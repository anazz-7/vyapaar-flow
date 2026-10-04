import React, { useState } from 'react';
import { LedgerEntry } from '../types';

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
  const [billNo, setBillNo] = useState(`INV-${Math.floor(1025 + Math.random() * 20)}`);
  const [amountStr, setAmountStr] = useState('');
  const [itemsSummary, setItemsSummary] = useState('California Almonds (5kg), Cashews (2kg)');
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
    };

    onSaveBill(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-4 flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-[15px] text-on-surface">New Sale Bill (You Gave)</h3>
              <p className="text-[11px] text-on-surface-variant">Party: {partyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-[12px]">
          {/* Bill No & Credit Type */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">Invoice No</label>
              <input
                type="text"
                required
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface font-mono font-bold"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">Payment Type</label>
              <div className="flex rounded-xl bg-surface-container-low p-1 border border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsUdhaar(true)}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                    isUdhaar ? 'bg-error text-white' : 'text-on-surface-variant'
                  }`}
                >
                  Udhaar (Credit)
                </button>
                <button
                  type="button"
                  onClick={() => setIsUdhaar(false)}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                    !isUdhaar ? 'bg-secondary text-white' : 'text-on-surface-variant'
                  }`}
                >
                  Cash Paid
                </button>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">Total Bill Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-heading font-bold text-[20px] text-error">
                ₹
              </span>
              <input
                type="number"
                min="1"
                required
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-9 pr-3 py-2.5 font-heading font-extrabold text-[20px] text-on-surface focus:outline-none focus:border-error"
              />
            </div>
          </div>

          {/* Items Summary */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">Items Description</label>
            <input
              type="text"
              required
              value={itemsSummary}
              onChange={(e) => setItemsSummary(e.target.value)}
              placeholder="e.g. Almonds (10kg), Cashews (5kg)"
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Items count badge */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">Total Quantity / Pack</label>
            <input
              type="text"
              value={itemsCount}
              onChange={(e) => setItemsCount(e.target.value)}
              placeholder="e.g. 4 items or 6 Cartons"
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* New Balance Preview */}
          <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
            <span className="text-on-surface-variant">New Customer Balance:</span>
            <span className="font-heading font-extrabold text-[14px] text-error">
              ₹{(currentBalance + (isUdhaar ? parseInt(amountStr, 10) || 0 : 0)).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-error text-on-error font-heading font-bold shadow-sm"
            >
              Save Sale Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
