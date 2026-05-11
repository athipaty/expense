const STYLES = {
  Food:       { color: "text-orange-400", bg: "bg-orange-900/30", icon: "🍜" },
  Transport:  { color: "text-blue-400",   bg: "bg-blue-900/30",   icon: "🚗" },
  Shopping:   { color: "text-pink-400",   bg: "bg-pink-900/30",   icon: "🛍️" },
  Drink:      { color: "text-purple-400", bg: "bg-purple-900/30", icon: "🧋" },
  Cigarettes: { color: "text-yellow-400", bg: "bg-yellow-900/30", icon: "🚬" },
  Other:      { color: "text-gray-400",   bg: "bg-gray-800",      icon: "📦" },
};

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0)
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🧾</p>
        <p className="text-gray-500 text-sm">No expenses this month</p>
      </div>
    );

  // Group by date
  const grouped = expenses.reduce((acc, e) => {
    const key = new Date(e.date).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <p className="text-xs text-gray-500 font-medium mb-2 px-1">{date}</p>
          <div className="space-y-2">
            {items.map((e) => {
              const style = STYLES[e.category] || STYLES.Other;
              return (
                <div
                  key={e._id}
                  className="bg-gray-900 rounded-2xl px-4 py-3.5 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {e.note || e.category}
                    </p>
                    <p className={`text-xs mt-0.5 ${style.color}`}>{e.category}</p>
                  </div>
                  <p className="text-sm font-bold text-white mr-2">
                    ฿{e.amount.toLocaleString()}
                  </p>
                  <button
                    onClick={() => onEdit(e)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 active:text-white rounded-lg"
                  >✏️</button>
                  <button
                    onClick={() => onDelete(e._id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 active:text-red-400 rounded-lg"
                  >🗑️</button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
