const { formatCurrency, categoryTotal, balance, savingsPercent, transactions } = require('./utils.js');

describe('formatCurrency', () => {
  test('formats positive amount', () => {
    expect(formatCurrency(1235)).toMatch(/1\D?235 ₽/);
  });
  test('formats negative amount with sign', () => {
    expect(formatCurrency(-100)).toMatch(/^-100 ₽$/);
  });
  test('formats zero', () => {
    expect(formatCurrency(0)).toBe('0 ₽');
  });
  test('uses custom currency', () => {
    expect(formatCurrency(50, '€')).toBe('50 €');
  });
});

describe('categoryTotal', () => {
  test('sums absolute amounts in a category', () => {
    expect(categoryTotal(transactions, 'Подписка')).toBe(898);
  });
  test('returns 0 for unknown category', () => {
    expect(categoryTotal(transactions, 'Unknown')).toBe(0);
  });
});

describe('balance', () => {
  test('sums all transactions', () => {
    expect(balance([{ amount: 100 }, { amount: -30 }, { amount: 20 }])).toBe(90);
  });
  test('handles empty list', () => {
    expect(balance([])).toBe(0);
  });
});

describe('savingsPercent', () => {
  test('computes percent', () => {
    expect(savingsPercent(50, 100)).toBe(50);
  });
  test('caps at 100', () => {
    expect(savingsPercent(200, 100)).toBe(100);
  });
  test('handles zero goal', () => {
    expect(savingsPercent(50, 0)).toBe(0);
  });
});
