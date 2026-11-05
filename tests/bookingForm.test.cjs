const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

function hookHarness(file, exportName, dependencies = {}) {
  const slots = [];
  let cursor = 0;
  const effects = [];
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect(callback, deps) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || deps.some((value, i) => !Object.is(value, previous[i]))) effects.push(callback);
      slots[index] = deps;
    },
    useCallback: callback => callback,
    useMemo: callback => callback(),
  };
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
  });
  const testModule = { exports: {} };
  vm.runInNewContext(outputText, {
    module: testModule, exports: testModule.exports,
    console: { log() {}, warn() {}, error() {} },
    require(name) {
      if (name === 'react') return react;
      if (name in dependencies) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return {
    render(options) { cursor = 0; return testModule.exports[exportName](options); },
    async runEffects() { effects.splice(0).forEach(effect => effect()); await new Promise(setImmediate); },
  };
}

function durationHarness(overrides = {}) {
  const changes = [], periods = [], messages = [];
  const options = {
    car: { minimumDays: 10 }, isWeekly: true, bookingType: 'daily',
    bookingData: { rentalDays: 14 }, monthlyPeriods: [],
    updateField: (field, value) => changes.push([field, value]),
    setPeriodId: id => periods.push(id),
    validateMonthlyPeriod: () => ({ isValid: true, message: '', periodId: 7 }),
    ...overrides,
  };
  const harness = hookHarness('src/hooks/booking/useBookingDuration.ts', 'useBookingDuration', {
    'react-hot-toast': { default: { error: message => messages.push(message) } },
  });
  return { ...harness, options, changes, periods, messages, current: () => harness.render(options) };
}

test('weekly duration rounds the minimum to full weeks and increments by seven days', () => {
  const h = durationHarness();
  const duration = h.current();
  assert.equal(duration.minimumDays, 14);
  assert.equal(duration.rentalDayStep, 7);
  duration.incrementDays();
  assert.deepEqual(h.changes, [['rentalDays', 21]]);
  duration.decrementDays();
  assert.equal(h.changes.length, 1);
  assert.equal(h.messages.length, 1);
});

test('entering a weekly count preserves the day value sent for pricing', () => {
  const h = durationHarness();
  h.current().handleDaysChange({ target: { value: '3' } });
  assert.deepEqual(h.changes, [['rentalDays', 21]]);
  h.current().handleDaysChange({ target: { value: '1' } });
  assert.deepEqual(h.changes.at(-1), ['rentalDays', 14]);
});

test('monthly duration keeps the selected period and rental days in sync', () => {
  const h = durationHarness({ bookingType: 'monthly', isWeekly: false });
  h.current().incrementMonths();
  assert.equal(h.current().rentalMonths, 2);
  assert.deepEqual(h.changes, [['rentalDays', 60]]);
  assert.deepEqual(h.periods, [7]);
});

test('an unavailable monthly duration leaves the current duration unchanged', () => {
  const h = durationHarness({ bookingType: 'monthly', validateMonthlyPeriod: () => ({ isValid: false, message: 'الفترة غير متاحة' }) });
  h.current().incrementMonths();
  assert.equal(h.current().rentalMonths, 1);
  assert.deepEqual(h.changes, []);
  assert.deepEqual(h.messages, ['الفترة غير متاحة']);
});

function identityHarness({ verified = true, registered = true, sent = { success: true } } = {}) {
  const calls = [], changes = [];
  const options = { bookingData: { customerName: 'عميل', customerPhone: '501234567' }, updateField: (field, value) => changes.push([field, value]) };
  const harness = hookHarness('src/hooks/booking/useBookingIdentity.ts', 'useBookingIdentity', {
    'react-hot-toast': { default: { success() {}, error() {}, dismiss() {} } },
    '@/src/context/AuthContext': { useAuth: () => ({ user: null, isAuthenticated: false, async register() { calls.push('register'); return { result: registered }; } }) },
    '@/src/hooks/usePhoneAuth': { usePhoneAuth: () => ({ isOTPSent: false, isLoading: false, async sendOTP() { calls.push('send'); return sent; }, async verifyOTP() { calls.push('verify'); return verified; } }) },
    '@/src/utils/bookingFormUtils': { formatPhoneNumber: (phone, code) => code + phone },
  });
  return { ...harness, calls, changes, options, current: () => harness.render(options) };
}

test('identity verification sends OTP before registering an account', async () => {
  const h = identityHarness();
  await h.current().handleVerifyIdentity();
  assert.deepEqual(h.calls, ['send']);
  assert.equal(h.current().isOTPPopupOpen, true);
  assert.equal(h.current().isIdentityVerified, false);
  assert.equal(await h.current().handleVerifyOTPFromPopup('123456'), true);
  assert.deepEqual(h.calls, ['send', 'verify', 'register']);
  assert.equal(h.current().isIdentityVerified, true);
  assert.equal(h.current().isOTPPopupOpen, false);
});

test('a rejected OTP never registers the customer or enables booking', async () => {
  const h = identityHarness({ verified: false });
  assert.equal(await h.current().handleVerifyOTPFromPopup('000000'), false);
  assert.deepEqual(h.calls, ['verify']);
  assert.equal(h.current().isIdentityVerified, false);
});

test('successful OTP with failed registration leaves identity unverified', async () => {
  const h = identityHarness({ registered: false });
  assert.equal(await h.current().handleVerifyOTPFromPopup('123456'), false);
  assert.equal(h.current().isIdentityVerified, false);
});

test('changing the phone number clears the previous identity verification', async () => {
  const h = identityHarness();
  await h.current().handleVerifyOTPFromPopup('123456');
  assert.equal(h.current().isIdentityVerified, true);
  h.current().handlePhoneChange('501111111', '+966');
  assert.equal(h.current().isIdentityVerified, false);
  assert.deepEqual(h.changes, [['customerPhone', '501111111']]);
});

test('OTP rate limiting may register an account but cannot verify identity', async () => {
  const h = identityHarness({ sent: { success: false, errorCode: 'auth/too-many-requests' } });
  await h.current().handleVerifyIdentity();
  assert.deepEqual(h.calls, ['send', 'register']);
  assert.equal(h.current().isIdentityVerified, false);
  assert.equal(h.current().isOTPPopupOpen, false);
});
