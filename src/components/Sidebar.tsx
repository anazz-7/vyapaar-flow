import React from 'react';
import { ScreenMode } from '../types';
import {
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  Wallet,
  CreditCard,
  Package,
  Users,
  Truck,
  UserCheck,
  Building2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Database,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavItem {
  id: ScreenMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeAlert?: string;
  disabledNotice?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  currentScreen: ScreenMode;
  onNavigate: (mode: ScreenMode) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenQuickBilling: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onOpenQuickBilling,
}) => {
  const { storeData, toCollect, lowStockCount, backupWarning, lastSavedTime } = useStore();

  const khataAlert =
    toCollect > 0
      ? `₹${
          toCollect >= 100000
            ? (toCollect / 100000).toFixed(1) + 'L'
            : toCollect >= 1000
            ? (toCollect / 1000).toFixed(1) + 'k'
            : Math.round(toCollect).toLocaleString('en-IN')
        } Due`
      : undefined;

  const stockAlert = lowStockCount > 0 ? `${lowStockCount} Low` : undefined;

  const navSections: NavSection[] = [
    {
      label: 'BUSINESS',
      items: [
        { id: 'dashboard' as ScreenMode, label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'TRANSACTIONS',
      items: [
        { id: 'sales' as ScreenMode, label: 'Sales & Billing', icon: ShoppingCart, badge: 'POS' },
        { id: 'daybook' as ScreenMode, label: 'Purchases', icon: Truck, disabledNotice: 'Viewing in Day Book' },
        { id: 'daybook' as ScreenMode, label: 'Expenses', icon: Receipt },
        { id: 'record-payment' as ScreenMode, label: 'Payments', icon: CreditCard },
      ],
    },
    {
      label: 'MANAGEMENT',
      items: [
        { id: 'products' as ScreenMode, label: 'Products & Stock', icon: Package, badgeAlert: stockAlert },
        { id: 'khata' as ScreenMode, label: 'Customers (Khata)', icon: Users, badgeAlert: khataAlert },
        { id: 'khata' as ScreenMode, label: 'Suppliers', icon: Building2 },
        { id: 'dashboard' as ScreenMode, label: 'Employees', icon: UserCheck },
      ],
    },
    {
      label: 'FINANCE',
      items: [
        { id: 'daybook' as ScreenMode, label: 'Cash & Bank (Roker)', icon: Wallet },
        { id: 'reports' as ScreenMode, label: 'Reports & P&L', icon: BarChart3 },
      ],
    },
    {
      label: 'SYSTEM',
      items: [
        { id: 'settings' as ScreenMode, label: 'Settings', icon: Settings },
      ],
    },
  ];

  const backupSubtitle = storeData.lastBackupDate
    ? `Backup: ${new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(
        new Date(storeData.lastBackupDate)
      )}`
    : 'No backup yet';

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 select-none z-30 flex-shrink-0 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand & Store Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0">
              VF
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-bold text-slate-900 text-sm tracking-tight truncate leading-tight">
                Vyapaar Flow
              </span>
              <span className="text-[11px] text-slate-500 font-medium truncate">
                {storeData.settings.storeName || 'BM Super Mart'}
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div
            className="w-9 h-9 mx-auto rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xs cursor-pointer"
            onClick={() => onNavigate('dashboard')}
            title="Vyapaar Flow"
          >
            VF
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ${
            isCollapsed ? 'hidden' : 'flex'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        {isCollapsed ? (
          <button
            onClick={onOpenQuickBilling}
            className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-xs"
            title="New Sale (Ctrl+N)"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onOpenQuickBilling}
            className="w-full h-10 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-between text-xs font-semibold transition-all shadow-xs group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>New Sale Bill</span>
            </span>
            <span className="text-[10px] bg-blue-500/50 text-white font-mono px-1.5 py-0.5 rounded group-hover:bg-blue-500 transition-colors">
              Ctrl+N
            </span>
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 py-1">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-0.5">
            {!isCollapsed && (
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.label}
              </div>
            )}
            {section.items.map((item, itemIdx) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={itemIdx}
                  onClick={() => onNavigate(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                        isActive
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {!isCollapsed && item.badgeAlert && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {item.badgeAlert}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle for Collapsed View */}
      {isCollapsed && (
        <div className="p-2 border-t border-slate-100 flex justify-center">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Honest Local Sync Status Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => onNavigate('settings')}
            className="w-full text-left flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 flex-shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                Saved on this device
              </span>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                <span>{backupSubtitle}</span>
                {backupWarning && (
                  <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                    • Backup due
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>
      )}
    </aside>
  );
};

