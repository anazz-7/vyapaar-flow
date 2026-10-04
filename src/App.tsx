/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ScreenMode, ActiveTab, LedgerEntry, ExpenseEntry, PaymentSubmission } from './types';
import {
  INITIAL_PARTY,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_EXPENSES,
  DEFAULT_PAYMENT_SUBMISSION,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CustomerKhataScreen } from './components/CustomerKhataScreen';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { PaymentRecordedScreen } from './components/PaymentRecordedScreen';
import { DayBookScreen } from './components/DayBookScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ThermalPrintModal } from './components/ThermalPrintModal';
import { CountCashModal } from './components/CountCashModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { NewBillModal } from './components/NewBillModal';
import { BillDetailModal } from './components/BillDetailModal';
import { ScreenSwitcherBar } from './components/ScreenSwitcherBar';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('khata');
  const [activeTab, setActiveTab] = useState<ActiveTab>('party');
  const [party, setParty] = useState(INITIAL_PARTY);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(INITIAL_LEDGER_ENTRIES);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(INITIAL_EXPENSES);
  const [netCash, setNetCash] = useState(85400);
  const [latestSubmission, setLatestSubmission] = useState<PaymentSubmission>(DEFAULT_PAYMENT_SUBMISSION);

  // Modals state
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isCountCashOpen, setIsCountCashOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isNewBillOpen, setIsNewBillOpen] = useState(false);
  const [isThermalOpen, setIsThermalOpen] = useState(false);
  const [viewingBillNo, setViewingBillNo] = useState<string | null>(null);

  // Viewport Frame Mode
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Screen selection handler
  const handleSelectScreen = (screen: ScreenMode) => {
    setCurrentScreen(screen);
    if (screen === 'dashboard') setActiveTab('home');
    else if (screen === 'daybook') setActiveTab('sales');
    else if (screen === 'khata') setActiveTab('party');
    else if (screen === 'record-payment') {
      setCurrentScreen('khata');
      setIsRecordPaymentOpen(true);
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentScreen('dashboard');
    else if (tab === 'sales') setCurrentScreen('daybook');
    else if (tab === 'party') setCurrentScreen('khata');
    else if (tab === 'items') {
      alert('Inventory items catalog: 120 items active. Cashews, Almonds, Raisins, Pistachios.');
    } else if (tab === 'more') {
      alert('More business tools: Thermal printer settings, GST reports, Staff permissions, Cloud sync.');
    }
  };

  // Payment Recording
  const handleSavePayment = (submission: PaymentSubmission) => {
    setLatestSubmission(submission);
    setIsRecordPaymentOpen(false);

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
      tag: submission.paymentMode === 'Cash' ? 'CASH' : submission.paymentMode === 'UPI / QR' ? 'ONLINE UPI' : 'BANK',
      amount: -submission.amount,
      dateStr: submission.dateStr,
      timeStr: submission.timeStr,
      description: 'Payment Received',
      note: submission.note,
      receiptNumber: submission.receiptId.replace('#REC-', ''),
      balance: submission.remainingBalance,
    };

    setLedgerEntries((prev) => [newLedgerEntry, ...prev]);

    // If paid by cash, update drawer cash
    if (submission.paymentMode === 'Cash') {
      setNetCash((prev) => prev + submission.amount);
    }

    // Navigate to Screen 3 (Payment Recorded / Voucher)
    setCurrentScreen('receipt');
  };

  // New Sale Bill
  const handleSaveBill = (entry: LedgerEntry) => {
    setLedgerEntries((prev) => [entry, ...prev]);
    if (entry.tag === 'UDHAAR') {
      setParty((prev) => ({
        ...prev,
        outstandingBalance: prev.outstandingBalance + entry.amount,
        totalPurchases: prev.totalPurchases + entry.amount,
      }));
    }
  };

  // Add Expense
  const handleSaveExpense = (newExp: ExpenseEntry) => {
    setExpenses((prev) => [newExp, ...prev]);
    if (newExp.paymentMode === 'Cash Counter') {
      setNetCash((prev) => Math.max(0, prev - newExp.amount));
    }
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
        title: 'Invoice Preview And Print',
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
    if (currentScreen === 'daybook') {
      return {
        subtitle: 'Cash Day Book',
        showBack: true,
        onBack: () => setCurrentScreen('dashboard'),
      };
    }
    return {
      subtitle: 'Dashboard',
      showBack: false,
    };
  };

  const headerProps = getHeaderProps();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Demo & Screen Switcher Bar */}
      <ScreenSwitcherBar
        currentScreen={currentScreen}
        onSelectScreen={handleSelectScreen}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={setIsMobileFrame}
      />

      {/* Main Container - either standard full-width or framed mobile viewport */}
      <div
        className={
          isMobileFrame
            ? 'flex-1 flex justify-center items-start py-6 px-4 bg-slate-900/10 min-h-screen overflow-x-hidden'
            : 'flex-1 flex flex-col w-full'
        }
      >
        <div
          className={
            isMobileFrame
              ? 'w-full max-w-[412px] bg-surface rounded-[40px] shadow-2xl border-[8px] border-slate-800 overflow-hidden relative min-h-[860px] flex flex-col'
              : 'w-full flex-1 flex flex-col'
          }
        >
          {/* Main Top Header */}
          <Header
            title={headerProps.title}
            subtitle={headerProps.subtitle}
            showBack={headerProps.showBack}
            onBack={headerProps.onBack}
            screenMode={currentScreen}
            onScreenChange={handleSelectScreen}
          />

          {/* Screen Content Body */}
          <main className="flex-1 pt-18 pb-6 flex flex-col w-full">
            {currentScreen === 'khata' && (
              <CustomerKhataScreen
                party={party}
                entries={ledgerEntries}
                onRecordPayment={() => setIsRecordPaymentOpen(true)}
                onGiveCredit={() => setIsNewBillOpen(true)}
                onViewBill={(billNo) => setViewingBillNo(billNo)}
                onSendWhatsAppReminder={handleSendWhatsAppReminder}
                onViewStatementPdf={() => alert(`Generating statement for ${party.name}...`)}
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
                onOpenThermal={() => setIsThermalOpen(true)}
              />
            )}

            {currentScreen === 'daybook' && (
              <DayBookScreen
                expenses={expenses}
                netCash={netCash}
                onAddExpense={() => setIsAddExpenseOpen(true)}
                onCountCash={() => setIsCountCashOpen(true)}
                onBankDeposit={() => {
                  alert('Bank Cash Deposit voucher: ₹50,000 deposited to HDFC Bank A/c ...3821');
                }}
              />
            )}

            {currentScreen === 'dashboard' && (
              <DashboardScreen
                onNavigate={handleSelectScreen}
                onQuickSale={() => setIsNewBillOpen(true)}
                onAddExpense={() => setIsAddExpenseOpen(true)}
              />
            )}
          </main>

          {/* Persistent Bottom Nav & Quick Sale FAB */}
          {currentScreen !== 'receipt' && (
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onQuickSale={() => setIsNewBillOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Record Payment Bottom Sheet Modal (Image 16) */}
      <RecordPaymentModal
        party={party}
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onSavePayment={handleSavePayment}
        onOpenSlipPreview={(amount, mode) => {
          setLatestSubmission({
            ...DEFAULT_PAYMENT_SUBMISSION,
            amount,
            paymentMode: mode as PaymentSubmission['paymentMode'],
          });
          setIsThermalOpen(true);
        }}
      />

      {/* Thermal (3") Receipt Modal */}
      <ThermalPrintModal
        isOpen={isThermalOpen}
        onClose={() => setIsThermalOpen(false)}
        submission={latestSubmission}
      />

      {/* Count Cash Modal */}
      <CountCashModal
        isOpen={isCountCashOpen}
        onClose={() => setIsCountCashOpen(false)}
        expectedAmount={netCash}
      />

      {/* Add Outflow Expense Modal */}
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

      {/* Invoice Detail Modal */}
      <BillDetailModal
        billNo={viewingBillNo}
        onClose={() => setViewingBillNo(null)}
        partyName={party.name}
      />
    </div>
  );
}
