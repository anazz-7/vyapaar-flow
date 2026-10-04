import React from 'react';
import { PaymentSubmission } from '../types';
import { Printer, Download, Share2, X, Check } from 'lucide-react';

interface ThermalPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: PaymentSubmission & { items?: Array<{ product: { name: string; unit: string }; qty: number; rate: number; amount: number }> };
}

export const ThermalPrintModal: React.FC<ThermalPrintModalProps> = ({
  isOpen,
  onClose,
  submission,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `BM Super Mart Receipt ${submission.receiptId}\nCustomer: ${submission.partyName}\nAmount: ₹${submission.amount.toLocaleString('en-IN')}\nPayment: ${submission.paymentMode}\nDate: ${submission.dateStr}\nRemaining Balance: ₹${submission.remainingBalance.toLocaleString('en-IN')}\nThank you!`;
    const phone = submission.phone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-slate-700" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Thermal Receipt Slip (3" 80mm)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thermal Slip Content (No GST fields as requested in Section 26) */}
        <div className="p-4 overflow-y-auto">
          <div className="bg-slate-50 text-slate-900 font-mono text-[11px] p-4 rounded-lg border border-slate-300 shadow-inner flex flex-col leading-tight print:border-none print:shadow-none print:p-0 print:bg-white">
            <div className="text-center font-bold text-[14px] uppercase tracking-wider text-black">
              BM SUPER MART
            </div>
            <div className="text-center text-[10px] text-slate-600 mt-0.5">
              Wholesale &amp; Retail Groceries
            </div>
            <div className="text-center text-[10px] text-slate-600">
              MG Road, Mandi, Indore - 452001
            </div>
            <div className="text-center text-[10px] text-slate-600">
              Phone: +91 98260 12345
            </div>

            <div className="border-b border-dashed border-slate-400 my-2.5" />

            <div className="flex justify-between text-[10px]">
              <span>SLIP: {submission.receiptId}</span>
              <span>POS: Counter-1</span>
            </div>
            <div className="flex justify-between text-[10px] mt-0.5">
              <span>DATE: {submission.dateStr}</span>
              <span>{submission.timeStr}</span>
            </div>

            <div className="border-b border-dashed border-slate-400 my-2.5" />

            <div className="text-[10px] space-y-0.5">
              <div>
                <span className="font-bold">PARTY: </span>
                <span>{submission.partyName}</span>
              </div>
              <div>
                <span>PROP: {submission.proprietor}</span>
              </div>
              <div>
                <span>TEL: {submission.phone}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-slate-400 my-2.5" />

            {/* If bill items attached */}
            {submission.items && submission.items.length > 0 ? (
              <div className="space-y-1 my-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>ITEM</span>
                  <span>QTY × RATE = TOTAL</span>
                </div>
                {submission.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-[10px]">
                    <span className="truncate max-w-[140px]">{item.product.name}</span>
                    <span>
                      {item.qty} × ₹{item.rate} = ₹{item.amount}
                    </span>
                  </div>
                ))}
                <div className="border-b border-dashed border-slate-400 my-2" />
              </div>
            ) : null}

            {/* Settlement amount */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between font-bold text-black text-[13px] pt-1">
                <span>AMOUNT RECEIVED:</span>
                <span>₹{submission.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-700">
                <span>PAYMENT MODE:</span>
                <span>{submission.paymentMode}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-700">
                <span>REMAINING KHATA:</span>
                <span>₹{submission.remainingBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-slate-400 my-2.5" />

            <div className="text-center text-[9px] text-slate-500 space-y-0.5">
              <p>*** PAYMENT CONFIRMED ***</p>
              <p>Thank you for your business!</p>
              <p>Computer Generated Slip • No Signature Req</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50">
          <button
            onClick={handlePrint}
            className="flex-1 h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print 80mm</span>
          </button>

          <button
            onClick={handleShare}
            className="h-9 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
            title="Share via WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
