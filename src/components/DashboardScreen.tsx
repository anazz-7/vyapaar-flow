import React, { useState } from 'react';
import { ScreenMode } from '../types';
import {
  TrendingUp,
  ShoppingBag,
  Receipt,
  Wallet,
  AlertCircle,
  ArrowRight,
  Calendar,
  Sparkles,
  Package,
  Plus,
  Database,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CHART_DATA_TIMEFRAMES } from '../data/mockData';

interface DashboardScreenProps {
  onNavigate: (mode: ScreenMode) => void;
  onQuickSale: () => void;
  onAddExpense: () => void;
  onRecordPayment: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onQuickSale,
  onAddExpense,
  onRecordPayment,
}) => {
  const {
    storeData,
    todaySales,
    cashInHand,
    toCollect,
    toPay,
    thisMonthSales,
    thisMonthPurchases,
    thisMonthExpenses,
    thisMonthNetProfit,
    totalStockValue,
    lowStockCount,
    overdueCustomersCount,
    backupWarning,
    loadDemoData,
    clearStoreData,
  } = useStore();

  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '3M' | '1Y'>('7D');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Dynamic real date & time-based greeting
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(now);
  const ownerName = storeData.settings.ownerName?.split(' ')[0] || 'Anas';

  // Empty state check: clean fresh start
  const isStoreEmpty =
    storeData.customers.length === 0 && storeData.ledgerEntries.length === 0;

  // Chart data calculation
  const chartPoints = CHART_DATA_TIMEFRAMES[timeframe];
  const maxSales = Math.max(1000, ...chartPoints.map((d) => d.sales));

  const overdueCustomers = storeData.customers
    .filter((c) => c.outstandingBalance > 0)
    .sort((a, b) => (b.overdueDays || 0) - (a.overdueDays || 0))
    .slice(0, 4);

  const inventoryWatchlist = storeData.products.slice(0, 4);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 7-Day Backup Reminder Alert */}
      {backupWarning && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Weekly Backup Due:</span>
              <span className="ml-1 text-amber-800">
                Your offline records haven't been exported in over 7 days. Keep a local backup safe.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
        </div>
      )}

      {/* Clean Empty Start Onboarding Banner */}
      {isStoreEmpty && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Clean Fresh Start • Ready for Real MSME Transactions</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome to Vyapaar Flow
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your business khata, inventory, and cash day book are completely clean and saved locally on this device via IndexedDB. You can start entering your daily shop bills immediately or load sample business data to explore every feature.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={loadDemoData}
                className="h-10 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Load Demo Business Data</span>
              </button>
              <button
                onClick={onQuickSale}
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Make First Sale Bill</span>
              </button>
              <button
                onClick={() => onNavigate('khata')}
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 transition-colors"
              >
                <span>Add Customer Khata</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Greeting Header with Real Date & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>
              {greeting}, {ownerName}
            </span>
            <span className="text-xl">✨</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {storeData.settings.storeName || 'BM Super Mart'} • Single source of truth active
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Today, {formattedDate}</span>
          </div>

          {!isStoreEmpty && (
            <button
              onClick={loadDemoData}
              className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 border border-slate-200 transition-colors"
              title="Reload sample data for testing"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          )}

          <button
            onClick={onQuickSale}
            className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Sale</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid with Real Central Store Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* HERO CARD: Today's Sales */}
        <div className="sm:col-span-2 lg:col-span-1 p-4 rounded-xl bg-slate-900 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today's Sales
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
              <TrendingUp className="w-3 h-3" />
              Live
            </span>
          </div>

          <div className="my-3">
            <div className="font-heading font-extrabold text-2xl tracking-tight tabular-nums">
              ₹{Math.round(todaySales).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Month Total: ₹{Math.round(thisMonthSales).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-300">
            <span>
              {storeData.ledgerEntries.filter((e) => e.type === 'sale').length} bills generated
            </span>
            <button
              onClick={() => onNavigate('sales')}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
            >
              <span>POS</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Cash in Hand (From Day Book Roker) */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cash in Hand
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="font-heading font-bold text-xl text-slate-900 tabular-nums">
              ₹{Math.round(cashInHand).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Drawer Roker balance
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <button
              onClick={() => onNavigate('daybook')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5"
            >
              <span>Day Book</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="font-medium text-slate-700">Verified</span>
          </div>
        </div>

        {/* Customer Receivables (To Collect - Udhaar) */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              To Collect (Khata)
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div
              className={`font-heading font-bold text-xl tabular-nums ${
                toCollect > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              ₹{Math.round(toCollect).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {overdueCustomersCount > 0 ? `${overdueCustomersCount} overdue accounts` : 'All accounts clear'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <button
              onClick={() => onNavigate('khata')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5"
            >
              <span>View Khata</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="font-bold text-rose-600">
              {storeData.customers.filter((c) => c.outstandingBalance > 0).length} Due
            </span>
          </div>
        </div>

        {/* Operating Expenses Card */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Expenses
            </span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="font-heading font-bold text-xl text-slate-900 tabular-nums">
              ₹{Math.round(thisMonthExpenses).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {storeData.expenses.length} vouchers logged
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <button
              onClick={onAddExpense}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              + Expense
            </button>
            <span className="font-medium text-slate-700">Month-to-Date</span>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Net Profit
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {thisMonthSales > 0
                ? `${Math.round((thisMonthNetProfit / thisMonthSales) * 100)}% Margin`
                : '0% Margin'}
            </span>
          </div>
          <div className="my-2">
            <div className="font-heading font-bold text-xl text-emerald-700 tabular-nums">
              ₹{Math.round(thisMonthNetProfit).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sales − Purchases − Expenses
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <button
              onClick={() => onNavigate('reports')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5"
            >
              <span>P&amp;L</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-emerald-700 font-medium">Verified</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Financial Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-slate-900 text-base">
                Sales Overview &amp; Revenue Trend
              </h2>
              <p className="text-xs text-slate-500">
                Daily turnover vs procurement cost
              </p>
            </div>

            {/* Timeframe Controls (7D, 30D, 3M, 1Y) */}
            <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              {(['7D', '30D', '3M', '1Y'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timeframe === t
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Bar / Trend Chart with Tooltips */}
          <div className="h-64 w-full pt-4 flex flex-col justify-end">
            <div className="flex-1 flex items-end justify-between gap-2 px-2 border-b border-slate-100 pb-2">
              {chartPoints.map((item, idx) => {
                const heightPercent = Math.max(15, Math.round((item.sales / maxSales) * 100));
                const purchasesHeightPercent = Math.max(
                  10,
                  Math.round((item.purchases / maxSales) * 100)
                );
                const isHovered = hoveredPoint === idx;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-16 z-20 bg-slate-900 text-white rounded-lg p-2 text-[10px] shadow-xl whitespace-nowrap pointer-events-none">
                        <p className="font-bold text-slate-200">{item.label}</p>
                        <p className="text-emerald-400">
                          Sales: ₹{item.sales.toLocaleString('en-IN')}
                        </p>
                        <p className="text-slate-400">
                          Cost: ₹{item.purchases.toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}

                    {/* Dual Bars: Sales (navy) & Purchases (slate-200) */}
                    <div className="w-full max-w-[32px] flex items-end justify-center gap-1 h-48">
                      <div
                        style={{ height: `${purchasesHeightPercent}%` }}
                        className="w-1/2 bg-slate-200 rounded-t-sm transition-all group-hover:bg-slate-300"
                      />
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-1/2 bg-slate-900 rounded-t-sm transition-all group-hover:bg-blue-600"
                      />
                    </div>

                    <span className="text-[10px] font-medium text-slate-500 truncate w-full text-center mt-1">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Meaningful Legend */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-900 inline-block" />
                  <span>Gross Sales</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-200 inline-block" />
                  <span>Purchases (Cost)</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Peak: ₹{maxSales.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Overview & Breakdown (1 Column) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-heading font-bold text-slate-900 text-base">
              Profit &amp; Loss Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Clear business formula: Revenue − Cost − Exp = Net
            </p>
          </div>

          <div className="space-y-3 my-2 text-xs">
            {/* Step 1: Revenue */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Total Revenue (Sales)</span>
                <span className="text-[11px] text-slate-500">
                  {storeData.ledgerEntries.filter((e) => e.type === 'sale').length} transactions
                </span>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">
                +₹{Math.round(thisMonthSales).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Step 2: Cost of goods */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">− Cost of Goods (Purchases)</span>
                <span className="text-[11px] text-slate-500">Supplier procurement</span>
              </div>
              <span className="font-mono font-bold text-slate-600 text-sm">
                −₹{Math.round(thisMonthPurchases).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Step 3: Operating Expenses */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">− Operating Expenses</span>
                <span className="text-[11px] text-slate-500">Shop rent, staff, freight</span>
              </div>
              <span className="font-mono font-bold text-slate-600 text-sm">
                −₹{Math.round(thisMonthExpenses).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Final Result: Net Profit */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900 block">= Net Clean Profit</span>
                <span className="text-[11px] text-emerald-700">
                  {thisMonthSales > 0
                    ? `${Math.round((thisMonthNetProfit / thisMonthSales) * 100)}% profitability`
                    : '0% profitability'}
                </span>
              </div>
              <span className="font-heading font-extrabold text-emerald-800 text-base tabular-nums">
                ₹{Math.round(thisMonthNetProfit).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('reports')}
            className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Detailed P&amp;L Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Action Grid: Critical Overdue Accounts + Inventory Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Overdue Khata (Direct WhatsApp / Call Follow-up) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-sm">
                  Overdue Customer Balances
                </h3>
                <p className="text-xs text-slate-500">Sorted by overdue days</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('khata')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All Khata
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {overdueCustomers.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-medium text-slate-600">No overdue balances</p>
                <p className="text-[11px] text-slate-400">All customer accounts are clear or on schedule.</p>
              </div>
            ) : (
              overdueCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="py-3 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 truncate">
                        {customer.name}
                      </span>
                      {customer.isOverdue && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          {customer.overdueDays}d Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Prop: {customer.proprietor} • {customer.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 block">
                        ₹{customer.outstandingBalance.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Limit: ₹{customer.creditLimit.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigate('khata')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-sm">
                  Inventory Stock Health
                </h3>
                <p className="text-xs text-slate-500">
                  {lowStockCount > 0 ? `${lowStockCount} items below threshold` : 'All items well-stocked'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage Stock
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {inventoryWatchlist.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-medium text-slate-600">No products added yet</p>
                <p className="text-[11px] text-slate-400">Add products to track inventory levels.</p>
              </div>
            ) : (
              inventoryWatchlist.map((product) => {
                const isLow = product.currentStock <= product.minStock;
                return (
                  <div
                    key={product.id}
                    className="py-3 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 block truncate">
                        {product.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        SKU: {product.sku} • Selling: ₹{product.sellingPrice}/{product.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <span
                          className={`font-mono font-bold block ${
                            isLow ? 'text-amber-700' : 'text-slate-900'
                          }`}
                        >
                          {product.currentStock} {product.unit}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Min: {product.minStock} {product.unit}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isLow
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {isLow ? 'Low Stock' : 'Adequate'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
