import React, { useState } from 'react';
import { ExpenseEntry } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseEntry) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [vendor, setVendor] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<ExpenseEntry['category']>('Transport');
  const [paymentMode, setPaymentMode] = useState<ExpenseEntry['paymentMode']>('Cash Counter');
  const [reference, setReference] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr, 10) || 0;
    if (amount <= 0 || !title) return;

    const newExpense: ExpenseEntry = {
      id: `exp-${Date.now()}`,
      expNumber: `EXP-${Math.floor(93 + Math.random() * 20)}`,
      title,
      vendor: vendor || 'Direct Cash Outflow',
      amount,
      timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateStr: 'Today, 24 Oct',
      category,
      paymentMode,
      reference: reference || undefined,
      badgeSecondary: paymentMode === 'Cash Counter' ? 'Slip Signed' : 'Self Verified',
    };

    onSave(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-4 flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-[15px] text-on-surface">Add Outflow Expense</h3>
              <p className="text-[11px] text-on-surface-variant">Records money paid out of shop drawer</p>
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
          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">Amount (₹)</label>
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

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">Expense Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mandi Auto Tempo Delivery"
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Vendor */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">Vendor / Handed To</label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. Ramu Auto Driver"
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">Category</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Transport', 'Staff Tea', 'Rent / Advance', 'Packaging', 'Electricity', 'Other'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                      category === cat
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container-low text-on-surface border border-outline-variant/20'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Payment Mode */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">Paid From</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Cash Counter', 'UPI / PhonePe', 'Bank Transfer (IMPS)', 'Cheque'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`py-2 px-2.5 rounded-lg text-[11px] font-medium text-left transition-all ${
                    paymentMode === mode
                      ? 'bg-secondary-container text-on-secondary-container font-bold border border-secondary'
                      : 'bg-surface-container-low text-on-surface border border-outline-variant/20'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Reference / Note */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">Bill / UTR Ref (Optional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. UTR #129038 or Slip Signed"
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
            />
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
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
