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

const { validateEmail, validateForm } = require(path.join(__dirname, '../../site-business-card/script.js'));

describe('Business Card — validateEmail', () => {
  test('accepts valid', () => {
    expect(validateEmail('komkov222111@gmail.com')).toBe(true);
  });
  test('rejects invalid', () => {
    expect(validateEmail('not.an.email')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('Business Card — validateForm', () => {
  const base = {
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    budget: '50 000 – 150 000 ₽',
    message: 'Нужен лендинг для нового проекта по доставке',
    service: ['Сайт'],
  };
  test('valid form passes', () => {
    expect(validateForm(base)).toEqual([]);
  });
  test('rejects missing budget', () => {
    expect(validateForm({ ...base, budget: '' })).toContain('Выберите бюджет');
  });
  test('rejects short message', () => {
    expect(validateForm({ ...base, message: 'кратко' }).length).toBeGreaterThan(0);
  });
  test('rejects bad email', () => {
    expect(validateForm({ ...base, email: 'plainstring' }).length).toBeGreaterThan(0);
  });
});
