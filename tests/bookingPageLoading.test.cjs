const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

function fakeImage(complete = false) {
  const handlers = new Map();
  return {
    complete, loading: 'lazy',
    addEventListener(event, callback) { handlers.set(event, callback); },
    removeEventListener(event) { handlers.delete(event); },
    finish(event = 'load') { this.complete = true; handlers.get(event)?.(); },
  };
}

function loadingHarness(images = [], fonts = Promise.resolve()) {
  let readyPageKey = null;
  let previousDeps;
  let cleanup;
  const contentRef = { current: { querySelectorAll: () => images } };
  const testModule = { exports: {} };
  const source = fs.readFileSync(path.join(__dirname, '../src/hooks/booking/useBookingPageLoading.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  vm.runInNewContext(outputText, {
    module: testModule, exports: testModule.exports,
    document: { fonts: { ready: fonts } },
    require(name) {
      assert.equal(name, 'react');
      return {
        useState: () => [readyPageKey, value => { readyPageKey = value; }],
        useEffect(callback, deps) {
          if (!previousDeps || deps.some((value, index) => !Object.is(value, previousDeps[index]))) {
            cleanup?.();
            cleanup = callback();
          }
          previousDeps = deps;
        },
      };
    },
  });
  return {
    render(isDataReady, pageKey = 'car-1') {
      return testModule.exports.useBookingPageLoading({ isDataReady, pageKey, contentRef });
    },
    flush: () => new Promise(setImmediate),
  };
}

test('the initial form stays hidden until all data, images and fonts are ready', async () => {
  const image = fakeImage();
  const fonts = deferred();
  const h = loadingHarness([image], fonts.promise);
  assert.equal(h.render(false), true);
  assert.equal(h.render(true), true);
  assert.equal(image.loading, 'eager');
  image.finish();
  await h.flush();
  assert.equal(h.render(true), true);
  fonts.resolve();
  await h.flush();
  assert.equal(h.render(true), false);
});

test('later price recalculations keep the revealed form visible', async () => {
  const h = loadingHarness();
  h.render(true);
  await h.flush();
  assert.equal(h.render(true), false);
  assert.equal(h.render(false), false);
});

test('a failed image cannot trap the customer behind the loading screen', async () => {
  const image = fakeImage();
  const h = loadingHarness([image]);
  h.render(true);
  image.finish('error');
  await h.flush();
  assert.equal(h.render(true), false);
});

test('changing the car waits for the new page data', async () => {
  const h = loadingHarness();
  h.render(true);
  await h.flush();
  assert.equal(h.render(true), false);
  assert.equal(h.render(false, 'car-2'), true);
  h.render(true, 'car-2');
  await h.flush();
  assert.equal(h.render(true, 'car-2'), false);
});

test('stale image completions cannot reveal a page whose data changed', async () => {
  const image = fakeImage();
  const h = loadingHarness([image]);
  h.render(true);
  h.render(false);
  image.finish();
  await h.flush();
  assert.equal(h.render(false), true);
  h.render(true);
  await h.flush();
  assert.equal(h.render(true), false);
});
