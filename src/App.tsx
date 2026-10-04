/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ScreenMode,
  ActiveTab,
  LedgerEntry,
  ExpenseEntry,
  PaymentSubmission,
  ToastNotification,
} from './types';
import {
  INITIAL_PARTY,
  DEFAULT_PAYMENT_SUBMISSION,
} from './data/mockData';
import { useStore } from './context/StoreContext';

// Core Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { InvoiceDrawer } from './components/InvoiceDrawer';

// Screens
import { DashboardScreen } from './components/DashboardScreen';
import { BillingPOSScreen } from './components/BillingPOSScreen';
import { CustomerKhataScreen } from './components/CustomerKhataScreen';
import { DayBookScreen } from './components/DayBookScreen';
import { ProductsScreen } from './components/ProductsScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PaymentRecordedScreen } from './components/PaymentRecordedScreen';

// Modals
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { ThermalPrintModal } from './components/ThermalPrintModal';
import { CountCashModal } from './components/CountCashModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { NewBillModal } from './components/NewBillModal';
import { BillDetailModal } from './components/BillDetailModal';

export default function App() {
  const {
    storeData,
    activeCustomer,
    cashInHand,
    addSaleBill,
    recordPayment,
    addExpense,
  } = useStore();

  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('dashboard');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [latestSubmission, setLatestSubmission] = useState<PaymentSubmission>(DEFAULT_PAYMENT_SUBMISSION);

  // Modals & Drawers state
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isCountCashOpen, setIsCountCashOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isNewBillOpen, setIsNewBillOpen] = useState(false);
  const [isThermalOpen, setIsThermalOpen] = useState(false);
  const [thermalData, setThermalData] = useState<any>(DEFAULT_PAYMENT_SUBMISSION);
  const [viewingBillNo, setViewingBillNo] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Current active customer fallback
  const party = activeCustomer || storeData.customers[0] || INITIAL_PARTY;
  const ledgerEntries = storeData.ledgerEntries;
  const expenses = storeData.expenses;
  const netCash = cashInHand;

  // Toast Helper
  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastNotification = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut for Global Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Screen selection handler
  const handleSelectScreen = (screen: ScreenMode) => {
    if (screen === 'record-payment') {
      setCurrentScreen('khata');
      setIsRecordPaymentOpen(true);
      return;
    }
    setCurrentScreen(screen);
    if (screen === 'dashboard') setActiveTab('home');
    else if (screen === 'sales') setActiveTab('sales');
    else if (screen === 'khata') setActiveTab('party');
    else if (screen === 'products') setActiveTab('items');
    else if (screen === 'reports') setActiveTab('more');
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentScreen('dashboard');
    else if (tab === 'sales') setCurrentScreen('sales');
    else if (tab === 'party') setCurrentScreen('khata');
    else if (tab === 'items') setCurrentScreen('products');
    else if (tab === 'more') setCurrentScreen('reports');
  };

  // Payment Recording
  const handleSavePayment = (submission: PaymentSubmission) => {
    setLatestSubmission(submission);
    setIsRecordPaymentOpen(false);

    recordPayment(submission);

    addToast({
      title: `Payment ₹${submission.amount.toLocaleString('en-IN')} Received`,
      message: `Voucher ${submission.receiptId} added to passbook and Day Book cash.`,
      type: 'success',
    });

    // Navigate to Screen 3 (Payment Recorded / Voucher)
    setCurrentScreen('receipt');
  };

  // New Sale Bill
  const handleSaveBill = (entry: LedgerEntry) => {
    addSaleBill(entry, party?.id);

    addToast({
      title: `Sale Bill #${entry.billNumber} Saved`,
      message: `Amount ₹${entry.amount.toLocaleString('en-IN')} (${entry.tag || 'CASH'})`,
      type: 'success',
    });
  };

  // Add Expense
  const handleSaveExpense = (newExp: ExpenseEntry) => {
    addExpense(newExp);

    addToast({
      title: `Expense ${newExp.expNumber} Logged`,
      message: `−₹${newExp.amount.toLocaleString('en-IN')} (${newExp.title})`,
      type: 'success',
    });
  };

  // WhatsApp reminder
  const handleSendWhatsAppReminder = () => {
    const text = `Dear ${party.proprietor} (${party.name}), this is a gentle payment reminder from ${
      storeData.settings.storeName || 'BM Super Mart'
    }. Your outstanding khata balance of ₹${party.outstandingBalance.toLocaleString(
      'en-IN'
    )} is due. Kindly clear the bill at your earliest convenience. Thank you!`;
    const phoneClean = party.phone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Header configuration per screen
  const getHeaderProps = () => {
    if (currentScreen === 'receipt') {
      return {
        title: 'Payment Receipt Slip',
        showBack: true,
        onBack: () => setCurrentScreen('khata'),
      };
    }
    if (currentScreen === 'sales') {
      return {
        title: 'Point of Sale (POS)',
        showBack: true,
        onBack: () => setCurrentScreen('dashboard'),
      };
    }
    if (currentScreen === 'khata') {
      return {
        title: `${party.name} - Ledger Passbook`,
        subtitle: `Prop: ${party.proprietor} • ${party.phone}`,
        showBack: true,
        onBack: () => setCurrentScreen('dashboard'),
      };
    }
    if (currentScreen === 'daybook') {
      return {
        title: 'Cash Day Book (Roker)',
        subtitle: `Drawer Cash: ₹${netCash.toLocaleString('en-IN')}`,
        showBack: true,
        onBack: () => setCurrentScreen('dashboard'),
      };
    }
    if (currentScreen === 'products') {
      return {
        title: 'Products & Inventory',
        showBack: true,
        onBack: () => setCurrentScreen('dashboard'),
      };
    }
    if (currentScreen === 'reports') {
      return {
        title: 'Financial Reports & P&L',
        showBack: true,
        onBack: () => setCurrentScreen('dashboard'),
      };
    }
    if (currentScreen === 'settings') {
      return {
        title: 'Settings & Data Management',
        showBack: true,
        onBack: () => setCurrentScreen('dashboard'),
      };
    }
    return {
      title: 'Business Overview',
      showBack: false,
    };
  };

  const headerProps = getHeaderProps();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Global Command Palette / Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCustomer={() => setCurrentScreen('khata')}
        onSelectProduct={() => setCurrentScreen('products')}
        onSelectInvoice={(invNo) => setViewingBillNo(invNo)}
        onNavigate={handleSelectScreen}
      />

      {/* Main Container - Full-width Desktop Workspace or Mobile */}
      <div className="flex-1 flex flex-row w-full min-h-screen">
        {/* Modern Sidebar (Desktop Workspace View) */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={handleSelectScreen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenQuickBilling={() => setCurrentScreen('sales')}
        />

        {/* Workspace Shell */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
          {/* Top Bar Header */}
          <Header
            title={headerProps.title}
            subtitle={headerProps.subtitle}
            showBack={headerProps.showBack}
            onBack={headerProps.onBack}
            screenMode={currentScreen}
            onScreenChange={handleSelectScreen}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenQuickSale={() => setCurrentScreen('sales')}
            onOpenRecordPayment={() => setIsRecordPaymentOpen(true)}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
          />

          {/* Screen Content Body */}
          <main className="flex-1 flex flex-col w-full pb-16 md:pb-8 overflow-x-hidden">
            {currentScreen === 'dashboard' && (
              <DashboardScreen
                onNavigate={handleSelectScreen}
                onQuickSale={() => setCurrentScreen('sales')}
                onAddExpense={() => setIsAddExpenseOpen(true)}
                onRecordPayment={() => setIsRecordPaymentOpen(true)}
              />
            )}

            {currentScreen === 'sales' && (
              <BillingPOSScreen
                onSaveBill={handleSaveBill}
                onOpenThermal={(bill) => {
                  setThermalData(bill);
                  setIsThermalOpen(true);
                }}
                onClose={() => setCurrentScreen('dashboard')}
              />
            )}

            {currentScreen === 'khata' && (
              <CustomerKhataScreen
                party={party}
                entries={ledgerEntries}
                onRecordPayment={() => setIsRecordPaymentOpen(true)}
                onGiveCredit={() => setIsNewBillOpen(true)}
                onViewBill={(billNo) => setViewingBillNo(billNo)}
                onSendWhatsAppReminder={handleSendWhatsAppReminder}
                onViewStatementPdf={() =>
                  addToast({
                    title: `Generating statement for ${party.name}`,
                    message: 'Official passbook ledger statement downloaded.',
                    type: 'success',
                  })
                }
                onShareReceipt={(entry) => {
                  setLatestSubmission({
                    ...DEFAULT_PAYMENT_SUBMISSION,
                    amount: Math.abs(entry.amount),
                    dateStr: entry.dateStr,
                    timeStr: entry.timeStr,
                    receiptId: entry.receiptNumber ? `#REC-${entry.receiptNumber}` : '#REC-304',
                  });
                  setCurrentScreen('receipt');
                }}
              />
            )}

            {currentScreen === 'receipt' && (
              <PaymentRecordedScreen
                submission={latestSubmission}
                onBackToKhata={() => setCurrentScreen('khata')}
                onOpenThermal={() => {
                  setThermalData(latestSubmission);
                  setIsThermalOpen(true);
                }}
              />
            )}

            {currentScreen === 'daybook' && (
              <DayBookScreen
                expenses={expenses}
                netCash={netCash}
                onAddExpense={() => setIsAddExpenseOpen(true)}
                onCountCash={() => setIsCountCashOpen(true)}
                onBankDeposit={() => {
                  addToast({
                    title: 'Bank Deposit Voucher Generated',
                    message: '₹50,000 deposited to HDFC Bank A/c ...3821',
                    type: 'success',
                  });
                }}
              />
            )}

            {currentScreen === 'products' && <ProductsScreen />}

            {currentScreen === 'reports' && <ReportsScreen />}

            {currentScreen === 'settings' && <SettingsScreen />}
          </main>

          {/* Persistent Mobile Bottom Navigation */}
          {currentScreen !== 'receipt' && currentScreen !== 'sales' && (
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onQuickSale={() => setCurrentScreen('sales')}
            />
          )}
        </div>
      </div>

      {/* Invoice Detail Side Drawer */}
      <InvoiceDrawer
        billNo={viewingBillNo}
        onClose={() => setViewingBillNo(null)}
        onOpenThermal={(bill) => {
          setThermalData(bill);
          setIsThermalOpen(true);
        }}
      />

      {/* Record Payment Dialog */}
      <RecordPaymentModal
        party={party}
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onSavePayment={handleSavePayment}
        onOpenSlipPreview={(amount, mode) => {
          setThermalData({
            ...DEFAULT_PAYMENT_SUBMISSION,
            amount,
            paymentMode: mode as PaymentSubmission['paymentMode'],
          });
          setIsThermalOpen(true);
        }}
      />

      {/* 3" Thermal Receipt Modal */}
      <ThermalPrintModal
        isOpen={isThermalOpen}
        onClose={() => setIsThermalOpen(false)}
        submission={thermalData}
      />

      {/* Count Cash Note Reconciliation Modal */}
      <CountCashModal
        isOpen={isCountCashOpen}
        onClose={() => setIsCountCashOpen(false)}
        expectedAmount={netCash}
      />

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSave={handleSaveExpense}
      />

      {/* Quick Sale Bill Modal */}
      <NewBillModal
        isOpen={isNewBillOpen}
        onClose={() => setIsNewBillOpen(false)}
        partyName={party.name}
        onSaveBill={handleSaveBill}
        currentBalance={party.outstandingBalance}
      />

      {/* Bill Detail Modal Fallback */}
      <BillDetailModal
        billNo={viewingBillNo}
        onClose={() => setViewingBillNo(null)}
        partyName={party.name}
      />
    </div>
  );
}
