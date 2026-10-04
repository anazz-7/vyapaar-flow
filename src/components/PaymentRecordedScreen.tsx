import React, { useState } from 'react';
import { PaymentSubmission } from '../types';
import { ASSETS } from '../data/mockData';

interface PaymentRecordedScreenProps {
  submission: PaymentSubmission;
  onBackToKhata: () => void;
  onOpenThermal: () => void;
}

export const PaymentRecordedScreen: React.FC<PaymentRecordedScreenProps> = ({
  submission,
  onBackToKhata,
  onOpenThermal,
}) => {
  const [includePdfSlip, setIncludePdfSlip] = useState(submission.includePdfSlip);
  const [addReviewLink, setAddReviewLink] = useState(submission.addReviewLink);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleSendWhatsApp = () => {
    const text = `🙏 *Payment Received - BM Super Mart*\nDear ${submission.proprietor} (*${submission.partyName}*),\nWe have received *₹${submission.amount.toLocaleString('en-IN')}* via ${submission.paymentMode} today (${submission.dateStr}, ${submission.timeStr}).\n\n• Receipt: *${submission.receiptId}*\n• Bills Settled: *${submission.settledBills.map((b) => `#${b.billNo}`).join(', ')}*\n• Current Khata Balance: *₹${submission.remainingBalance.toLocaleString('en-IN')} (Nil)*\n\nThank you for your timely settlement! Have a wonderful day ahead.\n• BM Super Mart (+91 98260 12345)`;
    
    // Open WhatsApp Web/API or fallback
    const phoneClean = submission.phone.replace(/[^0-9]/g, '');
    const url = `https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const handleDownloadPdf = () => {
    alert(`Downloading Official Payment Voucher ${submission.receiptId} (PDF)...`);
  };

  const handleShareMore = () => {
    if (navigator.share) {
      navigator.share({
        title: `Payment Receipt ${submission.receiptId}`,
        text: `Receipt from BM Super Mart for ₹${submission.amount.toLocaleString('en-IN')}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Payment receipt details copied to clipboard!`);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3 pb-32">
      {/* Modal Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-lowest text-secondary shadow-xs">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </span>
          <span className="font-heading font-bold text-[18px] text-on-surface">Payment Recorded</span>
        </div>
        <button
          aria-label="Close modal"
          className="w-9 h-9 rounded-full bg-surface-container-lowest text-on-surface-variant flex items-center justify-center shadow-xs active:scale-95 transition-transform"
          onClick={onBackToKhata}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Celebration Success Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm border border-outline-variant/30 flex items-center gap-3 relative overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0 relative">
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-heading font-bold text-[15px] text-on-surface truncate">
            Payment Received Successfully!
          </span>
          <span className="text-[12px] text-on-surface-variant">
            {submission.dateStr} • {submission.timeStr}
          </span>
        </div>
      </div>

      {/* Digital Paper Voucher Receipt */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 overflow-hidden">
        {/* Top Decorative Color Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-primary via-primary-container to-secondary"></div>

        {/* Receipt Content Padding */}
        <div className="p-4 sm:p-5 flex flex-col gap-3.5">
          {/* Store Brand Header */}
          <div className="flex items-start justify-between gap-2 pb-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <img
                  alt="BM Super Mart"
                  className="w-7 h-7 rounded-lg object-contain bg-surface-container-low"
                  src={ASSETS.storeLogo}
                />
                <span className="font-heading font-extrabold text-[17px] text-primary tracking-tight">
                  BM Super Mart
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant mt-0.5">
                General Merchant &amp; Wholesale Provision
              </p>
              <p className="text-[11px] text-outline">Indore, MP • +91 98260 12345</p>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
              <span className="bg-surface-container px-2.5 py-1 rounded-full text-primary font-mono text-[11px] font-bold tracking-wide">
                {submission.receiptId}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-1">Cash Voucher</span>
            </div>
          </div>

          {/* Perforated Tear-Line Visual Divider with Cutouts */}
          <div className="relative flex items-center justify-between my-0.5">
            <div className="w-4 h-8 bg-surface rounded-r-full -ml-5 sm:-ml-6 shadow-inner"></div>
            <div className="flex-1 border-b-2 border-dashed border-outline-variant/60 mx-2"></div>
            <div className="w-4 h-8 bg-surface rounded-l-full -mr-5 sm:-mr-6 shadow-inner"></div>
          </div>

          {/* Main Settlement Figure Hero */}
          <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col items-center justify-center text-center border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
              Total Amount Received
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="font-heading font-bold text-[22px] text-secondary">₹</span>
              <span className="font-heading font-black text-[32px] text-secondary tracking-tight">
                {submission.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              {submission.remainingBalance === 0 ? 'FULLY SETTLED' : 'PARTIALLY SETTLED'}
            </span>
          </div>

          {/* Party & Payment Meta Data Grid */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-on-surface-variant">Customer / Party</span>
              <div className="text-right">
                <span className="font-heading font-bold text-on-surface block">
                  {submission.partyName}
                </span>
                <span className="text-[11px] text-outline">
                  Prop: {submission.proprietor} • {submission.phone}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px]">
              <span className="text-on-surface-variant">Payment Method</span>
              <div className="flex items-center gap-1.5 text-right font-medium">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  {submission.paymentMode === 'Cash'
                    ? 'payments'
                    : submission.paymentMode === 'UPI / QR'
                    ? 'qr_code_2'
                    : 'account_balance'}
                </span>
                <span className="font-heading font-bold text-on-surface">{submission.modeDetail}</span>
              </div>
            </div>
          </div>

          {/* Invoice Allocation Breakdown Box */}
          <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Settled Bills (FIFO)
              </span>
              <span className="text-[11px] font-bold text-primary">
                {submission.settledBills.length} Invoices Closed
              </span>
            </div>

            <div className="flex flex-col gap-1.5 pt-0.5">
              {submission.settledBills.map((bill) => (
                <div
                  key={bill.billNo}
                  className="flex items-center justify-between bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      receipt_long
                    </span>
                    <span className="text-[12px] font-bold text-on-surface">Bill #{bill.billNo}</span>
                  </div>
                  <span className="font-heading font-bold text-[13px] text-on-surface">
                    ₹{bill.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Customer Khata Status Banner */}
            <div className="mt-1 flex items-center justify-between pt-2 border-t border-outline-variant/30 text-[12px]">
              <span className="text-on-surface-variant font-medium">Remaining Khata Balance</span>
              <span className="font-heading font-bold text-secondary">
                {submission.remainingBalance === 0
                  ? '₹0.00 (All Clear 🎉)'
                  : `₹${submission.remainingBalance.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>

          {/* Verification Signature Token */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-outline">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
              <span>POS Verified #BM-POS-8902</span>
            </div>
            <span>E-Slip Validated</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Share Section Preview */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              chat
            </span>
            <span className="font-heading font-bold text-[13px] text-on-surface">
              WhatsApp Message Preview
            </span>
          </div>
          <span className="text-[10px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">
            Automated
          </span>
        </div>

        {/* Realistic Simulated WhatsApp Chat Bubble */}
        <div className="bg-[#e5ddd5] dark:bg-[#121b22] rounded-xl p-2.5 flex flex-col">
          <div className="bg-white dark:bg-[#1f2c34] rounded-lg p-3 shadow-xs text-on-surface flex flex-col gap-1 leading-relaxed text-[12px]">
            <p className="font-bold text-primary">🙏 *Payment Received - BM Super Mart*</p>
            <p className="text-on-surface-variant">Dear {submission.proprietor} (*{submission.partyName}*),</p>
            <p>
              We have received <strong className="text-secondary font-bold">₹{submission.amount.toLocaleString('en-IN')}</strong> via {submission.paymentMode} today ({submission.dateStr}, {submission.timeStr}).
            </p>

            <div className="bg-surface-container-low p-2 rounded text-on-surface my-1 flex flex-col gap-0.5 text-[11px]">
              <p>• Receipt: *{submission.receiptId}*</p>
              <p>• Bills Settled: *{submission.settledBills.map((b) => `#${b.billNo}`).join(', ')}*</p>
              <p>
                • Current Khata Balance: <strong className="text-secondary">₹{submission.remainingBalance.toLocaleString('en-IN')} (Nil)</strong>
              </p>
            </div>

            <p className="text-on-surface-variant text-[11px]">
              Thank you for your timely settlement! Have a wonderful day ahead.
            </p>

            <div className="flex items-center justify-between text-outline text-[10px] pt-1 border-t border-outline-variant/20 mt-1">
              <span>• BM Super Mart (+91 98260 12345)</span>
              <span className="flex items-center text-[#53bdeb] font-bold">
                {submission.timeStr}{' '}
                <span className="material-symbols-outlined text-[13px] ml-0.5">done_all</span>
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Options Toggles */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <label className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low cursor-pointer border border-outline-variant/20">
            <input
              type="checkbox"
              checked={includePdfSlip}
              onChange={(e) => setIncludePdfSlip(e.target.checked)}
              className="w-4 h-4 rounded text-secondary focus:ring-0"
            />
            <span className="text-[12px] text-on-surface font-medium truncate">Include PDF Slip</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low cursor-pointer border border-outline-variant/20">
            <input
              type="checkbox"
              checked={addReviewLink}
              onChange={(e) => setAddReviewLink(e.target.checked)}
              className="w-4 h-4 rounded text-secondary focus:ring-0"
            />
            <span className="text-[12px] text-on-surface font-medium truncate">Add Review Link</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Full-Width WhatsApp Button */}
        <button
          onClick={handleSendWhatsApp}
          className="w-full bg-secondary hover:bg-secondary/90 active:scale-98 text-on-secondary rounded-full py-3.5 px-4 flex items-center justify-center gap-2 shadow-md font-heading font-extrabold text-[14px] transition-all"
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            send
          </span>
          <span>Send Receipt on WhatsApp ({submission.phone})</span>
        </button>

        {shareSuccess && (
          <p className="text-center text-[12px] text-secondary font-bold animate-pulse">
            ✓ WhatsApp link generated and opened!
          </p>
        )}

        {/* 3 Auxiliary Utility Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onOpenThermal}
            className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xs text-on-surface hover:bg-surface-container-low active:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">print</span>
            <span className="text-[11px] font-bold">Thermal (3")</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xs text-on-surface hover:bg-surface-container-low active:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">download</span>
            <span className="text-[11px] font-bold">Save PDF</span>
          </button>

          <button
            onClick={handleShareMore}
            className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xs text-on-surface hover:bg-surface-container-low active:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">share</span>
            <span className="text-[11px] font-bold">More Apps</span>
          </button>
        </div>

        {/* Back Link */}
        <button
          onClick={onBackToKhata}
          className="w-full text-center py-2 text-on-surface-variant text-[13px] font-semibold hover:text-primary transition-colors"
        >
          Back to Customer Khata →
        </button>
      </div>
    </div>
  );
};
