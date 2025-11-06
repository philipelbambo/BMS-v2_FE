    import React, { useState, useEffect } from 'react';
    import { ShoppingCart, Package, TrendingUp, DollarSign, Search, Plus, Minus, Edit2, Save, X, Download, BarChart3, AlertTriangle, RotateCcw, FileText } from 'lucide-react';

    interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    cost: number;
    quantity: number;
    minStock: number;
    sold: number;
    damaged: number;
    issued: number;
    lastUpdated: string;
    }

    interface Transaction {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
    timestamp: string;
    customerName?: string;
    type: 'sale' | 'return' | 'issue' | 'damage';
    }

    interface IssuanceRecord {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    issuedTo: string;
    purpose: string;
    timestamp: string;
    status: 'issued' | 'returned';
    }

    export default function POSInventorySystem() {
    const [products, setProducts] = useState<Product[]>([
        { id: '1', name: 'Cement Bags (50kg)', sku: 'CEM-001', category: 'Building Materials', price: 350, cost: 280, quantity: 150, minStock: 50, sold: 245, damaged: 5, issued: 10, lastUpdated: new Date().toISOString() },
        { id: '2', name: 'Hollow Blocks (4")', sku: 'HB-004', category: 'Building Materials', price: 12, cost: 8, quantity: 2500, minStock: 500, sold: 3850, damaged: 120, issued: 50, lastUpdated: new Date().toISOString() },
        { id: '3', name: 'Hollow Blocks (6")', sku: 'HB-006', category: 'Building Materials', price: 18, cost: 12, quantity: 1800, minStock: 400, sold: 2100, damaged: 85, issued: 30, lastUpdated: new Date().toISOString() },
        { id: '4', name: 'Roofing Sheets (G.I)', sku: 'ROOF-001', category: 'Roofing Materials', price: 450, cost: 350, quantity: 85, minStock: 20, sold: 120, damaged: 8, issued: 5, lastUpdated: new Date().toISOString() },
        { id: '5', name: 'Wood Planks 2x4x10', sku: 'WP-2410', category: 'Lumber', price: 180, cost: 140, quantity: 120, minStock: 30, sold: 280, damaged: 12, issued: 8, lastUpdated: new Date().toISOString() },
        { id: '6', name: 'Plywood 4x8 (1/4")', sku: 'PLY-048-25', category: 'Lumber', price: 520, cost: 420, quantity: 45, minStock: 15, sold: 95, damaged: 4, issued: 3, lastUpdated: new Date().toISOString() },
        { id: '7', name: 'Steel Rebars 10mm', sku: 'REB-010', category: 'Building Materials', price: 85, cost: 65, quantity: 300, minStock: 100, sold: 450, damaged: 15, issued: 20, lastUpdated: new Date().toISOString() },
        { id: '8', name: 'Pliers Heavy Duty', sku: 'TOOL-PL01', category: 'Tools', price: 280, cost: 200, quantity: 12, minStock: 5, sold: 18, damaged: 1, issued: 0, lastUpdated: new Date().toISOString() },
        { id: '9', name: 'Wire Cutters', sku: 'TOOL-WC01', category: 'Tools', price: 220, cost: 160, quantity: 8, minStock: 3, sold: 12, damaged: 0, issued: 0, lastUpdated: new Date().toISOString() },
        { id: '10', name: 'Sand (per cu.m)', sku: 'AGG-SND', category: 'Aggregates', price: 800, cost: 600, quantity: 15, minStock: 5, sold: 45, damaged: 2, issued: 3, lastUpdated: new Date().toISOString() },
        { id: '11', name: 'Gravel (per cu.m)', sku: 'AGG-GRV', category: 'Aggregates', price: 950, cost: 720, quantity: 12, minStock: 5, sold: 38, damaged: 1, issued: 2, lastUpdated: new Date().toISOString() },
        { id: '12', name: 'Paint White 4L', sku: 'PNT-WHT-4L', category: 'Paint & Finishing', price: 680, cost: 520, quantity: 35, minStock: 10, sold: 72, damaged: 3, issued: 1, lastUpdated: new Date().toISOString() },
    ]);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [issuances, setIssuances] = useState<IssuanceRecord[]>([]);
    const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState<'inventory' | 'pos' | 'analytics' | 'issuance' | 'returns'>('inventory');
    
    // Return/Damage Modal States
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnTransactionId, setReturnTransactionId] = useState('');
    const [returnReason, setReturnReason] = useState<'damaged' | 'other'>('damaged');
    const [customerName, setCustomerName] = useState('');
    
    // Issuance Modal States
    const [showIssuanceModal, setShowIssuanceModal] = useState(false);
    const [issuanceProduct, setIssuanceProduct] = useState<Product | null>(null);
    const [issuanceQuantity, setIssuanceQuantity] = useState(1);
    const [issuedTo, setIssuedTo] = useState('');
    const [issuancePurpose, setIssuancePurpose] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const updateQuantity = (id: string, change: number) => {
        setProducts(prev => prev.map(product => 
        product.id === id 
            ? { ...product, quantity: Math.max(0, product.quantity + change), lastUpdated: new Date().toISOString() }
            : product
        ));
    };

    const startEdit = (id: string, currentQty: number) => {
        setEditingId(id);
        setEditValue(currentQty.toString());
    };

    const saveEdit = (id: string) => {
        const newQty = parseInt(editValue);
        if (!isNaN(newQty) && newQty >= 0) {
        setProducts(prev => prev.map(product =>
            product.id === id
            ? { ...product, quantity: newQty, lastUpdated: new Date().toISOString() }
            : product
        ));
        }
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.product.id === product.id);
        if (existingItem) {
        setCart(cart.map(item =>
            item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        } else {
        setCart([...cart, { product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
        removeFromCart(productId);
        } else {
        setCart(cart.map(item =>
            item.product.id === productId
            ? { ...item, quantity }
            : item
        ));
        }
    };

    const processSale = () => {
        if (cart.length === 0) return;
        if (!customerName.trim()) {
        alert('Please enter customer name');
        return;
        }

        const newTransactions: Transaction[] = cart.map(item => ({
        id: `TXN-${Date.now()}-${item.product.id}`,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
        timestamp: new Date().toISOString(),
        customerName: customerName,
        type: 'sale'
        }));

        setTransactions([...newTransactions, ...transactions]);

        setProducts(prev => prev.map(product => {
        const cartItem = cart.find(item => item.product.id === product.id);
        if (cartItem) {
            return {
            ...product,
            quantity: product.quantity - cartItem.quantity,
            sold: product.sold + cartItem.quantity,
            lastUpdated: new Date().toISOString()
            };
        }
        return product;
        }));

        setCart([]);
        setCustomerName('');
        alert('Sale completed successfully!');
    };

    const processReturn = () => {
        const transaction = transactions.find(t => t.id === returnTransactionId);
        if (!transaction) {
        alert('Transaction not found!');
        return;
        }

        const returnTxn: Transaction = {
        id: `RTN-${Date.now()}`,
        productId: transaction.productId,
        productName: transaction.productName,
        quantity: transaction.quantity,
        price: transaction.price,
        total: -transaction.total,
        timestamp: new Date().toISOString(),
        customerName: transaction.customerName,
        type: returnReason === 'damaged' ? 'damage' : 'return'
        };

        setTransactions([returnTxn, ...transactions]);

        setProducts(prev => prev.map(product => {
        if (product.id === transaction.productId) {
            if (returnReason === 'damaged') {
            return {
                ...product,
                damaged: product.damaged + transaction.quantity,
                sold: product.sold - transaction.quantity,
                lastUpdated: new Date().toISOString()
            };
            } else {
            return {
                ...product,
                quantity: product.quantity + transaction.quantity,
                sold: product.sold - transaction.quantity,
                lastUpdated: new Date().toISOString()
            };
            }
        }
        return product;
        }));

        setShowReturnModal(false);
        setReturnTransactionId('');
        setReturnReason('damaged');
        alert('Return processed successfully!');
    };

    const processIssuance = () => {
        if (!issuanceProduct || !issuedTo.trim() || !issuancePurpose.trim()) {
        alert('Please fill all fields');
        return;
        }

        if (issuanceQuantity > issuanceProduct.quantity) {
        alert('Insufficient stock for issuance');
        return;
        }

        const newIssuance: IssuanceRecord = {
        id: `ISS-${Date.now()}`,
        productId: issuanceProduct.id,
        productName: issuanceProduct.name,
        quantity: issuanceQuantity,
        issuedTo: issuedTo,
        purpose: issuancePurpose,
        timestamp: new Date().toISOString(),
        status: 'issued'
        };

        setIssuances([newIssuance, ...issuances]);

        const issuanceTxn: Transaction = {
        id: `ITXN-${Date.now()}`,
        productId: issuanceProduct.id,
        productName: issuanceProduct.name,
        quantity: issuanceQuantity,
        price: 0,
        total: 0,
        timestamp: new Date().toISOString(),
        customerName: issuedTo,
        type: 'issue'
        };

        setTransactions([issuanceTxn, ...transactions]);

        setProducts(prev => prev.map(product => {
        if (product.id === issuanceProduct.id) {
            return {
            ...product,
            quantity: product.quantity - issuanceQuantity,
            issued: product.issued + issuanceQuantity,
            lastUpdated: new Date().toISOString()
            };
        }
        return product;
        }));

        setShowIssuanceModal(false);
        setIssuanceProduct(null);
        setIssuanceQuantity(1);
        setIssuedTo('');
        setIssuancePurpose('');
        alert('Material issued successfully!');
    };

    const markDamaged = (productId: string, quantity: number) => {
        const qty = parseInt(prompt(`Enter quantity to mark as damaged (max: ${quantity})`) || '0');
        if (qty > 0 && qty <= quantity) {
        setProducts(prev => prev.map(product => {
            if (product.id === productId) {
            return {
                ...product,
                quantity: product.quantity - qty,
                damaged: product.damaged + qty,
                lastUpdated: new Date().toISOString()
            };
            }
            return product;
        }));

        const product = products.find(p => p.id === productId);
        if (product) {
            const damageTxn: Transaction = {
            id: `DMG-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            quantity: qty,
            price: 0,
            total: 0,
            timestamp: new Date().toISOString(),
            type: 'damage'
            };
            setTransactions([damageTxn, ...transactions]);
        }
        
        alert('Items marked as damaged');
        }
    };

    const getStockStatus = (product: Product) => {
        if (product.quantity === 0) return { label: 'OUT OF STOCK', color: 'bg-red-100 text-red-800 border-red-300' };
        if (product.quantity <= product.minStock) return { label: 'LOW STOCK', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
        return { label: 'IN STOCK', color: 'bg-green-100 text-green-800 border-green-300' };
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sold), 0);
    const totalCost = products.reduce((sum, p) => sum + (p.cost * p.sold), 0);
    const totalProfit = totalRevenue - totalCost;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.cost * p.quantity), 0);
    const totalDamaged = products.reduce((sum, p) => sum + p.damaged, 0);
    const totalIssued = products.reduce((sum, p) => sum + p.issued, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const exportInventory = () => {
        const headers = ['SKU', 'Product Name', 'Category', 'Price', 'Cost', 'Quantity', 'Min Stock', 'Sold', 'Damaged', 'Issued', 'Revenue', 'Profit', 'Status'];
        const rows = products.map(p => {
        const status = getStockStatus(p);
        const revenue = p.price * p.sold;
        const profit = revenue - (p.cost * p.sold);
        return [p.sku, p.name, p.category, p.price, p.cost, p.quantity, p.minStock, p.sold, p.damaged, p.issued, revenue, profit, status.label];
        });
        
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pos_inventory_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-white p-8">
        <div className="max-w-8xl mx-auto">
            {/* Header */}
            <div className="mb-8 border-b-2 border-black pb-6">
            <div className="flex items-center justify-between">
                <div>
                <div className="flex items-center gap-3 mb-2">
                    <ShoppingCart className="w-10 h-10 text-black" />
                    <h1 className="text-4xl font-bold text-black">POS INVENTORY SYSTEM</h1>
                </div>
                <p className="text-black text-sm mt-2">Point of Sale & Real-time Inventory Management</p>
                </div>
                <div className="text-right">
                <div className="text-2xl font-bold text-black">
                    {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-black">
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                </div>
            </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-0 mb-8 border-2 border-black">
            <button
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 py-4 px-4 font-bold transition-colors ${
                activeTab === 'inventory' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
                <Package className="w-5 h-5 inline mr-2" />
                INVENTORY
            </button>
            <button
                onClick={() => setActiveTab('pos')}
                className={`flex-1 py-4 px-4 font-bold transition-colors border-x-2 border-black ${
                activeTab === 'pos' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                POS
            </button>
            <button
                onClick={() => setActiveTab('issuance')}
                className={`flex-1 py-4 px-4 font-bold transition-colors border-r-2 border-black ${
                activeTab === 'issuance' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
                <FileText className="w-5 h-5 inline mr-2" />
                ISSUANCE
            </button>
            <button
                onClick={() => setActiveTab('returns')}
                className={`flex-1 py-4 px-4 font-bold transition-colors border-r-2 border-black ${
                activeTab === 'returns' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                RETURNS
            </button>
            <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-4 px-4 font-bold transition-colors ${
                activeTab === 'analytics' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
                <BarChart3 className="w-5 h-5 inline mr-2" />
                ANALYTICS
            </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="border-2 border-black p-4">
                <div className="text-sm text-black mb-1">Total Revenue</div>
                <div className="text-2xl font-bold text-black">₱{totalRevenue.toLocaleString()}</div>
            </div>
            <div className="border-2 border-black p-4">
                <div className="text-sm text-black mb-1">Total Profit</div>
                <div className="text-2xl font-bold text-black">₱{totalProfit.toLocaleString()}</div>
            </div>
            <div className="border-2 border-black p-4">
                <div className="text-sm text-black mb-1">Inventory Value</div>
                <div className="text-2xl font-bold text-black">₱{totalInventoryValue.toLocaleString()}</div>
            </div>
            <div className="border-2 border-black p-4">
                <div className="text-sm text-black mb-1">Damaged Items</div>
                <div className="text-2xl font-bold text-red-600">{totalDamaged}</div>
            </div>
            <div className="border-2 border-black p-4">
                <div className="text-sm text-black mb-1">Issued Items</div>
                <div className="text-2xl font-bold text-blue-600">{totalIssued}</div>
            </div>
            </div>

            {/* INVENTORY TAB */}
            {activeTab === 'inventory' && (
            <>
                <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-black" />
                    <input
                    type="text"
                    placeholder="Search by name, SKU, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-black text-black placeholder-gray-400 focus:outline-none"
                    />
                </div>
                <button
                    onClick={exportInventory}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Export
                </button>
                </div>

                <div className="border-2 border-black">
                <table className="w-full">
                    <thead className="bg-black text-white">
                    <tr>
                        <th className="px-4 py-4 text-left font-bold">SKU</th>
                        <th className="px-4 py-4 text-left font-bold">PRODUCT</th>
                        <th className="px-4 py-4 text-left font-bold">CATEGORY</th>
                        <th className="px-4 py-4 text-right font-bold">PRICE</th>
                        <th className="px-4 py-4 text-center font-bold">QTY</th>
                        <th className="px-4 py-4 text-center font-bold">SOLD</th>
                        <th className="px-4 py-4 text-center font-bold">DAMAGED</th>
                        <th className="px-4 py-4 text-center font-bold">ISSUED</th>
                        <th className="px-4 py-4 text-center font-bold">STATUS</th>
                        <th className="px-4 py-4 text-center font-bold">ACTIONS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map((product, index) => {
                        const status = getStockStatus(product);
                        return (
                        <tr key={product.id} className={`border-t-2 border-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-3 text-black text-sm font-mono">{product.sku}</td>
                            <td className="px-4 py-3 text-black font-semibold">{product.name}</td>
                            <td className="px-4 py-3 text-black text-sm">{product.category}</td>
                            <td className="px-4 py-3 text-right text-black font-bold">₱{product.price.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                            {editingId === product.id ? (
                                <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-20 px-2 py-1 border-2 border-black text-center text-black"
                                autoFocus
                                />
                            ) : (
                                <span className="text-black font-bold">{product.quantity}</span>
                            )}
                            </td>
                            <td className="px-4 py-3 text-center text-black font-semibold">{product.sold}</td>
                            <td className="px-4 py-3 text-center text-red-600 font-semibold">{product.damaged}</td>
                            <td className="px-4 py-3 text-center text-blue-600 font-semibold">{product.issued}</td>
                            <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 text-xs font-bold border inline-block ${status.color}`}>
                                {status.label}
                            </span>
                            </td>
                            <td className="px-4 py-3">
                            {editingId === product.id ? (
                                <div className="flex items-center justify-center gap-1">
                                <button
                                    onClick={() => saveEdit(product.id)}
                                    className="p-2 bg-black text-white hover:bg-gray-800"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="p-2 border-2 border-black text-black hover:bg-gray-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-1">
                                <button
                                    onClick={() => updateQuantity(product.id, -1)}
                                    className="p-2 border-2 border-black text-black hover:bg-gray-100"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => startEdit(product.id, product.quantity)}
                                    className="p-2 border-2 border-black text-black hover:bg-gray-100"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => updateQuantity(product.id, 1)}
                                    className="p-2 bg-black text-white hover:bg-gray-800"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => markDamaged(product.id, product.quantity)}
                                    className="p-2 bg-red-600 text-white hover:bg-red-700"
                                    title="Mark as Damaged"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                </button>
                                </div>
                            )}
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
                </div>
            </>
            )}

            {/* POS TAB */}
            {activeTab === 'pos' && (
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                <h2 className="text-2xl font-bold text-black mb-4 border-b-2 border-black pb-2">PRODUCTS</h2>
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                    {products.filter(p => p.quantity > 0).map(product => (
                    <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="border-2 border-black p-4 hover:bg-gray-100 transition-colors text-left"
                    >
                        <div className="font-bold text-black mb-1">{product.name}</div>
                        <div className="text-sm text-black mb-2">{product.sku}</div>
                        <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-black">₱{product.price.toLocaleString()}</span>
                        <span className="text-sm text-black">Stock: {product.quantity}</span>
                        </div>
                    </button>
                    ))}
                </div>
                </div>

                <div className="border-2 border-black p-6">
                <h2 className="text-2xl font-bold text-black mb-4 border-b-2 border-black pb-2">CART</h2>
                
                <div className="mb-4">
                    <label className="block text-black text-sm font-bold mb-2">Customer Name:</label>
                    <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full px-3 py-2 border-2 border-black text-black placeholder-gray-400 focus:outline-none"
                    />
                </div>

                <div className="space-y-3 mb-6 max-h-[350px] overflow-y-auto">
                    {cart.map(item => (
                    <div key={item.product.id} className="border border-black p-3">
                        <div className="font-semibold text-black text-sm mb-2">{item.product.name}</div>
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 border border-black hover:bg-gray-100"
                            >
                            <Minus className="w-3 h-3 text-black" />
                            </button>
                            <span className="text-black font-bold w-8 text-center">{item.quantity}</span>
                            <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 bg-black text-white hover:bg-gray-800"
                            >
                            <Plus className="w-3 h-3" />
                            </button>
                        </div>
                        <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-black hover:bg-gray-100 p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        </div>
                        <div className="text-right text-black font-bold">
                        ₱{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                    </div>
                    ))}
                </div>

                {cart.length === 0 && (
                    <div className="text-center text-black py-8">Cart is empty</div>
                )}

                <div className="border-t-2 border-black pt-4 mb-4">
                    <div className="flex justify-between text-black mb-2">
                    <span>Items:</span>
                    <span className="font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-black">
                    <span>TOTAL:</span>
                    <span>₱{cartTotal.toLocaleString()}</span>
                    </div>
                </div>

                <button
                    onClick={processSale}
                    disabled={cart.length === 0}
                    className={`w-full py-4 font-bold text-lg ${
                    cart.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    } transition-colors`}
                >
                    COMPLETE SALE
                </button>
                </div>
            </div>
            )}

            {/* ISSUANCE TAB */}
            {activeTab === 'issuance' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">MATERIAL ISSUANCE</h2>
                <button
                    onClick={() => setShowIssuanceModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800"
                >
                    <Plus className="w-5 h-5" />
                    New Issuance
                </button>
                </div>

                <div className="border-2 border-black">
                <table className="w-full">
                    <thead className="bg-black text-white">
                    <tr>
                        <th className="px-4 py-4 text-left font-bold">ID</th>
                        <th className="px-4 py-4 text-left font-bold">PRODUCT</th>
                        <th className="px-4 py-4 text-center font-bold">QUANTITY</th>
                        <th className="px-4 py-4 text-left font-bold">ISSUED TO</th>
                        <th className="px-4 py-4 text-left font-bold">PURPOSE</th>
                        <th className="px-4 py-4 text-left font-bold">DATE</th>
                        <th className="px-4 py-4 text-center font-bold">STATUS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {issuances.map((issuance, index) => (
                        <tr key={issuance.id} className={`border-t-2 border-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3 text-black text-sm font-mono">{issuance.id}</td>
                        <td className="px-4 py-3 text-black font-semibold">{issuance.productName}</td>
                        <td className="px-4 py-3 text-center text-black font-bold">{issuance.quantity}</td>
                        <td className="px-4 py-3 text-black">{issuance.issuedTo}</td>
                        <td className="px-4 py-3 text-black">{issuance.purpose}</td>
                        <td className="px-4 py-3 text-black text-sm">
                            {new Date(issuance.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 text-xs font-bold border inline-block ${
                            issuance.status === 'issued' 
                                ? 'bg-blue-100 text-blue-800 border-blue-300' 
                                : 'bg-green-100 text-green-800 border-green-300'
                            }`}>
                            {issuance.status.toUpperCase()}
                            </span>
                        </td>
                        </tr>
                    ))}
                    {issuances.length === 0 && (
                        <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-black">
                            No issuances recorded
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
            )}

            {/* RETURNS TAB */}
            {activeTab === 'returns' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">RETURNS & DAMAGES</h2>
                <button
                    onClick={() => setShowReturnModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800"
                >
                    <RotateCcw className="w-5 h-5" />
                    Process Return
                </button>
                </div>

                <div className="border-2 border-black">
                <table className="w-full">
                    <thead className="bg-black text-white">
                    <tr>
                        <th className="px-4 py-4 text-left font-bold">TRANSACTION ID</th>
                        <th className="px-4 py-4 text-left font-bold">PRODUCT</th>
                        <th className="px-4 py-4 text-center font-bold">QTY</th>
                        <th className="px-4 py-4 text-left font-bold">CUSTOMER</th>
                        <th className="px-4 py-4 text-right font-bold">AMOUNT</th>
                        <th className="px-4 py-4 text-left font-bold">DATE</th>
                        <th className="px-4 py-4 text-center font-bold">TYPE</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions
                        .filter(t => t.type === 'sale')
                        .map((transaction, index) => (
                        <tr key={transaction.id} className={`border-t-2 border-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-3 text-black text-sm font-mono">{transaction.id}</td>
                            <td className="px-4 py-3 text-black font-semibold">{transaction.productName}</td>
                            <td className="px-4 py-3 text-center text-black font-bold">{transaction.quantity}</td>
                            <td className="px-4 py-3 text-black">{transaction.customerName || 'N/A'}</td>
                            <td className="px-4 py-3 text-right text-black font-bold">₱{transaction.total.toLocaleString()}</td>
                            <td className="px-4 py-3 text-black text-sm">
                            {new Date(transaction.timestamp).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 text-xs font-bold border inline-block bg-green-100 text-green-800 border-green-300">
                                SALE
                            </span>
                            </td>
                        </tr>
                        ))}
                    {transactions.filter(t => t.type === 'sale').length === 0 && (
                        <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-black">
                            No sales transactions
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>

                <h3 className="text-xl font-bold text-black mt-8 mb-4">RETURN HISTORY</h3>
                <div className="border-2 border-black">
                <table className="w-full">
                    <thead className="bg-black text-white">
                    <tr>
                        <th className="px-4 py-4 text-left font-bold">RETURN ID</th>
                        <th className="px-4 py-4 text-left font-bold">PRODUCT</th>
                        <th className="px-4 py-4 text-center font-bold">QTY</th>
                        <th className="px-4 py-4 text-left font-bold">CUSTOMER</th>
                        <th className="px-4 py-4 text-left font-bold">DATE</th>
                        <th className="px-4 py-4 text-center font-bold">TYPE</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions
                        .filter(t => t.type === 'return' || t.type === 'damage')
                        .map((transaction, index) => (
                        <tr key={transaction.id} className={`border-t-2 border-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-3 text-black text-sm font-mono">{transaction.id}</td>
                            <td className="px-4 py-3 text-black font-semibold">{transaction.productName}</td>
                            <td className="px-4 py-3 text-center text-black font-bold">{transaction.quantity}</td>
                            <td className="px-4 py-3 text-black">{transaction.customerName || 'N/A'}</td>
                            <td className="px-4 py-3 text-black text-sm">
                            {new Date(transaction.timestamp).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 text-xs font-bold border inline-block ${
                                transaction.type === 'damage'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            }`}>
                                {transaction.type === 'damage' ? 'DAMAGED' : 'RETURNED'}
                            </span>
                            </td>
                        </tr>
                        ))}
                    {transactions.filter(t => t.type === 'return' || t.type === 'damage').length === 0 && (
                        <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-black">
                            No returns or damages recorded
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
            <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                <div className="border-2 border-black p-6">
                    <DollarSign className="w-8 h-8 text-black mb-2" />
                    <div className="text-sm text-black mb-1">Total Revenue</div>
                    <div className="text-3xl font-bold text-black">₱{totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-black mt-2">From {products.reduce((sum, p) => sum + p.sold, 0)} units sold</div>
                </div>
                <div className="border-2 border-black p-6">
                    <TrendingUp className="w-8 h-8 text-black mb-2" />
                    <div className="text-sm text-black mb-1">Total Profit</div>
                    <div className="text-3xl font-bold text-black">₱{totalProfit.toLocaleString()}</div>
                    <div className="text-xs text-black mt-2">Profit Margin: {((totalProfit / totalRevenue) * 100).toFixed(1)}%</div>
                </div>
                <div className="border-2 border-black p-6">
                    <Package className="w-8 h-8 text-black mb-2" />
                    <div className="text-sm text-black mb-1">Inventory Value</div>
                    <div className="text-3xl font-bold text-black">₱{totalInventoryValue.toLocaleString()}</div>
                    <div className="text-xs text-black mt-2">{products.length} products in stock</div>
                </div>
                </div>

                <div className="border-2 border-black">
                <div className="bg-black text-white px-6 py-4">
                    <h3 className="text-xl font-bold">TOP SELLING PRODUCTS</h3>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr className="border-t-2 border-black">
                        <th className="px-6 py-3 text-left text-black font-bold">RANK</th>
                        <th className="px-6 py-3 text-left text-black font-bold">PRODUCT</th>
                        <th className="px-6 py-3 text-right text-black font-bold">UNITS SOLD</th>
                        <th className="px-6 py-3 text-right text-black font-bold">REVENUE</th>
                        <th className="px-6 py-3 text-right text-black font-bold">PROFIT</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...products]
                        .sort((a, b) => b.sold - a.sold)
                        .slice(0, 10)
                        .map((product, index) => {
                        const revenue = product.price * product.sold;
                        const profit = revenue - (product.cost * product.sold);
                        return (
                            <tr key={product.id} className={`border-t border-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-6 py-4 text-black font-bold">#{index + 1}</td>
                            <td className="px-6 py-4 text-black font-semibold">{product.name}</td>
                            <td className="px-6 py-4 text-right text-black font-bold">{product.sold}</td>
                            <td className="px-6 py-4 text-right text-black font-bold">₱{revenue.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-black font-bold">₱{profit.toLocaleString()}</td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
                </div>
            </div>
            )}

            {/* Issuance Modal */}
            {showIssuanceModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white border-4 border-black p-8 max-w-2xl w-full mx-4">
                <h2 className="text-2xl font-bold text-black mb-6">ISSUE MATERIAL</h2>
                
                <div className="space-y-4 mb-6">
                    <div>
                    <label className="block text-black font-bold mb-2">Select Product:</label>
                    <select
                        onChange={(e) => {
                        const product = products.find(p => p.id === e.target.value);
                        setIssuanceProduct(product || null);
                        }}
                        className="w-full px-4 py-3 border-2 border-black text-black focus:outline-none"
                    >
                        <option value="">-- Select Product --</option>
                        {products.filter(p => p.quantity > 0).map(product => (
                        <option key={product.id} value={product.id}>
                            {product.name} (Stock: {product.quantity})
                        </option>
                        ))}
                    </select>
                    </div>

                    {issuanceProduct && (
                    <>
                        <div>
                        <label className="block text-black font-bold mb-2">Quantity:</label>
                        <input
                            type="number"
                            min="1"
                            max={issuanceProduct.quantity}
                            value={issuanceQuantity}
                            onChange={(e) => setIssuanceQuantity(parseInt(e.target.value) || 1)}
                            className="w-full px-4 py-3 border-2 border-black text-black focus:outline-none"
                        />
                        </div>

                        <div>
                        <label className="block text-black font-bold mb-2">Issued To:</label>
                        <input
                            type="text"
                            value={issuedTo}
                            onChange={(e) => setIssuedTo(e.target.value)}
                            placeholder="Enter recipient name"
                            className="w-full px-4 py-3 border-2 border-black text-black focus:outline-none"
                        />
                        </div>

                        <div>
                        <label className="block text-black font-bold mb-2">Purpose:</label>
                        <textarea
                            value={issuancePurpose}
                            onChange={(e) => setIssuancePurpose(e.target.value)}
                            placeholder="Enter purpose of issuance"
                            className="w-full px-4 py-3 border-2 border-black text-black focus:outline-none"
                            rows={3}
                        />
                        </div>
                    </>
                    )}
                </div>

                <div className="flex gap-4">
                    <button
                    onClick={processIssuance}
                    className="flex-1 py-3 bg-black text-white font-bold hover:bg-gray-800"
                    >
                    ISSUE MATERIAL
                    </button>
                    <button
                    onClick={() => {
                        setShowIssuanceModal(false);
                        setIssuanceProduct(null);
                        setIssuanceQuantity(1);
                        setIssuedTo('');
                        setIssuancePurpose('');
                    }}
                    className="flex-1 py-3 border-2 border-black text-black font-bold hover:bg-gray-100"
                    >
                    CANCEL
                    </button>
                </div>
                </div>
            </div>
            )}

            {/* Return Modal */}
            {showReturnModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white border-4 border-black p-8 max-w-2xl w-full mx-4">
                <h2 className="text-2xl font-bold text-black mb-6">PROCESS RETURN</h2>
                
                <div className="space-y-4 mb-6">
                    <div>
                    <label className="block text-black font-bold mb-2">Transaction ID:</label>
                    <input
                        type="text"
                        value={returnTransactionId}
                        onChange={(e) => setReturnTransactionId(e.target.value)}
                        placeholder="Enter transaction ID (e.g., TXN-1234567890-1)"
                        className="w-full px-4 py-3 border-2 border-black text-black focus:outline-none"
                    />
                    </div>

                    <div>
                    <label className="block text-black font-bold mb-2">Return Reason:</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 border-2 border-black cursor-pointer hover:bg-gray-100">
                        <input
                            type="radio"
                            name="returnReason"
                            value="damaged"
                            checked={returnReason === 'damaged'}
                            onChange={(e) => setReturnReason(e.target.value as 'damaged' | 'other')}
                            className="w-5 h-5"
                        />
                        <span className="text-black font-semibold">Damaged/Defective (Item will be marked as damaged)</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border-2 border-black cursor-pointer hover:bg-gray-100">
                        <input
                            type="radio"
                            name="returnReason"
                            value="other"
                            checked={returnReason === 'other'}
                            onChange={(e) => setReturnReason(e.target.value as 'damaged' | 'other')}
                            className="w-5 h-5"
                        />
                        <span className="text-black font-semibold">Other reason (Item will be returned to stock)</span>
                        </label>
                    </div>
                    </div>

                    {returnReason === 'damaged' && (
                    <div className="bg-red-50 border-2 border-red-300 p-4">
                        <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-red-800 font-bold mb-1">Damaged Item Return</p>
                            <p className="text-red-700 text-sm">
                            This item will be marked as damaged and will NOT be returned to sellable inventory.
                            The damaged count will be updated in the system.
                            </p>
                        </div>
                        </div>
                    </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <button
                    onClick={processReturn}
                    className="flex-1 py-3 bg-black text-white font-bold hover:bg-gray-800"
                    >
                    PROCESS RETURN
                    </button>
                    <button
                    onClick={() => {
                        setShowReturnModal(false);
                        setReturnTransactionId('');
                        setReturnReason('damaged');
                    }}
                    className="flex-1 py-3 border-2 border-black text-black font-bold hover:bg-gray-100"
                    >
                    CANCEL
                    </button>
                </div>
                </div>
            </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t-2 border-black text-center text-black text-sm">
            <p>© 2025 POS Inventory Management System - Professional Point of Sale Solution</p>
            </div>
        </div>
        </div>
    );
    }