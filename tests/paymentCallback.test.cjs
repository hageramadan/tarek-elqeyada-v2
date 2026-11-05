const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../src/hooks/usePaymentCallback.ts"), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
});

async function processCallback(params, { token = "test-token", updated = true } = {}) {
  const states = [];
  const effects = [];
  const updates = [];
  const redirects = [];
  const timers = [];
  const removedKeys = [];
  const testModule = { exports: {} };
  const searchParams = new URLSearchParams(params);
  const storage = { getItem: () => token, removeItem: key => removedKeys.push(key) };
  vm.runInNewContext(outputText, {
    module: testModule, exports: testModule.exports,
    console: { log() {}, warn() {}, error() {} },
    localStorage: storage, sessionStorage: storage,
    setTimeout: callback => timers.push(callback),
    require(name) {
      if (name === "react") return {
        useState(initial) {
          const index = states.length;
          states.push(initial);
          return [initial, value => { states[index] = value; }];
        },
        useEffect: callback => effects.push(callback),
      };
      if (name === "next/navigation") return {
        useSearchParams: () => searchParams,
        useRouter: () => ({ push: url => redirects.push(url), back() {} }),
      };
      if (name === "react-hot-toast") return { default: { success() {}, error() {} } };
      if (name.endsWith("updatePaymentStatusService")) return {
        UpdatePaymentStatusService: {
          async updatePaymentStatus(payload, authToken) {
            updates.push({ payload, authToken });
            return updated;
          },
        },
      };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  testModule.exports.usePaymentCallback();
  effects.forEach(callback => callback());
  await new Promise(setImmediate);
  timers.forEach(callback => callback());
  return { states, updates, redirects, removedKeys };
}

const booking = { order_uuid: "order-123", payment_method_id: "13", booking_id: "42" };
const cases = [
  ["MISPay success", { code: "MP00" }, "mispay", "paid", "success"],
  ["MISPay failure", { code: "MP01" }, "mispay", "failed", "failed"],
  ["MISPay cancellation", { code: "MP02" }, "mispay", "cancelled", "cancelled"],
  ["Tamara success", { paymentStatus: "approved", orderId: "tamara-1" }, "tamara", "paid", "success"],
  ["Tamara rejection", { paymentStatus: "declined", orderId: "tamara-1" }, "tamara", "failed", "failed"],
  ["Tamara cancellation", { paymentStatus: "canceled", orderId: "tamara-1" }, "tamara", "cancelled", "cancelled"],
  ["Paymob success", { success: "true", pending: "false" }, "paymob", "paid", "success"],
  ["Paymob failure", { success: "false" }, "paymob", "failed", "failed"],
  ["Paymob error overrides approval", { success: "true", pending: "false", error_occured: "true" }, "paymob", "failed", "failed"],
  ["Generic success", { payment_status: "paid" }, "generic", "paid", "success"],
  ["Generic failure", { payment_status: "failed" }, "generic", "failed", "failed"],
];

for (const [name, params, provider, paymentStatus, status] of cases) {
  test(`${name} preserves the payment update and destination`, async () => {
    const result = await processCallback({ ...booking, ...params });
    assert.equal(result.states[0], false);
    assert.equal(result.states[1], status);
    assert.equal(result.updates.length, 1);
    const { payload, authToken } = result.updates[0];
    assert.equal(authToken, "test-token");
    assert.equal(payload.order_uuid, booking.order_uuid);
    assert.equal(payload.payment_method_id, 13);
    assert.equal(payload.payment_status, paymentStatus);
    assert.equal(payload.response.provider, provider);
    const destination = new URL(result.redirects[0], "https://example.test");
    assert.equal(destination.pathname, status === "success" ? "/booking-success" : "/payment-failed");
    assert.equal(destination.searchParams.get("order_uuid"), booking.order_uuid);
    assert.equal(result.removedKeys.includes("currentBookingUUID"), status === "success");
    if (status === "cancelled") assert.equal(destination.searchParams.get("cancelled"), "true");
  });
}

test("a failed backend update cannot confirm a successful payment", async () => {
  const result = await processCallback({ ...booking, code: "MP00" }, { updated: false });
  assert.equal(result.states[1], "failed");
  assert.match(result.redirects[0], /^\/payment-failed\?/);
  assert.deepEqual(result.removedKeys, []);
});

test("missing credentials or booking data never submits a payment update", async () => {
  for (const [params, options] of [
    [{ ...booking, code: "MP00" }, { token: null }],
    [{ code: "MP00" }, {}],
    [{}, {}],
  ]) {
    const result = await processCallback(params, options);
    assert.equal(result.states[0], false);
    assert.equal(result.states[1], "failed");
    assert.equal(result.updates.length, 0);
    assert.equal(result.redirects.length, 0);
  }
});
