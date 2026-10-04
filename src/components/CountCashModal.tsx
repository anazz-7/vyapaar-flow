import React, { useState } from 'react';
import { Coins, X, Check, AlertCircle, RefreshCw } from 'lucide-react';

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
    200: 20, // 4,000
    100: 10, // 1,000
    50: 6, // 300
    20: 3, // 60
    10: 4, // 40
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

  const handleReset = () => {
    setDenominations({
      500: 0,
      200: 0,
      100: 0,
      50: 0,
      20: 0,
      10: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                Cash Note Counter &amp; Reconciliation
              </h2>
              <p className="text-xs text-slate-500">
                Verify physical drawer notes vs Day Book
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto">
          {/* Comparison Banner */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                System Day Book
              </span>
              <span className="font-heading font-bold text-lg text-slate-800 block tabular-nums">
                ₹{expectedAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Physical Notes Counted
              </span>
              <span className="font-heading font-extrabold text-lg text-blue-600 block tabular-nums">
                ₹{totalCalculated.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Difference Indicator */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between font-semibold ${
              difference === 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : difference > 0
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {difference === 0 ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>
                {difference === 0
                  ? 'Drawer Cash Reconciled (100% Match)'
                  : difference > 0
                  ? `Excess Cash: +₹${difference.toLocaleString('en-IN')}`
                  : `Shortage in Drawer: −₹${Math.abs(difference).toLocaleString('en-IN')}`}
              </span>
            </div>
            <span className="font-mono text-sm tabular-nums">
              {difference >= 0 ? `+₹${difference}` : `−₹${Math.abs(difference)}`}
            </span>
          </div>

          {/* Denominations Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
              <span>Denomination</span>
              <span>Pieces (Qty)</span>
              <span>Total Value (₹)</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {[500, 200, 100, 50, 20, 10].map((note) => {
                const count = denominations[note] || 0;
                const value = note * count;
                return (
                  <div key={note} className="p-2.5 flex items-center justify-between bg-white text-xs">
                    <span className="font-mono font-bold text-slate-900 w-16">
                      ₹{note}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono">×</span>
                      <input
                        type="number"
                        min="0"
                        value={count || ''}
                        onChange={(e) =>
                          handleCountChange(note, parseInt(e.target.value, 10) || 0)
                        }
                        placeholder="0"
                        className="w-16 h-7 text-center font-mono font-bold bg-slate-50 border border-slate-200 rounded text-xs outline-hidden focus:bg-white focus:border-blue-500"
                      />
                    </div>

                    <span className="font-mono font-bold text-slate-900 w-20 text-right">
                      ₹{value.toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Notes</span>
            </button>

            <button
              type="button"
              onClick={() => {
                alert(`Closing drawer verified with ₹${totalCalculated.toLocaleString('en-IN')}`);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              Accept &amp; Close Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
