import React, { useState } from 'react';
import { ExpenseEntry } from '../types';
import { Receipt, X, Check, Tag, CreditCard, Wallet, Building2, QrCode } from 'lucide-react';

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

  const categories: ExpenseEntry['category'][] = [
    'Transport',
    'Staff Tea',
    'Rent / Advance',
    'Packaging',
    'Electricity',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                Log Outflow Expense
              </h2>
              <p className="text-xs text-slate-500">
                Records money paid out of shop counter
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
          {/* Amount Input */}
          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
              Expense Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-heading font-bold text-rose-600 text-lg">
                ₹
              </span>
              <input
                type="number"
                min="1"
                required
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0"
                className="w-full h-11 pl-8 pr-3 rounded-xl border border-slate-200 bg-white font-heading font-bold text-xl text-rose-600 tabular-nums outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Expense Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Expense Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mandi Tempo Transport, Staff Tea & Samosa"
              className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs text-slate-900"
            />
          </div>

          {/* Vendor / Payee */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Vendor / Payee</label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. Ramu Auto Tempo, Sharma Tea Stall"
              className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs text-slate-900"
            />
          </div>

          {/* Category Chips */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    category === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Mode */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Paid From</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Cash Counter', label: 'Cash Drawer' },
                { id: 'UPI / PhonePe', label: 'UPI / PhonePe' },
                { id: 'Bank Transfer (IMPS)', label: 'Bank IMPS' },
                { id: 'Cheque', label: 'Cheque' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMode(m.id as any)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-medium text-center transition-colors ${
                    paymentMode === m.id
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reference No */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Bill / UTR Reference (Optional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. UTR #928174 or Bill #45"
              className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs text-slate-900 font-mono"
            />
          </div>

          {/* Action Buttons */}
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
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold shadow-xs"
            >
              Save Outflow Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
