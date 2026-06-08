/**
 * @jest-environment node
 */
const path = require('path');

const restaurantPath = path.join(__dirname, '../../site-restaurant/script.js');

// The script auto-runs DOM logic on require — guard against missing document
global.document = global.document || {
  getElementById: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
};
global.window = global.window || { addEventListener: () => {}, scrollY: 0 };
global.IntersectionObserver = class { observe() {} unobserve() {} };
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

const { validateEmail, validateForm } = require(restaurantPath);

describe('Restaurant — validateEmail', () => {
  test('valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('first.last+tag@sub.domain.co')).toBe(true);
  });
  test('invalid email', () => {
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('Restaurant — validateForm', () => {
  const valid = {
    name: 'John Doe',
    email: 'john@example.com',
    date: '2026-12-31',
    time: '20:00',
    guests: '4',
    phone: '+12345678',
  };
  test('passes with all valid fields', () => {
    expect(validateForm(valid)).toEqual([]);
  });
  test('rejects empty name', () => {
    expect(validateForm({ ...valid, name: '' })).toContain('Name is required');
  });
  test('rejects bad email', () => {
    expect(validateForm({ ...valid, email: 'bad' })).toContain('Valid email is required');
  });
  test('rejects missing guests', () => {
    expect(validateForm({ ...valid, guests: '' })).toContain('Guests is required');
  });
  test('rejects short phone', () => {
    expect(validateForm({ ...valid, phone: '1' })).toContain('Valid phone is required');
  });
});
