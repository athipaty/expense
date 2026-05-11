import { useState } from 'react';

const CATEGORIES = [
  { name: 'Food',       icon: '🍜' },
  { name: 'Transport',  icon: '🚗' },
  { name: 'Shopping',   icon: '🛍️' },
  { name: 'Drink',      icon: '🧋' },
  { name: 'Cigarettes', icon: '🚬' },
  { name: 'Other',      icon: '📦' },
];

export default function ExpenseForm({ initial, onSave, onCancel }) {
  const [amount, setAmount] = useState(initial?.amount || '');
  const [category, setCategory] = useState(initial?.category || 'Food');
  const [note, setNote] = useState(initial?.note || '');
  const [date, setDate] = useState(
    initial?.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );

  const handleSubmit = () => {
    if (!amount) return alert('Please enter an amount');
    onSave({ amount: Number(amount), category, note, date });
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-end justify-center z-50" onClick={onCancel}>
      <div
        className="bg-gray-900 w-full max-w-lg rounded-t-3xl p-6 space-y-5 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto -mt-2 mb-1" />

        <h2 className="text-lg font-bold text-white text-center">
          {initial ? '✏️ Edit Expense' : '➕ New Expense'}
        </h2>

        {/* Amount */}
        <div className="bg-gray-800 rounded-2xl px-4 py-3">
          <label className="text-xs text-gray-400 font-medium block mb-1">Amount (฿)</label>
          <input
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            autoFocus
            className="w-full bg-transparent text-white text-3xl font-bold outline-none placeholder-gray-700"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs text-gray-400 font-medium block mb-2">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(({ name, icon }) => (
              <button
                key={name}
                onClick={() => setCategory(name)}
                className={`py-3 rounded-2xl text-sm font-semibold flex flex-col items-center gap-1 transition ${
                  category === name
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 active:bg-gray-700'
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="bg-gray-800 rounded-2xl px-4 py-3">
          <label className="text-xs text-gray-400 font-medium block mb-1">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Lunch at MK"
            className="w-full bg-transparent text-white outline-none placeholder-gray-600 text-sm"
          />
        </div>

        {/* Date */}
        <div className="bg-gray-800 rounded-2xl px-4 py-3">
          <label className="text-xs text-gray-400 font-medium block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-white outline-none text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-800 active:bg-gray-700 text-white py-4 rounded-2xl font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-emerald-500 active:bg-emerald-400 text-white py-4 rounded-2xl font-semibold"
          >
            {initial ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
