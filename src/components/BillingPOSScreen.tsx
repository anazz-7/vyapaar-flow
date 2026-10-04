import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  Printer,
  Share2,
  Check,
  User,
  CreditCard,
  Wallet,
  Building2,
  QrCode,
  FileText,
  AlertCircle,
  X,
  Keyboard,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_CUSTOMERS } from '../data/mockData';
import { ProductItem, CartItem, Party, LedgerEntry } from '../types';

interface BillingPOSScreenProps {
  onSaveBill: (entry: LedgerEntry) => void;
  onOpenThermal: (bill: any) => void;
  onClose?: () => void;
}

export const BillingPOSScreen: React.FC<BillingPOSScreenProps> = ({
  onSaveBill,
  onOpenThermal,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Party>(MOCK_CUSTOMERS[0]);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Bank' | 'Udhaar'>('Cash');
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: MOCK_PRODUCTS[0],
      qty: 5,
      rate: MOCK_PRODUCTS[0].sellingPrice,
      discountPercent: 0,
      amount: 5 * MOCK_PRODUCTS[0].sellingPrice,
    },
    {
      product: MOCK_PRODUCTS[1],
      qty: 2,
      rate: MOCK_PRODUCTS[1].sellingPrice,
      discountPercent: 0,
      amount: 2 * MOCK_PRODUCTS[1].sellingPrice,
    },
  ]);
  const [overallDiscount, setOverallDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [savedSuccessNotice, setSavedSuccessNotice] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Keyboard Shortcuts (Section 11)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + S -> Save Bill
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave(false);
      }
      // Ctrl + P -> Save & Print
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleSave(true);
      }
      // Ctrl + N -> Reset new sale
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setCart([]);
        setSearchQuery('');
      }
      // Esc -> Close
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const categories = ['All', 'Dry Fruits', 'Spices', 'Grains', 'Packaged'];

  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesQuery =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.barcode.includes(searchQuery);
    return matchesCategory && matchesQuery;
  });

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
                amount: (item.qty + 1) * item.rate * (1 - item.discountPercent / 100),
              }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          qty: 1,
          rate: product.sellingPrice,
          discountPercent: 0,
          amount: product.sellingPrice,
        },
      ];
    });
  };

  const updateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              qty: newQty,
              amount: newQty * item.rate * (1 - item.discountPercent / 100),
            }
          : item
      )
    );
  };

  const updateRate = (productId: string, newRate: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              rate: newRate,
              amount: item.qty * newRate * (1 - item.discountPercent / 100),
            }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Barcode enter handler
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const matched = MOCK_PRODUCTS.find(
      (p) => p.barcode === searchQuery.trim() || p.sku.toLowerCase() === searchQuery.toLowerCase().trim()
    );
    if (matched) {
      addToCart(matched);
      setSearchQuery('');
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = overallDiscount;
  const rawTotal = Math.max(0, subtotal - discountAmount);
  const roundedTotal = Math.round(rawTotal);
  const roundOff = Number((roundedTotal - rawTotal).toFixed(2));

  const handleSave = (shouldPrint: boolean) => {
    if (cart.length === 0) {
      alert('Please add at least one product to the bill.');
      return;
    }

    const billNumber = `INV-${Math.floor(1028 + Math.random() * 50)}`;
    const itemsSummary = cart.map((i) => `${i.product.name} (${i.qty} ${i.product.unit})`).join(', ');

    const newLedgerEntry: LedgerEntry = {
      id: `entry-${Date.now()}`,
      type: 'sale',
      billNumber,
      tag: paymentMode === 'Udhaar' ? 'UDHAAR' : paymentMode === 'UPI' ? 'ONLINE UPI' : 'CASH',
      amount: roundedTotal,
      dateStr: 'Today, 24 Oct',
      timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: `Sale Bill #${billNumber}`,
      itemsSummary,
      itemsCount: `${cart.length} items`,
      balance: selectedCustomer.outstandingBalance + (paymentMode === 'Udhaar' ? roundedTotal : 0),
      status: paymentMode === 'Udhaar' ? 'PENDING' : 'PAID',
    };

    onSaveBill(newLedgerEntry);

    if (shouldPrint) {
      onOpenThermal({
        receiptId: `#REC-${billNumber}`,
        partyName: selectedCustomer.name,
        proprietor: selectedCustomer.proprietor,
        phone: selectedCustomer.phone,
        amount: roundedTotal,
        paymentMode: paymentMode === 'Udhaar' ? 'Credit' : paymentMode,
        dateStr: 'Today, 24 Oct 2024',
        timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        settledBills: [{ billNo: billNumber, amount: roundedTotal }],
        remainingBalance: selectedCustomer.outstandingBalance + (paymentMode === 'Udhaar' ? roundedTotal : 0),
        items: cart,
      });
    }

    setSavedSuccessNotice(true);
    setTimeout(() => {
      setSavedSuccessNotice(false);
      setCart([]);
      if (onClose) onClose();
    }, 1200);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName) return;
    const newCust: Party = {
      id: `party-custom-${Date.now()}`,
      name: newCustomerName,
      proprietor: newCustomerName,
      phone: newCustomerPhone || '+91 98000 00000',
      category: 'RETAIL',
      address: 'Indore Mandi',
      outstandingBalance: 0,
      isOverdue: false,
      overdueDays: 0,
      creditLimit: 10000,
      totalPurchases: 0,
      totalPaid: 0,
      avgPayTimeDays: 0,
    };
    setSelectedCustomer(newCust);
    setShowAddCustomerModal(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
  };

  const handleShareWhatsApp = () => {
    const text = `Sale Bill from BM Super Mart for ${selectedCustomer.name}:\nTotal Amount: ₹${roundedTotal.toLocaleString('en-IN')}\nPayment: ${paymentMode}\nItems: ${cart.length}\nThank you for your business!`;
    const phoneClean = selectedCustomer.phone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col space-y-4">
      {/* Keyboard Shortcuts Hint Bar (Section 11) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[11px]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <Keyboard className="w-3.5 h-3.5 text-blue-400" />
            <span>Speed POS Mode Active</span>
          </span>
          <span className="hidden md:inline text-slate-400">
            <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-slate-200">Ctrl+N</kbd> New
          </span>
          <span className="hidden md:inline text-slate-400">
            <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-slate-200">Ctrl+S</kbd> Save
          </span>
          <span className="hidden md:inline text-slate-400">
            <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-slate-200">Ctrl+P</kbd> Print
          </span>
        </div>
        <span className="text-slate-400 font-medium">Barcode Ready</span>
      </div>

      {savedSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center justify-between animate-in fade-in duration-200 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Sale Bill successfully saved! Voucher and ledger updated.</span>
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Left (Products & Cart) / Right (Customer & Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT / MAIN AREA (8 Cols on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Top Bar: Search & Barcode input + Categories */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-3">
            <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan barcode or search product by name/SKU (e.g. 890123456701, Almonds)..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:bg-white focus:border-blue-500 transition-all font-medium"
                />
              </div>
              <button
                type="submit"
                className="h-10 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition-colors"
                title="Simulate Barcode Scan"
              >
                <Barcode className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Scan</span>
              </button>
            </form>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {filteredProducts.slice(0, 4).map((prod) => (
              <div
                key={prod.id}
                onClick={() => addToCart(prod)}
                className="p-2.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group text-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>{prod.sku}</span>
                    <span className="text-emerald-600 font-semibold">{prod.currentStock} {prod.unit}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600">
                    {prod.name}
                  </h4>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <span className="font-heading font-bold text-slate-900">
                    ₹{prod.sellingPrice}/{prod.unit}
                  </span>
                  <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    +
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Cart Table (Section 10) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-slate-900 text-sm">
                  Cart Items
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                  {cart.length} lines
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-700 text-sm">Cart is empty</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scan a barcode or click any product above to start billing.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Disc %</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-2 text-center w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cart.map((item) => (
                      <tr key={item.product.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 min-w-[140px]">
                          <span className="font-semibold text-slate-900 block truncate">
                            {item.product.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            SKU: {item.product.sku}
                          </span>
                        </td>

                        {/* Qty +/- Controls */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => updateQty(item.product.id, item.qty - 1)}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) =>
                                updateQty(item.product.id, parseInt(e.target.value, 10) || 1)
                              }
                              className="w-12 h-6 text-center font-bold font-mono bg-slate-50 border border-slate-200 rounded text-xs"
                            />
                            <button
                              onClick={() => updateQty(item.product.id, item.qty + 1)}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Rate */}
                        <td className="py-2.5 px-3 text-right font-mono font-medium">
                          ₹{item.rate}
                        </td>

                        {/* Discount */}
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-slate-500 font-mono">
                            {item.discountPercent}%
                          </span>
                        </td>

                        {/* Line Total */}
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </td>

                        {/* Delete Row */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT / SUMMARY AREA (4 Cols on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Customer Selection Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Customer Account
              </span>
              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>New Customer</span>
              </button>
            </div>

            {/* Customer Dropdown */}
            <div className="space-y-1">
              <select
                value={selectedCustomer.id}
                onChange={(e) => {
                  const found = MOCK_CUSTOMERS.find((c) => c.id === e.target.value);
                  if (found) setSelectedCustomer(found);
                }}
                className="w-full h-9 px-2.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-900 text-xs outline-hidden"
              >
                {MOCK_CUSTOMERS.map((cust) => (
                  <option key={cust.id} value={cust.id}>
                    {cust.name} ({cust.category})
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                <span>Prop: {selectedCustomer.proprietor}</span>
                <span className="font-medium text-slate-700">{selectedCustomer.phone}</span>
              </div>

              {selectedCustomer.outstandingBalance > 0 && (
                <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-[11px] text-rose-700 flex items-center justify-between">
                  <span>Current Balance Due:</span>
                  <span className="font-bold font-mono">
                    ₹{selectedCustomer.outstandingBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
              Payment Method
            </span>

            <div className="grid grid-cols-3 gap-1.5">
              {(['Cash', 'UPI', 'Card', 'Bank', 'Udhaar'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`py-2 px-2 rounded-lg font-semibold text-xs border transition-all flex flex-col items-center gap-1 ${
                    paymentMode === mode
                      ? mode === 'Udhaar'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{mode}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bill Calculation & TOTAL (Prominent) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 text-xs">
            <div className="space-y-2 pb-3 border-b border-slate-100 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-mono font-medium text-slate-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Special Discount (₹)</span>
                <input
                  type="number"
                  min="0"
                  value={overallDiscount || ''}
                  onChange={(e) => setOverallDiscount(parseInt(e.target.value, 10) || 0)}
                  placeholder="0"
                  className="w-20 h-6 px-1.5 text-right font-mono bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Round Off</span>
                <span className="font-mono">{roundOff >= 0 ? `+₹${roundOff}` : `-₹${Math.abs(roundOff)}`}</span>
              </div>
            </div>

            {/* GRAND TOTAL - VISUALLY PROMINENT */}
            <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Payable
                </span>
                <span className="text-[11px] text-slate-400">
                  Mode: {paymentMode}
                </span>
              </div>
              <div className="font-heading font-extrabold text-2xl text-emerald-400 tabular-nums">
                ₹{roundedTotal.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Action Buttons: SAVE & PRINT, SAVE, SHARE, DRAFT */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSave(true)}
                disabled={cart.length === 0}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>SAVE &amp; PRINT SLIP (Ctrl+P)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSave(false)}
                  disabled={cart.length === 0}
                  className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save (Ctrl+S)</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  disabled={cart.length === 0}
                  className="py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Share WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Compact Modal (Section 13) */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-4 space-y-3 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-heading font-bold text-sm text-slate-900">Add New Customer</h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Customer / Store Name</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g. Royal Sweets & Bakery"
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="+91 98260 XXXXX"
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
