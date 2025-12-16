const assert = require('chai').assert;

describe('Unit Tests', function () {
  // #isArray, true if array
  it('#isArray, true if array', function () {
    assert.isArray(['unit', 'test'], 'isArray returns true');
  });

  // #isArray, false if not array
  it('#isArray, false if not array', function () {
    assert.isNotArray('unit', 'isNotArray returns true');
  });

  // #equal, compare equal
  it('#equal, compare equal', function () {
    assert.equal(3, '3', '== coerces values to strings');
  });

  // #strictEqual, compare equal
  it('#strictEqual, compare equal', function () {
    assert.strictEqual(3, 3, '=== compares numbers');
  });

  // #notStrictEqual, compare not equal
  it('#notStrictEqual, compare not equal', function () {
    assert.notStrictEqual(3, '3', '!== compares different types');
  });

  // #deepEqual, compare contents
  it('#deepEqual, compare contents', function () {
    assert.deepEqual({ a: 1 }, { a: 1 }, 'deepEqual compares values');
  });

  // #notDeepEqual, compare contents
  it('#notDeepEqual, compare contents', function () {
    assert.notDeepEqual({ a: 1 }, { a: '1' }, 'notDeepEqual compares values');
  });
});
