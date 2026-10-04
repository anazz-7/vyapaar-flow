import React from 'react';
import { X, Printer, Share2, Download, Check, FileText } from 'lucide-react';
import { INVOICE_DETAILS, ASSETS } from '../data/mockData';

interface InvoiceDrawerProps {
  billNo: string | null;
  onClose: () => void;
  onOpenThermal: (bill: any) => void;
}

export const InvoiceDrawer: React.FC<InvoiceDrawerProps> = ({
  billNo,
  onClose,
  onOpenThermal,
}) => {
  if (!billNo) return null;

  const invoice = INVOICE_DETAILS[billNo] || {
    billNo,
    date: '23 Oct 2024, 04:15 PM',
    customerName: 'Asra Fruits & Nuts',
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

  const handleShareWhatsApp = () => {
    const text = `Invoice #${invoice.billNo} from BM Super Mart:\nCustomer: ${invoice.customerName}\nDate: ${invoice.date}\nAmount: ₹${invoice.grandTotal.toLocaleString('en-IN')}\nStatus: ${invoice.status || 'Verified'}\nThank you!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Invoice #{invoice.billNo}
              </h3>
              <p className="text-[11px] text-slate-500">{invoice.date}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Status & Customer Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Customer Account
              </span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                {invoice.customerName || 'Asra Fruits & Nuts'}
              </span>
              <span className="text-[11px] text-slate-500">
                Payment: {invoice.paymentMode || 'Udhaar (Credit)'}
              </span>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                invoice.status === 'PAID'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : invoice.status === 'OVERDUE'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {invoice.status || 'VERIFIED'}
            </span>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
              Billed Items
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

          {/* Bill Financial Summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-slate-900 font-medium">
                ₹{invoice.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount Applied</span>
                <span className="font-mono">−₹{invoice.discount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
              <span>Grand Total</span>
              <span className="font-heading font-extrabold text-slate-900 text-base tabular-nums">
                ₹{invoice.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2">
          <button
            onClick={() => {
              onOpenThermal({
                receiptId: `#REC-${invoice.billNo}`,
                partyName: invoice.customerName || 'Asra Fruits & Nuts',
                proprietor: 'Customer',
                phone: '+91 98260 44321',
                amount: invoice.grandTotal,
                paymentMode: invoice.paymentMode || 'Credit',
                dateStr: invoice.date,
                timeStr: '',
                settledBills: [{ billNo: invoice.billNo, amount: invoice.grandTotal }],
                remainingBalance: 0,
                items: invoice.items,
              });
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print 3" Thermal Slip</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full py-2 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
