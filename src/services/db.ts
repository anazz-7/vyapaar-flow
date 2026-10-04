import { StoreData, StoreSettings, Party, ProductItem, Supplier, LedgerEntry, ExpenseEntry, DayBookRecord } from '../types';
import {
  MOCK_CUSTOMERS,
  MOCK_PRODUCTS,
  MOCK_SUPPLIERS,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_EXPENSES,
} from '../data/mockData';

const DB_NAME = 'vyapaar_flow_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';
const STATE_KEY = 'current_store_data';
const LOCAL_STORAGE_KEY = 'vyapaar_flow_local_backup';

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'My Business',
  proprietor: 'Store Owner',
  phone: '+91 98000 00000',
  address: 'Shop No. 1, Main Market',
  autoRoundOff: true,
  allowUdhaar: true,
  enableThermal: true,
  thermalWidth: '80mm',
};

export const EMPTY_STORE_DATA: StoreData = {
  version: 1,
  isDemoLoaded: false,
  lastBackupDate: null,
  settings: DEFAULT_SETTINGS,
  customers: [],
  suppliers: [],
  products: [],
  ledgerEntries: [],
  expenses: [],
  dayBooks: {},
};

export function getDemoStoreData(): StoreData {
  return {
    version: 1,
    isDemoLoaded: true,
    lastBackupDate: new Date().toISOString(),
    settings: {
      ...DEFAULT_SETTINGS,
      storeName: 'BM Super Mart',
      proprietor: 'Mohammed Anas',
      phone: '+91 98260 12345',
      address: 'Shop #14, Wholesale Mandi, MG Road, Indore - 452001',
    },
    customers: [...MOCK_CUSTOMERS],
    suppliers: [...MOCK_SUPPLIERS],
    products: [...MOCK_PRODUCTS],
    ledgerEntries: [...INITIAL_LEDGER_ENTRIES],
    expenses: [...INITIAL_EXPENSES],
    dayBooks: {
      [getTodayDateKey()]: {
        date: getTodayDateKey(),
        openingCash: 42500,
        cashIn: 47150,
        cashOut: INITIAL_EXPENSES.reduce((sum, e) => sum + e.amount, 0),
        closingCash: 85400,
        isLocked: false,
      },
    },
  };
}

// Open IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Load StoreData from IndexedDB (with fallback to localStorage)
export async function loadStoreData(): Promise<StoreData> {
  try {
    const db = await openDB();
    const data = await new Promise<StoreData | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(STATE_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });

    if (data && typeof data === 'object') {
      return data;
    }
  } catch (err) {
    console.warn('IndexedDB load failed, trying localStorage fallback:', err);
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('LocalStorage load failed:', e);
  }

  // Return clean empty store by default for new users
  return EMPTY_STORE_DATA;
}

// Auto-save StoreData to IndexedDB and localStorage
export async function saveStoreData(data: StoreData): Promise<void> {
  // Sync to localStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }

  // Save to IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, STATE_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('IndexedDB save failed:', err);
  }
}

// Export backup as downloadable JSON file
export function exportBackupFile(data: StoreData): void {
  const updatedData: StoreData = {
    ...data,
    lastBackupDate: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(updatedData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `vyapaar_flow_backup_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import backup JSON file
export function parseBackupFile(fileContent: string): StoreData {
  const parsed = JSON.parse(fileContent);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid backup file: not a JSON object');
  }
  if (!Array.isArray(parsed.customers) || !Array.isArray(parsed.products)) {
    throw new Error('Invalid backup file structure');
  }
  return {
    ...EMPTY_STORE_DATA,
    ...parsed,
    lastBackupDate: new Date().toISOString(),
  };
}

// Check if last backup is older than 7 days
export function isBackupOlderThan7Days(lastBackupDate: string | null): boolean {
  if (!lastBackupDate) return true;
  const lastTime = new Date(lastBackupDate).getTime();
  const now = Date.now();
  const diffDays = (now - lastTime) / (1000 * 60 * 60 * 24);
  return diffDays >= 7;
}

// Helper: YYYY-MM-DD
export function getTodayDateKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
