import React, { useState } from 'react';
import { ScreenMode } from '../types';
import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  Receipt,
  ShoppingCart,
  CreditCard,
  UserPlus,
  PackagePlus,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  screenMode: ScreenMode;
  onScreenChange: (mode: ScreenMode) => void;
  onOpenSearch: () => void;
  onOpenQuickSale: () => void;
  onOpenRecordPayment: () => void;
  onOpenAddExpense: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  screenMode,
  onScreenChange,
  onOpenSearch,
  onOpenQuickSale,
  onOpenRecordPayment,
  onOpenAddExpense,
}) => {
  const { storeData } = useStore();
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);


  const getBreadcrumbTitle = () => {
    if (title) return title;
    switch (screenMode) {
      case 'dashboard':
        return 'Business Overview';
      case 'sales':
        return 'Sales & Invoices (POS)';
      case 'khata':
        return 'Customer Khata (Passbook)';
      case 'daybook':
        return 'Cash Day Book (Roker)';
      case 'products':
        return 'Products & Inventory';
      case 'reports':
        return 'Financial Reports & P&L';
      case 'settings':
        return 'Settings';
      case 'receipt':
        return 'Payment Receipt Slip';
      case 'record-payment':
        return 'Receive Payment';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 w-full bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 sticky top-0 z-40 select-none">
      {/* Left: Mobile Back Button / Title & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="hover:text-slate-800 cursor-pointer" onClick={() => onScreenChange('dashboard')}>
                {storeData.settings.storeName || 'BM Super Mart'}
              </span>
              <span>/</span>
              <span className="font-semibold text-slate-900 truncate">
                {getBreadcrumbTitle()}
              </span>
            </div>
            {subtitle && (
              <span className="text-[11px] text-slate-500 truncate">{subtitle}</span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden sm:flex flex-1 max-w-md mx-2">
        <button
          onClick={onOpenSearch}
          className="w-full h-9 px-3 rounded-lg bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-left text-xs text-slate-400 hover:text-slate-600 flex items-center justify-between transition-all group shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="truncate">Search customers, products, invoices...</span>
          </span>
          <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Global Quick Action "+ Create" Button (Section 9) */}
        <div className="relative">
          <button
            onClick={() => setShowCreateDropdown(!showCreateDropdown)}
            className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {showCreateDropdown && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Actions
              </div>
              <button
                onClick={() => {
                  setShowCreateDropdown(false);
                  onOpenQuickSale();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 group"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">New Sale Bill</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Ctrl+N</span>
              </button>
              <button
                onClick={() => {
                  setShowCreateDropdown(false);
                  onOpenRecordPayment();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 hover:text-slate-900"
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Receive Payment</span>
              </button>
              <button
                onClick={() => {
                  setShowCreateDropdown(false);
                  onOpenAddExpense();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 hover:text-slate-900"
              >
                <Receipt className="w-4 h-4 text-amber-600" />
                <span className="font-medium">New Expense</span>
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => {
                  setShowCreateDropdown(false);
                  onScreenChange('khata');
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 hover:text-slate-900"
              >
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">New Customer</span>
              </button>
              <button
                onClick={() => {
                  setShowCreateDropdown(false);
                  onScreenChange('products');
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 hover:text-slate-900"
              >
                <PackagePlus className="w-4 h-4 text-purple-600" />
                <span className="font-medium">New Product</span>
              </button>
              <button
                onClick={() => {
                  setShowCreateDropdown(false);
                  onScreenChange('daybook');
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 hover:text-slate-900"
              >
                <Truck className="w-4 h-4 text-slate-600" />
                <span className="font-medium">New Supplier Bill</span>
              </button>
            </div>
          )}
        </div>



        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationPopup(!showNotificationPopup)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotificationPopup && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                  2 New
                </span>
              </div>
              <div className="space-y-2 pt-2">
                <div className="p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                  <p className="font-semibold text-rose-900">Overdue Payment Alert</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Asra Fruits &amp; Nuts has ₹14,200 pending for 4 days past credit term.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-100">
                  <p className="font-semibold text-amber-900">Low Stock Notice</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Green Cardamom 8mm is down to 8 kg (minimum threshold: 10 kg).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User / Business Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfilePopup(!showProfilePopup)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              A
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {(storeData.settings.ownerName || storeData.settings.proprietor || 'Anas').split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight">Admin (Owner)</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
          </button>

          {showProfilePopup && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900">{storeData.settings.ownerName || 'Mohammed Anas'}</p>
                <p className="text-[11px] text-slate-500">{storeData.settings.phone || '0786mdanas@gmail.com'}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfilePopup(false);
                  onScreenChange('settings');
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              >
                <span>Store Settings</span>
              </button>
              <button
                onClick={() => {
                  setShowProfilePopup(false);
                  onScreenChange('reports');
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              >
                <span>Financial Reports</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <div className="px-3 py-1.5 text-[11px] text-slate-400">
                Vyapaar Flow v2.4 SaaS
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
