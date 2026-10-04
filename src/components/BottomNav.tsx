import React from 'react';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Plus,
  MoreHorizontal,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onQuickSale: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onQuickSale,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 select-none shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'home'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Sales */}
        <button
          onClick={() => onTabChange('sales')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'sales'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Sales</span>
        </button>

        {/* Central Floating POS Quick Sale Button */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            onClick={onQuickSale}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-95 transition-all ring-4 ring-white"
            title="Speed Sale Bill"
          >
            <Plus className="w-6 h-6" />
          </button>
          <span className="text-[10px] font-bold text-slate-700 mt-0.5">Billing</span>
        </div>

        {/* Products */}
        <button
          onClick={() => onTabChange('items')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'items'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Stock</span>
        </button>

        {/* Reports / More */}
        <button
          onClick={() => onTabChange('more')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'more'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Reports</span>
        </button>
      </div>
    </nav>
  );
};
