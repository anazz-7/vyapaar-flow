import React, { useState } from 'react';
import { PaymentSubmission } from '../types';
import {
  CheckCircle2,
  Printer,
  Share2,
  Download,
  ArrowLeft,
  Check,
  CreditCard,
  User,
  Calendar,
  Clock,
  FileText,
} from 'lucide-react';

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
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleSendWhatsApp = () => {
    const text = `🙏 Payment Received - BM Super Mart\nDear ${submission.proprietor} (${submission.partyName}),\nWe have received ₹${submission.amount.toLocaleString('en-IN')} via ${submission.paymentMode} today (${submission.dateStr}, ${submission.timeStr}).\n\n• Receipt: ${submission.receiptId}\n• Bills Settled: ${submission.settledBills.map((b) => `#${b.billNo}`).join(', ')}\n• Current Khata Balance: ₹${submission.remainingBalance.toLocaleString('en-IN')}\n\nThank you for your timely settlement! Have a wonderful day ahead.\n• BM Super Mart (+91 98260 12345)`;

    const phoneClean = submission.phone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(text)}`, '_blank');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Success Badge & Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
          Payment Recorded Successfully
        </h1>
        <p className="text-xs text-slate-500">
          Voucher {submission.receiptId} saved and customer passbook balance updated.
        </p>
      </div>

      {/* Main Voucher Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5 text-xs">
        {/* Big Amount Row */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Amount Received
            </span>
            <span className="font-heading font-extrabold text-3xl text-slate-900 tabular-nums block mt-0.5">
              ₹{submission.amount.toLocaleString('en-IN')}
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{submission.paymentMode} Counter</span>
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Customer Account
            </span>
            <span className="font-semibold text-slate-900 text-sm block mt-0.5">
              {submission.partyName}
            </span>
            <span className="text-slate-500 text-[11px]">
              Prop: {submission.proprietor} • {submission.phone}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Date &amp; Time
            </span>
            <span className="font-semibold text-slate-900 text-sm block mt-0.5">
              {submission.dateStr}
            </span>
            <span className="text-slate-500 text-[11px] font-mono">
              {submission.timeStr} • Voucher {submission.receiptId}
            </span>
          </div>
        </div>

        {/* Remaining Khata Balance */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Remaining Outstanding Khata
            </span>
            <span className="font-semibold text-slate-900 text-sm mt-0.5 block">
              {submission.remainingBalance === 0 ? 'Full Balance Cleared ✓' : 'Partial Due Remaining'}
            </span>
          </div>
          <span className="font-heading font-bold text-lg font-mono text-slate-900 tabular-nums">
            ₹{submission.remainingBalance.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Note if any */}
        {submission.note && (
          <div className="p-3 bg-slate-50/50 rounded-lg text-slate-600 text-[11px]">
            <span className="font-semibold text-slate-700">Note: </span>
            {submission.note}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSendWhatsApp}
            className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Send Instant WhatsApp Receipt to Customer</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenThermal}
              className="py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print 3" Thermal Slip</span>
            </button>

            <button
              onClick={onBackToKhata}
              className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Khata</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
