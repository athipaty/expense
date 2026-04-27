import { useState } from 'react';

export default function IncomeForm({ onSave, onCancel }) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = () => {
    if (!amount) return alert('Please enter an amount');
    onSave({ amount: Number(amount), note, date });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
      <div className="bg-gray-900 w-full max-w-xl rounded-t-3xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-emerald-400">+ Add Income</h2>

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

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Daily wage"
            className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}