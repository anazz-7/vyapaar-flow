import React, { useState, useEffect } from 'react';
import { Search, X, User, Package, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { INVOICE_DETAILS } from '../data/mockData';
import { ScreenMode } from '../types';
import { useStore } from '../context/StoreContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customerId: string) => void;
  onSelectProduct: (productId: string) => void;
  onSelectInvoice: (invoiceNo: string) => void;
  onNavigate: (mode: ScreenMode) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCustomer,
  onSelectProduct,
  onSelectInvoice,
  onNavigate,
}) => {
  const { storeData, setActiveCustomerId } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchingCustomers = cleanQuery
    ? storeData.customers.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.proprietor.toLowerCase().includes(cleanQuery) ||
          c.phone.includes(cleanQuery)
      )
    : storeData.customers.slice(0, 3);

  const matchingProducts = cleanQuery
    ? storeData.products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.sku.toLowerCase().includes(cleanQuery) ||
          p.barcode.includes(cleanQuery)
      )
    : storeData.products.slice(0, 3);

  const invoiceList = Object.values(INVOICE_DETAILS);
  const matchingInvoices = cleanQuery
    ? invoiceList.filter(
        (inv) =>
          inv.billNo.toLowerCase().includes(cleanQuery) ||
          (inv.customerName && inv.customerName.toLowerCase().includes(cleanQuery))
      )
    : invoiceList.slice(0, 2);


  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers, products, invoices, payments... (e.g. Asra, Almonds, INV-1022)"
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Search Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Customers Section */}
          {matchingCustomers.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Customers (Khata)</span>
                <span className="font-normal lowercase text-slate-400">Jump to passbook</span>
              </div>
              <div className="space-y-1">
                {matchingCustomers.map((cust) => (
                  <button
                    key={cust.id}
                    onClick={() => {
                      setActiveCustomerId(cust.id);
                      onSelectCustomer(cust.id);
                      onNavigate('khata');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{cust.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          Prop: {cust.proprietor} • {cust.phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="font-mono font-bold text-slate-900 block">
                        ₹{cust.outstandingBalance.toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`text-[10px] font-medium ${
                          cust.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {cust.outstandingBalance > 0 ? 'Due Balance' : 'Cleared'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          {matchingProducts.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Products &amp; Inventory</span>
                <span className="font-normal lowercase text-slate-400">View stock health</span>
              </div>
              <div className="space-y-1">
                {matchingProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod.id);
                      onNavigate('products');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{prod.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          SKU: {prod.sku} • Selling: ₹{prod.sellingPrice}/{prod.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="font-mono font-bold text-slate-900 block">
                        {prod.currentStock} {prod.unit}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${
                          prod.currentStock <= prod.minStock ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {prod.currentStock <= prod.minStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoices Section */}
          {matchingInvoices.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Invoices &amp; Bills</span>
              </div>
              <div className="space-y-1">
                {matchingInvoices.map((inv) => (
                  <button
                    key={inv.billNo}
                    onClick={() => {
                      onSelectInvoice(inv.billNo);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate font-mono">
                          #{inv.billNo} • {inv.customerName || 'Customer'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{inv.date}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="font-mono font-bold text-slate-900 block">
                        ₹{inv.grandTotal.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {inv.status || 'Verified'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingCustomers.length === 0 &&
            matchingProducts.length === 0 &&
            matchingInvoices.length === 0 && (
              <div className="py-8 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-medium text-slate-600">No results found for "{query}"</p>
                <p className="text-xs text-slate-400 mt-0.5">Try searching with a customer name, product SKU, or bill number.</p>
              </div>
            )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
                ↵
              </kbd>{' '}
              to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
                esc
              </kbd>{' '}
              to dismiss
            </span>
          </div>
          <span className="font-medium text-slate-400">Global Command Palette</span>
        </div>
      </div>
    </div>
  );
};
