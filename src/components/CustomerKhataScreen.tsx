import React, { useState } from 'react';
import { Party, LedgerEntry } from '../types';
import {
  Phone,
  MessageSquare,
  Share2,
  FileText,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  CreditCard,
  Building2,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';

interface CustomerKhataScreenProps {
  party: Party;
  entries: LedgerEntry[];
  onRecordPayment: () => void;
  onGiveCredit: () => void;
  onViewBill: (billNo: string) => void;
  onSendWhatsAppReminder: () => void;
  onViewStatementPdf: () => void;
  onShareReceipt: (entry: LedgerEntry) => void;
}

export const CustomerKhataScreen: React.FC<CustomerKhataScreenProps> = ({
  party,
  entries,
  onRecordPayment,
  onGiveCredit,
  onViewBill,
  onSendWhatsAppReminder,
  onViewStatementPdf,
  onShareReceipt,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sales' | 'payments'>('all');
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  const filteredEntries = entries.filter((entry) => {
    if (activeFilter === 'sales') return entry.type === 'sale';
    if (activeFilter === 'payments') return entry.type === 'payment';
    return true;
  });

  const creditUsedPercent = Math.min(
    100,
    Math.round((party.outstandingBalance / party.creditLimit) * 100)
  );

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Customer Header Identity Card (Section 15: Mini Business Dashboard) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Identity Info */}
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-heading font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-xs">
              AF
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading font-bold text-xl text-slate-900 tracking-tight truncate">
                  {party.name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 tracking-wide">
                  {party.category}
                </span>
                {party.isOverdue && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{party.overdueDays} Days Overdue</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 truncate">
                Proprietor: <span className="font-medium text-slate-700">{party.proprietor}</span> • {party.phone}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {party.address}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
            <a
              href={`tel:${party.phone}`}
              className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              title="Call Customer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            <button
              onClick={onSendWhatsAppReminder}
              className="h-9 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              title="Send WhatsApp Payment Reminder"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Reminder</span>
            </button>

            <button
              onClick={onViewStatementPdf}
              className="h-9 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              title="Download Statement"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Statement</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Key Metric Cards (Section 15) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          {/* Outstanding Balance */}
          <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-100 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
              Outstanding Balance
            </span>
            <div className="font-heading font-extrabold text-2xl text-rose-700 my-1 tabular-nums">
              ₹{party.outstandingBalance.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-rose-600 font-medium">
              Payment due from Imran Bhai
            </span>
          </div>

          {/* Credit Limit Usage */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Credit Limit Used
            </span>
            <div className="font-heading font-bold text-xl text-slate-900 my-1 tabular-nums">
              {creditUsedPercent}%
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${creditUsedPercent}%` }}
                className={`h-full ${creditUsedPercent > 80 ? 'bg-rose-500' : 'bg-blue-600'}`}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1">
              ₹{party.outstandingBalance.toLocaleString('en-IN')} of ₹{party.creditLimit.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Total Lifetime Sales */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Purchases
            </span>
            <div className="font-heading font-bold text-xl text-slate-900 my-1 tabular-nums">
              ₹{party.totalPurchases.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500">
              14 lifetime vouchers
            </span>
          </div>

          {/* Total Paid Back */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Paid
            </span>
            <div className="font-heading font-bold text-xl text-emerald-700 my-1 tabular-nums">
              ₹{party.totalPaid.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              Avg cycle: {party.avgPayTimeDays} days
            </span>
          </div>
        </div>

        {/* Primary Khata Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onRecordPayment}
            className="flex-1 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Receive Payment (You Got)</span>
          </button>

          <button
            onClick={onGiveCredit}
            className="flex-1 h-10 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Give Credit Sale (You Gave)</span>
          </button>
        </div>
      </div>

      {/* Transaction Timeline & Ledger Table (Section 12: Light rows, comfortable height, right-aligned) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-slate-900 text-sm">
              Passbook Ledger
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{entries.length} entries</span>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 font-medium">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setActiveFilter('sales')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeFilter === 'sales'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sales (Udhaar)
            </button>
            <button
              onClick={() => setActiveFilter('payments')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeFilter === 'payments'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Payments Received
            </button>
          </div>
        </div>

        {/* Clean Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Date &amp; Time</th>
                <th className="py-2.5 px-4">Voucher / Bill</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">You Gave (Debit)</th>
                <th className="py-2.5 px-4 text-right">You Got (Credit)</th>
                <th className="py-2.5 px-4 text-right">Net Balance</th>
                <th className="py-2.5 px-3 text-center w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((entry) => {
                const isSale = entry.type === 'sale';
                const isPayment = entry.type === 'payment';
                const isOpening = entry.type === 'opening';

                return (
                  <tr
                    key={entry.id}
                    onClick={() => {
                      if (entry.billNumber) onViewBill(entry.billNumber);
                    }}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      entry.billNumber ? 'cursor-pointer' : ''
                    }`}
                  >
                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900 block">
                        {entry.dateStr}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {entry.timeStr || 'Opening'}
                      </span>
                    </td>

                    {/* Voucher / Bill */}
                    <td className="py-3 px-4 font-mono font-medium">
                      {entry.billNumber ? (
                        <span className="text-blue-600 font-semibold hover:underline">
                          #{entry.billNumber}
                        </span>
                      ) : entry.receiptNumber ? (
                        <span className="text-emerald-700">#{entry.receiptNumber}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block truncate max-w-[200px]">
                        {entry.description}
                      </span>
                      {entry.itemsSummary && (
                        <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                          {entry.itemsSummary}
                        </span>
                      )}
                      {entry.upiRef && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          UPI Ref: {entry.upiRef}
                        </span>
                      )}
                    </td>

                    {/* Status Pill (Section 12 & 17) */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isPayment
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : entry.status === 'OVERDUE'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : entry.status === 'PARTIAL'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {isPayment
                          ? 'PAID'
                          : entry.status || (isSale ? 'UDHAAR' : 'BALANCE')}
                      </span>
                    </td>

                    {/* You Gave (Debit - Red) */}
                    <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                      {isSale ? (
                        <span className="text-rose-600">
                          ₹{entry.amount.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* You Got (Credit - Green) */}
                    <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                      {isPayment ? (
                        <span className="text-emerald-600">
                          ₹{Math.abs(entry.amount).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Balance */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      ₹{entry.balance.toLocaleString('en-IN')}
                    </td>

                    {/* Quick Action Icon */}
                    <td className="py-3 px-3 text-center text-slate-400">
                      {entry.billNumber && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewBill(entry.billNumber!);
                          }}
                          className="p-1 hover:text-blue-600 rounded transition-colors"
                          title="View Invoice Drawer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                      {entry.type === 'payment' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShareReceipt(entry);
                          }}
                          className="p-1 hover:text-emerald-600 rounded transition-colors"
                          title="View Payment Voucher"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
