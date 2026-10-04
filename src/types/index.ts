export type ScreenMode = 'khata' | 'daybook' | 'dashboard' | 'receipt' | 'record-payment';
export type ActiveTab = 'home' | 'sales' | 'party' | 'items' | 'more';

export interface LedgerEntry {
  id: string;
  type: 'sale' | 'payment' | 'opening';
  billNumber?: string;
  tag?: 'UDHAAR' | 'ONLINE UPI' | 'CASH' | 'CHEQUE' | 'BANK';
  amount: number;
  dateStr: string;
  timeStr: string;
  description: string;
  itemsSummary?: string;
  itemsCount?: string;
  upiRef?: string;
  receiptNumber?: string;
  note?: string;
  balance: number;
}

export interface ExpenseEntry {
  id: string;
  expNumber: string;
  title: string;
  vendor: string;
  amount: number;
  timeStr: string;
  dateStr: string;
  category: 'Transport' | 'Staff Tea' | 'Rent / Advance' | 'Packaging' | 'Electricity' | 'Other';
  paymentMode: 'Cash Counter' | 'UPI / PhonePe' | 'Bank Transfer (IMPS)' | 'Cheque';
  badgeSecondary?: string;
  reference?: string;
}

export interface Party {
  id: string;
  name: string;
  proprietor: string;
  phone: string;
  category: string;
  address: string;
  outstandingBalance: number;
  isOverdue: boolean;
  overdueDays: number;
  creditLimit: number;
  totalPurchases: number;
  totalPaid: number;
  avgPayTimeDays: number;
}

export interface PaymentSubmission {
  receiptId: string;
  partyName: string;
  proprietor: string;
  phone: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI / QR' | 'Bank (NEFT)' | 'Cheque';
  modeDetail: string;
  dateStr: string;
  timeStr: string;
  note: string;
  settledBills: Array<{ billNo: string; amount: number }>;
  remainingBalance: number;
  includePdfSlip: boolean;
  addReviewLink: boolean;
}
