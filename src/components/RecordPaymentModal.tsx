import React, { useState } from 'react';
import { Party, PaymentSubmission } from '../types';
import {
  CreditCard,
  Wallet,
  Building2,
  QrCode,
  X,
  Check,
  Printer,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface RecordPaymentModalProps {
  party: Party;
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (submission: PaymentSubmission) => void;
  onOpenSlipPreview: (amount: number, mode: string) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  party,
  isOpen,
  onClose,
  onSavePayment,
  onOpenSlipPreview,
}) => {
  const [amountStr, setAmountStr] = useState<string>(party.outstandingBalance.toString());
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI / QR' | 'Bank (NEFT)' | 'Cheque'>('Cash');
  const [paymentDate, setPaymentDate] = useState('Today, 24 Oct');
  const [entryTime, setEntryTime] = useState('04:30 PM');
  const [note, setNote] = useState('Received at shop counter by Imran Bhai personally');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  if (!isOpen) return null;

  const numericAmount = Math.max(0, parseInt(amountStr, 10) || 0);
  const remainingBalance = Math.max(0, party.outstandingBalance - numericAmount);

  // Auto-allocate FIFO across bills
  const bill1Due = 8400; // INV-1022
  const bill2Due = 5800; // INV-1011
  const bill1Allocated = Math.min(numericAmount, bill1Due);
  const bill2Allocated = Math.min(Math.max(0, numericAmount - bill1Due), bill2Due);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;

    const submission: PaymentSubmission = {
      receiptId: `#REC-${Math.floor(300 + Math.random() * 50)}`,
      partyName: party.name,
      proprietor: party.proprietor,
      phone: party.phone,
      amount: numericAmount,
      paymentMode,
      modeDetail:
        paymentMode === 'Cash'
          ? 'Cash (Counter POS-01)'
          : paymentMode === 'UPI / QR'
          ? 'UPI / PhonePe'
          : paymentMode === 'Bank (NEFT)'
          ? 'Bank Transfer (IMPS)'
          : 'Cheque Clearing',
      dateStr: paymentDate,
      timeStr: entryTime,
      note,
      settledBills: [
        ...(bill1Allocated > 0 ? [{ billNo: 'INV-1022', amount: bill1Allocated }] : []),
        ...(bill2Allocated > 0 ? [{ billNo: 'INV-1011', amount: bill2Allocated }] : []),
      ],
      remainingBalance,
      includePdfSlip: true,
      addReviewLink: true,
    };

    onSavePayment(submission);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                Receive Payment (You Got)
              </h2>
              <p className="text-xs text-slate-500">
                {party.name} • Prop: {party.proprietor}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Total Due Banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Current Outstanding Due
              </span>
              <span className="font-heading font-extrabold text-xl text-slate-900 mt-0.5 block tabular-nums">
                ₹{party.outstandingBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setAmountStr(party.outstandingBalance.toString())}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
            >
              Clear Full Balance
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
              Payment Amount Received (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-heading font-extrabold text-slate-400 text-lg">
                ₹
              </span>
              <input
                type="number"
                required
                min="1"
                max={party.outstandingBalance * 2}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full h-12 pl-8 pr-4 rounded-xl border border-slate-200 bg-white font-heading font-bold text-2xl text-slate-900 tabular-nums outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="0"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-1.5 pt-1">
              {[5000, 10000, party.outstandingBalance].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmountStr(preset.toString())}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-semibold text-[11px] transition-colors"
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
              Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Cash', label: 'Cash Counter', icon: Wallet },
                { id: 'UPI / QR', label: 'UPI / PhonePe', icon: QrCode },
                { id: 'Bank (NEFT)', label: 'Bank (IMPS)', icon: Building2 },
                { id: 'Cheque', label: 'Cheque', icon: CreditCard },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = paymentMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMode(item.id as any)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-semibold text-[11px] text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remaining Balance Calculator */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-emerald-900 block">Remaining Customer Khata:</span>
              <span className="text-[11px] text-emerald-700">Calculated after this voucher</span>
            </div>
            <div className="text-right">
              <span className="font-heading font-extrabold text-lg text-emerald-800 tabular-nums block">
                ₹{remainingBalance.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">
                {remainingBalance === 0 ? 'FULLY CLEARED ✓' : 'PARTIAL DUE'}
              </span>
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Voucher Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Received at shop counter by Imran Bhai"
              className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs text-slate-900"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              type="submit"
              disabled={numericAmount <= 0}
              className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>CONFIRM &amp; SAVE PAYMENT (₹{numericAmount.toLocaleString('en-IN')})</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenSlipPreview(numericAmount, paymentMode)}
              className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Preview 3" Thermal Voucher Slip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
