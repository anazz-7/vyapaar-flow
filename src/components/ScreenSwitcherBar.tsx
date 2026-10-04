import React from 'react';
import { ScreenMode } from '../types';

interface ScreenSwitcherBarProps {
  currentScreen: ScreenMode;
  onSelectScreen: (screen: ScreenMode) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: (val: boolean) => void;
}

export const ScreenSwitcherBar: React.FC<ScreenSwitcherBarProps> = ({
  currentScreen,
  onSelectScreen,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  return (
    <div className="w-full bg-primary text-on-primary py-2 px-3 shadow-md border-b border-primary-container z-50 text-[12px]">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Screen Jump Links */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-surface-container-highest/80 mr-1 hidden sm:inline">
            Screens:
          </span>

          <button
            onClick={() => onSelectScreen('khata')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'khata'
                ? 'bg-secondary text-on-secondary shadow-xs'
                : 'bg-primary-container text-surface-container-highest hover:bg-primary-container/80'
            }`}
          >
            <span>📖</span>
            <span>Khata Ledger</span>
          </button>

          <button
            onClick={() => onSelectScreen('record-payment')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'record-payment'
                ? 'bg-secondary text-on-secondary shadow-xs'
                : 'bg-primary-container text-surface-container-highest hover:bg-primary-container/80'
            }`}
          >
            <span>💳</span>
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => onSelectScreen('receipt')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'receipt'
                ? 'bg-secondary text-on-secondary shadow-xs'
                : 'bg-primary-container text-surface-container-highest hover:bg-primary-container/80'
            }`}
          >
            <span>🧾</span>
            <span>Payment Recorded</span>
          </button>

          <button
            onClick={() => onSelectScreen('daybook')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'daybook'
                ? 'bg-secondary text-on-secondary shadow-xs'
                : 'bg-primary-container text-surface-container-highest hover:bg-primary-container/80'
            }`}
          >
            <span>📒</span>
            <span>Day Book</span>
          </button>

          <button
            onClick={() => onSelectScreen('dashboard')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'dashboard'
                ? 'bg-secondary text-on-secondary shadow-xs'
                : 'bg-primary-container text-surface-container-highest hover:bg-primary-container/80'
            }`}
          >
            <span>📊</span>
            <span>Overview</span>
          </button>
        </div>

        {/* Viewport Frame Toggle */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onToggleMobileFrame(!isMobileFrame)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 border ${
              isMobileFrame
                ? 'bg-on-primary text-primary border-on-primary font-bold'
                : 'bg-primary-container text-surface-container-highest border-primary-container hover:bg-primary-container/80'
            }`}
            title="Toggle between Mobile App View and Desktop View"
          >
            <span className="material-symbols-outlined text-[15px]">
              {isMobileFrame ? 'smartphone' : 'devices'}
            </span>
            <span>{isMobileFrame ? 'Phone View' : 'Responsive View'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
