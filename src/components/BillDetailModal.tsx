import React from 'react';
import { INVOICE_DETAILS, ASSETS } from '../data/mockData';
import { FileText, X, Printer, Share2, Download } from 'lucide-react';

interface BillDetailModalProps {
  billNo: string | null;
  onClose: () => void;
  partyName: string;
}

export const BillDetailModal: React.FC<BillDetailModalProps> = ({
  billNo,
  onClose,
  partyName,
}) => {
  if (!billNo) return null;

  const invoice = INVOICE_DETAILS[billNo] || {
    billNo,
    date: '23 Oct 2024, 04:15 PM',
    customerName: partyName,
    paymentMode: 'Udhaar (Due)',
    status: 'OVERDUE',
    items: [
      { name: 'California Almonds Premium', qty: '10 kg', rate: 420, amount: 4200 },
      { name: 'Whole Cashews W-320', qty: '5 kg', rate: 560, amount: 2800 },
      { name: 'Afghan Green Raisins', qty: '2 kg', rate: 350, amount: 700 },
      { name: 'Pista Akbari Roasted', qty: '1 kg', rate: 700, amount: 700 },
    ],
    subtotal: 8400,
    discount: 0,
    roundOff: 0,
    tax: 0,
    grandTotal: 8400,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `Sale Bill #${invoice.billNo} from BM Super Mart:\nCustomer: ${partyName}\nTotal Amount: ₹${invoice.grandTotal.toLocaleString('en-IN')}\nDate: ${invoice.date}\nThank you!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                Invoice #{invoice.billNo}
              </h2>
              <p className="text-xs text-slate-500">
                Customer: {partyName} • {invoice.date}
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
          {/* Metadata banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Billing Date &amp; Status
              </span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                {invoice.date}
              </span>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                invoice.status === 'PAID'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {invoice.status === 'PAID' ? 'PAID (CASH / ONLINE)' : 'UDHAAR (DUE)'}
            </span>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
              Itemized Products
            </span>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {invoice.items.map((item, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between bg-white">
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-900 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {item.qty} @ ₹{item.rate}/unit
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 whitespace-nowrap">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-slate-900 font-medium">
                ₹{invoice.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-mono">−₹{invoice.discount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
              <span>Grand Total</span>
              <span className="font-heading font-extrabold text-base text-slate-900 tabular-nums">
                ₹{invoice.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handleShare}
              className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
