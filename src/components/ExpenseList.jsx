const COLORS = {
  Food: 'text-orange-400',
  Transport: 'text-blue-400',
  Shopping: 'text-pink-400',
  Other: 'text-gray-400',
};

const ICONS = { Food: '🍜', Transport: '🚗', Shopping: '🛍️', Other: '📦' };

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0)
    return <p className="text-center text-gray-600 py-10">No expenses this month</p>;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Transactions</h2>
      {expenses.map((e) => (
        <div key={e._id} className="bg-gray-900 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{ICONS[e.category]}</span>
            <div>
              <p className="text-sm font-medium">{e.note || e.category}</p>
              <p className={`text-xs ${COLORS[e.category]}`}>
                {e.category} · {new Date(e.date).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">฿{e.amount.toLocaleString()}</span>
            <button onClick={() => onEdit(e)} className="text-gray-500 hover:text-white text-xs">✏️</button>
            <button onClick={() => onDelete(e._id)} className="text-gray-500 hover:text-red-400 text-xs">🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}