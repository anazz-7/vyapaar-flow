import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  X,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle2,
  Boxes,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductItem } from '../types';

export const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(products[0]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Dry Fruits');
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdPurchase, setNewProdPurchase] = useState('');
  const [newProdSelling, setNewProdSelling] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdMinStock, setNewProdMinStock] = useState('20');

  const categories = ['All', 'Dry Fruits', 'Spices', 'Grains', 'Packaged'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  const totalStockValue = products.reduce(
    (sum, p) => sum + p.currentStock * p.purchasePrice,
    0
  );
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStock).length;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const purchase = parseInt(newProdPurchase, 10) || 0;
    const selling = parseInt(newProdSelling, 10) || 0;
    const stock = parseInt(newProdStock, 10) || 0;
    const minStock = parseInt(newProdMinStock, 10) || 10;

    const newProduct: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      sku: newProdSku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      barcode: `890123456${Math.floor(100 + Math.random() * 900)}`,
      category: newProdCategory,
      unit: newProdUnit,
      purchasePrice: purchase,
      sellingPrice: selling,
      currentStock: stock,
      minStock,
      openingStock: stock,
      purchasesQty: 0,
      salesQty: 0,
      adjustmentsQty: 0,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setSelectedProduct(newProduct);
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdSku('');
    setNewProdPurchase('');
    setNewProdSelling('');
    setNewProdStock('');
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
            Products &amp; Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time stock levels, procurement valuation, and movement tracking.
          </p>
        </div>

        <button
          onClick={() => setShowAddProductModal(true)}
          className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Catalog Items
          </span>
          <div className="font-heading font-bold text-2xl text-slate-900 my-1 tabular-nums">
            {products.length} Items
          </div>
          <span className="text-[11px] text-slate-500">Across 4 active categories</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Total Stock Valuation
          </span>
          <div className="font-heading font-bold text-2xl text-slate-900 my-1 tabular-nums">
            ₹{totalStockValue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500">Based on purchase cost</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Low Stock Alerts
          </span>
          <div className="font-heading font-bold text-2xl text-amber-600 my-1 tabular-nums">
            {lowStockCount} Items
          </div>
          <span className="text-[11px] text-amber-700">Below minimum safety threshold</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Stock Health
          </span>
          <div className="font-heading font-bold text-2xl text-emerald-600 my-1 tabular-nums">
            94.2% Optimal
          </div>
          <span className="text-[11px] text-emerald-700">Zero dead stock detected</span>
        </div>
      </div>

      {/* Split View: Products Table (Left) + Stock Movement Drawer/Detail (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Product Table (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50/50">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or SKU..."
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3 text-right">Selling</th>
                  <th className="py-2.5 px-3 text-right">Stock</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-2 text-center w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.currentStock <= p.minStock;
                  const isSelected = selectedProduct?.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-900 block truncate">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.sku} • {p.category}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        ₹{p.sellingPrice}/{p.unit}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        <span className={isLow ? 'text-amber-700' : 'text-slate-900'}>
                          {p.currentStock} {p.unit}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isLow
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>

                      <td className="py-2.5 px-2 text-center text-slate-400">
                        <ChevronRight className="w-4 h-4" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Stock Health & Movement Drawer (5 cols on desktop) (Section 16) */}
        {selectedProduct ? (
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {selectedProduct.sku} • {selectedProduct.category}
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900 mt-0.5">
                  {selectedProduct.name}
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  selectedProduct.currentStock <= selectedProduct.minStock
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {selectedProduct.currentStock <= selectedProduct.minStock
                  ? 'Low Stock Alert'
                  : 'In Stock'}
              </span>
            </div>

            {/* Key Metrics Grid (Section 16) */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Current Stock
                </span>
                <span className="font-heading font-bold text-xl text-slate-900 mt-1 block">
                  {selectedProduct.currentStock} {selectedProduct.unit}
                </span>
                <span className="text-[10px] text-slate-500">
                  Min threshold: {selectedProduct.minStock} {selectedProduct.unit}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Stock Value
                </span>
                <span className="font-heading font-bold text-xl text-slate-900 mt-1 block">
                  ₹{(selectedProduct.currentStock * selectedProduct.purchasePrice).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500">
                  @ ₹{selectedProduct.purchasePrice} buy cost
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Selling Price
                </span>
                <span className="font-mono font-bold text-base text-slate-900 mt-1 block">
                  ₹{selectedProduct.sellingPrice}/{selectedProduct.unit}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  +₹{selectedProduct.sellingPrice - selectedProduct.purchasePrice} margin
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Purchase Price
                </span>
                <span className="font-mono font-bold text-base text-slate-900 mt-1 block">
                  ₹{selectedProduct.purchasePrice}/{selectedProduct.unit}
                </span>
                <span className="text-[10px] text-slate-500">From Mandi vendor</span>
              </div>
            </div>

            {/* Visual Stock Movement Breakdown (Section 16) */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
              <span className="font-heading font-bold text-slate-900 text-xs block">
                Visual Stock Movement Formula
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Opening Stock</span>
                  <span className="font-mono font-semibold">
                    {selectedProduct.openingStock} {selectedProduct.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between text-emerald-700">
                  <span>+ Total Purchases (Stock In)</span>
                  <span className="font-mono font-semibold">
                    +{selectedProduct.purchasesQty} {selectedProduct.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between text-rose-700">
                  <span>− Total Sales (Stock Out)</span>
                  <span className="font-mono font-semibold">
                    −{selectedProduct.salesQty} {selectedProduct.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-500">
                  <span>± Stock Adjustments</span>
                  <span className="font-mono font-semibold">
                    {selectedProduct.adjustmentsQty} {selectedProduct.unit}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
                  <span>= Verified Current Stock</span>
                  <span className="font-heading text-sm text-blue-600">
                    {selectedProduct.currentStock} {selectedProduct.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => alert(`Reorder PO generated for ${selectedProduct.name}!`)}
                className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                + Reorder From Supplier
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
            <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">Select a product</p>
            <p className="text-xs text-slate-400">Click any product in the list to inspect stock movement.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal (Section 13) */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 space-y-3 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-heading font-bold text-sm text-slate-900">Add New Product</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Kashmiri Saffron Extra Pure (Kesar)"
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    placeholder="e.g. KSR-EXT-001"
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs"
                  >
                    <option value="Dry Fruits">Dry Fruits</option>
                    <option value="Spices">Spices</option>
                    <option value="Grains">Grains</option>
                    <option value="Packaged">Packaged</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Purchase Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPurchase}
                    onChange={(e) => setNewProdPurchase(e.target.value)}
                    placeholder="e.g. 350"
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdSelling}
                    onChange={(e) => setNewProdSelling(e.target.value)}
                    placeholder="e.g. 420"
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Opening Stock</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={newProdMinStock}
                    onChange={(e) => setNewProdMinStock(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
