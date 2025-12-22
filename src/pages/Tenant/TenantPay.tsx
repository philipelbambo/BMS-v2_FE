    import React, { useState, useEffect, useRef } from 'react';
    import { CreditCard, Smartphone, DollarSign, Check, X, ChevronDown, ChevronUp, Download, Eye } from 'lucide-react';

    // Extend Window interface to include ApplePaySession
    declare global {
        interface Window {
        ApplePaySession?: any;
        PaymentRequest?: any;
        }
    }

    // TypeScript interfaces
    interface PaymentMethod {
    id: string;
    type: 'card' | 'apple' | 'google';
    last4?: string;
    brand?: string;
    expiryDate?: string;
    isDefault: boolean;
    }

    interface Transaction {
    id: string;
    date: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    method: string;
    description: string;
    receiptUrl?: string;
    }

    interface PaymentFormData {
    amount: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    }

    type PaymentStep = 'amount' | 'method' | 'details' | 'confirm';

    const PaymentProcessor: React.FC = () => {
    const [step, setStep] = useState<PaymentStep>('amount');
    const [formData, setFormData] = useState<PaymentFormData>({
        amount: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    });
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [expandedTx, setExpandedTx] = useState<string | null>(null);
    const [receiptModal, setReceiptModal] = useState<Transaction | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [supportsApplePay, setSupportsApplePay] = useState(false);
    const [supportsGooglePay, setSupportsGooglePay] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Payment methods
    const paymentMethods: PaymentMethod[] = [
        { id: '1', type: 'card', last4: '4242', brand: 'Visa', expiryDate: '12/25', isDefault: true },
        { id: '2', type: 'card', last4: '5555', brand: 'Mastercard', expiryDate: '08/24', isDefault: false },
        { id: '3', type: 'apple', isDefault: false },
        { id: '4', type: 'google', isDefault: false }
    ];

    // Transaction history
    const transactions: Transaction[] = [
        { id: '1', date: '2024-12-20', amount: 125.50, status: 'completed', method: 'Visa •••• 4242', description: 'Online Purchase', receiptUrl: '#' },
        { id: '2', date: '2024-12-19', amount: 89.99, status: 'completed', method: 'Apple Pay', description: 'Subscription', receiptUrl: '#' },
        { id: '3', date: '2024-12-18', amount: 250.00, status: 'pending', method: 'Mastercard •••• 5555', description: 'Service Payment' },
        { id: '4', date: '2024-12-17', amount: 45.00, status: 'failed', method: 'Visa •••• 4242', description: 'Failed Transaction' }
    ];

    // Detect device capabilities
    useEffect(() => {
        const checkPaymentSupport = () => {
        // Type-safe check for Apple Pay support
        if (typeof window !== 'undefined' && 'ApplePaySession' in window) {
            setSupportsApplePay(true);
        }
        
        // Check for Google Pay/ Payment Request API support
        if (typeof window !== 'undefined' && 'PaymentRequest' in window) {
            setSupportsGooglePay(true);
        }
        };

        const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        };

        checkPaymentSupport();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
        const timer = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(timer);
        }
    }, [toast]);

    // Format card number with spaces
    const formatCardNumber = (value: string): string => {
        const cleaned = value.replace(/\D/g, '');
        const chunks = cleaned.match(/.{1,4}/g) || [];
        return chunks.join(' ').substr(0, 19);
    };

    // Format expiry date
    const formatExpiry = (value: string): string => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
        return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
        }
        return cleaned;
    };

    // Handle form input
    const handleInputChange = (field: keyof PaymentFormData, value: string) => {
        let formatted = value;
        if (field === 'cardNumber') {
        formatted = formatCardNumber(value);
        } else if (field === 'expiryDate') {
        formatted = formatExpiry(value);
        } else if (field === 'cvv') {
        formatted = value.replace(/\D/g, '').substr(0, 4);
        } else if (field === 'amount') {
        formatted = value.replace(/[^\d.]/g, '');
        }
        setFormData(prev => ({ ...prev, [field]: formatted }));
    };

    // Process payment
    const handleProcessPayment = async () => {
        setProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProcessing(false);
        setToast({ message: 'Payment processed successfully!', type: 'success' });
        setStep('amount');
        setFormData({ amount: '', cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
    };

    // Get status color
    const getStatusColor = (status: string): string => {
        switch (status) {
        case 'completed': return 'text-green-600 bg-green-100';
        case 'pending': return 'text-yellow-600 bg-yellow-100';
        case 'failed': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
        }
    };

    // Step indicator
    const steps = ['Amount', 'Method', 'Details', 'Confirm'];
    const stepIndex = steps.indexOf(step.charAt(0).toUpperCase() + step.slice(1));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-[env(safe-area-inset-bottom)]">
        <style>{`
            @supports (padding: max(0px)) {
            .pb-safe { padding-bottom: max(env(safe-area-inset-bottom), 1rem); }
            .fixed-bottom-safe { bottom: max(env(safe-area-inset-bottom), 1rem); }
            }
            
            .touch-manipulation {
            -webkit-tap-highlight-color: transparent;
            tap-highlight-color: transparent;
            }
            
            @media print {
            body { background: white; }
            .no-print { display: none !important; }
            .print-full { page-break-inside: avoid; }
            }

            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

            input[type="number"]::-webkit-inner-spin-button,
            input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
            }

            .card-shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            }

            @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
            }
        `}</style>

        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white shadow-md no-print">
            <div className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Payment Center</h1>
                <DollarSign className="text-indigo-600" size={28} />
            </div>
            
            {/* Step Indicator */}
            <div className="mt-4 flex items-center justify-between">
                {steps.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all ${
                    i <= stepIndex ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                    {i < stepIndex ? <Check size={16} /> : <span className="text-sm">{i + 1}</span>}
                    </div>
                    <span className="hidden lg:inline ml-2 text-sm font-medium">{s}</span>
                    {i < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${i < stepIndex ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                    )}
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6" ref={scrollRef}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Form Section */}
            <div className="lg:col-span-2 space-y-6">
                {/* Payment Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Payment Summary</h2>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                    <p className="text-sm opacity-90 mb-2">Amount to Pay</p>
                    <p className="font-bold" style={{ fontSize: 'clamp(24px, 5vw, 48px)' }}>
                    ${formData.amount || '0.00'}
                    </p>
                </div>
                </div>

                {/* Amount Input */}
                {step === 'amount' && (
                <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Enter Amount</h3>
                    <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">$</span>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none"
                    />
                    </div>
                    <button
                    onClick={() => formData.amount && setStep('method')}
                    disabled={!formData.amount}
                    className="w-full mt-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all touch-manipulation"
                    >
                    Continue
                    </button>
                </div>
                )}

                {/* Payment Method Selection */}
                {step === 'method' && (
                <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h3>
                    
                    {/* Mobile: Horizontal Scroll */}
                    <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-2 px-2">
                    <div className="flex space-x-4 pb-2">
                        {paymentMethods.filter(m => m.type === 'card' || (m.type === 'apple' && supportsApplePay) || (m.type === 'google' && supportsGooglePay)).map(method => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`flex-shrink-0 w-64 p-4 border-2 rounded-xl transition-all ${
                            selectedMethod === method.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white'
                            }`}
                            style={{ minWidth: '256px', minHeight: '144px' }}
                        >
                            {method.type === 'card' ? (
                            <div className="flex flex-col h-full justify-between">
                                <div className="flex items-center justify-between">
                                <CreditCard className="text-gray-700" size={32} />
                                <span className="text-xs font-bold text-gray-600">{method.brand}</span>
                                </div>
                                <div>
                                <p className="text-lg font-mono">•••• •••• •••• {method.last4}</p>
                                <p className="text-sm text-gray-600 mt-1">Expires {method.expiryDate}</p>
                                </div>
                            </div>
                            ) : method.type === 'apple' ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <Smartphone size={32} className="mb-2" />
                                <p className="font-bold">Apple Pay</p>
                            </div>
                            ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <Smartphone size={32} className="mb-2" />
                                <p className="font-bold">Google Pay</p>
                            </div>
                            )}
                        </button>
                        ))}
                    </div>
                    </div>

                    {/* Desktop: Vertical List */}
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                    {paymentMethods.filter(m => m.type === 'card' || (m.type === 'apple' && supportsApplePay) || (m.type === 'google' && supportsGooglePay)).map(method => (
                        <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-6 border-2 rounded-xl transition-all ${
                            selectedMethod === method.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white'
                        }`}
                        style={{ minHeight: '120px' }}
                        >
                        {method.type === 'card' ? (
                            <div className="flex items-center space-x-4">
                            <CreditCard className="text-gray-700" size={40} />
                            <div className="text-left">
                                <p className="text-lg font-mono">•••• {method.last4}</p>
                                <p className="text-sm text-gray-600">{method.brand} - Exp {method.expiryDate}</p>
                            </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center space-x-3">
                            <Smartphone size={32} />
                            <p className="font-bold text-lg">{method.type === 'apple' ? 'Apple Pay' : 'Google Pay'}</p>
                            </div>
                        )}
                        </button>
                    ))}
                    </div>

                    <button
                    onClick={() => selectedMethod && setStep('details')}
                    disabled={!selectedMethod}
                    className="w-full mt-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all touch-manipulation"
                    >
                    Continue
                    </button>
                </div>
                )}

                {/* Payment Details */}
                {step === 'details' && (
                <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Card Details</h3>
                    <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                        type="text"
                        inputMode="numeric"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none font-mono text-lg"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none font-mono text-lg"
                        />
                        </div>
                        
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                            type="password"
                            inputMode="numeric"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none font-mono text-lg"
                        />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input
                        type="text"
                        value={formData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        placeholder="JOHN DOE"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:outline-none uppercase text-lg"
                        />
                    </div>
                    </div>

                    <button
                    onClick={() => formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardholderName && setStep('confirm')}
                    disabled={!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName}
                    className="w-full mt-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all touch-manipulation"
                    >
                    Review Payment
                    </button>
                </div>
                )}

                {/* Confirmation */}
                {step === 'confirm' && (
                <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Confirm Payment</h3>
                    
                    <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-xl">${formData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Card:</span>
                        <span className="font-mono">•••• {formData.cardNumber.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Cardholder:</span>
                        <span>{formData.cardholderName}</span>
                    </div>
                    </div>

                    <button
                    onClick={handleProcessPayment}
                    disabled={processing}
                    className="w-full mt-6 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:bg-gray-300 transition-all flex items-center justify-center touch-manipulation"
                    >
                    {processing ? (
                        <div className="card-shimmer w-24 h-6 rounded" />
                    ) : (
                        <>
                        <Check className="mr-2" size={20} />
                        Process Payment
                        </>
                    )}
                    </button>
                </div>
                )}
            </div>

            {/* Transaction History */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
                
                {/* Mobile: Accordion */}
                <div className="lg:hidden space-y-3 max-h-96 overflow-y-auto">
                    {transactions.map(tx => (
                    <div key={tx.id} className="border-2 border-gray-200 rounded-xl overflow-hidden">
                        <button
                        onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        style={{ minHeight: '44px' }}
                        >
                        <div className="text-left">
                            <p className="font-bold">${tx.amount.toFixed(2)}</p>
                            <p className="text-xs text-gray-600">{tx.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                            {tx.status}
                            </span>
                            {expandedTx === tx.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        </button>
                        
                        {expandedTx === tx.id && (
                        <div className="p-4 bg-gray-50 border-t-2 border-gray-200 space-y-2">
                            <p className="text-sm"><span className="font-medium">Method:</span> {tx.method}</p>
                            <p className="text-sm"><span className="font-medium">Description:</span> {tx.description}</p>
                            {tx.receiptUrl && (
                            <button
                                onClick={() => setReceiptModal(tx)}
                                className="flex items-center space-x-2 text-indigo-600 text-sm font-medium hover:text-indigo-800 touch-manipulation"
                                style={{ minHeight: '44px' }}
                            >
                                <Eye size={16} />
                                <span>View Receipt</span>
                            </button>
                            )}
                        </div>
                        )}
                    </div>
                    ))}
                </div>

                {/* Desktop: Table */}
                <div className="hidden lg:block overflow-auto max-h-96">
                    <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Date</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Amount</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                            <td className="px-3 py-3">{tx.date}</td>
                            <td className="px-3 py-3 font-bold">${tx.amount.toFixed(2)}</td>
                            <td className="px-3 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                                {tx.status}
                            </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Receipt Modal */}
        {receiptModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto print-full">
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center no-print">
                <h4 className="font-bold text-lg">Receipt</h4>
                <button
                    onClick={() => setReceiptModal(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <X size={24} />
                </button>
                </div>
                
                <div className="p-6 space-y-4">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Payment Receipt</h2>
                    <p className="text-gray-600 mt-2">Transaction ID: {receiptModal.id}</p>
                </div>
                
                <div className="border-2 border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{receiptModal.date}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-xl">${receiptModal.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{receiptModal.method}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium">{receiptModal.description}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(receiptModal.status)}`}>
                        {receiptModal.status}
                    </span>
                    </div>
                </div>

                <button
                    onClick={() => window.print()}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center justify-center no-print touch-manipulation"
                >
                    <Download className="mr-2" size={20} />
                    Print Receipt
                </button>
                </div>
            </div>
            </div>
        )}

        {/* Toast Notification */}
        {toast && (
            <div className={`fixed ${isMobile ? 'top-20' : 'bottom-6'} right-6 z-50 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in max-w-sm`}>
            {toast.type === 'success' ? <Check size={24} /> : <X size={24} />}
            <span className="font-medium">{toast.message}</span>
            </div>
        )}
        </div>
    );
    };

    export default PaymentProcessor;