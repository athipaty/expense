import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { getExpenses, createExpense, updateExpense, deleteExpense } from './api/expenses';

export default function App() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await getExpenses(month, year);
    setExpenses(res.data);
  };

  useEffect(() => { load(); }, [month, year]);

  const handleSave = async (data) => {
    if (editingExpense) {
      await updateExpense(editingExpense._id, data);
    } else {
      await createExpense(data);
    }
    setEditingExpense(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this expense?')) {
      await deleteExpense(id);
      load();
    }
  };

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">💸 My Expenses</h1>
          <p className="text-gray-400 text-sm mt-0.5">Personal tracker</p>
        </div>
        <button
          onClick={() => { setEditingExpense(null); setShowForm(true); }}
          className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
        >
          + Add
        </button>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => {
            if (month === 1) { setMonth(12); setYear(y => y - 1); }
            else setMonth(m => m - 1);
          }}
          className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm"
        >←</button>
        <span className="flex-1 text-center font-semibold text-gray-200">
          {monthNames[month - 1]} {year}
        </span>
        <button
          onClick={() => {
            if (month === 12) { setMonth(1); setYear(y => y + 1); }
            else setMonth(m => m + 1);
          }}
          className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm"
        >→</button>
      </div>

      {/* Dashboard */}
      <Dashboard expenses={expenses} />

      {/* List */}
      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      {showForm && (
        <ExpenseForm
          initial={editingExpense}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingExpense(null); }}
        />
      )}
    </div>
  );
}