import React, { useState } from 'react';
import { ScreenMode } from '../types';

interface DashboardScreenProps {
  onNavigate: (mode: ScreenMode) => void;
  onQuickSale: () => void;
  onAddExpense: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onQuickSale,
  onAddExpense,
}) => {
  const [salesTimeframe, setSalesTimeframe] = useState<'today' | '7d' | '30d'>('today');
  const [synced, setSynced] = useState(true);

  const handleSync = () => {
    setSynced(false);
    setTimeout(() => {
      setSynced(true);
      alert('Cloud Khata successfully synchronized with server!');
    }, 800);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-32 px-3 sm:px-4">
      {/* Greeting Header */}
      <div className="pt-2 pb-2.5 flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-[18px] text-on-surface tracking-tight">
              Good Morning, BM Super Mart
            </span>
            <span className="text-[18px]">✨</span>
          </div>
          <p className="text-[12px] text-on-surface-variant truncate">
            Here is how your business is doing today
          </p>
        </div>
        <div className="flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/30 flex-shrink-0">
          <span className="material-symbols-outlined text-[15px] text-primary">calendar_today</span>
          <span className="font-heading font-bold text-[11px] text-primary">Today, 24 Oct</span>
        </div>
      </div>

      {/* 2x2 Top Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {/* Today's Sales */}
        <div className="flex flex-col p-3 bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Today's Sales
            </span>
            <div className="w-6 h-6 rounded-full bg-secondary-container/60 flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
            </div>
          </div>
          <span className="font-heading font-black text-[24px] text-on-surface">₹48,520</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
              ▲ +12.4%
            </span>
            <span className="text-[11px] text-on-surface-variant">vs yesterday</span>
          </div>
          <div className="absolute -right-3 -bottom-3 w-12 h-12 bg-secondary/5 rounded-full pointer-events-none"></div>
        </div>

        {/* Purchases */}
        <div className="flex flex-col p-3 bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Purchases
            </span>
            <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
            </div>
          </div>
          <span className="font-heading font-black text-[24px] text-on-surface">₹22,400</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[11px] text-on-surface-variant">3 vendor bills today</span>
          </div>
          <div className="absolute -right-3 -bottom-3 w-12 h-12 bg-primary/5 rounded-full pointer-events-none"></div>
        </div>

        {/* Expenses */}
        <div
          onClick={() => onNavigate('daybook')}
          className="flex flex-col p-3 bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/30 cursor-pointer hover:border-outline-variant transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Expenses
            </span>
            <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[14px]">receipt</span>
            </div>
          </div>
          <span className="font-heading font-bold text-[20px] text-on-surface">₹4,250</span>
          <span className="text-[11px] text-on-surface-variant mt-1">Rent advance &amp; fuel</span>
        </div>

        {/* Net Cash Flow */}
        <div className="flex flex-col p-3 bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Net Cash Flow
            </span>
            <div className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
              <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
            </div>
          </div>
          <span className="font-heading font-bold text-[20px] text-secondary">+₹21,870</span>
          <span className="text-[11px] text-secondary font-medium mt-1">Healthy surplus</span>
        </div>
      </div>

      {/* Collect vs Pay Split Card */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {/* You'll Get */}
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">You'll Get</span>
            </div>
            <span className="font-heading font-black text-[20px] text-secondary block">
              ₹2,45,000
            </span>
            <span className="text-[11px] text-on-surface-variant">18 Customers</span>
          </div>
          <button
            onClick={() => onNavigate('khata')}
            className="mt-3 w-full py-1.5 px-2 rounded-full bg-secondary text-on-secondary font-heading font-bold text-[12px] flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">notifications_active</span>
            <span>Collect</span>
          </button>
        </div>

        {/* You'll Give */}
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-error"></span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">You'll Give</span>
            </div>
            <span className="font-heading font-black text-[20px] text-error block">
              ₹1,84,000
            </span>
            <span className="text-[11px] text-on-surface-variant">9 Suppliers</span>
          </div>
          <button
            onClick={() => alert('Opening Supplier Accounts payables ledger...')}
            className="mt-3 w-full py-1.5 px-2 rounded-full bg-surface-container-high text-on-surface font-heading font-bold text-[12px] flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">send_money</span>
            <span>Pay</span>
          </button>
        </div>
      </div>

      {/* Cash in Hand & HDFC Bank Balance Strip */}
      <div className="mb-3.5">
        <div className="bg-surface-container-high/60 backdrop-blur-sm p-3 rounded-2xl flex items-center justify-between gap-2 border border-outline-variant/30">
          <div
            onClick={() => onNavigate('daybook')}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold">Cash in Hand</span>
              <span className="font-heading font-bold text-[15px] text-on-surface truncate">₹85,400</span>
            </div>
          </div>

          <div className="h-8 w-px bg-outline-variant/40 flex-shrink-0"></div>

          <div className="flex items-center gap-2.5 min-w-0 flex-1 pl-1">
            <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold">HDFC Bank</span>
              <span className="font-heading font-bold text-[15px] text-on-surface truncate">₹3,42,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Quick Actions Grid */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-heading font-bold text-[14px] text-on-surface">Quick Actions</span>
          <span className="text-[11px] text-on-surface-variant">1-Tap Shortcuts</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* New Sale */}
          <button
            onClick={onQuickSale}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary text-on-primary shadow-sm active:scale-95 transition-all text-center"
            type="button"
          >
            <div className="w-9 h-9 rounded-full bg-on-primary/10 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[22px]">point_of_sale</span>
            </div>
            <span className="font-heading font-bold text-[12px] leading-tight">+ New Sale</span>
            <span className="text-[9px] text-on-primary/80">Make Bill</span>
          </button>

          {/* + Purchase */}
          <button
            onClick={() => alert('New Purchase Order / Inward Goods entry...')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface shadow-xs active:scale-95 transition-all text-center hover:bg-surface-container-low"
            type="button"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-1">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            </div>
            <span className="font-heading font-bold text-[12px] leading-tight">+ Purchase</span>
            <span className="text-[9px] text-on-surface-variant">Stock in</span>
          </button>

          {/* Add Expense */}
          <button
            onClick={onAddExpense}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface shadow-xs active:scale-95 transition-all text-center hover:bg-surface-container-low"
            type="button"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface mb-1">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <span className="font-heading font-bold text-[12px] leading-tight">Add Expense</span>
            <span className="text-[9px] text-on-surface-variant">Outflow</span>
          </button>

          {/* Receive Payment */}
          <button
            onClick={() => onNavigate('khata')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface shadow-xs active:scale-95 transition-all text-center hover:bg-surface-container-low"
            type="button"
          >
            <div className="w-9 h-9 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary mb-1">
              <span className="material-symbols-outlined text-[20px]">download_for_offline</span>
            </div>
            <span className="font-heading font-bold text-[12px] leading-tight">Receive</span>
            <span className="text-[9px] text-on-surface-variant">Got money</span>
          </button>

          {/* Add Party */}
          <button
            onClick={() => onNavigate('khata')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface shadow-xs active:scale-95 transition-all text-center hover:bg-surface-container-low"
            type="button"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-1">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <span className="font-heading font-bold text-[12px] leading-tight">Add Party</span>
            <span className="text-[9px] text-on-surface-variant">Customer/Khata</span>
          </button>

          {/* Add Item */}
          <button
            onClick={() => alert('Adding new dry fruit / grocery item to catalog...')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface shadow-xs active:scale-95 transition-all text-center hover:bg-surface-container-low"
            type="button"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-1">
              <span className="material-symbols-outlined text-[20px]">category</span>
            </div>
            <span className="font-heading font-bold text-[12px] leading-tight">Add Item</span>
            <span className="text-[9px] text-on-surface-variant">Catalog</span>
          </button>
        </div>
      </div>

      {/* Sales Overview SVG Chart Card */}
      <div className="mb-4">
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="font-heading font-bold text-[14px] text-on-surface">Sales Overview</span>
              <span className="text-[11px] text-on-surface-variant">Peak today: ₹54,000 at 6 PM</span>
            </div>

            <div className="flex items-center bg-surface-container-high p-0.5 rounded-full border border-outline-variant/30">
              <button
                onClick={() => setSalesTimeframe('today')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  salesTimeframe === 'today'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant'
                }`}
                type="button"
              >
                Today
              </button>
              <button
                onClick={() => setSalesTimeframe('7d')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  salesTimeframe === '7d'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant'
                }`}
                type="button"
              >
                7D
              </button>
              <button
                onClick={() => setSalesTimeframe('30d')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  salesTimeframe === '30d'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant'
                }`}
                type="button"
              >
                30D
              </button>
            </div>
          </div>

          {/* SVG Wave */}
          <div className="relative w-full h-36 flex items-end">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 120">
              <defs>
                <linearGradient id="salesGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00236f" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#00236f" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path
                d="M0,105 Q30,95 60,80 T120,65 T180,75 T240,25 T280,40 T320,15 L320,120 L0,120 Z"
                fill="url(#salesGrad)"
              ></path>
              <path
                d="M0,105 Q30,95 60,80 T120,65 T180,75 T240,25 T280,40 T320,15"
                fill="none"
                stroke="#00236f"
                strokeLinecap="round"
                strokeWidth="3"
              ></path>
              <circle cx="240" cy="25" fill="#006c4a" r="4.5" stroke="#ffffff" strokeWidth="2"></circle>
            </svg>

            <div className="absolute left-[75%] top-1 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] font-bold py-0.5 px-2 rounded-full shadow-md flex items-center gap-1">
              <span>₹54k Peak</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 mt-1 text-on-surface-variant text-[10px] font-mono">
            <span>8 AM</span>
            <span>11 AM</span>
            <span>2 PM</span>
            <span>5 PM</span>
            <span>8 PM</span>
            <span>Closing</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-[14px] text-on-surface">Recent Transactions</span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
          </div>
          <button
            onClick={() => onNavigate('khata')}
            className="text-[12px] text-primary font-bold flex items-center hover:underline"
            type="button"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {/* ABC Stores */}
          <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-secondary-container/50 text-secondary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">north_east</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-[13px] text-on-surface truncate">ABC Stores</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono">
                    INV-1024
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-on-surface-variant">Sale • 10:45 AM</span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                    Paid
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 pl-2">
              <span className="font-heading font-bold text-[14px] text-secondary block">+ ₹12,500</span>
              <span className="text-[10px] text-on-surface-variant">Cash</span>
            </div>
          </div>

          {/* Walk-in Customer */}
          <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-secondary-container/50 text-secondary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">north_east</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-[13px] text-on-surface truncate">
                    Walk-in Customer
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono">
                    INV-1023
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-on-surface-variant">Sale • 10:15 AM</span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                    Paid (UPI)
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 pl-2">
              <span className="font-heading font-bold text-[14px] text-secondary block">+ ₹2,350</span>
              <span className="text-[10px] text-on-surface-variant">QR Code</span>
            </div>
          </div>

          {/* Malabar Wholesalers */}
          <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-error-container/60 text-error flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">south_west</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-[13px] text-on-surface truncate">
                    Malabar Wholesalers
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono">
                    PUR-302
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-on-surface-variant">Purchase • 09:30 AM</span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-surface-container-highest text-primary-container text-[10px] font-bold">
                    Partial
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 pl-2">
              <span className="font-heading font-bold text-[14px] text-on-surface block">- ₹18,400</span>
              <span className="text-[10px] text-error font-medium">₹8,400 Due</span>
            </div>
          </div>

          {/* Shop Electricity Bill */}
          <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-surface-container-high text-outline flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-[13px] text-on-surface truncate">
                    Shop Electricity Bill
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono">
                    EXP-89
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-on-surface-variant">Expense • Yesterday</span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">
                    Paid
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 pl-2">
              <span className="font-heading font-bold text-[14px] text-on-surface block">- ₹3,200</span>
              <span className="text-[10px] text-on-surface-variant">Auto Debit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Sync Status Banner */}
      <div className="mb-4">
        <div className="bg-primary/5 rounded-2xl p-3.5 flex items-center gap-3 border border-primary/10">
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">backup</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-heading font-bold text-[12px] text-primary">
              Auto Khata Backup Active
            </span>
            <span className="text-[11px] text-on-surface-variant">
              {synced ? 'Last synced 5 mins ago to secure cloud' : 'Syncing changes...'}
            </span>
          </div>
          <button
            onClick={handleSync}
            className="px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-heading font-bold text-[11px] shadow-xs active:scale-95 border border-outline-variant/20 hover:bg-surface-container"
            type="button"
          >
            Sync
          </button>
        </div>
      </div>
    </div>
  );
};
