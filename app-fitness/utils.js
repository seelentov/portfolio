function computeProgress(current, goal) {
  if (goal <= 0) return 0;
  return Math.min(1, Math.max(0, current / goal));
}

function formatNumber(n) {
  return n.toLocaleString('en-US');
}

const weekData = [
  { day: 'Mon', steps: 7200 },
  { day: 'Tue', steps: 8420 },
  { day: 'Wed', steps: 6100 },
  { day: 'Thu', steps: 9500 },
  { day: 'Fri', steps: 8900 },
  { day: 'Sat', steps: 5200 },
  { day: 'Sun', steps: 9550 },
];

function weeklyAverage(data) {
  if (data.length === 0) return 0;
  return Math.round(data.reduce((sum, d) => sum + d.steps, 0) / data.length);
}

module.exports = { computeProgress, formatNumber, weekData, weeklyAverage };
