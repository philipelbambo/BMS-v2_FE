    import React, { useState, useMemo, useRef } from 'react';
    import { Search, ShoppingCart, Trash2, Plus, Minus, Printer, Receipt } from 'lucide-react';

    // Define the Product type for TypeScript
    interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    }

    // Define the CartItem type
    interface CartItem extends Product {
    quantity: number;
    }

    // Dummy product data for hardware store
    const products: Product[] = [
    { id: 1, name: 'Portland Cement 40kg', price: 245.0, category: 'Cement', image: 'https://images.unsplash.com/photo-1588856842195-8863c19e4c84?w=400&h=300&fit=crop' },
    { id: 2, name: 'Marine Plywood 4x8', price: 1350.0, category: 'Wood', image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=300&fit=crop' },
    { id: 3, name: 'Common Wire Nails 2"', price: 85.0, category: 'Hardware', image: 'https://images.unsplash.com/photo-1625519838416-2adc4d00a370?w=400&h=300&fit=crop' },
    { id: 4, name: 'Hollow Blocks 4"', price: 12.5, category: 'Blocks', image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&h=300&fit=crop' },
    { id: 5, name: 'Deformed Steel Bar 10mm', price: 380.0, category: 'Steel', image: 'https://images.unsplash.com/photo-1565984640994-675b1d23ef3f?w=400&h=300&fit=crop' },
    { id: 6, name: 'Roofing Nails 3"', price: 95.0, category: 'Hardware', image: 'https://images.unsplash.com/photo-1622207055775-07c4e5c57c19?w=400&h=300&fit=crop' },
    { id: 7, name: 'Ordinary Plywood 4x8', price: 850.0, category: 'Wood', image: 'https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=400&h=300&fit=crop' },
    { id: 8, name: 'Masonry Cement 40kg', price: 215.0, category: 'Cement', image: 'https://images.unsplash.com/photo-1606744837616-56c7e5d53b23?w=400&h=300&fit=crop' },
    { id: 9, name: 'G.I. Sheet #26', price: 650.0, category: 'Roofing', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop' },
    { id: 10, name: 'PVC Pipes 1/2"', price: 145.0, category: 'Plumbing', image: 'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=400&h=300&fit=crop' },
    { id: 11, name: 'Sand (per bag)', price: 45.0, category: 'Aggregates', image: 'https://images.unsplash.com/photo-1509130298739-651801c76e96?w=400&h=300&fit=crop' },
    { id: 12, name: 'Gravel (per bag)', price: 55.0, category: 'Aggregates', image: 'https://images.unsplash.com/photo-1611348586755-53860f7ae57a?w=400&h=300&fit=crop' },
    ];

    export default function POSSystem() {
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cashAmount, setCashAmount] = useState('');

    // 🔹 Discount states
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
    const [discountValue, setDiscountValue] = useState<string>('');

    // 🔹 Modal states
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showPrintOption, setShowPrintOption] = useState(false);
    const [transactionReceipt, setTransactionReceipt] = useState<string | null>(null);

    const receiptRef = useRef<HTMLDivElement>(null);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // 🔹 Calculate discount amount and discounted subtotal
    const { discountedSubtotal, discountAmount } = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let discountAmt = 0;

        const value = parseFloat(discountValue) || 0;

        if (discountType === 'percentage' && value > 0) {
        discountAmt = (value / 100) * subtotal;
        } else if (discountType === 'fixed' && value > 0) {
        discountAmt = Math.min(value, subtotal); // Can't discount more than subtotal
        }

        const discounted = subtotal - discountAmt;
        return {
        discountedSubtotal: Math.max(0, discounted),
        discountAmount: discountAmt,
        };
    }, [cart, discountType, discountValue]);

    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

    const change = useMemo(() => {
        const cash = parseFloat(cashAmount) || 0;
        return cash - discountedSubtotal;
    }, [cashAmount, discountedSubtotal]);

    // Cart functions (same as before, but cleaned)
    const addToCart = (product: Product) => {
        setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        if (existingItem) {
            return prevCart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            return [...prevCart, { ...product, quantity: 1 }];
        }
        });
    };

    const updateQuantity = (id: number, newQty: number) => {
        if (newQty <= 0) {
        removeFromCart(id);
        return;
        }
        setCart(prev => prev.map(item => (item.id === id ? { ...item, quantity: newQty } : item)));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        setCashAmount('');
        setDiscountValue('');
    };

    // 🔹 STEP 1: Initiate checkout
    const handleCheckout = () => {
        if (cart.length === 0) return;
        if (parseFloat(cashAmount) < discountedSubtotal) {
        alert('⚠️ Insufficient cash!');
        return;
        }
        setShowConfirmation(true);
    };

    // 🔹 STEP 2: Confirm & finalize sale (no print yet)
    const finalizeSale = () => {
        setShowConfirmation(false);

        // 🎯 SALE IS NOW FINALIZED
        // Here you'd typically: call API, log sale, etc.
        // For demo: reset cart & prepare receipt content
        
        const receiptData = generateReceiptContent();
        setTransactionReceipt(receiptData);
        
        // Reset form
        clearCart();
        
        // 🖨️ Now ask: want to print?
        setShowPrintOption(true);
    };

    const cancelSale = () => {
        setShowConfirmation(false);
    };

    // 🔹 Generate receipt HTML (for later printing)
    const generateReceiptContent = (): string => {
        const now = new Date();
        const transactionId = 'TXN' + Math.random().toString(36).substr(2, 8).toUpperCase();

        const itemsHtml = cart.map(item => `
        <tr>
            <td class="item-name">${item.name}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">₱${item.price.toFixed(2)}</td>
            <td class="text-right">₱${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
        `).join('');

        let discountsHtml = '';
        if (discountAmount > 0) {
        discountsHtml = `
            <div class="total-row">
            <span>Discount (${discountType === 'percentage' ? `${discountValue}%` : `₱${parseFloat(discountValue).toFixed(2)}`}):</span>
            <span class="text-red-600">-₱${discountAmount.toFixed(2)}</span>
            </div>
        `;
        }

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt</title>
            <style>
            body { font-family: 'Courier New', monospace; max-width: 400px; margin: 20px auto; padding: 20px; }
            .receipt-header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }
            .receipt-header h1 { margin: 0; font-size: 24px; }
            .receipt-header p { margin: 5px 0; font-size: 12px; }
            .receipt-info { margin-bottom: 15px; font-size: 12px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            .items-table th { text-align: left; border-bottom: 1px solid #000; padding: 5px 0; font-size: 12px; }
            .items-table td { padding: 5px 0; font-size: 12px; }
            .item-name { max-width: 200px; word-wrap: break-word; }
            .text-right { text-align: right; }
            .totals { border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; }
            .total-row.grand-total { font-weight: bold; font-size: 18px; border-top: 1px solid #000; padding-top: 10px; margin-top: 5px; }
            .receipt-footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px dashed #000; font-size: 12px; }
            @media print {
                body { margin: 0; padding: 10px; }
                @page { margin: 0.5cm; }
            }
            </style>
        </head>
        <body>
            <div class="receipt-header">
            <h1>HARDWARE STORE</h1>
            <p>Point of Sale System</p>
            <p>Cagayan de Oro, Philippines</p>
            <p>Tel: (088) 123-4567</p>
            </div>

            <div class="receipt-info">
            <p>Date: ${now.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>Time: ${now.toLocaleTimeString('en-PH')}</p>
            <p>Transaction #: ${transactionId}</p>
            </div>

            <table class="items-table">
            <thead>
                <tr>
                <th>Item</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
            </table>

            <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₱${subtotal.toFixed(2)}</span>
            </div>
            ${discountsHtml}
            <div class="total-row grand-total">
                <span>TOTAL:</span>
                <span>₱${discountedSubtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Cash:</span>
                <span>₱${parseFloat(cashAmount || '0').toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Change:</span>
                <span class="${change >= 0 ? 'text-green-600' : 'text-red-600'}">₱${change.toFixed(2)}</span>
            </div>
            </div>

            <div class="receipt-footer">
            <p>Thank you for your purchase!</p>
            <p>Please come again</p>
            <p>*** This is an official receipt ***</p>
            </div>
        </body>
        </html>
        `;
    };

    // 🔹 Print receipt (only if user chooses)
    const printReceipt = () => {
        if (!transactionReceipt) return;

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
        alert('Pop-up blocked. Please allow pop-ups to print.');
        return;
        }

        printWindow.document.write(transactionReceipt);
        printWindow.document.close();

        printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
        setShowPrintOption(false);
        };
    };

    const skipPrint = () => {
        setShowPrintOption(false);
        setTransactionReceipt(null);
    };

    return (
        <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="w-full min-h-screen">

            {/* Header */}
            <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-red-700">Point of Sale System</h1>
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            {/* LEFT: Products */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 md:p-6">
                {/* Search */}
                <div className="mb-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                    type="text"
                    placeholder="Search products or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>
                </div>

                {/* Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-h-[70vh] overflow-y-auto pr-1">
                {filteredProducts.map(product => (
                    <div
                    key={product.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer overflow-hidden"
                    onClick={() => addToCart(product)}
                    >
                    {/* Product Image */}
                    <div className="w-full h-47 bg-gray-200 overflow-hidden">
                        <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase">{product.category}</span>
                        <h3 className="font-medium text-gray-800 mt-1 text-sm md:text-base truncate">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-gray-900">₱{product.price.toFixed(2)}</span>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1">
                            <Plus size={14} /> Add
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {filteredProducts.length === 0 && (
                <div className="text-center py-10 text-gray-500">No products found for "{searchQuery}"</div>
                )}
            </div>

            {/* RIGHT: Cart & Checkout */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-4">
                {/* Cart Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                    <ShoppingCart className="text-red-600" size={22} />
                    <h2 className="text-lg md:text-xl font-bold text-gray-800">Cart ({cart.length})</h2>
                    </div>
                    {cart.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="text-gray-500 hover:text-red-600"
                        title="Clear cart"
                    >
                        <Trash2 size={18} />
                    </button>
                    )}
                </div>

                {/* Cart Items */}
                <div className="space-y-3 mb-5 max-h-[250px] overflow-y-auto pr-1">
                    {cart.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded p-3 border">
                        <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                            <p className="text-gray-600 text-xs">₱{item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                            <Trash2 size={14} />
                        </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                            <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 w-6 h-6 rounded flex items-center justify-center"
                            >
                            <Minus size={12} />
                            </button>
                            <span className="font-medium w-6 text-center">{item.quantity}</span>
                            <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 w-6 h-6 rounded flex items-center justify-center"
                            >
                            <Plus size={12} />
                            </button>
                        </div>
                        <span className="font-bold">₱{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                    ))}
                    {cart.length === 0 && (
                    <div className="text-center py-6 text-gray-400">
                        <ShoppingCart size={36} className="mx-auto opacity-50 mb-2" />
                        <p>Add items to cart</p>
                    </div>
                    )}
                </div>

                {/* Discount Section */}
                <div className="mb-5 p-3 bg-gray-50 rounded-lg border">
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Receipt size={16} /> Discount
                    </h3>
                    <div className="flex gap-2 mb-2">
                    <button
                        onClick={() => setDiscountType('percentage')}
                        className={`flex-1 py-1.5 rounded text-sm font-medium ${
                        discountType === 'percentage'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        %
                    </button>
                    <button
                        onClick={() => setDiscountType('fixed')}
                        className={`flex-1 py-1.5 rounded text-sm font-medium ${
                        discountType === 'fixed'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        ₱
                    </button>
                    </div>
                    <input
                    type="number"
                    placeholder={discountType === 'percentage' ? 'e.g. 10 for 10%' : 'e.g. 200'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-red-500"
                    min="0"
                    step={discountType === 'percentage' ? '0.1' : '1'}
                    />
                    {discountAmount > 0 && (
                    <p className="text-green-600 text-sm mt-1">
                        Discount: -₱{discountAmount.toFixed(2)}
                    </p>
                    )}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-5">
                    <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount:</span>
                        <span>-₱{discountAmount.toFixed(2)}</span>
                    </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-800 pt-1 border-t">
                    <span>Total:</span>
                    <span>₱{discountedSubtotal.toFixed(2)}</span>
                    </div>

                    {/* Cash Input */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cash Received</label>
                    <input
                        type="number"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                        step="0.01"
                        min="0"
                    />
                    </div>

                    {cashAmount && (
                    <div className={`flex justify-between text-lg font-bold ${
                        change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        <span>Change:</span>
                        <span>₱{change.toFixed(2)}</span>
                    </div>
                    )}
                </div>

                {/* Checkout Button */}
                <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || discountedSubtotal === 0}
                    className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${
                    cart.length === 0 || discountedSubtotal === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                    <Receipt size={20} /> Checkout & Sell
                </button>
                </div>
            </div>
            </div>
        </div>

        {/* 🔹 Confirmation Modal */}
        {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Sale</h3>
                <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{cart.length}</span>
                </div>
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₱{discountAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>₱{discountedSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Cash:</span>
                    <span>₱{parseFloat(cashAmount || '0').toFixed(2)}</span>
                </div>
                <div className={`flex justify-between font-bold text-lg ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                    <span>Change:</span>
                    <span>₱{change.toFixed(2)}</span>
                </div>
                </div>
                <div className="flex gap-3 mt-6">
                <button
                    onClick={finalizeSale}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium"
                >
                    ✅ Confirm & Sell
                </button>
                <button
                    onClick={cancelSale}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded font-medium"
                >
                    ❌ Cancel
                </button>
                </div>
            </div>
            </div>
        )}

        {/* 🔹 Print Option Modal */}
        {showPrintOption && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-5 text-center">
                <Receipt className="mx-auto text-4xl text-gray-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sale Completed!</h3>
                <p className="text-gray-600 mb-5">Would you like to print the receipt?</p>
                <div className="flex gap-3">
                <button
                    onClick={printReceipt}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded font-medium flex items-center justify-center gap-2"
                >
                    <Printer size={18} /> Print Receipt
                </button>
                <button
                    onClick={skipPrint}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2.5 rounded font-medium"
                >
                    Skip
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
    }