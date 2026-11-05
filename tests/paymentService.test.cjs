const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

function loadPaymentService(checkout) {
  const source = fs.readFileSync(
    path.join(__dirname, "../src/services/paymentService.ts"),
    "utf8",
  );
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module,
    exports: module.exports,
    process: { env: {} },
    console: { log() {}, warn() {}, error() {} },
    require(name) {
      assert.equal(name, "./carService");
      return { CarService: { checkout } };
    },
  });
  return module.exports;
}

const payment = {
  car_name: "Test car",
  amount: 1000,
  uuid: "test-booking",
  zip: "12251",
  address: "Test address",
  city: "Test city",
};

test("API method 13 opens MISPay checkout instead of selecting cash", async () => {
  let calls = 0;
  const { PaymentService, PaymentMethodType } = loadPaymentService(async (data, token) => {
    calls++;
    assert.equal(data.payment_method, 13);
    assert.equal(data.index, 4);
    assert.equal(token, "test-token");
    return { payment_data: { raw: { result: { url: "https://example.com/mispay" } } } };
  });
  assert.equal(PaymentMethodType.MISPAY, 13);
  const result = await PaymentService.processPayment(
    { ...payment, payment_method: 13 }, "test-token",
  );
  assert.equal(calls, 1);
  assert.equal(result.success, true);
  assert.equal(result.isCash, false);
  assert.equal(result.paymentUrl, "https://example.com/mispay");
  assert.equal(PaymentService.isPaymentMethodRequiresGateway(13), true);
});

test("cash method 12 stays separate and does not call a payment gateway", async () => {
  const { PaymentService, PaymentMethodType } = loadPaymentService(async () => {
    assert.fail("Cash must not create a gateway checkout");
  });
  assert.equal(PaymentMethodType.CASH, 12);
  const result = await PaymentService.processPayment(
    { ...payment, payment_method: 12 }, "test-token",
  );
  assert.equal(result.success, true);
  assert.equal(result.isCash, true);
  assert.equal(result.paymentUrl, undefined);
  assert.equal(PaymentService.isPaymentMethodRequiresGateway(12), false);
});

test("MISPay without a checkout URL fails instead of confirming cash payment", async () => {
  const { PaymentService } = loadPaymentService(async () => ({ payment_data: {} }));
  const result = await PaymentService.processPayment(
    { ...payment, payment_method: 13 }, "test-token",
  );
  assert.equal(result.success, false);
  assert.notEqual(result.isCash, true);
});
