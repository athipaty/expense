import { useState } from 'react';

export default function IncomeForm({ onSave, onCancel, initial }) {
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [note, setNote] = useState(initial?.note || '');
  const [date, setDate] = useState(
    initial ? new Date(initial.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  );

  const handleSubmit = () => {
    if (!amount) return alert('Please enter an amount');
    onSave({ amount: Number(amount), note, date });
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-end justify-center z-50" onClick={onCancel}>
      <div
        className="bg-gray-900 w-full max-w-lg rounded-t-3xl p-6 space-y-5 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto -mt-2 mb-1" />

        <h2 className="text-lg font-bold text-emerald-400 text-center">
          {initial ? '✏️ Edit Income' : '💰 Add Income'}
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

        {/* Note */}
        <div className="bg-gray-800 rounded-2xl px-4 py-3">
          <label className="text-xs text-gray-400 font-medium block mb-1">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Daily wage"
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
