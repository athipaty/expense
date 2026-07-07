const BillProgress = ({ bills, available, onEdit }) => {
  const safeAvailable = isNaN(available) ? 0 : Math.max(available, 0);
  const sortedBills = [...bills].sort((a, b) => b.amount - a.amount);

  const { billsWithProgress, freeMoney } = sortedBills.reduce(
    (acc, bill) => {
      const paid = Math.min(Math.max(acc.remaining, 0), bill.amount);
      const remaining = acc.remaining - paid;
      const percent = Math.round((paid / bill.amount) * 100);
      return {
        remaining,
        freeMoney: remaining,
        billsWithProgress: [
          ...acc.billsWithProgress,
          { ...bill, paid, percent, done: percent >= 100 },
        ],
      };
    },
    { remaining: safeAvailable, freeMoney: safeAvailable, billsWithProgress: [] }
  );

  return (
    <div className="mb-4">
      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-2">
        Fixed Bills
      </p>

      {billsWithProgress.length === 0 && (
        <div className="bg-gray-900 rounded-3xl p-6 text-center mb-3">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-gray-500 text-sm">No fixed bills yet</p>
        </div>
      )}

      <div className="space-y-3">
        {billsWithProgress.map((bill) => (
          <div key={bill._id} className="bg-gray-900 rounded-3xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                  bill.done ? "bg-emerald-900/50" : "bg-orange-900/40"
                }`}>
                  {bill.done ? "✅" : "🔴"}
                </div>
                <span className="font-semibold text-sm text-white">{bill.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    ฿{bill.paid.toLocaleString()} / ฿{bill.amount.toLocaleString()}
                  </p>
                  <p className={`text-xs font-bold ${bill.done ? "text-emerald-400" : "text-orange-400"}`}>
                    {bill.percent}%
                  </p>
                </div>
                {onEdit && (
                  <button
                    onClick={() => onEdit(bill)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 active:text-emerald-400 rounded-lg flex-shrink-0"
                  >✏️</button>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${
                  bill.done ? "bg-emerald-500" : "bg-orange-400"
                }`}
                style={{ width: `${bill.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Free Money */}
      <div className="bg-emerald-950/60 border border-emerald-800/50 rounded-3xl p-4 flex items-center justify-between mt-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-900/50 rounded-xl flex items-center justify-center text-lg">💚</div>
          <div>
            <p className="text-xs text-emerald-400 font-medium">Free Money</p>
            <p className="text-xs text-gray-500">After all bills</p>
          </div>
        </div>
        <p className="text-emerald-400 font-bold text-lg">฿{freeMoney.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default BillProgress;
