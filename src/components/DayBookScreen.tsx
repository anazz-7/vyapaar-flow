import React, { useState } from 'react';
import { ExpenseEntry } from '../types';

interface DayBookScreenProps {
  expenses: ExpenseEntry[];
  netCash: number;
  onAddExpense: () => void;
  onCountCash: () => void;
  onBankDeposit: () => void;
}

export const DayBookScreen: React.FC<DayBookScreenProps> = ({
  expenses,
  netCash,
  onAddExpense,
  onCountCash,
  onBankDeposit,
}) => {
  const [activeSegment, setActiveSegment] = useState<'daybook' | 'categories'>('daybook');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  const dates = [
    'Today, 24 Oct 2024',
    'Yesterday, 23 Oct 2024',
    'Tue, 22 Oct 2024',
  ];

  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredExpenses = expenses.filter((exp) => {
    if (categoryFilter === 'All') return true;
    return exp.category.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  // Calculate category aggregates for Category View
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-32 px-3 sm:px-4">
      {/* Date Selector & Timeline Bar */}
      <div className="pt-2 pb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous day"
            onClick={() => setCurrentDateIndex((prev) => Math.min(prev + 1, dates.length - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface border border-outline-variant/30">
            <span className="material-symbols-outlined text-[17px] text-primary">calendar_today</span>
            <span className="font-heading font-bold text-[13px]">{dates[currentDateIndex]}</span>
          </div>

          <button
            aria-label="Next day"
            onClick={() => setCurrentDateIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentDateIndex === 0}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
              currentDateIndex === 0
                ? 'bg-surface-container text-outline-variant cursor-not-allowed opacity-50'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface active:scale-95'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            aria-label="Export PDF"
            onClick={() => alert('Exporting Day Book PDF...')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/30 active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
          </button>

          <button
            aria-label="Filter"
            onClick={() => alert('Filter transactions by counter, user, or payment mode')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface-variant shadow-xs border border-outline-variant/30 active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Control */}
      <div className="mb-3">
        <div className="flex p-1 rounded-xl bg-surface-container border border-outline-variant/20 shadow-inner">
          <button
            onClick={() => setActiveSegment('daybook')}
            className={`flex-1 py-2 px-3 rounded-lg font-heading text-[12px] text-center transition-all ${
              activeSegment === 'daybook'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                : 'text-on-surface-variant font-medium hover:text-on-surface'
            }`}
            type="button"
          >
            Day Book (Cash In/Out)
          </button>
          <button
            onClick={() => setActiveSegment('categories')}
            className={`flex-1 py-2 px-3 rounded-lg font-heading text-[12px] text-center transition-all ${
              activeSegment === 'categories'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                : 'text-on-surface-variant font-medium hover:text-on-surface'
            }`}
            type="button"
          >
            Expense Categories
          </button>
        </div>
      </div>

      {/* Primary Net Cash Hero Card */}
      <div className="mb-3.5">
        <div className="rounded-2xl bg-primary text-on-primary p-4 shadow-md relative overflow-hidden">
          {/* Ambient background decoration */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-on-primary/5 pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-surface-container-highest/80 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-secondary-fixed">
                  account_balance_wallet
                </span>
                Current Net Cash in Drawer
              </span>
              <div className="font-heading font-black text-[30px] tracking-tight mt-1 text-on-primary flex items-baseline">
                <span>₹{netCash.toLocaleString('en-IN')}</span>
                <span className="text-[11px] font-bold ml-2 px-2 py-0.5 rounded-full bg-secondary text-on-secondary">
                  Healthy
                </span>
              </div>
            </div>

            <button
              onClick={onCountCash}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 backdrop-blur-sm text-on-primary text-[11px] font-bold active:scale-95 transition-all border border-on-primary/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Count Cash</span>
            </button>
          </div>

          {/* Cash Matrix Mini Grid */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-2.5 bg-primary-container/40 rounded-xl p-2.5 border border-on-primary/10">
            <div className="flex flex-col">
              <span className="text-[10px] text-surface-container-highest/70 font-medium">Opening (8 AM)</span>
              <span className="font-heading text-[13px] font-bold text-on-primary mt-0.5">₹82,850</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-secondary-fixed font-bold">Cash In (+)</span>
              <span className="font-heading text-[13px] font-bold text-secondary-fixed mt-0.5">+₹6,800</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-tertiary-fixed-dim font-bold">Cash Out (-)</span>
              <span className="font-heading text-[13px] font-bold text-tertiary-fixed-dim mt-0.5">
                -₹{totalExpenseAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Quick Action Shortcuts */}
      <div className="mb-3.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={onAddExpense}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-primary text-on-primary font-heading font-bold text-[12px] flex-shrink-0 shadow-xs active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Add Outflow</span>
          </button>

          <button
            onClick={onBankDeposit}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-surface-container-lowest text-on-surface font-heading font-semibold text-[12px] flex-shrink-0 shadow-xs border border-outline-variant/30 active:scale-95 transition-all hover:bg-surface-container"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">account_balance</span>
            <span>Bank Deposit</span>
          </button>

          <button
            onClick={() => alert('Generating Petty Cash Voucher slip...')}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-surface-container-lowest text-on-surface font-heading font-semibold text-[12px] flex-shrink-0 shadow-xs border border-outline-variant/30 active:scale-95 transition-all hover:bg-surface-container"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary-container">receipt</span>
            <span>Petty Cash Slip</span>
          </button>

          <button
            onClick={() => alert('Loading Past Khata archives for October...')}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-surface-container-lowest text-on-surface font-heading font-semibold text-[12px] flex-shrink-0 shadow-xs border border-outline-variant/30 active:scale-95 transition-all hover:bg-surface-container"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-outline">history</span>
            <span>Past Khata</span>
          </button>
        </div>
      </div>

      {activeSegment === 'daybook' ? (
        <>
          {/* Expense Header with Quick Filter Badges */}
          <div className="mb-2 flex items-center justify-between">
            <div>
              <span className="font-heading font-bold text-[15px] text-on-surface">Today's Expenses</span>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">
                Total Outflow: <strong className="text-error">₹{totalExpenseAmount.toLocaleString('en-IN')}</strong> • {expenses.length} Entries
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
              Roker Khata
            </span>
          </div>

          {/* Category Filter Horizontal Strip */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setCategoryFilter('All')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === 'All'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
                }`}
                type="button"
              >
                All (₹{totalExpenseAmount.toLocaleString('en-IN')})
              </button>

              <button
                onClick={() => setCategoryFilter('Rent')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === 'Rent'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
                }`}
                type="button"
              >
                Rent / Advance (₹2,500)
              </button>

              <button
                onClick={() => setCategoryFilter('Transport')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === 'Transport'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
                }`}
                type="button"
              >
                Transport (₹850)
              </button>

              <button
                onClick={() => setCategoryFilter('Staff Tea')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === 'Staff Tea'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
                }`}
                type="button"
              >
                Staff Tea (₹450)
              </button>

              <button
                onClick={() => setCategoryFilter('Packaging')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === 'Packaging'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
                }`}
                type="button"
              >
                Packaging (₹450)
              </button>
            </div>
          </div>

          {/* Chronological Expense Ledger Feed */}
          <div className="flex flex-col gap-2.5 mb-4">
            {filteredExpenses.map((exp, index) => (
              <React.Fragment key={exp.id}>
                <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30 flex flex-col gap-2 relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">
                          {exp.category === 'Transport'
                            ? 'local_shipping'
                            : exp.category === 'Staff Tea'
                            ? 'local_cafe'
                            : exp.category === 'Rent / Advance'
                            ? 'storefront'
                            : 'shopping_bag'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading font-bold text-[13px] text-on-surface truncate">
                            {exp.title}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant">
                            #{exp.expNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                          {exp.vendor}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-heading font-extrabold text-[15px] text-error block">
                        -₹{exp.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5">
                        {exp.timeStr}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 bg-surface-container-low/40 px-2.5 py-1.5 rounded-lg text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[10px]">
                        <span className="material-symbols-outlined text-[12px]">payments</span>
                        {exp.paymentMode}
                      </span>
                      {exp.badgeSecondary && (
                        <span className="inline-flex items-center gap-0.5 text-primary font-bold text-[10px]">
                          <span className="material-symbols-outlined text-[13px]">attachment</span>
                          {exp.badgeSecondary}
                        </span>
                      )}
                      {exp.reference && (
                        <span className="text-secondary font-bold text-[10px]">
                          {exp.reference}
                        </span>
                      )}
                    </div>
                    <button
                      aria-label="Transaction Options"
                      className="text-on-surface-variant hover:text-primary"
                      type="button"
                      onClick={() => alert(`Managing Expense #${exp.expNumber}`)}
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>

                {/* Reconciled Checkpoint Banner after 3rd item */}
                {index === 2 && (
                  <div className="p-2.5 rounded-xl bg-surface-container border border-secondary/30 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                      <span className="font-heading font-bold text-on-surface">Cash Drawer Reconciled (10:00 AM)</span>
                    </div>
                    <span className="text-on-surface-variant font-medium">Verified by Owner</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Store Owner Tip */}
          <div className="mb-4">
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              </div>
              <div className="min-w-0">
                <span className="font-heading font-bold text-[12px] text-on-surface block">
                  Vyapaar Tip for BM Super Mart
                </span>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Match physical cash with Day Book before closing the shutter tonight.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Expense Categories Breakdown View */
        <div className="flex flex-col gap-2.5 mb-4">
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-xs">
            <h3 className="font-heading font-bold text-[14px] mb-3">Category Distribution</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(categoryTotals).map(([cat, amount]) => {
                const pct = Math.round((amount / totalExpenseAmount) * 100);
                return (
                  <div key={cat} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-medium text-on-surface">{cat}</span>
                      <span className="font-heading font-bold">
                        ₹{amount.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] text-on-surface-variant">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Summary Strip */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-3 sm:px-4 py-2 bg-surface/95 backdrop-blur-md border-t border-outline-variant/20">
        <div className="max-w-lg mx-auto p-2.5 rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col pl-2">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold">Today's Outflow</span>
            <span className="font-heading text-[15px] font-black text-error">
              ₹{totalExpenseAmount.toLocaleString('en-IN')}{' '}
              <span className="text-[11px] font-normal text-on-surface-variant">({expenses.length} Items)</span>
            </span>
          </div>

          <button
            onClick={onAddExpense}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-error text-on-error font-heading font-bold text-[13px] shadow-sm active:scale-95 transition-all hover:bg-error/90"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>+ Add Expense</span>
          </button>
        </div>
      </div>
    </div>
  );
};
