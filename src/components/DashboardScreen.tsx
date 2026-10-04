import React, { useState } from 'react';
import { ScreenMode } from '../types';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Receipt,
  Wallet,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  DollarSign,
  Package,
  Users,
} from 'lucide-react';
import {
  FINANCIAL_METRICS,
  CHART_DATA_TIMEFRAMES,
  MOCK_CUSTOMERS,
  MOCK_PRODUCTS,
  INITIAL_EXPENSES,
} from '../data/mockData';

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
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '3M' | '1Y'>('7D');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const chartPoints = CHART_DATA_TIMEFRAMES[timeframe];
  const maxSales = Math.max(...chartPoints.map((d) => d.sales));

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Greeting Header (Section 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Good morning, Anas</span>
            <span className="text-xl">✨</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's your business overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Today, 24 Oct 2024</span>
          </div>

          <button
            onClick={onQuickSale}
            className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Sale</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid with Visual Hierarchy (Section 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* HERO CARD: Sales (Greatest visual emphasis) */}
        <div className="sm:col-span-2 lg:col-span-1 p-4 rounded-xl bg-slate-900 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Sales
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
              <TrendingUp className="w-3 h-3" />
              +{FINANCIAL_METRICS.salesGrowth}%
            </span>
          </div>

          <div className="my-3">
            <div className="font-heading font-extrabold text-2xl tracking-tight tabular-nums">
              ₹{FINANCIAL_METRICS.sales.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              vs ₹11.1L prior period
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-300">
            <span>28 bills generated</span>
            <button
              onClick={() => onNavigate('sales')}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
            >
              <span>View POS</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Purchases Card */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Purchases
            </span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="font-heading font-bold text-xl text-slate-900 tabular-nums">
              ₹{FINANCIAL_METRICS.purchases.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              3 vendor consignments
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Cost of stock</span>
            <span className="font-medium text-slate-700">Mandi verified</span>
          </div>
        </div>

        {/* Expenses Card */}
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
              ₹{FINANCIAL_METRICS.expenses.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Rent, staff, tempo fuel
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <button
              onClick={onAddExpense}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              + Add Expense
            </button>
            <span className="font-medium text-slate-700">4 logged</span>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Net Profit
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {FINANCIAL_METRICS.netProfitMargin}% Margin
            </span>
          </div>
          <div className="my-2">
            <div className="font-heading font-bold text-xl text-emerald-700 tabular-nums">
              ₹{FINANCIAL_METRICS.netProfit.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Revenue − COGS − Exp
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-medium flex justify-between">
            <span>Healthy Surplus</span>
            <span>+8.2% mom</span>
          </div>
        </div>

        {/* Outstanding Receivables Card */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Outstanding
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="font-heading font-bold text-xl text-rose-600 tabular-nums">
              ₹{FINANCIAL_METRICS.outstanding.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Receivables: ₹3.18L • Due
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
            <span className="font-bold text-rose-600">4 Overdue</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Financial Analytics Row (Section 6) */}
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
                const purchasesHeightPercent = Math.max(10, Math.round((item.purchases / maxSales) * 100));
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
                        <p className="text-emerald-400">Sales: ₹{item.sales.toLocaleString('en-IN')}</p>
                        <p className="text-slate-400">Cost: ₹{item.purchases.toLocaleString('en-IN')}</p>
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

        {/* Profit Overview & Breakdown (1 Column) (Section 6 & 28) */}
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
                <span className="text-[11px] text-slate-500">28 active transactions</span>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">
                +₹{FINANCIAL_METRICS.sales.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Step 2: Cost of goods */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">− Cost of Goods (Purchases)</span>
                <span className="text-[11px] text-slate-500">Stock procurement</span>
              </div>
              <span className="font-mono font-bold text-slate-600 text-sm">
                −₹{FINANCIAL_METRICS.purchases.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Step 3: Operating Expenses */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">− Operating Expenses</span>
                <span className="text-[11px] text-slate-500">Shop rent, staff, freight</span>
              </div>
              <span className="font-mono font-bold text-slate-600 text-sm">
                −₹{FINANCIAL_METRICS.expenses.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Final Result: Net Profit */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900 block">= Net Clean Profit</span>
                <span className="text-[11px] text-emerald-700">22.5% profitability</span>
              </div>
              <span className="font-heading font-extrabold text-emerald-800 text-base tabular-nums">
                ₹{FINANCIAL_METRICS.netProfit.toLocaleString('en-IN')}
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
                <p className="text-xs text-slate-500">Requires follow-up today</p>
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
            {MOCK_CUSTOMERS.filter((c) => c.outstandingBalance > 0).slice(0, 3).map((customer) => (
              <div key={customer.id} className="py-3 flex items-center justify-between gap-2 text-xs">
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
            ))}
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
                <p className="text-xs text-slate-500">Items nearing reorder threshold</p>
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
            {MOCK_PRODUCTS.slice(2, 5).map((product) => {
              const isLow = product.currentStock <= product.minStock;
              return (
                <div key={product.id} className="py-3 flex items-center justify-between gap-2 text-xs">
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
