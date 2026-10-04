import React, { useState } from 'react';
import {
  Building2,
  Receipt,
  Printer,
  Package,
  CreditCard,
  Users,
  ShieldCheck,
  Cloud,
  Palette,
  Check,
  Edit2,
  Save,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Business');
  const [savedNotice, setSavedNotice] = useState(false);

  // Sample form states
  const [businessName, setBusinessName] = useState('BM Super Mart');
  const [ownerName, setOwnerName] = useState('Mohammed Anas');
  const [phone, setPhone] = useState('+91 98260 12345');
  const [address, setAddress] = useState('Shop #12, Wholesale Mandi, MG Road, Indore - 452001');
  const [enableThermalPrinter, setEnableThermalPrinter] = useState(true);
  const [autoRoundOff, setAutoRoundOff] = useState(true);
  const [allowUdhaar, setAllowUdhaar] = useState(true);

  const categories = [
    { id: 'Business', label: 'Business Profile', icon: Building2 },
    { id: 'Billing', label: 'Billing & POS', icon: Receipt },
    { id: 'Invoice', label: 'Invoice & Receipts', icon: Printer },
    { id: 'Products', label: 'Products & Inventory', icon: Package },
    { id: 'Payments', label: 'Payment Modes', icon: CreditCard },
    { id: 'Security', label: 'Security & Backup', icon: Cloud },
  ];

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
            Settings &amp; Configuration
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your store details, billing rules, invoice headers, and cloud sync.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully. All changes are live!</span>
        </div>
      )}

      {/* 2-Column Layout: Categories list (Left) + Detail Form Settings (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Categories List */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Cards (Section 29) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6 text-xs">
          {activeCategory === 'Business' && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                Business Information
              </h2>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Store / Business Name</span>
                    <span className="text-slate-500 text-[11px]">Displayed on all receipts and WhatsApp messages</span>
                  </div>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-52 h-8 px-2.5 bg-white border border-slate-200 rounded font-semibold text-slate-900"
                  />
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Proprietor Name</span>
                    <span className="text-slate-500 text-[11px]">Primary contact for vouchers</span>
                  </div>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-52 h-8 px-2.5 bg-white border border-slate-200 rounded font-semibold text-slate-900"
                  />
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Official Business Phone</span>
                    <span className="text-slate-500 text-[11px]">Used for WhatsApp reminder messages</span>
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-52 h-8 px-2.5 bg-white border border-slate-200 rounded font-semibold text-slate-900"
                  />
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Address &amp; Location</span>
                    <span className="text-slate-500 text-[11px]">Shop address printed on bills</span>
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-64 h-8 px-2.5 bg-white border border-slate-200 rounded font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'Billing' && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                Billing &amp; Point of Sale Rules
              </h2>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Automatic Round-Off</span>
                    <span className="text-slate-500 text-[11px]">Round fractional paise to nearest rupee on bills</span>
                  </div>
                  <button
                    onClick={() => setAutoRoundOff(!autoRoundOff)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      autoRoundOff ? 'bg-slate-900' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        autoRoundOff ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Allow Credit (Udhaar) Sales</span>
                    <span className="text-slate-500 text-[11px]">Permit customer ledger passbook entry without instant payment</span>
                  </div>
                  <button
                    onClick={() => setAllowUdhaar(!allowUdhaar)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      allowUdhaar ? 'bg-slate-900' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        allowUdhaar ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'Invoice' && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                Invoice &amp; Receipt Formats
              </h2>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">3" (80mm) Thermal Bluetooth Printer</span>
                  <span className="text-slate-500 text-[11px]">Format slips for standard retail counter printers</span>
                </div>
                <button
                  onClick={() => setEnableThermalPrinter(!enableThermalPrinter)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    enableThermalPrinter ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      enableThermalPrinter ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-800 block">Invoice Disclaimer / Notes</span>
                <span className="text-slate-500 text-[11px] block mb-2">Printed at bottom of bill</span>
                <input
                  type="text"
                  defaultValue="Thank you for shopping at BM Super Mart! Goods once sold can be exchanged within 48 hours."
                  className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded font-medium text-slate-900"
                />
              </div>
            </div>
          )}

          {activeCategory !== 'Business' && activeCategory !== 'Billing' && activeCategory !== 'Invoice' && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                {activeCategory} Settings
              </h2>
              <div className="p-4 bg-slate-50 rounded-lg text-slate-600">
                All parameters for {activeCategory} are synchronized and operating with verified defaults.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
