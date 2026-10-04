import React, { useState, useRef } from 'react';
import {
  Building2,
  Receipt,
  Printer,
  Package,
  CreditCard,
  ShieldCheck,
  Cloud,
  Check,
  Save,
  Download,
  Upload,
  AlertTriangle,
  Sparkles,
  Trash2,
  Database,
  HardDrive,
  Clock,
  Info,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SettingsScreen: React.FC = () => {
  const {
    storeData,
    updateSettings,
    exportBackup,
    importBackup,
    loadDemoData,
    clearStoreData,
    backupWarning,
    lastSavedTime,
  } = useStore();

  const [activeCategory, setActiveCategory] = useState<string>('Security');
  const [savedNotice, setSavedNotice] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states from store settings
  const [businessName, setBusinessName] = useState(storeData.settings.storeName || 'BM Super Mart');
  const [ownerName, setOwnerName] = useState(storeData.settings.ownerName || 'Mohammed Anas');
  const [phone, setPhone] = useState(storeData.settings.phone || '+91 98260 12345');
  const [address, setAddress] = useState(
    storeData.settings.address || 'Shop #12, Wholesale Mandi, MG Road, Indore - 452001'
  );
  const [enableThermalPrinter, setEnableThermalPrinter] = useState(
    storeData.settings.thermalPrinter ?? true
  );
  const [autoRoundOff, setAutoRoundOff] = useState(storeData.settings.autoRoundOff ?? true);
  const [allowUdhaar, setAllowUdhaar] = useState(storeData.settings.allowUdhaar ?? true);

  const categories = [
    { id: 'Security', label: 'Storage & Backup', icon: Database },
    { id: 'Business', label: 'Business Profile', icon: Building2 },
    { id: 'Billing', label: 'Billing & POS', icon: Receipt },
    { id: 'Invoice', label: 'Invoice & Receipts', icon: Printer },
  ];

  const handleSaveProfile = () => {
    updateSettings({
      storeName: businessName,
      ownerName: ownerName,
      phone: phone,
      address: address,
      thermalPrinter: enableThermalPrinter,
      autoRoundOff: autoRoundOff,
      allowUdhaar: allowUdhaar,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          importBackup(content);
          setStatusMsg('Backup imported successfully! All records have been restored.');
          setTimeout(() => setStatusMsg(null), 4000);
        } catch (err: any) {
          alert('Failed to parse backup file: ' + err.message);
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const lastBackupStr = storeData.lastBackupDate
    ? new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(storeData.lastBackupDate))
    : 'Never';

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
            Settings &amp; Data Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage IndexedDB storage, backups, store details, and billing rules.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved to IndexedDB successfully.</span>
        </div>
      )}

      {statusMsg && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-blue-600" />
          <span>{statusMsg}</span>
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

        {/* Right Settings Cards */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6 text-xs">
          {/* CATEGORY: STORAGE & BACKUP */}
          {activeCategory === 'Security' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading font-bold text-base text-slate-900">
                  IndexedDB Storage &amp; Offline Backups
                </h2>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  High-capacity persistent storage on this device with one-click JSON backup and restore.
                </p>
              </div>

              {/* 7-Day Backup Reminder Banner */}
              {backupWarning && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-xs">Backup Reminder: Over 7 Days Since Last Export</p>
                    <p className="text-[11px] text-amber-800">
                      Your business data is saved locally on this browser. To protect against device loss or browser cache clearing, export a backup copy now.
                    </p>
                  </div>
                </div>
              )}

              {/* Status Overview Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <HardDrive className="w-4 h-4 text-blue-600" />
                    <span className="font-bold uppercase tracking-wider text-[10px]">Storage Engine</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">IndexedDB (Active)</p>
                  <p className="text-[11px] text-slate-500">
                    Auto-saves after every transaction. Unlimited MSME quota.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold uppercase tracking-wider text-[10px]">Sync Status</span>
                  </div>
                  <p className="font-semibold text-emerald-700 text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Saved on this device
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Last backup: <span className="font-medium text-slate-800">{lastBackupStr}</span>
                  </p>
                </div>
              </div>

              {/* Backup & Restore Actions */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900">Backup &amp; Restore Your Books</h3>
                <p className="text-slate-500 text-[11px]">
                  Export a timestamped JSON file containing all your customers, products, sales bills, ledger passbooks, and day book entries.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={exportBackup}
                    className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Backup (JSON)</span>
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 px-4 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold flex items-center gap-2 shadow-2xs transition-colors"
                  >
                    <Upload className="w-4 h-4 text-slate-600" />
                    <span>Import Backup</span>
                  </button>
                </div>
              </div>

              {/* Demo Data & Reset Actions */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900">Demo Data &amp; Reset</h3>
                <p className="text-slate-500 text-[11px]">
                  Load rich sample data to test workflows, or clear everything to start with clean empty business books.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      loadDemoData();
                      setStatusMsg('Demo business data loaded successfully!');
                      setTimeout(() => setStatusMsg(null), 3000);
                    }}
                    className="h-9 px-3.5 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Load Demo Data</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all data? This will reset all records to zero.')) {
                        clearStoreData();
                        setStatusMsg('Store cleared! Ready for fresh entries.');
                        setTimeout(() => setStatusMsg(null), 3000);
                      }
                    }}
                    className="h-9 px-3.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Reset Store to Empty</span>
                  </button>
                </div>
              </div>

              {/* Online Cloud Sync Note */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Looking for Multi-Device Online Sync?</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Vyapaar Flow is designed offline-first so you can run your shop fast without internet. Online synchronization via Supabase (PostgreSQL) or Firebase (Firestore) can be connected later. Your existing IndexedDB data structure is already formatted for seamless cloud synchronization whenever you choose to activate it.
                </p>
              </div>
            </div>
          )}

          {/* CATEGORY: BUSINESS PROFILE */}
          {activeCategory === 'Business' && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                Business Information
              </h2>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-800 block">Store / Business Name</span>
                    <span className="text-slate-500 text-[11px]">Displayed on all receipts and WhatsApp messages</span>
                  </div>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full sm:w-64 h-8 px-2.5 bg-white border border-slate-200 rounded font-semibold text-slate-900"
                  />
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-800 block">Proprietor Name</span>
                    <span className="text-slate-500 text-[11px]">Primary contact for vouchers</span>
                  </div>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full sm:w-64 h-8 px-2.5 bg-white border border-slate-200 rounded font-semibold text-slate-900"
                  />
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-800 block">Official Business Phone</span>
                    <span className="text-slate-500 text-[11px]">Used for WhatsApp reminder messages</span>
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full sm:w-64 h-8 px-2.5 bg-white border border-slate-200 rounded font-semibold text-slate-900"
                  />
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-800 block">Address &amp; Location</span>
                    <span className="text-slate-500 text-[11px]">Shop address printed on bills</span>
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full sm:w-64 h-8 px-2.5 bg-white border border-slate-200 rounded font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY: BILLING RULES */}
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

          {/* CATEGORY: INVOICE & PRINTER */}
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
                  defaultValue={`Thank you for shopping at ${storeData.settings.storeName || 'BM Super Mart'}! Goods once sold can be exchanged within 48 hours.`}
                  className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded font-medium text-slate-900"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
