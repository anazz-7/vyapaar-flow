import React, { useState, useId } from 'react';
import { Party, PaymentSubmission } from '../types';

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
  const [attachedPhoto, setAttachedPhoto] = useState(false);
  const fileInputId = useId();

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom duration-200">
        {/* Drag handle */}
        <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto mt-2.5 mb-1 sm:hidden"></div>

        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
            <div>
              <h2 className="font-heading font-bold text-[18px] text-on-surface leading-tight">
                Record Payment
              </h2>
              <p className="text-[12px] text-on-surface-variant">
                {party.name} • {party.proprietor}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 flex flex-col gap-4">
          {/* Total Due Banner */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-error-container/40 border border-error/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[18px]">cloud_alert</span>
              <span className="font-heading font-bold text-[13px] text-error">
                Total Due: ₹{party.outstandingBalance.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="bg-error text-white font-bold text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase">
              {party.overdueDays} Days Overdue
            </span>
          </div>

          {/* Amount Received Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              AMOUNT RECEIVED (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-extrabold text-[26px] text-secondary">
                ₹
              </span>
              <input
                type="number"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-11 pr-4 py-3 font-heading font-extrabold text-[28px] text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
                placeholder="0"
                min="1"
                required
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <button
                type="button"
                onClick={() => setAmountStr(party.outstandingBalance.toString())}
                className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all whitespace-nowrap ${
                  numericAmount === party.outstandingBalance
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Full Due: ₹{party.outstandingBalance.toLocaleString('en-IN')}
              </button>
              <button
                type="button"
                onClick={() => setAmountStr('10000')}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all whitespace-nowrap ${
                  numericAmount === 10000
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                ₹10,000
              </button>
              <button
                type="button"
                onClick={() => setAmountStr('5000')}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all whitespace-nowrap ${
                  numericAmount === 5000
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                ₹5,000
              </button>
              <button
                type="button"
                onClick={() => setAmountStr('')}
                className="px-3 py-1 rounded-full text-[12px] font-medium bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                Custom
              </button>
            </div>

            {/* Remaining Customer Balance Alert */}
            <div
              className={`mt-1 p-2.5 rounded-xl border flex items-center justify-between text-[12px] ${
                remainingBalance === 0
                  ? 'bg-secondary-container/50 border-secondary/30 text-on-secondary-container'
                  : 'bg-surface-container border-outline-variant/30 text-on-surface'
              }`}
            >
              <div className="flex items-center gap-1.5 font-medium">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span>Remaining Customer Balance:</span>
              </div>
              <span className="font-heading font-bold text-[14px]">
                {remainingBalance === 0 ? '₹0 (Fully Settled! 🎉)' : `₹${remainingBalance.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
              <div className="min-w-0">
                <span className="text-[10px] text-on-surface-variant block uppercase font-medium">Payment Date</span>
                <input
                  type="text"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="bg-transparent text-[12px] font-bold text-on-surface w-full focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
              <div className="min-w-0">
                <span className="text-[10px] text-on-surface-variant block uppercase font-medium">Entry Time</span>
                <input
                  type="text"
                  value={entryTime}
                  onChange={(e) => setEntryTime(e.target.value)}
                  className="bg-transparent text-[12px] font-bold text-on-surface w-full focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              PAYMENT MODE
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* Cash */}
              <button
                type="button"
                onClick={() => setPaymentMode('Cash')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  paymentMode === 'Cash'
                    ? 'bg-secondary-container/60 border-secondary text-on-secondary-container shadow-xs'
                    : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <div>
                  <span className="font-heading font-bold text-[13px] block">Cash</span>
                  <span className="text-[10px] text-on-surface-variant">Counter Handover</span>
                </div>
              </button>

              {/* UPI / QR */}
              <button
                type="button"
                onClick={() => setPaymentMode('UPI / QR')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  paymentMode === 'UPI / QR'
                    ? 'bg-secondary-container/60 border-secondary text-on-secondary-container shadow-xs'
                    : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                </div>
                <div>
                  <span className="font-heading font-bold text-[13px] block">UPI / QR</span>
                  <span className="text-[10px] text-on-surface-variant">GPay, PhonePe, Paytm</span>
                </div>
              </button>

              {/* Bank NEFT */}
              <button
                type="button"
                onClick={() => setPaymentMode('Bank (NEFT)')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  paymentMode === 'Bank (NEFT)'
                    ? 'bg-secondary-container/60 border-secondary text-on-secondary-container shadow-xs'
                    : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
                <div>
                  <span className="font-heading font-bold text-[13px] block">Bank (NEFT)</span>
                  <span className="text-[10px] text-on-surface-variant">IMPS / RTGS</span>
                </div>
              </button>

              {/* Cheque */}
              <button
                type="button"
                onClick={() => setPaymentMode('Cheque')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  paymentMode === 'Cheque'
                    ? 'bg-secondary-container/60 border-secondary text-on-secondary-container shadow-xs'
                    : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <span className="font-heading font-bold text-[13px] block">Cheque</span>
                  <span className="text-[10px] text-on-surface-variant">Clearing Deposit</span>
                </div>
              </button>
            </div>

            {/* Cash Counter Tag */}
            <div className="bg-surface-container-low px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold text-on-surface-variant flex items-center justify-between">
              <span>CASH-COUNTER-01</span>
              <span className="text-secondary font-sans font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Ready
              </span>
            </div>
          </div>

          {/* Auto-Clear Oldest Bills First (FIFO) */}
          <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/20 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">auto_fix_high</span>
                <span className="font-heading font-bold text-[12px] text-on-surface">Auto-Clear Oldest Bills First</span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container font-bold text-[10px] px-2 py-0.2 rounded-full">
                FIFO
              </span>
            </div>

            <div className="flex flex-col gap-1 text-[11px] pt-1 border-t border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="text-on-surface">1. Settles INV-1022 (Overdue)</span>
                <span className="font-heading font-bold text-secondary">
                  ₹{bill1Allocated.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface">2. Balance cleared INV-1011</span>
                <span className="font-heading font-bold text-secondary">
                  ₹{bill2Allocated.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Shopkeeper Note & Attachment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              SHOPKEEPER NOTE • OPTIONAL
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-[12px] text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. Received at shop counter personally"
            />

            <label
              htmlFor={fileInputId}
              className="w-full py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-dashed border-outline-variant/60 flex items-center justify-center gap-2 text-[12px] font-medium text-on-surface-variant transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {attachedPhoto ? 'check_circle' : 'add_a_photo'}
              </span>
              <span>{attachedPhoto ? 'Voucher Photo Attached ✓' : 'Attach Cash Voucher / Cheque Photo'}</span>
              <input
                id={fileInputId}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={() => setAttachedPhoto(true)}
              />
            </label>
          </div>

          {/* Instant WhatsApp Receipt Preview Box */}
          <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  chat
                </span>
                <div>
                  <span className="font-heading font-bold text-[12px] text-on-surface block">Send Instant WhatsApp Receipt</span>
                  <span className="text-[10px] text-on-surface-variant">{party.phone}</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendWhatsApp}
                  onChange={(e) => setSendWhatsApp(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>

            {sendWhatsApp && (
              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-[11px] text-on-surface-variant italic leading-relaxed">
                “Dear Imran Bhai, received ₹{numericAmount.toLocaleString('en-IN')} for {party.name}. Your remaining balance is now ₹{remainingBalance.toLocaleString('en-IN')}. - BM Super Mart”
              </div>
            )}
          </div>

          {/* Sticky Bottom Form Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => onOpenSlipPreview(numericAmount, paymentMode)}
              className="py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-heading font-bold text-[13px] flex items-center justify-center gap-1.5 border border-outline-variant/40 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Slip</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3.5 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-heading font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span>Save Payment (₹{numericAmount.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
