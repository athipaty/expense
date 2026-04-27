import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import BillProgress from "./components/BillProgress";
import IncomeForm from "./components/IncomeForm";
import BillsManager from "./components/BillsManager";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./api/expenses";
import { getIncome, createIncome, deleteIncome } from "./api/income";
import { getFixedBills } from "./api/fixedBills";

export default function App() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [bills, setBills] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showBillsManager, setShowBillsManager] = useState(false);
  const [tab, setTab] = useState("overview"); // overview | expenses | income

  const loadAll = async () => {
    const [expRes, incRes, billRes] = await Promise.all([
      getExpenses(month, year),
      getIncome(month, year),
      getFixedBills(),
    ]);
    setExpenses(expRes.data);
    setIncome(incRes.data);
    setBills(billRes.data);
  };

  useEffect(() => {
    loadAll();
  }, [month, year]);

  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  console.log(
    "totalIncome:",
    totalIncome,
    "expenses:",
    expenses,
    "bills:",
    bills,
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">💸 My Expenses</h1>
          <p className="text-gray-400 text-sm mt-0.5">Personal tracker</p>
        </div>
        <button
          onClick={() => setShowBillsManager(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold px-3 py-2 rounded-xl transition"
        >
          📋 Bills
        </button>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => {
            if (month === 1) {
              setMonth(12);
              setYear((y) => y - 1);
            } else setMonth((m) => m - 1);
          }}
          className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm"
        >
          ←
        </button>
        <span className="flex-1 text-center font-semibold text-gray-200">
          {monthNames[month - 1]} {year}
        </span>
        <button
          onClick={() => {
            if (month === 12) {
              setMonth(1);
              setYear((y) => y + 1);
            } else setMonth((m) => m + 1);
          }}
          className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm"
        >
          →
        </button>
      </div>

      {/* Income Summary */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Total Income</p>
          <p className="text-2xl font-bold text-emerald-400">
            ฿{totalIncome.toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => setShowIncomeForm(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
        >
          + Income
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["overview", "expenses", "income"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition ${
              tab === t
                ? "bg-gray-700 text-white"
                : "bg-gray-900 text-gray-500 hover:bg-gray-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <>
          <BillProgress
            bills={bills}
            available={
              totalIncome -
              (expenses || []).reduce((s, e) => s + (e.amount || 0), 0)
            }
          />
          <Dashboard expenses={expenses} />
        </>
      )}

      {tab === "expenses" && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingExpense(null);
                setShowExpenseForm(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              + Add Expense
            </button>
          </div>
          <ExpenseList
            expenses={expenses}
            onEdit={(e) => {
              setEditingExpense(e);
              setShowExpenseForm(true);
            }}
            onDelete={async (id) => {
              if (confirm("Delete this expense?")) {
                await deleteExpense(id);
                loadAll();
              }
            }}
          />
        </>
      )}

      {tab === "income" && (
        <div className="space-y-3">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowIncomeForm(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              + Add Income
            </button>
          </div>
          {income.length === 0 && (
            <p className="text-center text-gray-600 py-10">
              No income logged this month
            </p>
          )}
          {income.map((inc) => (
            <div
              key={inc._id}
              className="bg-gray-900 rounded-xl px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  +฿{inc.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  {inc.note || "Income"} ·{" "}
                  {new Date(inc.date).toLocaleDateString("en-GB")}
                </p>
              </div>
              <button
                onClick={async () => {
                  if (confirm("Delete this income?")) {
                    await deleteIncome(inc._id);
                    loadAll();
                  }
                }}
                className="text-gray-500 hover:text-red-400 text-sm"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showExpenseForm && (
        <ExpenseForm
          initial={editingExpense}
          onSave={async (data) => {
            if (editingExpense) await updateExpense(editingExpense._id, data);
            else await createExpense(data);
            setEditingExpense(null);
            setShowExpenseForm(false);
            loadAll();
          }}
          onCancel={() => {
            setShowExpenseForm(false);
            setEditingExpense(null);
          }}
        />
      )}

      {showIncomeForm && (
        <IncomeForm
          onSave={async (data) => {
            await createIncome(data);
            setShowIncomeForm(false);
            loadAll();
          }}
          onCancel={() => setShowIncomeForm(false)}
        />
      )}

      {showBillsManager && (
        <BillsManager
          bills={bills}
          onRefresh={loadAll}
          onClose={() => setShowBillsManager(false)}
        />
      )}
    </div>
  );
}
