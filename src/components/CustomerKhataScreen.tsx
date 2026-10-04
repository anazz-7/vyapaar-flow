import React, { useState } from 'react';
import { Party, LedgerEntry } from '../types';

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'this_month' | 'last_30' | 'custom'>('all');
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  const filteredEntries = entries.filter((entry) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'this_month') return entry.dateStr.includes('Oct') || entry.dateStr.includes('Yesterday');
    if (activeFilter === 'last_30') return true;
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-32 px-3 sm:px-4">
      {/* Party Identity Top Profile Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 mt-2">
        <div className="flex items-start justify-between gap-2">
          {/* Avatar and Name */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-heading font-extrabold text-[18px]">
                AF
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-white ring-2 ring-surface-container-lowest">
                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading font-bold text-[18px] text-on-surface truncate">
                  {party.name}
                </h2>
                <span className="bg-secondary-container text-on-secondary-container text-[11px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                  {party.category}
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant mt-0.5 truncate">
                Prop: {party.proprietor} • {party.phone}
              </p>
            </div>
          </div>

          {/* Quick Communication Icons */}
          <div className="flex items-center gap-1.5 flex-shrink-0 relative">
            <a
              href={`tel:${party.phone}`}
              className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-primary flex items-center justify-center transition-colors"
              title="Call Party"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
            </a>
            <button
              onClick={onSendWhatsAppReminder}
              className="w-9 h-9 rounded-full bg-secondary-container/60 hover:bg-secondary-container text-secondary flex items-center justify-center transition-colors"
              title="WhatsApp Message"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat
              </span>
            </button>
            <button
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors"
              title="Party Options"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>

            {showOptionsDropdown && (
              <div className="absolute right-0 top-11 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 p-1.5 z-30">
                <button
                  className="w-full text-left px-3 py-2 text-[12px] rounded-lg hover:bg-surface-container flex items-center gap-2"
                  onClick={() => {
                    setShowOptionsDropdown(false);
                    onViewStatementPdf();
                  }}
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">description</span>
                  Download Statement
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-[12px] rounded-lg hover:bg-surface-container flex items-center gap-2 text-error"
                  onClick={() => {
                    setShowOptionsDropdown(false);
                    alert(`Credit limit for ${party.name} is ₹${party.creditLimit.toLocaleString('en-IN')}`);
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  Adjust Credit Limit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-outline-variant/20 text-[12px] text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-outline flex-shrink-0">storefront</span>
          <span className="truncate">{party.address}</span>
        </div>

        {/* Net Outstanding Balance Card */}
        <div className="mt-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                NET OUTSTANDING BALANCE
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-heading font-extrabold text-[26px] text-error">
                  ₹{party.outstandingBalance.toLocaleString('en-IN')}
                </span>
                <span className="text-[12px] font-semibold text-error/90">
                  (You will get)
                </span>
              </div>
            </div>

            {party.isOverdue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {party.overdueDays} Days Overdue
              </span>
            )}
          </div>

          {/* Credit Limit Gauge */}
          <div className="mt-3 pt-2 border-t border-outline-variant/20">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-on-surface-variant font-medium">
                Credit Limit: <strong className="text-on-surface">₹{party.creditLimit.toLocaleString('en-IN')}</strong>
              </span>
              <span className="text-error font-semibold">
                56% used (₹10,800 left)
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '56%' }}></div>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-surface-container-low p-2.5 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total Purchases</span>
            <span className="font-heading font-bold text-[14px] text-primary block mt-0.5">
              ₹{party.totalPurchases.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-on-surface-variant">8 Invoices</span>
          </div>

          <div className="bg-surface-container-low p-2.5 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total Paid</span>
            <span className="font-heading font-bold text-[14px] text-secondary block mt-0.5">
              ₹{party.totalPaid.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-secondary font-semibold">Good Payer</span>
          </div>

          <div className="bg-surface-container-low p-2.5 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Avg. Pay Time</span>
            <span className="font-heading font-bold text-[14px] text-on-surface block mt-0.5">
              {party.avgPayTimeDays} Days
            </span>
            <span className="text-[10px] text-on-surface-variant">Standard: 15d</span>
          </div>
        </div>

        {/* Quick Action Ribbon: WhatsApp Reminder & Statement PDF */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
          <button
            onClick={onSendWhatsAppReminder}
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-secondary-container/70 hover:bg-secondary-container text-on-secondary-container font-heading font-bold text-[12px] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              send
            </span>
            <span>WhatsApp Reminder</span>
          </button>

          <button
            onClick={onViewStatementPdf}
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-heading font-bold text-[12px] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span>Statement PDF</span>
          </button>
        </div>
      </div>

      {/* Ledger Passbook Header & Filter Strip */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-primary">menu_book</span>
            <h3 className="font-heading font-bold text-[16px] text-on-surface">Ledger Passbook</h3>
          </div>
          <span className="text-[11px] text-on-surface-variant font-medium">
            Showing {filteredEntries.length} Entries
          </span>
        </div>

        {/* Segmented Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setActiveFilter('this_month')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
              activeFilter === 'this_month'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setActiveFilter('last_30')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
              activeFilter === 'last_30'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setActiveFilter('custom')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
              activeFilter === 'custom'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            Custom
          </button>
        </div>
      </div>

      {/* Ledger Feed Entries */}
      <div className="flex flex-col gap-2.5 mt-2.5">
        {filteredEntries.map((entry) => {
          if (entry.type === 'opening') {
            return (
              <div
                key={entry.id}
                className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-outline-variant/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-[18px]">history</span>
                  </div>
                  <div>
                    <span className="font-heading font-bold text-[13px] text-on-surface block">
                      {entry.description}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">{entry.dateStr}</span>
                  </div>
                </div>
                <span className="font-heading font-bold text-[15px] text-on-surface">
                  ₹{entry.amount.toLocaleString('en-IN')}
                </span>
              </div>
            );
          }

          const isSale = entry.type === 'sale';

          return (
            <div
              key={entry.id}
              className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant/30 flex flex-col gap-2 transition-all hover:border-outline-variant"
            >
              {/* Row 1: Header + Amount */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSale ? 'bg-error-container/60 text-error' : 'bg-secondary-container/60 text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isSale ? 'receipt_long' : 'payments'}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-heading font-bold text-[14px] text-on-surface">
                        {entry.description}
                      </span>
                      {entry.tag && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isSale
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-secondary-container text-on-secondary-container'
                          }`}
                        >
                          {entry.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-on-surface-variant block mt-0.5">
                      {entry.dateStr} • {entry.timeStr}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span
                    className={`font-heading font-extrabold text-[16px] block ${
                      isSale ? 'text-error' : 'text-secondary'
                    }`}
                  >
                    {isSale ? `+₹${entry.amount.toLocaleString('en-IN')}` : `-₹${Math.abs(entry.amount).toLocaleString('en-IN')}`}
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">
                    {isSale ? 'Gave (Debit)' : 'Got (Credit)'}
                  </span>
                </div>
              </div>

              {/* Item Summary or Reference Box */}
              {isSale && entry.itemsSummary && (
                <div className="flex items-center justify-between bg-surface-container-low px-2.5 py-1.5 rounded-lg text-[11px] text-on-surface-variant">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[15px] text-outline flex-shrink-0">inventory_2</span>
                    <span className="truncate">{entry.itemsSummary}</span>
                  </div>
                  {entry.itemsCount && (
                    <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded text-[10px] font-bold text-on-surface flex-shrink-0 ml-1">
                      {entry.itemsCount}
                    </span>
                  )}
                </div>
              )}

              {!isSale && (
                <div className="flex items-center justify-between bg-surface-container-low px-2.5 py-1.5 rounded-lg text-[11px] text-on-surface-variant">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[15px] text-secondary flex-shrink-0">
                      verified
                    </span>
                    <span className="truncate">
                      {entry.upiRef ? `UPI Ref: ${entry.upiRef}` : (entry.note || 'Fully Settled Old Due')}
                    </span>
                  </div>
                  {entry.receiptNumber && (
                    <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded text-[10px] font-bold text-on-surface flex-shrink-0 ml-1">
                      Rcpt #{entry.receiptNumber}
                    </span>
                  )}
                </div>
              )}

              {/* Balance & Action Link */}
              <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-[12px]">
                <div className="text-on-surface-variant">
                  Balance: <strong className="text-on-surface font-heading">₹{entry.balance.toLocaleString('en-IN')}</strong>
                </div>

                {isSale ? (
                  <button
                    onClick={() => onViewBill(entry.billNumber || 'INV-1022')}
                    className="flex items-center gap-1 text-primary font-semibold hover:underline"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>View Bill</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onShareReceipt(entry)}
                    className="flex items-center gap-1 text-secondary font-semibold hover:underline"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">share</span>
                    <span>Share Receipt</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Action Bar for Khata (You Gave / You Got) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/30 py-2.5 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* You Gave (Red) */}
          <button
            onClick={onGiveCredit}
            type="button"
            className="flex-1 py-3 px-4 rounded-full bg-error-container text-on-error-container font-heading font-extrabold text-[14px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-error-container/80"
          >
            <span className="material-symbols-outlined text-[20px]">remove_circle</span>
            <span>You Gave ₹</span>
          </button>

          {/* You Got (Green) */}
          <button
            onClick={onRecordPayment}
            type="button"
            className="flex-1 py-3 px-4 rounded-full bg-secondary text-on-secondary font-heading font-extrabold text-[14px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all hover:bg-secondary/90"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>You Got ₹</span>
          </button>

          {/* Reminder Bell */}
          <button
            onClick={onSendWhatsAppReminder}
            type="button"
            className="w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0 transition-colors"
            title="Set Reminder"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};
