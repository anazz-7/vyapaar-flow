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
  INITIAL_LEDGER_ENTRIES,
  INITIAL_EXPENSES,
  DEFAULT_PAYMENT_SUBMISSION,
} from './data/mockData';

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
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('dashboard');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [party, setParty] = useState(INITIAL_PARTY);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(INITIAL_LEDGER_ENTRIES);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(INITIAL_EXPENSES);
  const [netCash, setNetCash] = useState(85400);
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
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

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

    // Snapshot for Undo
    const previousParty = { ...party };
    const previousEntries = [...ledgerEntries];
    const previousNetCash = netCash;

    // Update Party state
    setParty((prev) => ({
      ...prev,
      outstandingBalance: submission.remainingBalance,
      isOverdue: submission.remainingBalance > 0,
      totalPaid: prev.totalPaid + submission.amount,
    }));

    // Add entry to Ledger
    const newLedgerEntry: LedgerEntry = {
      id: `entry-${Date.now()}`,
      type: 'payment',
      tag:
        submission.paymentMode === 'Cash'
          ? 'CASH'
          : submission.paymentMode === 'UPI / QR'
          ? 'ONLINE UPI'
          : 'BANK',
      amount: -submission.amount,
      dateStr: submission.dateStr,
      timeStr: submission.timeStr,
      description: 'Payment Received',
      note: submission.note,
      receiptNumber: submission.receiptId.replace('#REC-', ''),
      balance: submission.remainingBalance,
      status: 'PAID',
    };

    setLedgerEntries((prev) => [newLedgerEntry, ...prev]);

    // If paid by cash, update drawer cash
    if (submission.paymentMode === 'Cash') {
      setNetCash((prev) => prev + submission.amount);
    }

    addToast({
      title: `Payment ₹${submission.amount.toLocaleString('en-IN')} Received`,
      message: `Voucher ${submission.receiptId} added to passbook.`,
      type: 'success',
      undoLabel: 'Undo',
      undoAction: () => {
        setParty(previousParty);
        setLedgerEntries(previousEntries);
        setNetCash(previousNetCash);
        addToast({
          title: 'Payment entry undone',
          type: 'info',
        });
      },
    });

    // Navigate to Screen 3 (Payment Recorded / Voucher)
    setCurrentScreen('receipt');
  };

  // New Sale Bill
  const handleSaveBill = (entry: LedgerEntry) => {
    const previousParty = { ...party };
    const previousEntries = [...ledgerEntries];

    setLedgerEntries((prev) => [entry, ...prev]);

    if (entry.tag === 'UDHAAR') {
      setParty((prev) => ({
        ...prev,
        outstandingBalance: prev.outstandingBalance + entry.amount,
        totalPurchases: prev.totalPurchases + entry.amount,
      }));
    }

    addToast({
      title: `Sale Bill #${entry.billNumber} Saved`,
      message: `Amount ₹${entry.amount.toLocaleString('en-IN')} (${entry.tag || 'CASH'})`,
      type: 'success',
      undoLabel: 'Undo',
      undoAction: () => {
        setParty(previousParty);
        setLedgerEntries(previousEntries);
        addToast({
          title: 'Sale bill cancelled',
          type: 'info',
        });
      },
    });
  };

  // Add Expense
  const handleSaveExpense = (newExp: ExpenseEntry) => {
    const previousExpenses = [...expenses];
    const previousCash = netCash;

    setExpenses((prev) => [newExp, ...prev]);

    if (newExp.paymentMode === 'Cash Counter') {
      setNetCash((prev) => Math.max(0, prev - newExp.amount));
    }

    addToast({
      title: `Expense ${newExp.expNumber} Logged`,
      message: `−₹${newExp.amount.toLocaleString('en-IN')} (${newExp.title})`,
      type: 'success',
      undoLabel: 'Undo',
      undoAction: () => {
        setExpenses(previousExpenses);
        setNetCash(previousCash);
        addToast({
          title: 'Expense voucher undone',
          type: 'info',
        });
      },
    });
  };

  // WhatsApp reminder
  const handleSendWhatsAppReminder = () => {
    const text = `Dear ${party.proprietor} (${party.name}), this is a gentle payment reminder from BM Super Mart. Your outstanding khata balance of ₹${party.outstandingBalance.toLocaleString('en-IN')} is due. Kindly clear the bill at your earliest convenience. Thank you!`;
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
    if (currentScreen === 'khata') {
      return {
        title: 'Customer Khata - Asra Fruits & Nuts',
        showBack: true,
        onBack: () => setCurrentScreen('dashboard'),
      };
    }
    if (currentScreen === 'sales') {
      return {
        title: 'High-Speed Billing & POS',
        showBack: true,
        onBack: () => setCurrentScreen('dashboard'),
      };
    }
    if (currentScreen === 'daybook') {
      return {
        title: 'Cash Day Book (Roker)',
        showBack: true,
        onBack: () => setCurrentScreen('dashboard'),
      };
    }
    if (currentScreen === 'products') {
      return {
        title: 'Products & Stock Inventory',
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
        title: 'Settings & Rules',
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

      {/* Main Container - Desktop Workspace or Framed Mobile Preview */}
      <div
        className={
          isMobileFrame
            ? 'flex-1 flex justify-center items-start py-8 px-4 bg-slate-900/10 min-h-screen'
            : 'flex-1 flex flex-row w-full min-h-screen'
        }
      >
        {/* Modern Sidebar (Desktop Workspace View) */}
        {!isMobileFrame && (
          <Sidebar
            currentScreen={currentScreen}
            onNavigate={handleSelectScreen}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onOpenQuickBilling={() => setCurrentScreen('sales')}
          />
        )}

        {/* Workspace Shell */}
        <div
          className={
            isMobileFrame
              ? 'w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl border-[8px] border-slate-900 overflow-hidden relative min-h-[880px] flex flex-col'
              : 'flex-1 flex flex-col min-w-0 bg-slate-50'
          }
        >
          {/* Top Bar Header */}
          <Header
            title={headerProps.title}
            showBack={headerProps.showBack}
            onBack={headerProps.onBack}
            screenMode={currentScreen}
            onScreenChange={handleSelectScreen}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenQuickSale={() => setCurrentScreen('sales')}
            onOpenRecordPayment={() => setIsRecordPaymentOpen(true)}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            isMobileFrame={isMobileFrame}
            onToggleMobileFrame={setIsMobileFrame}
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

      {/* Invoice Detail Side Drawer (Section 14) */}
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
