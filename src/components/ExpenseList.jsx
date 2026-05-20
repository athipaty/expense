const STYLES = {
  Food:       { color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/20", icon: "🍜" },
  Transport:  { color: "text-blue-400",   bg: "bg-blue-500/15",   border: "border-blue-500/20",   icon: "🚗" },
  Shopping:   { color: "text-pink-400",   bg: "bg-pink-500/15",   border: "border-pink-500/20",   icon: "🛍️" },
  Drink:      { color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/20", icon: "🧋" },
  Cigarettes: { color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/20", icon: "🚬" },
  Other:      { color: "text-gray-400",   bg: "bg-gray-700/40",   border: "border-gray-700/40",   icon: "📦" },
};

const TZ = 'Asia/Singapore';

function todaySGStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ });
}

function yesterdaySGStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA', { timeZone: TZ });
}

function isToday(dateStr) {
  return dateStr === todaySGStr();
}

function isYesterday(dateStr) {
  return dateStr === yesterdaySGStr();
}

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (!expenses || expenses.length === 0)
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🧾</p>
        <p className="text-gray-500 text-sm font-medium">No expenses this month</p>
        <p className="text-gray-600 text-xs mt-1">Tap + Add to get started</p>
      </div>
    );

  // Sort newest first then group by date
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const grouped = sorted.reduce((acc, e) => {
    const key = new Date(e.date).toISOString().split("T")[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([dateKey, items]) => {
        const dayTotal = items.reduce((s, e) => s + (e.amount || 0), 0);
        const label = isToday(dateKey)
          ? "Today"
          : isYesterday(dateKey)
          ? "Yesterday"
          : new Date(dateKey).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

        return (
          <div key={dateKey}>
            {/* Date header row */}
            <div className="flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold tracking-wide ${
                    label === "Today"
                      ? "text-emerald-400"
                      : label === "Yesterday"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                <span className="text-gray-700 text-xs">
                  {items.length} item{items.length > 1 ? "s" : ""}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-400">
                ฿{dayTotal.toLocaleString()}
              </span>
            </div>

            {/* Expense cards */}
            <div className="space-y-2">
              {items.map((e) => {
                const style = STYLES[e.category] || STYLES.Other;
                return (
                  <div
                    key={e._id}
                    className={`group relative bg-gray-900 border ${style.border} rounded-2xl overflow-hidden`}
                  >
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      {/* Icon */}
                      <div
                        className={`w-11 h-11 ${style.bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}
                      >
                        {style.icon}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate leading-tight">
                          {e.note || e.category}
                        </p>
                        <span
                          className={`inline-block text-xs mt-0.5 font-medium ${style.color} ${style.bg} px-1.5 py-0.5 rounded-md`}
                        >
                          {e.category}
                        </span>
                      </div>

                      {/* Amount */}
                      <p className="text-base font-bold text-white tabular-nums mr-1">
                        ฿{e.amount.toLocaleString()}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(e)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl active:bg-gray-700 transition-colors"
                          aria-label="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-gray-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(e._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl active:bg-red-900/40 transition-colors"
                          aria-label="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-gray-400 active:text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className={`h-0.5 w-full ${style.bg}`} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
