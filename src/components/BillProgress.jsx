const BillProgress = ({ bills, available }) => {
  const safeAvailable = isNaN(available) ? 0 : Math.max(available, 0);

  const { billsWithProgress, freeMoney } = bills.reduce(
    (acc, bill) => {
      const paid = Math.min(Math.max(acc.remaining - 0, 0), bill.amount);
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
    <div className="space-y-4 mb-6">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Fixed Bills
      </h2>

      {billsWithProgress.length === 0 && (
        <p className="text-gray-600 text-sm">No fixed bills yet</p>
      )}

      {billsWithProgress.map((bill) => (
        <div key={bill._id} className="bg-gray-900 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {bill.done ? (
                <span className="text-lg">✅</span>
              ) : (
                <span className="text-lg">🔴</span>
              )}
              <span className="font-medium text-sm">{bill.name}</span>
            </div>
            <span className="text-sm text-gray-400">
              ฿{bill.paid.toLocaleString()} / ฿{bill.amount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${
                bill.done ? 'bg-emerald-500' : 'bg-orange-400'
              }`}
              style={{ width: `${bill.percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">{bill.percent}%</p>
        </div>
      ))}

      <div className="bg-emerald-900/30 border border-emerald-700/40 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">💚</span>
          <span className="text-sm font-medium text-emerald-300">Free Money</span>
        </div>
        <span className="text-emerald-400 font-bold">฿{freeMoney.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default BillProgress;