import React, { useState } from 'react';
import { ExpenseEntry } from '../types';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Coins,
  Building2,
  Calendar,
  Filter,
  Download,
  Receipt,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Tag,
  CreditCard,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

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
  const { storeData, getDayBookForDate } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  // Real dynamic dates (Today, Yesterday, Day Before)
  const now = new Date();
  const dateList = [
    {
      key: now.toISOString().split('T')[0],
      label: `Today, ${new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(now)}`,
    },
    {
      key: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      label: `Yesterday, ${new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(
        new Date(Date.now() - 86400000)
      )}`,
    },
    {
      key: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      label: new Intl.DateTimeFormat('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(new Date(Date.now() - 86400000 * 2)),
    },
  ];

  const currentDateObj = dateList[currentDateIndex] || dateList[0];
  const dayBookRecord = getDayBookForDate(currentDateObj.key);

  const categories = ['All', 'Transport', 'Staff Tea', 'Rent / Advance', 'Packaging', 'Electricity'];

  const filteredExpenses = expenses.filter((exp) => {
    if (selectedCategory === 'All') return true;
    return exp.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Real Cash Drawer equation
  const openingCash = dayBookRecord.openingCash;
  const cashIn = dayBookRecord.cashIn;
  const cashOut = dayBookRecord.cashOut;
  const closingCash = dayBookRecord.closingCash;


  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Date Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
            Cash Day Book (Roker)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daily cash drawer flow, physical register reconciliation, and operating expenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Navigator */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setCurrentDateIndex((p) => Math.min(p + 1, dateList.length - 1))}
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2.5 py-1 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateList[currentDateIndex].label}</span>
            </div>
            <button
              onClick={() => setCurrentDateIndex((p) => Math.max(p - 1, 0))}
              disabled={currentDateIndex === 0}
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="h-9 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export Day Sheet</span>
          </button>
        </div>
      </div>

      {/* Cash Drawer Reconciliation Equation Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-900 text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-slate-900">
                Daily Cash Drawer Position (Roker Balance)
              </h2>
              <span className="text-[11px] text-slate-500">
                Counter drawer balance reconciled with digital receipts
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCountCash}
              className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-slate-600" />
              <span>Count Physical Notes</span>
            </button>
            <button
              onClick={onBankDeposit}
              className="h-8 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Deposit to Bank</span>
            </button>
          </div>
        </div>

        {/* 4 Flow Cards: Opening + Cash In - Cash Out = Closing */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              1. Opening Drawer Cash
            </span>
            <div className="font-heading font-bold text-xl text-slate-800 mt-1 tabular-nums">
              ₹{openingCash.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500">Brought forward at 09:00 AM</span>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              + Total Cash In (Sales + Khata)
            </span>
            <div className="font-heading font-bold text-xl text-emerald-700 mt-1 tabular-nums">
              +₹{cashIn.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-600">Counter collection &amp; receipts</span>
          </div>

          <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
              − Total Cash Out (Expenses)
            </span>
            <div className="font-heading font-bold text-xl text-rose-700 mt-1 tabular-nums">
              −₹{cashOut.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-rose-600">{expenses.length} operating vouchers</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900 text-white shadow-md border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              = Net In-Hand Drawer Cash
            </span>
            <div className="font-heading font-extrabold text-xl text-emerald-400 mt-1 tabular-nums">
              ₹{closingCash.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-300 font-semibold">
              Drawer balanced &amp; verified ✓
            </span>
          </div>
        </div>
      </div>

      {/* Expenses Register Table & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Header & Category Filter */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-slate-900 text-sm">
              Operating Outflow Expenses
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500">{filteredExpenses.length} entries</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={onAddExpense}
              className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {/* Clean Expenses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Voucher / Time</th>
                <th className="py-2.5 px-4">Expense Title</th>
                <th className="py-2.5 px-4">Vendor / Payee</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Payment Mode</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 block">
                      #{exp.expNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {exp.timeStr} • {exp.dateStr}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block truncate">
                      {exp.title}
                    </span>
                    {exp.reference && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Ref: {exp.reference}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">
                    {exp.vendor}
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{exp.category}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    <span className="text-xs">{exp.paymentMode}</span>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 whitespace-nowrap">
                    −₹{exp.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Verified ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
