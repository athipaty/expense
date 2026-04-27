const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Drink",
  "Cigarettes",
  "Other",
];
const COLORS = {
  Food: "bg-orange-500",
  Transport: "bg-blue-500",
  Shopping: "bg-pink-500",
  Drink: "bg-purple-500",
  Cigarettes: "bg-yellow-500",
  Other: "bg-gray-500",
};

export default function Dashboard({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    amount: expenses
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + e.amount, 0),
  }));

  return (
    <div className="bg-gray-900 rounded-2xl p-5 mb-6">
      <p className="text-gray-400 text-sm mb-1">Total this month</p>
      <p className="text-4xl font-bold text-emerald-400 mb-5">
        ฿{total.toLocaleString()}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {byCategory.map(({ cat, amount }) => (
          <div
            key={cat}
            className="bg-gray-800 rounded-xl p-3 flex items-center gap-3"
          >
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${COLORS[cat]}`}
            />
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">{cat}</p>
              <p className="text-sm font-semibold text-left">
                ฿{amount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
