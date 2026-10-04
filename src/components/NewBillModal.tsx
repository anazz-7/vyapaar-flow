import React, { useState } from 'react';
import { LedgerEntry } from '../types';
import { ShoppingCart, X, Check } from 'lucide-react';

interface NewBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  partyName: string;
  onSaveBill: (entry: LedgerEntry) => void;
  currentBalance: number;
}

export const NewBillModal: React.FC<NewBillModalProps> = ({
  isOpen,
  onClose,
  partyName,
  onSaveBill,
  currentBalance,
}) => {
  const [billNo, setBillNo] = useState(`INV-${Math.floor(1028 + Math.random() * 50)}`);
  const [amountStr, setAmountStr] = useState('');
  const [itemsSummary, setItemsSummary] = useState('California Almonds (5kg), Whole Cashews (2kg)');
  const [itemsCount, setItemsCount] = useState('2 items');
  const [isUdhaar, setIsUdhaar] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr, 10) || 0;
    if (amount <= 0) return;

    const newBalance = isUdhaar ? currentBalance + amount : currentBalance;

    const newEntry: LedgerEntry = {
      id: `entry-${Date.now()}`,
      type: 'sale',
      billNumber: billNo,
      tag: isUdhaar ? 'UDHAAR' : 'CASH',
      amount,
      dateStr: 'Today, 24 Oct',
      timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: `Sale Bill #${billNo}`,
      itemsSummary,
      itemsCount,
      balance: newBalance,
      status: isUdhaar ? 'PENDING' : 'PAID',
    };

    onSaveBill(newEntry);
    onClose();
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
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                Quick Sale Bill (You Gave)
              </h2>
              <p className="text-xs text-slate-500">
                Party: {partyName}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto">
          {/* Bill No & Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                Bill Number
              </label>
              <input
                type="text"
                required
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-mono font-bold text-xs text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                Payment Type
              </label>
              <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUdhaar(true)}
                  className={`flex-1 py-1 rounded-md text-xs font-semibold transition-colors ${
                    isUdhaar ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Udhaar
                </button>
                <button
                  type="button"
                  onClick={() => setIsUdhaar(false)}
                  className={`flex-1 py-1 rounded-md text-xs font-semibold transition-colors ${
                    !isUdhaar ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Cash / UPI
                </button>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
              Bill Total Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-heading font-bold text-slate-400 text-lg">
                ₹
              </span>
              <input
                type="number"
                min="1"
                required
                autoFocus
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0"
                className="w-full h-11 pl-8 pr-3 rounded-xl border border-slate-200 bg-white font-heading font-bold text-xl text-slate-900 tabular-nums outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Items Summary</label>
            <input
              type="text"
              value={itemsSummary}
              onChange={(e) => setItemsSummary(e.target.value)}
              placeholder="e.g. Almonds (5kg), Cashews (2kg)"
              className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs text-slate-900"
            />
          </div>

          {/* Total Preview */}
          {amountStr && parseInt(amountStr, 10) > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-700 block">New Customer Balance:</span>
                <span className="text-[11px] text-slate-500">
                  {isUdhaar ? 'Added to credit passbook' : 'Cleared on counter'}
                </span>
              </div>
              <span className="font-heading font-bold text-base text-slate-900 tabular-nums">
                ₹{(isUdhaar ? currentBalance + (parseInt(amountStr, 10) || 0) : currentBalance).toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold shadow-xs"
            >
              Create Sale Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
