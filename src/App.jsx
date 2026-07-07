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
import { getIncome, createIncome, updateIncome, deleteIncome } from "./api/income";
import { getFixedBills } from "./api/fixedBills";
import { nowSG } from "./utils/date";

export default function App() {
  const { month: initMonth, year: initYear } = nowSG();
  const [month, setMonth] = useState(initMonth);
  const [year, setYear] = useState(initYear);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [bills, setBills] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showBillsManager, setShowBillsManager] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    loadAll();
  }, [month, year]);

  const loadAll = async () => {
    const [expRes, incRes, billRes] = await Promise.all([
      getExpenses(month, year),
      getIncome(month, year),
      getFixedBills(month, year),
    ]);
    setExpenses(expRes.data);
    setIncome(incRes.data);
    setBills(billRes.data);
  };

  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = (expenses || []).reduce((s, e) => s + (e.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const TAB_ICONS = { overview: "📊", expenses: "💸", income: "💰" };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col max-w-lg mx-auto relative">

      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-4 bg-gray-950 sticky top-0 z-10 border-b border-gray-800/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-tight">💸 TingTong</h1>
            <p className="text-gray-500 text-xs mt-0.5">Personal Finance</p>
          </div>
          <button
            onClick={() => setShowBillsManager(true)}
            className="bg-gray-800 active:bg-gray-700 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl flex items-center gap-1.5"
          >
            📋 <span>Bills</span>
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (month === 1) { setMonth(12); setYear((y) => y - 1); }
              else setMonth((m) => m - 1);
            }}
            className="w-10 h-10 bg-gray-800 active:bg-gray-700 rounded-xl flex items-center justify-center text-lg"
          >‹</button>
          <span className="flex-1 text-center font-semibold text-base text-white">
            {monthNames[month - 1]} {year}
          </span>
          <button
            onClick={() => {
              if (month === 12) { setMonth(1); setYear((y) => y + 1); }
              else setMonth((m) => m + 1);
            }}
            className="w-10 h-10 bg-gray-800 active:bg-gray-700 rounded-xl flex items-center justify-center text-lg"
          >›</button>
        </div>
      </header>

      {/* ── Balance Card ── */}
      <div className="px-5 pt-5">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-5 mb-4 shadow-lg">
          <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider mb-1">Balance</p>
          <p className="text-4xl font-bold text-white mb-4">฿{balance.toLocaleString()}</p>
          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 rounded-2xl px-3 py-2.5">
              <p className="text-emerald-200 text-xs mb-0.5">Income</p>
              <p className="text-white font-bold text-base">฿{totalIncome.toLocaleString()}</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl px-3 py-2.5">
              <p className="text-emerald-200 text-xs mb-0.5">Expenses</p>
              <p className="text-white font-bold text-base">฿{totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 px-5 pb-28 overflow-y-auto">
        {tab === "overview" && (
          <>
            <BillProgress
              bills={bills}
              available={balance}
              onEdit={(bill) => { setEditingBill(bill); setShowBillsManager(true); }}
            />
            <Dashboard expenses={expenses} />
          </>
        )}

        {tab === "expenses" && (
          <>
            <div className="flex justify-between items-center mt-2 mb-4">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Expenses</p>
              <button
                onClick={() => { setEditingExpense(null); setShowExpenseForm(true); }}
                className="bg-emerald-500 active:bg-emerald-400 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl"
              >
                + Add
              </button>
            </div>
            <ExpenseList
              expenses={expenses}
              onEdit={(e) => { setEditingExpense(e); setShowExpenseForm(true); }}
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
          <>
            <div className="flex justify-between items-center mt-2 mb-4">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Income</p>
              <button
                onClick={() => { setEditingIncome(null); setShowIncomeForm(true); }}
                className="bg-emerald-500 active:bg-emerald-400 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl"
              >
                + Add
              </button>
            </div>
            <div className="space-y-3">
              {income.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">💰</p>
                  <p className="text-gray-500 text-sm">No income logged this month</p>
                </div>
              )}
              {income.map((inc) => (
                <div key={inc._id} className="bg-gray-900 rounded-2xl px-4 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-900/50 rounded-xl flex items-center justify-center text-lg">💰</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{inc.note || "Income"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(inc.date).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-emerald-400">+฿{inc.amount.toLocaleString()}</p>
                    <button
                      onClick={() => { setEditingIncome(inc); setShowIncomeForm(true); }}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 active:text-emerald-400 rounded-lg"
                    >✏️</button>
                    <button
                      onClick={async () => {
                        if (confirm("Delete this income?")) {
                          await deleteIncome(inc._id);
                          loadAll();
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 active:text-red-400 rounded-lg"
                    >🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-gray-900/95 backdrop-blur border-t border-gray-800 px-4 pt-3 pb-6 flex gap-2 z-20">
        {["overview", "expenses", "income"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition ${
              tab === t ? "bg-gray-700 text-white" : "text-gray-500 active:bg-gray-800"
            }`}
          >
            <span className="text-lg">{TAB_ICONS[t]}</span>
            <span className="text-xs font-medium capitalize">{t}</span>
          </button>
        ))}
      </nav>

      {/* ── Modals ── */}
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
          onCancel={() => { setShowExpenseForm(false); setEditingExpense(null); }}
        />
      )}

      {showIncomeForm && (
        <IncomeForm
          initial={editingIncome}
          onSave={async (data) => {
            if (editingIncome) await updateIncome(editingIncome._id, data);
            else await createIncome(data);
            setEditingIncome(null);
            setShowIncomeForm(false);
            loadAll();
          }}
          onCancel={() => { setShowIncomeForm(false); setEditingIncome(null); }}
        />
      )}

      {showBillsManager && (
        <BillsManager
          bills={bills}
          month={month}
          year={year}
          onRefresh={loadAll}
          initialEditBill={editingBill}
          onClose={() => { setShowBillsManager(false); setEditingBill(null); }}
        />
      )}
    </div>
  );
}
