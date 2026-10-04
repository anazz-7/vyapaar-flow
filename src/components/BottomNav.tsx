import React from 'react';
import { ActiveTab } from '../types';

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
    <>
      {/* Floating Quick Sale Action Trigger */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40">
        <button
          onClick={onQuickSale}
          className="flex items-center gap-1.5 h-12 px-4 rounded-full bg-secondary text-on-secondary shadow-[0_8px_20px_rgba(0,108,74,0.32)] hover:bg-secondary/90 active:scale-95 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
          <span className="font-heading font-bold text-[14px] tracking-wide">+ Quick Sale</span>
        </button>
      </div>

      {/* Persistent Bottom Tab Bar */}
      <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-1">
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
              activeTab === 'home'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
            >
              dashboard
            </span>
            <span className="text-[11px] font-medium mt-0.5">Home</span>
          </button>

          <button
            onClick={() => onTabChange('sales')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
              activeTab === 'sales'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeTab === 'sales' ? "'FILL' 1" : "'FILL' 0" }}
            >
              receipt_long
            </span>
            <span className="text-[11px] font-medium mt-0.5">Sales</span>
          </button>

          <button
            onClick={() => onTabChange('party')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
              activeTab === 'party'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeTab === 'party' ? "'FILL' 1" : "'FILL' 0" }}
            >
              group
            </span>
            <span className="text-[11px] font-medium mt-0.5">Party</span>
          </button>

          <button
            onClick={() => onTabChange('items')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
              activeTab === 'items'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeTab === 'items' ? "'FILL' 1" : "'FILL' 0" }}
            >
              inventory_2
            </span>
            <span className="text-[11px] font-medium mt-0.5">Items</span>
          </button>

          <button
            onClick={() => onTabChange('more')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
              activeTab === 'more'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeTab === 'more' ? "'FILL' 1" : "'FILL' 0" }}
            >
              widgets
            </span>
            <span className="text-[11px] font-medium mt-0.5">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
