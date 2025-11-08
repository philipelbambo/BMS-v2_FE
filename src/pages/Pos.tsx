    import React, { useState, useMemo, useRef } from 'react';
    import { Search, ShoppingCart, Trash2, Plus, Minus, Printer } from 'lucide-react';

    // Define the Product type for TypeScript
    interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    }

    // Define the CartItem type
    interface CartItem extends Product {
    quantity: number;
    }

    // Dummy product data for hardware store
    const products: Product[] = [
    { id: 1, name: 'Portland Cement 40kg', price: 245.00, category: 'Cement' },
    { id: 2, name: 'Marine Plywood 4x8', price: 1350.00, category: 'Wood' },
    { id: 3, name: 'Common Wire Nails 2"', price: 85.00, category: 'Hardware' },
    { id: 4, name: 'Hollow Blocks 4"', price: 12.50, category: 'Blocks' },
    { id: 5, name: 'Deformed Steel Bar 10mm', price: 380.00, category: 'Steel' },
    { id: 6, name: 'Roofing Nails 3"', price: 95.00, category: 'Hardware' },
    { id: 7, name: 'Ordinary Plywood 4x8', price: 850.00, category: 'Wood' },
    { id: 8, name: 'Masonry Cement 40kg', price: 215.00, category: 'Cement' },
    { id: 9, name: 'G.I. Sheet #26', price: 650.00, category: 'Roofing' },
    { id: 10, name: 'PVC Pipes 1/2"', price: 145.00, category: 'Plumbing' },
    { id: 11, name: 'Sand (per bag)', price: 45.00, category: 'Aggregates' },
    { id: 12, name: 'Gravel (per bag)', price: 55.00, category: 'Aggregates' },
    ];

    export default function POSSystem() {
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');
    
    // State for shopping cart
    const [cart, setCart] = useState<CartItem[]>([]);
    
    // State for cash payment input
    const [cashAmount, setCashAmount] = useState('');

    // Ref for receipt content
    const receiptRef = useRef<HTMLDivElement>(null);

    // Filter products based on search query
    const filteredProducts = useMemo(() => {
        return products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // Calculate subtotal of all items in cart
    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cart]);

    // Calculate change (cash - subtotal)
    const change = useMemo(() => {
        const cash = parseFloat(cashAmount) || 0;
        return cash - subtotal;
    }, [cashAmount, subtotal]);

    // Add product to cart or increase quantity if already exists
    const addToCart = (product: Product) => {
        setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        
        if (existingItem) {
            // If item exists, increase quantity
            return prevCart.map(item =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
        } else {
            // If new item, add with quantity 1
            return [...prevCart, { ...product, quantity: 1 }];
        }
        });
    };

    // Update quantity of item in cart
    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity <= 0) {
        removeFromCart(id);
        return;
        }
        
        setCart(prevCart =>
        prevCart.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        )
        );
    };

    // Remove item from cart
    const removeFromCart = (id: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
        setCashAmount('');
    };

    // Print receipt function
    const printReceipt = () => {
        if (cart.length === 0) return;
        
        const printWindow = window.open('', '', 'width=800,height=600');
        if (!printWindow) return;

        const receiptContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt</title>
            <style>
            body {
                font-family: 'Courier New', monospace;
                max-width: 400px;
                margin: 20px auto;
                padding: 20px;
            }
            .receipt-header {
                text-align: center;
                border-bottom: 2px dashed #000;
                padding-bottom: 10px;
                margin-bottom: 15px;
            }
            .receipt-header h1 {
                margin: 0;
                font-size: 24px;
            }
            .receipt-header p {
                margin: 5px 0;
                font-size: 12px;
            }
            .receipt-info {
                margin-bottom: 15px;
                font-size: 12px;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
            }
            .items-table th {
                text-align: left;
                border-bottom: 1px solid #000;
                padding: 5px 0;
                font-size: 12px;
            }
            .items-table td {
                padding: 5px 0;
                font-size: 12px;
            }
            .item-name {
                max-width: 200px;
            }
            .text-right {
                text-align: right;
            }
            .totals {
                border-top: 2px solid #000;
                padding-top: 10px;
                margin-top: 10px;
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                font-size: 14px;
            }
            .total-row.grand-total {
                font-weight: bold;
                font-size: 18px;
                border-top: 1px solid #000;
                padding-top: 10px;
                margin-top: 5px;
            }
            .receipt-footer {
                text-align: center;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 2px dashed #000;
                font-size: 12px;
            }
            @media print {
                body {
                margin: 0;
                padding: 10px;
                }
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
            <p>Date: ${new Date().toLocaleDateString('en-PH', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</p>
            <p>Time: ${new Date().toLocaleTimeString('en-PH')}</p>
            <p>Transaction #: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
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
                ${cart.map(item => `
                <tr>
                    <td class="item-name">${item.name}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">₱${item.price.toFixed(2)}</td>
                    <td class="text-right">₱${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
            </table>

            <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₱${subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
                <span>TOTAL:</span>
                <span>₱${subtotal.toFixed(2)}</span>
            </div>
            ${cashAmount ? `
                <div class="total-row">
                <span>Cash:</span>
                <span>₱${parseFloat(cashAmount).toFixed(2)}</span>
                </div>
                <div class="total-row">
                <span>Change:</span>
                <span>₱${change.toFixed(2)}</span>
                </div>
            ` : ''}
            </div>

            <div class="receipt-footer">
            <p>Thank you for your purchase!</p>
            <p>Please come again</p>
            <p>*** This is an official receipt ***</p>
            </div>
        </body>
        </html>
        `;

        printWindow.document.write(receiptContent);
        printWindow.document.close();
        
        // Wait for content to load before printing
        printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
            printWindow.close();
        };
        };
    };

    return (
        <div className="min-h-screen bg-white p-6">
        <div className="w-full min-h-screen">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-red-700 mb-2">
                Point of Sale System
            </h1>
            </div>

            {/* Main POS Layout - Split into two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT SECTION: Product List (2/3 width) */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
                {/* Search Bar */}
                <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredProducts.map(product => (
                    <div
                    key={product.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                    <div className="mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                        {product.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-800 mt-1">
                        {product.name}
                        </h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                        ₱{product.price.toFixed(2)}
                        </span>
                        <button
                        onClick={() => addToCart(product)}
                        className="bg-[#DC0E0E] hover:bg-[#B00B0B] text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                        <Plus size={16} />
                        Add
                        </button>
                    </div>
                    </div>
                ))}
                </div>

                {/* No results message */}
                {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p>No products found matching "{searchQuery}"</p>
                </div>
                )}
            </div>

            {/* RIGHT SECTION: Shopping Cart (1/3 width) */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 h-fit sticky top-6">
                {/* Cart Header */}
                <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="text-[#DC0E0E]" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Cart</h2>
                    <span className="bg-[#DC0E0E] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cart.length}
                    </span>
                </div>
                
                {cart.length > 0 && (
                    <button
                    onClick={clearCart}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Clear cart"
                    >
                    <Trash2 size={20} />
                    </button>
                )}
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                    <ShoppingCart size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Cart is empty</p>
                    </div>
                ) : (
                    cart.map(item => (
                    <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                        <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">
                            {item.name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                            ₱{item.price.toFixed(2)} each
                            </p>
                        </div>
                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-7 h-7 rounded flex items-center justify-center transition-colors"
                            >
                            <Minus size={14} />
                            </button>
                            <span className="font-semibold text-gray-800 w-8 text-center">
                            {item.quantity}
                            </span>
                            <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-7 h-7 rounded flex items-center justify-center transition-colors"
                            >
                            <Plus size={14} />
                            </button>
                        </div>
                        <span className="font-bold text-gray-900">
                            ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                        </div>
                    </div>
                    ))
                )}
                </div>

                {/* Totals Section */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="font-bold text-lg">₱{subtotal.toFixed(2)}</span>
                </div>

                {/* Cash Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cash Amount:
                    </label>
                    <input
                    type="number"
                    placeholder="0.00"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC0E0E] focus:border-transparent"
                    step="0.01"
                    min="0"
                    />
                </div>

                {/* Change Display */}
                {cashAmount && (
                    <div className={`flex justify-between text-lg font-bold ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    <span>Change:</span>
                    <span>₱{change.toFixed(2)}</span>
                    </div>
                )}

                {/* Checkout Button */}
                <button
                    disabled={cart.length === 0}
                    onClick={printReceipt}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 ${
                    cart.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[#DC0E0E] hover:bg-[#B00B0B]'
                    }`}
                >
                    <Printer size={20} />
                    Print Receipt
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }