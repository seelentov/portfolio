function formatMinutes(seconds) {
  if (seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function totalSessionMinutes(sessions) {
  return sessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
}

function streakDays(history) {
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].completed) streak++;
    else break;
  }
  return streak;
}

const sessions = [
  { id: '1', title: 'Утренний покой', minutes: 10, category: 'Фокус', mood: 'sunrise' },
  { id: '2', title: 'Снятие стресса', minutes: 15, category: 'Тревога', mood: 'ocean' },
  { id: '3', title: 'Глубокий сон', minutes: 25, category: 'Сон', mood: 'night' },
  { id: '4', title: 'Сканирование тела', minutes: 20, category: 'Осознанность', mood: 'forest' },
  { id: '5', title: 'Любящая доброта', minutes: 12, category: 'Сострадание', mood: 'sunset' },
];

module.exports = { formatMinutes, totalSessionMinutes, streakDays, sessions };
