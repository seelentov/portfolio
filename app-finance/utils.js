function formatCurrency(amount, currency = '₽') {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const fmt = Math.round(abs).toLocaleString('ru-RU');
  return `${sign}${fmt} ${currency}`;
}

function categoryTotal(transactions, category) {
  return transactions
    .filter(t => t.category === category)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

function balance(transactions) {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

function savingsPercent(saved, goal) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((saved / goal) * 100)));
}

const transactions = [
  { id: '1', name: 'Apple Store', category: 'Покупки', amount: -12999, date: '08 июн', icon: '🍎' },
  { id: '2', name: 'Зарплата', category: 'Доход', amount: 425000, date: '01 июн', icon: '💼' },
  { id: '3', name: 'Яндекс.Музыка', category: 'Подписка', amount: -299, date: '01 июн', icon: '🎵' },
  { id: '4', name: 'ВкусВилл', category: 'Продукты', amount: -8640, date: '31 мая', icon: '🛒' },
  { id: '5', name: 'Яндекс.Такси', category: 'Транспорт', amount: -850, date: '30 мая', icon: '🚗' },
  { id: '6', name: 'Кинопоиск', category: 'Подписка', amount: -599, date: '28 мая', icon: '🎬' },
];

const monthlyData = [
  { month: 'Янв', income: 4200, expense: 2800 },
  { month: 'Фев', income: 4250, expense: 3100 },
  { month: 'Мар', income: 4250, expense: 2400 },
  { month: 'Апр', income: 4250, expense: 3200 },
  { month: 'Май', income: 4250, expense: 2900 },
  { month: 'Июн', income: 4250, expense: 1820 },
];

module.exports = { formatCurrency, categoryTotal, balance, savingsPercent, transactions, monthlyData };
