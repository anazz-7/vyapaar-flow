import React from 'react';
import { PaymentSubmission } from '../types';

interface ThermalPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: PaymentSubmission;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-sm w-full p-4 flex flex-col gap-3 max-h-[90vh] overflow-y-auto border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <div className="flex items-center gap-1.5 text-on-surface font-heading font-bold text-[14px]">
            <span className="material-symbols-outlined text-[20px] text-primary">print</span>
            <span>Thermal Receipt (3" 80mm)</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Realistic Thermal Paper Component */}
        <div className="bg-white text-black font-mono text-[12px] p-4 rounded-lg border border-slate-300 shadow-inner flex flex-col leading-tight print:border-none print:shadow-none print:p-0">
          <div className="text-center font-bold text-[15px] uppercase tracking-wider">
            BM SUPER MART
          </div>
          <div className="text-center text-[10px] text-slate-600">
            Wholesale Merchant &amp; Provisions
          </div>
          <div className="text-center text-[10px] text-slate-600">
            Mandi Road, Indore - 452001
          </div>
          <div className="text-center text-[10px] text-slate-600">
            Tel: +91 98260 12345 | GST: 23AAGCB1293P1Z5
          </div>

          <div className="border-b border-dashed border-black my-2"></div>

          <div className="flex justify-between text-[11px]">
            <span>RCPT: {submission.receiptId}</span>
            <span>POS: POS-01</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>DATE: {submission.dateStr}</span>
            <span>{submission.timeStr}</span>
          </div>

          <div className="border-b border-dashed border-black my-2"></div>

          <div>CUSTOMER:</div>
          <div className="font-bold text-[13px]">{submission.partyName}</div>
          <div className="text-[11px]">Prop: {submission.proprietor} ({submission.phone})</div>

          <div className="border-b border-dashed border-black my-2"></div>

          <div className="font-bold mb-1">SETTLED INVOICES:</div>
          {submission.settledBills.map((b) => (
            <div key={b.billNo} className="flex justify-between text-[11px] py-0.5">
              <span>BILL #{b.billNo}</span>
              <span>₹{b.amount.toLocaleString('en-IN')}</span>
            </div>
          ))}

          <div className="border-b border-dashed border-black my-2"></div>

          <div className="flex justify-between font-bold text-[14px]">
            <span>TOTAL RECEIVED:</span>
            <span>₹{submission.amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>PAYMENT MODE:</span>
            <span>{submission.paymentMode}</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold mt-1">
            <span>REMAINING BAL:</span>
            <span>₹{submission.remainingBalance.toLocaleString('en-IN')} (NIL)</span>
          </div>

          <div className="border-b border-dashed border-black my-2"></div>

          {/* Barcode Simulation */}
          <div className="py-2 text-center">
            <div className="inline-block tracking-widest text-[24px] font-mono leading-none select-none">
              ||||| | |||| || |||||| | |||||
            </div>
            <div className="text-[9px] tracking-widest text-slate-500 mt-1">
              BM-POS-8902-REC305
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-600 mt-1">
            Thank you for your business!
            <br />
            Subject to Indore Jurisdiction.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-surface-container text-on-surface font-medium text-[12px]"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2 rounded-xl bg-primary text-on-primary font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
