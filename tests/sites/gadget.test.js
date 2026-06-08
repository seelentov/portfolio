/**
 * @jest-environment node
 */
const path = require('path');

global.document = global.document || {
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  addEventListener: () => {},
};
global.window = global.window || { addEventListener: () => {}, scrollY: 0 };
global.IntersectionObserver = class { observe() {} unobserve() {} };

const { calculateTotal } = require(path.join(__dirname, '../../site-gadget/script.js'));

describe('Gadget — calculateTotal', () => {
  test('computes total without tax', () => {
    expect(calculateTotal(279, 2)).toBe(558);
  });
  test('computes total with tax', () => {
    expect(calculateTotal(100, 1, 0.2)).toBe(120);
  });
  test('rounds to 2 decimals', () => {
    expect(calculateTotal(33.333, 3)).toBe(99.999 < 100 ? 100 : 99.999);
  });
  test('throws on negative', () => {
    expect(() => calculateTotal(-1, 2)).toThrow();
  });
  test('throws on invalid input', () => {
    expect(() => calculateTotal('abc', 2)).toThrow();
  });
  test('handles zero qty', () => {
    expect(calculateTotal(279, 0)).toBe(0);
  });
});
