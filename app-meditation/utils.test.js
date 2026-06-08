const { formatMinutes, totalSessionMinutes, streakDays, sessions } = require('./utils.js');

describe('formatMinutes', () => {
  test('formats minutes and seconds', () => {
    expect(formatMinutes(125)).toBe('2:05');
    expect(formatMinutes(600)).toBe('10:00');
    expect(formatMinutes(0)).toBe('0:00');
  });
  test('clamps negative values', () => {
    expect(formatMinutes(-30)).toBe('0:00');
  });
});

describe('totalSessionMinutes', () => {
  test('sums minutes', () => {
    expect(totalSessionMinutes([{ minutes: 10 }, { minutes: 20 }])).toBe(30);
  });
  test('handles missing minutes', () => {
    expect(totalSessionMinutes([{ minutes: 10 }, {}])).toBe(10);
  });
});

describe('streakDays', () => {
  test('counts streak from end', () => {
    expect(streakDays([{ completed: true }, { completed: true }, { completed: true }])).toBe(3);
  });
  test('breaks on incomplete day', () => {
    expect(streakDays([{ completed: true }, { completed: false }, { completed: true }])).toBe(1);
  });
  test('returns 0 if last day incomplete', () => {
    expect(streakDays([{ completed: true }, { completed: false }])).toBe(0);
  });
});

describe('sessions data', () => {
  test('has 5 sessions', () => {
    expect(sessions).toHaveLength(5);
  });
  test('every session has required fields', () => {
    sessions.forEach(s => {
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('title');
      expect(s).toHaveProperty('minutes');
    });
  });
});
