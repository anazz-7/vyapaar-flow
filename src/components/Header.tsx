import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { ScreenMode } from '../types';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  screenMode: ScreenMode;
  onScreenChange: (mode: ScreenMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  onScreenChange,
}) => {
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30">
      <div className="h-16 px-4 max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left Slot */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {showBack ? (
            <button
              aria-label="Go back"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-on-surface hover:text-primary transition-colors -ml-2"
              onClick={onBack}
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          {/* Vyapaar Brand Logo */}
          <img
            alt="VyapaarEasy Brand Logo"
            className="h-8 w-auto object-contain flex-shrink-0 cursor-pointer"
            src={ASSETS.vyapaarLogo}
            onClick={() => onScreenChange('dashboard')}
          />

          {/* Title / Store Picker */}
          {title ? (
            <h1 className="font-heading font-semibold text-[16px] text-on-surface truncate ml-1">
              {title}
            </h1>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-1 min-h-[44px] px-1.5 rounded-lg text-left hover:bg-surface-container-low transition-colors"
                type="button"
                onClick={() => setShowShopDropdown(!showShopDropdown)}
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-heading text-[13px] text-primary font-bold leading-none truncate">
                    BM Super Mart
                  </span>
                  <span className="text-[11px] text-on-surface-variant truncate font-normal">
                    {subtitle || 'Dashboard'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant flex-shrink-0">
                  arrow_drop_down
                </span>
              </button>

              {/* Shop Picker Dropdown */}
              {showShopDropdown && (
                <div className="absolute top-12 left-0 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 p-2 z-50">
                  <div className="p-2 border-b border-outline-variant/30">
                    <p className="text-[11px] font-bold text-outline uppercase tracking-wider">Active Business</p>
                    <p className="font-heading font-bold text-[14px] text-primary mt-0.5">BM Super Mart</p>
                    <p className="text-[11px] text-on-surface-variant">Indore Mandi • GSTIN: 23AAGCB1293P1Z5</p>
                  </div>
                  <div className="pt-1.5 flex flex-col gap-0.5">
                    <button
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[12px] font-medium text-on-surface hover:bg-surface-container flex items-center justify-between"
                      onClick={() => {
                        setShowShopDropdown(false);
                        onScreenChange('daybook');
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-primary">account_balance_wallet</span>
                        Cash Day Book (Roker)
                      </span>
                      <span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">Active</span>
                    </button>
                    <button
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[12px] font-medium text-on-surface hover:bg-surface-container flex items-center gap-2"
                      onClick={() => {
                        setShowShopDropdown(false);
                        onScreenChange('khata');
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">menu_book</span>
                      Customer Khata Passbook
                    </button>
                    <button
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[12px] font-medium text-on-surface hover:bg-surface-container flex items-center gap-2"
                      onClick={() => {
                        setShowShopDropdown(false);
                        onScreenChange('dashboard');
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">dashboard</span>
                      Business KPI Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            aria-label="Search records and inventory"
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
            type="button"
            onClick={() => onScreenChange('khata')}
            title="Search Customer or Bill"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <div className="relative">
            <button
              aria-label="Notifications"
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              type="button"
              onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              title="Recent Alerts"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
            </button>

            {showNotificationPopup && (
              <div className="absolute top-12 right-0 w-72 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                  <span className="font-heading font-bold text-[13px]">Business Notifications</span>
                  <span className="text-[10px] bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-bold">1 Overdue</span>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <div
                    className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors"
                    onClick={() => {
                      setShowNotificationPopup(false);
                      onScreenChange('khata');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[12px] text-error">Asra Fruits &amp; Nuts</span>
                      <span className="text-[10px] text-on-surface-variant">4d Overdue</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Net balance ₹14,200 pending recovery</p>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[12px] text-secondary">Cash Drawer Check</span>
                      <span className="text-[10px] text-on-surface-variant">10:00 AM</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Morning cash tally ₹85,400 verified</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Photo */}
          <div className="relative pl-1">
            <button
              className="flex items-center"
              type="button"
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              aria-label="Owner Profile"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary transition-all"
                src={ASSETS.ownerPhoto}
              />
            </button>

            {showProfilePopup && (
              <div className="absolute top-12 right-0 w-60 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 p-3 z-50">
                <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/30">
                  <img
                    alt="Owner"
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-primary/30"
                    src={ASSETS.ownerPhoto}
                  />
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-[13px] text-on-surface truncate">Imran Bhai</p>
                    <p className="text-[11px] text-on-surface-variant truncate">Master Shop Owner</p>
                  </div>
                </div>
                <div className="pt-2 flex flex-col gap-1 text-[12px]">
                  <div className="flex items-center justify-between py-1 text-on-surface-variant">
                    <span>Store ID</span>
                    <span className="font-mono font-bold text-primary">#BM-IND-01</span>
                  </div>
                  <div className="flex items-center justify-between py-1 text-on-surface-variant">
                    <span>Auto Backup</span>
                    <span className="text-secondary font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
