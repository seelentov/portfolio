const { computeProgress, formatNumber, weeklyAverage, weekData } = require('./utils.js');

describe('computeProgress', () => {
  test('returns 0 when goal is 0', () => {
    expect(computeProgress(100, 0)).toBe(0);
  });
  test('returns clamped 1 when current exceeds goal', () => {
    expect(computeProgress(15000, 10000)).toBe(1);
  });
  test('returns correct ratio', () => {
    expect(computeProgress(5000, 10000)).toBe(0.5);
  });
  test('handles negative current', () => {
    expect(computeProgress(-100, 1000)).toBe(0);
  });
});

describe('formatNumber', () => {
  test('formats with comma separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
  test('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('weeklyAverage', () => {
  test('computes average', () => {
    expect(weeklyAverage([{ day: 'a', steps: 100 }, { day: 'b', steps: 200 }])).toBe(150);
  });
  test('handles empty array', () => {
    expect(weeklyAverage([])).toBe(0);
  });
  test('weekData has 7 days', () => {
    expect(weekData).toHaveLength(7);
  });
});
