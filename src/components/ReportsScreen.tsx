import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Wallet,
  Users,
  Package,
} from 'lucide-react';
import { FINANCIAL_METRICS, INITIAL_EXPENSES, MOCK_CUSTOMERS } from '../data/mockData';

export const ReportsScreen: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<'pnl' | 'sales' | 'expenses' | 'receivables'>(
    'pnl'
  );
  const [dateRange, setDateRange] = useState('October 2024 (Month-to-Date)');

  const reportTabs = [
    { id: 'pnl', label: 'Profit & Loss Statement', icon: BarChart3 },
    { id: 'sales', label: 'Sales & Invoices Summary', icon: TrendingUp },
    { id: 'expenses', label: 'Operating Expenses', icon: Wallet },
    { id: 'receivables', label: 'Customer Receivables Aging', icon: Users },
  ];

  const handleExportCsv = () => {
    alert('Exporting verified report in CSV format...');
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
            Financial Reports &amp; Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Executive financial intelligence, profitability breakdown, and customer receivables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="h-9 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="h-9 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Report Categories Nav (Section 27) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2 text-xs font-semibold">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFIT & LOSS (Section 28) */}
      {activeReportTab === 'pnl' && (
        <div className="space-y-6">
          {/* Executive P&L Formula Cards */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                P&amp;L Analysis for {dateRange}
              </span>
              <h2 className="font-heading font-extrabold text-xl text-slate-900 mt-0.5">
                Statement of Operations
              </h2>
            </div>

            {/* Visual Equation Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Step 1: Gross Sales */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Gross Sales (Revenue)
                </span>
                <span className="font-heading font-bold text-2xl text-slate-900 block mt-1 tabular-nums">
                  ₹{FINANCIAL_METRICS.sales.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  +12.4% vs last month
                </span>
              </div>

              {/* Step 2: COGS */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  − Cost of Goods Sold
                </span>
                <span className="font-heading font-bold text-2xl text-slate-700 block mt-1 tabular-nums">
                  ₹{FINANCIAL_METRICS.purchases.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  67.4% of total sales
                </span>
              </div>

              {/* Step 3: Expenses */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  − Operating Expenses
                </span>
                <span className="font-heading font-bold text-2xl text-slate-700 block mt-1 tabular-nums">
                  ₹{FINANCIAL_METRICS.expenses.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Shop rent, tea, tempo freight
                </span>
              </div>

              {/* Final Net Profit */}
              <div className="p-4 rounded-xl bg-emerald-950 text-white shadow-md border border-emerald-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                  = Net Profit (Pre-Tax)
                </span>
                <span className="font-heading font-extrabold text-2xl text-emerald-300 block mt-1 tabular-nums">
                  ₹{FINANCIAL_METRICS.netProfit.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
                  22.5% Net Profit Margin
                </span>
              </div>
            </div>

            {/* Detailed P&L Line Items Table */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-heading font-bold text-sm text-slate-900 mb-3">
                Itemized Profit &amp; Loss Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Account Head</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                      <th className="py-2.5 px-3 text-right">% of Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="font-semibold text-slate-900 bg-slate-50/50">
                      <td className="py-2.5 px-3">Gross Sales Revenue</td>
                      <td className="py-2.5 px-3 text-slate-500">Operating Inflow</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹12,48,500</td>
                      <td className="py-2.5 px-3 text-right font-mono">100.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 pl-6 text-slate-600">Counter Cash Sales</td>
                      <td className="py-2 px-3 text-slate-400">Direct Retail</td>
                      <td className="py-2 px-3 text-right font-mono">₹7,20,000</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-500">57.7%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 pl-6 text-slate-600">Credit / Udhaar Billing</td>
                      <td className="py-2 px-3 text-slate-400">Wholesale Passbook</td>
                      <td className="py-2 px-3 text-right font-mono">₹5,28,500</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-500">42.3%</td>
                    </tr>
                    <tr className="font-semibold text-slate-900 bg-slate-50/50">
                      <td className="py-2.5 px-3">Cost of Goods Sold (Purchases)</td>
                      <td className="py-2.5 px-3 text-slate-500">Direct Procurement</td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-600">−₹8,42,200</td>
                      <td className="py-2.5 px-3 text-right font-mono">67.4%</td>
                    </tr>
                    <tr className="font-semibold text-emerald-800 bg-emerald-50/50">
                      <td className="py-2.5 px-3">Gross Operating Margin</td>
                      <td className="py-2.5 px-3 text-emerald-700">Sales − COGS</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹4,06,300</td>
                      <td className="py-2.5 px-3 text-right font-mono">32.6%</td>
                    </tr>
                    <tr className="font-semibold text-slate-900 bg-slate-50/50">
                      <td className="py-2.5 px-3">Operating Expenses</td>
                      <td className="py-2.5 px-3 text-slate-500">Overhead Outflows</td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-600">−₹1,24,500</td>
                      <td className="py-2.5 px-3 text-right font-mono">10.0%</td>
                    </tr>
                    {INITIAL_EXPENSES.map((exp) => (
                      <tr key={exp.id} className="text-slate-600">
                        <td className="py-2 px-3 pl-6">{exp.title} ({exp.vendor})</td>
                        <td className="py-2 px-3 text-slate-400">{exp.category}</td>
                        <td className="py-2 px-3 text-right font-mono">−₹{exp.amount.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-400">0.8%</td>
                      </tr>
                    ))}
                    <tr className="font-extrabold text-slate-900 bg-slate-100 text-sm">
                      <td className="py-3 px-3">NET CLEAN BUSINESS PROFIT</td>
                      <td className="py-3 px-3 text-emerald-700">Surplus</td>
                      <td className="py-3 px-3 text-right font-heading text-emerald-700">
                        ₹2,81,800
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-700">22.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECEIVABLES AGING */}
      {activeReportTab === 'receivables' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Customer Receivables &amp; Credit Aging
              </h2>
              <p className="text-xs text-slate-500">
                Tracking all pending customer khata balances and overdue timelines.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Due Across All Parties:</span>
              <span className="font-heading font-bold text-xl text-rose-600 font-mono">
                ₹{FINANCIAL_METRICS.receivables.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Credit Limit</th>
                  <th className="py-2.5 px-3 text-right">Total Purchases</th>
                  <th className="py-2.5 px-3 text-right">Balance Due</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_CUSTOMERS.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 block">{cust.name}</span>
                      <span className="text-[11px] text-slate-500">
                        Prop: {cust.proprietor} • {cust.phone}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{cust.category}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ₹{cust.creditLimit.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ₹{cust.totalPurchases.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">
                      ₹{cust.outstandingBalance.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          cust.outstandingBalance === 0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : cust.isOverdue
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {cust.outstandingBalance === 0
                          ? 'CLEARED'
                          : cust.isOverdue
                          ? `${cust.overdueDays}D OVERDUE`
                          : 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EXPENSES OR SALES FALLBACK */}
      {(activeReportTab === 'sales' || activeReportTab === 'expenses') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            {activeReportTab === 'sales' ? 'Consolidated Sales Register' : 'Operating Expenses Ledger'}
          </h2>
          <p className="text-xs text-slate-500">
            Audit-ready transactions verified with receipts and vouchers.
          </p>
          <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-600">
            All records for October 2024 are synchronized with the cloud ledger and reconciled against day drawer balances.
          </div>
        </div>
      )}
    </div>
  );
};
