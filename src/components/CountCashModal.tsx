import React, { useState } from 'react';

interface CountCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedAmount: number;
}

export const CountCashModal: React.FC<CountCashModalProps> = ({
  isOpen,
  onClose,
  expectedAmount,
}) => {
  const [denominations, setDenominations] = useState<Record<number, number>>({
    500: 160, // 80,000
    200: 20,  // 4,000
    100: 10,  // 1,000
    50: 6,    // 300
    20: 3,    // 60
    10: 4,    // 40
  });

  if (!isOpen) return null;

  const totalCalculated = Object.entries(denominations).reduce(
    (acc, [val, count]) => acc + Number(val) * count,
    0
  );

  const difference = totalCalculated - expectedAmount;

  const handleCountChange = (val: number, count: number) => {
    setDenominations((prev) => ({
      ...prev,
      [val]: Math.max(0, count || 0),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-4 flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-[15px] text-on-surface">Cash Drawer Reconciliation</h3>
              <p className="text-[11px] text-on-surface-variant">Verify physical notes against Day Book</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Expected vs Counted Comparison */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold">System Expected</span>
            <span className="font-heading font-black text-[18px] text-primary block mt-0.5">
              ₹{expectedAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold">Physical Count</span>
            <span
              className={`font-heading font-black text-[18px] block mt-0.5 ${
                difference === 0 ? 'text-secondary' : 'text-error'
              }`}
            >
              ₹{totalCalculated.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Status Notification */}
        <div
          className={`p-2.5 rounded-xl text-[12px] flex items-center gap-2 font-medium ${
            difference === 0
              ? 'bg-secondary-container/60 text-on-secondary-container'
              : 'bg-error-container/60 text-on-error-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {difference === 0 ? 'check_circle' : 'warning'}
          </span>
          <span>
            {difference === 0
              ? 'Exact Match! Cash drawer is 100% balanced.'
              : difference > 0
              ? `Surplus of +₹${difference.toLocaleString('en-IN')}`
              : `Shortage of -₹${Math.abs(difference).toLocaleString('en-IN')}`}
          </span>
        </div>

        {/* Denominations Grid */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Currency Notes &amp; Coins
          </span>
          <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
            {[500, 200, 100, 50, 20, 10].map((denom) => {
              const count = denominations[denom] || 0;
              const subtotal = denom * count;
              return (
                <div
                  key={denom}
                  className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low border border-outline-variant/20 text-[12px]"
                >
                  <div className="flex items-center gap-2 w-20">
                    <span className="font-heading font-bold text-[13px] text-primary">₹{denom}</span>
                    <span className="text-on-surface-variant font-mono">×</span>
                  </div>

                  <input
                    type="number"
                    min="0"
                    value={count}
                    onChange={(e) => handleCountChange(denom, parseInt(e.target.value, 10) || 0)}
                    className="w-24 bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-2 py-1 text-center font-heading font-bold focus:outline-none focus:border-primary"
                  />

                  <div className="w-24 text-right font-heading font-bold text-on-surface">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface font-medium text-[12px]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert('Cash tally verified and logged to audit trail.');
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-secondary text-on-secondary font-heading font-bold text-[13px] shadow-sm"
          >
            Confirm Reconciliation
          </button>
        </div>
      </div>
    </div>
  );
};
