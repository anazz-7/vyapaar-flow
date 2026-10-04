import React from 'react';
import { INVOICE_DETAILS, ASSETS } from '../data/mockData';

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
    items: [
      { name: 'California Almonds Premium', qty: '10 kg', rate: 420, amount: 4200 },
      { name: 'Whole Cashews W-320', qty: '5 kg', rate: 560, amount: 2800 },
      { name: 'Afghan Green Raisins', qty: '2 kg', rate: 350, amount: 700 },
      { name: 'Pista Akbari Roasted', qty: '1 kg', rate: 700, amount: 700 },
    ],
    subtotal: 8400,
    tax: 0,
    grandTotal: 8400,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-4 flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <div className="flex items-center gap-2">
            <img
              alt="BM Super Mart"
              className="w-7 h-7 rounded-lg object-contain bg-surface-container-low"
              src={ASSETS.storeLogo}
            />
            <div>
              <h3 className="font-heading font-bold text-[15px] text-on-surface">Tax Invoice #{invoice.billNo}</h3>
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

        <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20 flex justify-between text-[11px]">
          <div>
            <span className="text-on-surface-variant block">Billing Date</span>
            <span className="font-bold text-on-surface">{invoice.date}</span>
          </div>
          <div className="text-right">
            <span className="text-on-surface-variant block">Status</span>
            <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold">
              Udhaar (Due)
            </span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1 pb-1 border-b border-outline-variant/30">
            <span>Item / Description</span>
            <span className="text-right">Qty × Rate = Total</span>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            {invoice.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/50 text-[12px]"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-medium text-on-surface block truncate">{item.name}</span>
                  <span className="text-[10px] text-on-surface-variant">
                    {item.qty} @ ₹{item.rate}/unit
                  </span>
                </div>
                <span className="font-heading font-bold text-on-surface whitespace-nowrap">
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Total Summary */}
        <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-1 text-[12px] border border-outline-variant/20">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal</span>
            <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>CGST + SGST (0%)</span>
            <span>₹0.00</span>
          </div>
          <div className="border-t border-outline-variant/40 pt-1.5 mt-0.5 flex justify-between font-heading font-extrabold text-[15px] text-on-surface">
            <span>Grand Total</span>
            <span className="text-primary">₹{invoice.grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2 rounded-xl bg-surface-container text-on-surface font-medium text-[12px] flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-primary text-on-primary font-heading font-bold text-[12px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
