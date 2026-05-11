const CATEGORIES = ["Food", "Transport", "Shopping", "Drink", "Cigarettes", "Other"];

const STYLES = {
  Food:       { bg: "bg-orange-500/20",  dot: "bg-orange-400",  icon: "🍜" },
  Transport:  { bg: "bg-blue-500/20",    dot: "bg-blue-400",    icon: "🚗" },
  Shopping:   { bg: "bg-pink-500/20",    dot: "bg-pink-400",    icon: "🛍️" },
  Drink:      { bg: "bg-purple-500/20",  dot: "bg-purple-400",  icon: "🧋" },
  Cigarettes: { bg: "bg-yellow-500/20",  dot: "bg-yellow-400",  icon: "🚬" },
  Other:      { bg: "bg-gray-500/20",    dot: "bg-gray-400",    icon: "📦" },
};

export default function Dashboard({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    amount: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.amount > 0);

  if (byCategory.length === 0) {
    return (
      <div className="bg-gray-900 rounded-3xl p-6 text-center mb-4">
        <p className="text-4xl mb-2">📊</p>
        <p className="text-gray-500 text-sm">No expenses yet this month</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-3xl p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Breakdown</p>
        <p className="text-sm font-bold text-white">฿{total.toLocaleString()}</p>
      </div>

      {/* Bar */}
      <div className="flex rounded-full overflow-hidden h-3 mb-5 gap-0.5">
        {byCategory.map(({ cat, amount }) => (
          <div
            key={cat}
            className={`${STYLES[cat].dot} transition-all`}
            style={{ width: `${(amount / total) * 100}%` }}
          />
        ))}
      </div>

      <div className="space-y-2.5">
        {byCategory.map(({ cat, amount }) => (
          <div key={cat} className="flex items-center gap-3">
            <div className={`w-9 h-9 ${STYLES[cat].bg} rounded-xl flex items-center justify-center text-base flex-shrink-0`}>
              {STYLES[cat].icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-white">{cat}</p>
                <p className="text-sm font-semibold text-white">฿{amount.toLocaleString()}</p>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${STYLES[cat].dot}`}
                  style={{ width: `${(amount / total) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 w-9 text-right flex-shrink-0">
              {Math.round((amount / total) * 100)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
