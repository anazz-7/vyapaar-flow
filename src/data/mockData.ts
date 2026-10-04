import { Party, LedgerEntry, ExpenseEntry, PaymentSubmission } from '../types';

export const ASSETS = {
  vyapaarLogo: 'https://lh3.googleusercontent.com/aida/AEtjO1XDVtYGiwd9-d9wC4HMz7WcrvEeRztFw0vJ_1LnGOt1H_F4Au4ENr6bP4cqqjhy-1z_4YRpUmt9uAp0Oq4YXfAWFTpGHLrnMrDo3yPHXyr13l893LDD5dBncJRMkthL2sZAPs3mt0_hVdppIXHdyiguPk2mmtTluUpabkjM3hjEnnz9q0kpMxvcHgdoFa_AUiJvc5vD3qOetEGFscuaCbKIPLutekXFHKGkzo0k6g4BYqs2wSU306Tm',
  storeLogo: 'https://lh3.googleusercontent.com/aida/AEtjO1XRmvuqNFLP6GMES-_GfaSPNGcNzse23eABcbvzXG8sWDOBRKF8tHZJV02UiSX6c1y-pCOkrchDqrY3PxfgCv2X6gnQ9CrEbr8y3ucsxAg4gpB34eejmy6yZYZXT0LdfJTB7rn8i94WXBEjzIpTValRRiZkRVqtGYnMKQkRlLq5PuIAHF5CyvQHa1l3i8dpn9E69YLNVMy4q2-G7rfALFkdOXIjh9256DXIQXfW9dgc19xRJcP9d9Cw',
  ownerPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrfbz2f-PRoHctFM7plIGYYfuTneXBKlWvIoEl-4OfhaqMn7h7T8mSMWPpPQpJ9o6-jgihD-vgkadGDgvJOI6FqPwaEmJASU37A_f6OI8a2zQrxtO332wluKsmoLigA_at7g5OpGk-3CIOb0eUPBWjDQilIf9r2lCKd1QdJrjf4Zr-cyIsgZmdDas10THdzFgVe5x8AvCSyI3al-tnEYfqpwJIFh3hbe8URkOaj1eTz1c-zQHcf-g',
};

export const INITIAL_PARTY: Party = {
  id: 'party-asra-01',
  name: 'Asra Fruits & Nuts',
  proprietor: 'Imran Bhai',
  phone: '+91 98260 44321',
  category: 'WHOLESALE',
  address: 'Shop #14, Wholesale Mandi, MG Road, Indore - 452001',
  outstandingBalance: 14200,
  isOverdue: true,
  overdueDays: 4,
  creditLimit: 25000,
  totalPurchases: 86400,
  totalPaid: 72200,
  avgPayTimeDays: 12,
};

export const INITIAL_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'entry-1',
    type: 'sale',
    billNumber: 'INV-1022',
    tag: 'UDHAAR',
    amount: 8400,
    dateStr: 'Yesterday, 23 Oct',
    timeStr: '04:15 PM',
    description: 'Sale Bill #INV-1022',
    itemsSummary: 'Almonds (10kg), Cashews (5kg), Raisin...',
    itemsCount: '4 items',
    balance: 14200,
  },
  {
    id: 'entry-2',
    type: 'payment',
    tag: 'ONLINE UPI',
    amount: -10000,
    dateStr: '18 Oct 2024',
    timeStr: '11:30 AM',
    description: 'Payment Received',
    upiRef: 'PhonePe / 9482910',
    receiptNumber: 'REC-304',
    balance: 5800,
  },
  {
    id: 'entry-3',
    type: 'sale',
    billNumber: 'INV-1011',
    tag: 'UDHAAR',
    amount: 15800,
    dateStr: '12 Oct 2024',
    timeStr: '02:45 PM',
    description: 'Sale Bill #INV-1011',
    itemsSummary: 'Diwali Wholesale Dry Fruits Gift Boxes',
    itemsCount: '6 Cartons',
    balance: 15800,
  },
  {
    id: 'entry-4',
    type: 'payment',
    tag: 'CASH',
    amount: -8000,
    dateStr: '05 Oct 2024',
    timeStr: '10:15 AM',
    description: 'Payment Received',
    note: 'Shop Counter Cash Handover',
    receiptNumber: 'REC-288',
    balance: 0,
  },
  {
    id: 'entry-5',
    type: 'opening',
    amount: 8000,
    dateStr: '01 Oct 2024',
    timeStr: '',
    description: 'Opening Balance Brought Forward',
    balance: 8000,
  },
];

export const INITIAL_EXPENSES: ExpenseEntry[] = [
  {
    id: 'exp-92',
    expNumber: 'EXP-92',
    title: 'Transport & Tempo Delivery',
    vendor: 'Ramu Auto Tempo - Mandi Stock Unloading',
    amount: 850,
    timeStr: '03:30 PM',
    dateStr: 'Today, 24 Oct',
    category: 'Transport',
    paymentMode: 'Cash Counter',
    badgeSecondary: 'Bill Attached',
  },
  {
    id: 'exp-91',
    expNumber: 'EXP-91',
    title: 'Staff Chai & Refreshment',
    vendor: 'Sharma Tea Stall (Weekly Snacks & Chai)',
    amount: 450,
    timeStr: '01:45 PM',
    dateStr: 'Today, 24 Oct',
    category: 'Staff Tea',
    paymentMode: 'UPI / PhonePe',
    badgeSecondary: 'Self Verified',
  },
  {
    id: 'exp-90',
    expNumber: 'EXP-90',
    title: 'Shop Rent Advance',
    vendor: 'Landlord Verma Ji - Shop Part Advance',
    amount: 2500,
    timeStr: '11:15 AM',
    dateStr: 'Today, 24 Oct',
    category: 'Rent / Advance',
    paymentMode: 'Bank Transfer (IMPS)',
    reference: 'UTR #928174',
  },
  {
    id: 'exp-89',
    expNumber: 'EXP-89',
    title: 'Packaging & Carry Bags',
    vendor: 'Shree Krishna Packaging - 50kg Bags',
    amount: 450,
    timeStr: '10:00 AM',
    dateStr: 'Today, 24 Oct',
    category: 'Packaging',
    paymentMode: 'Cash Counter',
    badgeSecondary: 'Slip Signed',
  },
];

export const DEFAULT_PAYMENT_SUBMISSION: PaymentSubmission = {
  receiptId: '#REC-305',
  partyName: 'Asra Fruits & Nuts',
  proprietor: 'Imran Bhai',
  phone: '+91 98260 44321',
  amount: 14200,
  paymentMode: 'Cash',
  modeDetail: 'Cash (Counter POS-01)',
  dateStr: 'Today, 24 Oct 2024',
  timeStr: '04:30 PM',
  note: 'Received at shop counter by Imran Bhai personally',
  settledBills: [
    { billNo: 'INV-1022', amount: 8400 },
    { billNo: 'INV-1011', amount: 5800 },
  ],
  remainingBalance: 0,
  includePdfSlip: true,
  addReviewLink: true,
};

export const INVOICE_DETAILS: Record<string, {
  billNo: string;
  date: string;
  items: Array<{ name: string; qty: string; rate: number; amount: number }>;
  subtotal: number;
  tax: number;
  grandTotal: number;
}> = {
  'INV-1022': {
    billNo: 'INV-1022',
    date: '23 Oct 2024, 04:15 PM',
    items: [
      { name: 'California Almonds Premium', qty: '10 kg', rate: 420, amount: 4200 },
      { name: 'Whole Cashews W-320', qty: '5 kg', rate: 560, amount: 2800 },
      { name: 'Afghan Green Raisins', qty: '2 kg', rate: 350, amount: 700 },
      { name: 'Pista Akbari Roasted', qty: '1 kg', rate: 700, amount: 700 },
    ],
    subtotal: 8400,
    tax: 0,
    grandTotal: 8400,
  },
  'INV-1011': {
    billNo: 'INV-1011',
    date: '12 Oct 2024, 02:45 PM',
    items: [
      { name: 'Diwali Wholesale Dry Fruits Gift Boxes', qty: '6 Cartons', rate: 2400, amount: 14400 },
      { name: 'Gold Embossed Packaging Boxes', qty: '14 pcs', rate: 100, amount: 1400 },
    ],
    subtotal: 15800,
    tax: 0,
    grandTotal: 15800,
  },
};
