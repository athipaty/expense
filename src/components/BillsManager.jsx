import { useState } from 'react';
import { createFixedBill, deleteFixedBill } from '../api/fixedBills';

export default function BillsManager({ bills, month, year, onRefresh, onClose }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = async () => {
    if (!name || !amount) return alert('Fill in both fields');
    await createFixedBill({ 
      name, 
      amount: Number(amount), 
      month, 
      year,
      order: bills.length 
    });
    setName('');
    setAmount('');
    onRefresh();
  };

  const handleDelete = async (id) => {
    if (confirm('Remove this bill?')) {
      await deleteFixedBill(id);
      onRefresh();
    }
  };

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
      <div className="bg-gray-900 w-full max-w-xl rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            📋 Bills — {monthNames[month - 1]} {year}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Add new bill */}
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bill name"
            className="flex-1 bg-gray-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="฿"
            className="w-24 bg-gray-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleAdd}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 rounded-xl text-sm font-semibold transition"
          >
            Add
          </button>
        </div>

        {/* Bill list */}
        <div className="space-y-2">
          {bills.map((bill) => (
            <div key={bill._id} className="bg-gray-800 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{bill.name}</p>
                <p className="text-xs text-gray-400">฿{bill.amount.toLocaleString()} / month</p>
              </div>
              <button
                onClick={() => handleDelete(bill._id)}
                className="text-gray-500 hover:text-red-400 text-sm"
              >
                🗑️
              </button>
            </div>
          ))}
          {bills.length === 0 && (
            <p className="text-gray-600 text-sm text-center py-4">
              No bills for {monthNames[month - 1]} {year}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}