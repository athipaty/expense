import { useState } from 'react';
import { createFixedBill, updateFixedBill, deleteFixedBill } from '../api/fixedBills';

export default function BillsManager({ bills, month, year, onRefresh, onClose }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [editingBill, setEditingBill] = useState(null);

  const handleSubmit = async () => {
    if (!name || !amount) return alert('Fill in both fields');
    if (editingBill) {
      await updateFixedBill(editingBill._id, { name, amount: Number(amount) });
    } else {
      await createFixedBill({ name, amount: Number(amount), month, year, order: bills.length });
    }
    setName('');
    setAmount('');
    setEditingBill(null);
    onRefresh();
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setName(bill.name);
    setAmount(String(bill.amount));
  };

  const handleCancel = () => {
    setEditingBill(null);
    setName('');
    setAmount('');
  };

  const handleDelete = async (id) => {
    if (confirm('Remove this bill?')) {
      await deleteFixedBill(id);
      onRefresh();
    }
  };

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const total = bills.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-end justify-center z-50" onClick={onClose}>
      <div
        className="bg-gray-900 w-full max-w-lg rounded-t-3xl p-6 space-y-4 max-h-[85vh] flex flex-col pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto -mt-2" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">📋 Fixed Bills</h2>
            <p className="text-xs text-gray-500 mt-0.5">{monthNames[month - 1]} {year}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-800 active:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400"
          >✕</button>
        </div>

        {/* Total */}
        {bills.length > 0 && (
          <div className="bg-gray-800 rounded-2xl px-4 py-3 flex justify-between items-center">
            <p className="text-sm text-gray-400">Total bills</p>
            <p className="text-sm font-bold text-white">฿{total.toLocaleString()}</p>
          </div>
        )}

        {/* Add / Edit form */}
        {editingBill && (
          <p className="text-xs text-emerald-400 font-medium -mb-1">Editing: {editingBill.name}</p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bill name"
            className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-600"
          />
          <input
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="฿"
            className="w-24 bg-gray-800 rounded-xl px-3 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-600"
          />
          {editingBill && (
            <button
              onClick={handleCancel}
              className="bg-gray-700 active:bg-gray-600 text-white px-3 rounded-xl text-sm font-bold"
            >✕</button>
          )}
          <button
            onClick={handleSubmit}
            className="bg-emerald-500 active:bg-emerald-400 text-white px-4 rounded-xl text-sm font-bold"
          >
            {editingBill ? 'Save' : 'Add'}
          </button>
        </div>

        {/* Bill list */}
        <div className="overflow-y-auto space-y-2 flex-1">
          {bills.length === 0 && (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-gray-500 text-sm">No bills for {monthNames[month - 1]} {year}</p>
            </div>
          )}
          {[...bills].sort((a, b) => b.amount - a.amount).map((bill) => (
            <div
              key={bill._id}
              className={`rounded-2xl px-4 py-3.5 flex items-center justify-between transition ${
                editingBill?._id === bill._id ? 'bg-emerald-900/30 ring-1 ring-emerald-500' : 'bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-700 rounded-xl flex items-center justify-center text-base">📄</div>
                <div>
                  <p className="text-sm font-semibold text-white">{bill.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">฿{bill.amount.toLocaleString()} / month</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(bill)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 active:text-emerald-400 rounded-xl"
                >✏️</button>
                <button
                  onClick={() => handleDelete(bill._id)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 active:text-red-400 rounded-xl"
                >🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
