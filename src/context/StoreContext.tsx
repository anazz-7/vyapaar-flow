import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  StoreData,
  StoreSettings,
  Party,
  ProductItem,
  Supplier,
  LedgerEntry,
  ExpenseEntry,
  DayBookRecord,
  PaymentSubmission,
} from '../types';
import {
  loadStoreData,
  saveStoreData,
  getDemoStoreData,
  EMPTY_STORE_DATA,
  exportBackupFile,
  parseBackupFile,
  isBackupOlderThan7Days,
  getTodayDateKey,
} from '../services/db';

interface StoreContextType {
  storeData: StoreData;
  isLoading: boolean;
  lastSavedTime: string;
  backupWarning: boolean;
  activeCustomer: Party | null;
  setActiveCustomerId: (id: string | null) => void;

  // Single Source of Truth Computed Totals
  todaySales: number;
  cashInHand: number;
  toCollect: number; // Customers owe me
  toPay: number; // I owe suppliers
  totalStockValue: number;
  lowStockCount: number;
  overdueCustomersCount: number;
  thisMonthSales: number;
  thisMonthPurchases: number;
  thisMonthExpenses: number;
  thisMonthNetProfit: number;

  // Day Book for specific date
  getDayBookForDate: (dateKey: string) => DayBookRecord;
  updateDayBook: (record: DayBookRecord) => void;

  // Actions
  addSaleBill: (
    entry: LedgerEntry,
    customerId?: string,
    cartItems?: Array<{ productId: string; qty: number }>
  ) => void;
  recordPayment: (submission: PaymentSubmission) => void;
  addExpense: (expense: ExpenseEntry) => void;
  addCustomer: (customer: Party) => void;
  updateCustomer: (customer: Party) => void;
  deleteCustomer: (id: string) => void;
  addProduct: (product: ProductItem) => void;
  updateProduct: (product: ProductItem) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplier: Supplier) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Data management
  loadDemoData: () => void;
  clearStoreData: () => void;
  exportBackup: () => void;
  importBackup: (fileContent: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeData, setStoreData] = useState<StoreData>(EMPTY_STORE_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [activeCustomerId, setActiveCustomerIdState] = useState<string | null>(null);

  // Initial load from IndexedDB
  useEffect(() => {
    let mounted = true;
    loadStoreData()
      .then((data) => {
        if (mounted) {
          setStoreData(data);
          if (data.customers.length > 0) {
            setActiveCustomerIdState(data.customers[0].id);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load store data:', err);
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Save changes to IndexedDB
  const commitStoreData = useCallback((newData: StoreData) => {
    setStoreData(newData);
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    saveStoreData(newData).catch((e) => console.error('Save failed:', e));
  }, []);

  // Active customer object
  const activeCustomer = useMemo(() => {
    if (!activeCustomerId && storeData.customers.length > 0) {
      return storeData.customers[0];
    }
    return storeData.customers.find((c) => c.id === activeCustomerId) || storeData.customers[0] || null;
  }, [storeData.customers, activeCustomerId]);

  const setActiveCustomerId = (id: string | null) => {
    setActiveCustomerIdState(id);
  };

  const todayKey = getTodayDateKey();

  // Day Book Record for any date
  const getDayBookForDate = useCallback(
    (dateKey: string): DayBookRecord => {
      if (storeData.dayBooks[dateKey]) {
        return storeData.dayBooks[dateKey];
      }

      // If missing, compute opening from nearest previous closing cash or default
      let previousClosing = 0;
      const sortedKeys = Object.keys(storeData.dayBooks)
        .filter((k) => k < dateKey)
        .sort();
      if (sortedKeys.length > 0) {
        const lastKey = sortedKeys[sortedKeys.length - 1];
        previousClosing = storeData.dayBooks[lastKey].closingCash;
      }

      return {
        date: dateKey,
        openingCash: previousClosing,
        cashIn: 0,
        cashOut: 0,
        closingCash: previousClosing,
        isLocked: false,
      };
    },
    [storeData.dayBooks]
  );

  const updateDayBook = useCallback(
    (record: DayBookRecord) => {
      commitStoreData({
        ...storeData,
        dayBooks: {
          ...storeData.dayBooks,
          [record.date]: record,
        },
      });
    },
    [storeData, commitStoreData]
  );

  // SINGLE SOURCE OF TRUTH CALCULATIONS
  const toCollect = useMemo(() => {
    return storeData.customers.reduce((sum, c) => sum + (c.outstandingBalance > 0 ? c.outstandingBalance : 0), 0);
  }, [storeData.customers]);

  const toPay = useMemo(() => {
    return storeData.suppliers.reduce((sum, s) => sum + (s.balanceDue > 0 ? s.balanceDue : 0), 0);
  }, [storeData.suppliers]);

  const todaySales = useMemo(() => {
    return storeData.ledgerEntries
      .filter((e) => e.type === 'sale' && (e.dateStr.includes('Today') || e.dateStr.includes(todayKey)))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [storeData.ledgerEntries, todayKey]);

  const currentDayBook = useMemo(() => {
    return getDayBookForDate(todayKey);
  }, [getDayBookForDate, todayKey]);

  const cashInHand = useMemo(() => {
    return currentDayBook.closingCash;
  }, [currentDayBook]);

  const totalStockValue = useMemo(() => {
    return storeData.products.reduce((sum, p) => sum + p.currentStock * p.purchasePrice, 0);
  }, [storeData.products]);

  const lowStockCount = useMemo(() => {
    return storeData.products.filter((p) => p.currentStock <= p.minStock).length;
  }, [storeData.products]);

  const overdueCustomersCount = useMemo(() => {
    return storeData.customers.filter((c) => c.outstandingBalance > 0 && c.isOverdue).length;
  }, [storeData.customers]);

  const thisMonthSales = useMemo(() => {
    return storeData.ledgerEntries.filter((e) => e.type === 'sale').reduce((sum, e) => sum + e.amount, 0);
  }, [storeData.ledgerEntries]);

  const thisMonthPurchases = useMemo(() => {
    return storeData.suppliers.reduce((sum, s) => sum + (s.balanceDue || 0), 0);
  }, [storeData.suppliers]);

  const thisMonthExpenses = useMemo(() => {
    return storeData.expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [storeData.expenses]);

  const thisMonthNetProfit = useMemo(() => {
    return Math.max(0, thisMonthSales - thisMonthPurchases - thisMonthExpenses);
  }, [thisMonthSales, thisMonthPurchases, thisMonthExpenses]);

  const backupWarning = useMemo(() => {
    return isBackupOlderThan7Days(storeData.lastBackupDate);
  }, [storeData.lastBackupDate]);

  // ACTION: Add Sale Bill (Updates stock, customer balance, ledger, day book)
  const addSaleBill = useCallback(
    (entry: LedgerEntry, customerId?: string, cartItems?: Array<{ productId: string; qty: number }>) => {
      const isUdhaar = entry.tag === 'UDHAAR';
      const isCash = entry.tag === 'CASH';

      // 1. Update Customers
      let updatedCustomers = [...storeData.customers];
      if (customerId) {
        updatedCustomers = updatedCustomers.map((c) => {
          if (c.id === customerId) {
            const newBal = isUdhaar ? c.outstandingBalance + entry.amount : c.outstandingBalance;
            return {
              ...c,
              outstandingBalance: newBal,
              totalPurchases: c.totalPurchases + entry.amount,
              isOverdue: newBal > 0 && c.overdueDays > 0,
            };
          }
          return c;
        });
      }

      // 2. Reduce Stock
      let updatedProducts = [...storeData.products];
      if (cartItems && cartItems.length > 0) {
        updatedProducts = updatedProducts.map((p) => {
          const cartItem = cartItems.find((ci) => ci.productId === p.id);
          if (cartItem) {
            const newStock = Math.max(0, p.currentStock - cartItem.qty);
            return {
              ...p,
              currentStock: newStock,
              salesQty: (p.salesQty || 0) + cartItem.qty,
            };
          }
          return p;
        });
      }

      // 3. Update Day Book if Cash
      const currentDay = getDayBookForDate(todayKey);
      const newCashIn = isCash ? currentDay.cashIn + entry.amount : currentDay.cashIn;
      const newClosing = currentDay.openingCash + newCashIn - currentDay.cashOut;

      const updatedDayBooks = {
        ...storeData.dayBooks,
        [todayKey]: {
          ...currentDay,
          cashIn: newCashIn,
          closingCash: newClosing,
        },
      };

      commitStoreData({
        ...storeData,
        customers: updatedCustomers,
        products: updatedProducts,
        ledgerEntries: [entry, ...storeData.ledgerEntries],
        dayBooks: updatedDayBooks,
      });
    },
    [storeData, todayKey, getDayBookForDate, commitStoreData]
  );

  // ACTION: Record Payment (Reduces customer balance, increases cash/bank, updates day book)
  const recordPayment = useCallback(
    (submission: PaymentSubmission) => {
      const isCash = submission.paymentMode === 'Cash';

      // 1. Update Customer
      const updatedCustomers = storeData.customers.map((c) => {
        if (c.name.toLowerCase() === submission.partyName.toLowerCase()) {
          const newBal = submission.remainingBalance;
          return {
            ...c,
            outstandingBalance: newBal,
            totalPaid: c.totalPaid + submission.amount,
            isOverdue: newBal > 0,
          };
        }
        return c;
      });

      // 2. New Ledger Entry
      const newEntry: LedgerEntry = {
        id: `entry-${Date.now()}`,
        type: 'payment',
        tag: isCash ? 'CASH' : submission.paymentMode === 'UPI / QR' ? 'ONLINE UPI' : 'BANK',
        amount: -submission.amount,
        dateStr: submission.dateStr,
        timeStr: submission.timeStr,
        description: 'Payment Received',
        note: submission.note,
        receiptNumber: submission.receiptId.replace('#REC-', ''),
        balance: submission.remainingBalance,
        status: 'PAID',
      };

      // 3. Update Day Book if Cash
      const currentDay = getDayBookForDate(todayKey);
      const newCashIn = isCash ? currentDay.cashIn + submission.amount : currentDay.cashIn;
      const newClosing = currentDay.openingCash + newCashIn - currentDay.cashOut;

      const updatedDayBooks = {
        ...storeData.dayBooks,
        [todayKey]: {
          ...currentDay,
          cashIn: newCashIn,
          closingCash: newClosing,
        },
      };

      commitStoreData({
        ...storeData,
        customers: updatedCustomers,
        ledgerEntries: [newEntry, ...storeData.ledgerEntries],
        dayBooks: updatedDayBooks,
      });
    },
    [storeData, todayKey, getDayBookForDate, commitStoreData]
  );

  // ACTION: Add Expense (Records outflow, updates day book if cash)
  const addExpense = useCallback(
    (expense: ExpenseEntry) => {
      const isCash = expense.paymentMode === 'Cash Counter';

      const currentDay = getDayBookForDate(todayKey);
      const newCashOut = isCash ? currentDay.cashOut + expense.amount : currentDay.cashOut;
      const newClosing = Math.max(0, currentDay.openingCash + currentDay.cashIn - newCashOut);

      const updatedDayBooks = {
        ...storeData.dayBooks,
        [todayKey]: {
          ...currentDay,
          cashOut: newCashOut,
          closingCash: newClosing,
        },
      };

      commitStoreData({
        ...storeData,
        expenses: [expense, ...storeData.expenses],
        dayBooks: updatedDayBooks,
      });
    },
    [storeData, todayKey, getDayBookForDate, commitStoreData]
  );

  // Customers Management
  const addCustomer = useCallback(
    (customer: Party) => {
      commitStoreData({
        ...storeData,
        customers: [customer, ...storeData.customers],
      });
      setActiveCustomerIdState(customer.id);
    },
    [storeData, commitStoreData]
  );

  const updateCustomer = useCallback(
    (customer: Party) => {
      commitStoreData({
        ...storeData,
        customers: storeData.customers.map((c) => (c.id === customer.id ? customer : c)),
      });
    },
    [storeData, commitStoreData]
  );

  const deleteCustomer = useCallback(
    (id: string) => {
      commitStoreData({
        ...storeData,
        customers: storeData.customers.filter((c) => c.id !== id),
      });
      if (activeCustomerId === id) {
        setActiveCustomerIdState(storeData.customers[0]?.id || null);
      }
    },
    [storeData, activeCustomerId, commitStoreData]
  );

  // Products Management
  const addProduct = useCallback(
    (product: ProductItem) => {
      commitStoreData({
        ...storeData,
        products: [product, ...storeData.products],
      });
    },
    [storeData, commitStoreData]
  );

  const updateProduct = useCallback(
    (product: ProductItem) => {
      commitStoreData({
        ...storeData,
        products: storeData.products.map((p) => (p.id === product.id ? product : p)),
      });
    },
    [storeData, commitStoreData]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      commitStoreData({
        ...storeData,
        products: storeData.products.filter((p) => p.id !== id),
      });
    },
    [storeData, commitStoreData]
  );

  // Suppliers Management
  const addSupplier = useCallback(
    (supplier: Supplier) => {
      commitStoreData({
        ...storeData,
        suppliers: [supplier, ...storeData.suppliers],
      });
    },
    [storeData, commitStoreData]
  );

  const updateSupplier = useCallback(
    (supplier: Supplier) => {
      commitStoreData({
        ...storeData,
        suppliers: storeData.suppliers.map((s) => (s.id === supplier.id ? supplier : s)),
      });
    },
    [storeData, commitStoreData]
  );

  // Settings Management
  const updateSettings = useCallback(
    (newSettings: Partial<StoreSettings>) => {
      commitStoreData({
        ...storeData,
        settings: {
          ...storeData.settings,
          ...newSettings,
        },
      });
    },
    [storeData, commitStoreData]
  );

  // Demo Data & Reset Actions
  const loadDemoData = useCallback(() => {
    const demo = getDemoStoreData();
    commitStoreData(demo);
    setActiveCustomerIdState(demo.customers[0]?.id || null);
  }, [commitStoreData]);

  const clearStoreData = useCallback(() => {
    commitStoreData(EMPTY_STORE_DATA);
    setActiveCustomerIdState(null);
  }, [commitStoreData]);

  const exportBackup = useCallback(() => {
    exportBackupFile(storeData);
    commitStoreData({
      ...storeData,
      lastBackupDate: new Date().toISOString(),
    });
  }, [storeData, commitStoreData]);

  const importBackup = useCallback(
    (fileContent: string) => {
      const restored = parseBackupFile(fileContent);
      commitStoreData(restored);
      if (restored.customers.length > 0) {
        setActiveCustomerIdState(restored.customers[0].id);
      }
    },
    [commitStoreData]
  );

  return (
    <StoreContext.Provider
      value={{
        storeData,
        isLoading,
        lastSavedTime,
        backupWarning,
        activeCustomer,
        setActiveCustomerId,
        todaySales,
        cashInHand,
        toCollect,
        toPay,
        totalStockValue,
        lowStockCount,
        overdueCustomersCount,
        thisMonthSales,
        thisMonthPurchases,
        thisMonthExpenses,
        thisMonthNetProfit,
        getDayBookForDate,
        updateDayBook,
        addSaleBill,
        recordPayment,
        addExpense,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProduct,
        updateProduct,
        deleteProduct,
        addSupplier,
        updateSupplier,
        updateSettings,
        loadDemoData,
        clearStoreData,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
