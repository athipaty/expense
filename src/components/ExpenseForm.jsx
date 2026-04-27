import { useState } from 'react';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Drink', 'Cigarettes', 'Other'];

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
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
      <div className="bg-gray-900 w-full max-w-xl rounded-t-3xl p-6 space-y-4">
        <h2 className="text-lg font-bold">{initial ? 'Edit Expense' : 'New Expense'}</h2>

        {/* Amount */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Amount (฿)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white text-lg font-bold outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-2 rounded-xl text-sm font-medium transition ${
                  category === cat
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Lunch at MK"
            className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Date */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-semibold transition"
          >
            {initial ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}