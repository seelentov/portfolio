/**
 * @jest-environment node
 */
const path = require('path');

global.document = global.document || {
  getElementById: () => null,
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {},
};
global.window = global.window || { addEventListener: () => {}, scrollY: 0, innerWidth: 1280, innerHeight: 800 };

const { validateEmail, validateForm } = require(path.join(__dirname, '../../site-agency/script.js'));

describe('Agency — validateEmail', () => {
  test('accepts valid', () => {
    expect(validateEmail('hi@volt.studio')).toBe(true);
  });
  test('rejects invalid', () => {
    expect(validateEmail('hi@')).toBe(false);
  });
});

describe('Agency — validateForm', () => {
  const base = {
    name: 'Alice',
    email: 'alice@example.com',
    message: 'I want to build a mobile app for my company.',
    services: ['Web Design'],
  };
  test('passes valid form', () => {
    expect(validateForm(base)).toEqual([]);
  });
  test('rejects short name', () => {
    expect(validateForm({ ...base, name: 'A' }).length).toBeGreaterThan(0);
  });
  test('rejects invalid email', () => {
    expect(validateForm({ ...base, email: 'notvalid' }).length).toBeGreaterThan(0);
  });
  test('rejects short message', () => {
    expect(validateForm({ ...base, message: 'hi' }).length).toBeGreaterThan(0);
  });
});
