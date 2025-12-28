    import React, { useState, useEffect } from 'react';
    import { 
    Camera, Copy, CheckCircle, Clock, XCircle, Download, Bell, 
    Filter, Upload, X, ChevronDown, Eye, Printer 
    } from 'lucide-react';
    import useBackButtonProtection from '../../hooks/useBackButtonProtection';

    // TypeScript Interfaces
    interface GCashPayment {
    id: string;
    amount: number;
    referenceNumber: string;
    transactionDate: string;
    screenshot?: string;
    status: 'pending' | 'verified' | 'rejected';
    notes?: string;
    }

    interface PersonalPayment {
    id: string;
    amount: number;
    date: string;
    recipient: string;
    receipt?: string;
    notes?: string;
    status: 'pending' | 'verified' | 'rejected';
    }

    interface PaymentSchedule {
    id: string;
    dueDate: string;
    amount: number;
    description: string;
    isPaid: boolean;
    }

    // Custom Hooks
    const usePaymentHistory = () => {
    const [gcashPayments, setGCashPayments] = useState<GCashPayment[]>([
        {
        id: '1',
        amount: 1000,
        referenceNumber: 'BH-101-20231215-7X9K',
        transactionDate: '2023-12-15',
        status: 'verified',
        },
        {
        id: '2',
        amount: 1000,
        referenceNumber: 'BH-101-20231115-2M4P',
        transactionDate: '2023-11-15',
        status: 'verified',
        },
    ]);

    const [personalPayments, setPersonalPayments] = useState<PersonalPayment[]>([
        {
        id: '1',
        amount: 1000,
        date: '2023-10-15',
        recipient: 'Mrs. Santos',
        status: 'verified',
        notes: 'October rent',
        },
    ]);

    return {
        gcashPayments,
        setGCashPayments,
        personalPayments,
        setPersonalPayments,
    };
    };

    const useNotifications = () => {
    const [notifications, setNotifications] = useState<string[]>([
        'Rent due in 3 days - January 2024',
    ]);

    return { notifications, setNotifications };
    };

    const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'gcash' | 'personal'>('gcash');
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState(false);
    const [amount, setAmount] = useState('');
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showNotifications, setShowNotifications] = useState(false);
    
    // Personal Payment States
    const [personalAmount, setPersonalAmount] = useState('');
    const [personalDate, setPersonalDate] = useState('');
    const [recipient, setRecipient] = useState('');
    const [personalReceipt, setPersonalReceipt] = useState<string | null>(null);
    const [personalNotes, setPersonalNotes] = useState('');

    // View Receipt Modal States
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<GCashPayment | PersonalPayment | null>(null);
    const [selectedPaymentType, setSelectedPaymentType] = useState<'gcash' | 'personal'>('gcash');

    const { gcashPayments, setGCashPayments, personalPayments, setPersonalPayments } = usePaymentHistory();
    const { notifications } = useNotifications();

    const gcashNumber = '09123456789';
    const gcashName = 'MARIA SANTOS';
    const [roomNumber, setRoomNumber] = useState('1');

    const generateReferenceNumber = () => {
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `BH-${roomNumber}-${date}-${random}`;
    };

    const [referenceNumber] = useState(generateReferenceNumber());

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateQRCode = () => {
        const qrData = `GCash Payment
    Amount: ₱${amount}
    Reference: ${referenceNumber}
    To: ${gcashName}
    Number: ${gcashNumber}`;
        
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#001F3D';
        ctx.font = '12px monospace';
        ctx.fillText('QR Code', size / 2 - 30, size / 2);
        ctx.fillText('Placeholder', size / 2 - 40, size / 2 + 20);
        }
        
        return canvas.toDataURL();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'gcash' | 'personal') => {
        const file = e.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'gcash') {
            setScreenshot(reader.result as string);
            } else {
            setPersonalReceipt(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
        }
    };

    const handleGCashSubmit = () => {
        if (!amount || !screenshot) {
        alert('Please fill in all required fields');
        return;
        }

        const newPayment: GCashPayment = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        referenceNumber,
        transactionDate: new Date().toISOString().split('T')[0],
        screenshot,
        status: 'pending',
        };

        setGCashPayments([newPayment, ...gcashPayments]);
        setAmount('');
        setScreenshot(null);
        alert('Payment submitted for verification!');
    };

    const handlePersonalSubmit = () => {
        if (!personalAmount || !personalDate || !recipient) {
        alert('Please fill in all required fields');
        return;
        }

        const newPayment: PersonalPayment = {
        id: Date.now().toString(),
        amount: parseFloat(personalAmount),
        date: personalDate,
        recipient,
        receipt: personalReceipt || undefined,
        notes: personalNotes || undefined,
        status: 'pending',
        };

        setPersonalPayments([newPayment, ...personalPayments]);
        setPersonalAmount('');
        setPersonalDate('');
        setRecipient('');
        setPersonalReceipt(null);
        setPersonalNotes('');
        alert('Payment recorded successfully!');
    };

    // 🔴 DELETE FUNCTION — ADDED HERE
    const handleDeletePayment = (type: 'gcash' | 'personal', id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this payment? This cannot be undone.');
        if (!confirmed) return;

        if (type === 'gcash') {
        setGCashPayments(prev => prev.filter(payment => payment.id !== id));
        } else {
        setPersonalPayments(prev => prev.filter(payment => payment.id !== id));
        }
    };

    const viewReceipt = (payment: GCashPayment | PersonalPayment, type: 'gcash' | 'personal') => {
        setSelectedPayment(payment);
        setSelectedPaymentType(type);
        setShowReceiptModal(true);
    };

    const printReceipt = () => {
        window.print();
    };

    const paymentSchedule: PaymentSchedule[] = [
        {
        id: '1',
        dueDate: '2024-01-15',
        amount: 1000,
        description: 'January Rent',
        isPaid: false,
        },
        {
        id: '2',
        dueDate: '2024-01-31',
        amount: 0,
        description: 'WiFi (End of Month)',
        isPaid: false,
        },
        {
        id: '3',
        dueDate: '2024-02-15',
        amount: 1000,
        description: 'February Rent',
        isPaid: false,
        },
    ];

    const getStatusBadge = (status: string) => {
        const styles = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        verified: 'bg-green-100 text-green-800 border-green-300',
        rejected: 'bg-red-100 text-red-800 border-red-300',
        };

        const icons = {
        pending: <Clock size={14} />,
        verified: <CheckCircle size={14} />,
        rejected: <XCircle size={14} />,
        };

        return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
            {icons[status as keyof typeof icons]}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        );
    };

    const filteredGCashPayments = filterStatus === 'all' 
        ? gcashPayments 
        : gcashPayments.filter(p => p.status === filterStatus);

    const filteredPersonalPayments = filterStatus === 'all'
        ? personalPayments
        : personalPayments.filter(p => p.status === filterStatus);

    return (
        <div className="min-h-screen bg-white" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Receipt Modal */}
        {showReceiptModal && selectedPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowReceiptModal(false)}>
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Receipt Content */}
                <div className="p-6" id="receipt-content">
                {/* Receipt Header */}
                <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: '#001F3D' }}>
                    <h2 className="text-2xl font-bold" style={{ color: '#001F3D' }}>Payment Receipt</h2>
                    <p className="text-sm text-gray-600 mt-1">Boarding House Payment</p>
                </div>

                {/* Receipt Details */}
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Receipt No:</span>
                    <span className="text-sm font-semibold" style={{ color: '#001F3D' }}>
                        {selectedPaymentType === 'gcash' 
                        ? (selectedPayment as GCashPayment).referenceNumber 
                        : selectedPayment.id}
                    </span>
                    </div>

                    <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Room Number:</span>
                    <span className="text-sm font-semibold" style={{ color: '#001F3D' }}>
                        {roomNumber === '11' ? 'Room 11 (Pad)' : `Room ${roomNumber}`}
                    </span>
                    </div>

                    <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm font-semibold" style={{ color: '#001F3D' }}>
                        {new Date(
                        selectedPaymentType === 'gcash' 
                            ? (selectedPayment as GCashPayment).transactionDate 
                            : (selectedPayment as PersonalPayment).date
                        ).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                        })}
                    </span>
                    </div>

                    <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <span className="text-sm font-semibold" style={{ color: '#001F3D' }}>
                        {selectedPaymentType === 'gcash' ? 'GCash' : 'Cash'}
                    </span>
                    </div>

                    {selectedPaymentType === 'personal' && (selectedPayment as PersonalPayment).recipient && (
                    <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Paid To:</span>
                        <span className="text-sm font-semibold" style={{ color: '#001F3D' }}>
                        {(selectedPayment as PersonalPayment).recipient}
                        </span>
                    </div>
                    )}

                    <div className="flex justify-between items-start pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                    <span className="text-base font-semibold text-gray-700">Amount:</span>
                    <span className="text-2xl font-bold" style={{ color: '#001F3D' }}>
                        ₱{selectedPayment.amount.toLocaleString()}
                    </span>
                    </div>

                    <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span>
                        {getStatusBadge(selectedPayment.status)}
                    </span>
                    </div>

                    {selectedPaymentType === 'personal' && (selectedPayment as PersonalPayment).notes && (
                    <div className="pt-3 border-t" style={{ borderColor: '#e5e7eb' }}>
                        <p className="text-xs text-gray-600 mb-1">Notes:</p>
                        <p className="text-sm" style={{ color: '#001F3D' }}>
                        {(selectedPayment as PersonalPayment).notes}
                        </p>
                    </div>
                    )}
                </div>

                {/* Proof Images */}
                {selectedPaymentType === 'gcash' && (selectedPayment as GCashPayment).screenshot && (
                    <div className="mb-6">
                    <p className="text-sm font-semibold mb-2" style={{ color: '#001F3D' }}>Transaction Screenshot:</p>
                    <img 
                        src={(selectedPayment as GCashPayment).screenshot} 
                        alt="Transaction proof" 
                        className="w-full rounded-lg border"
                        style={{ borderColor: '#e5e7eb' }}
                    />
                    </div>
                )}

                {selectedPaymentType === 'personal' && (selectedPayment as PersonalPayment).receipt && (
                    <div className="mb-6">
                    <p className="text-sm font-semibold mb-2" style={{ color: '#001F3D' }}>Receipt Photo:</p>
                    <img 
                        src={(selectedPayment as PersonalPayment).receipt} 
                        alt="Receipt" 
                        className="w-full rounded-lg border"
                        style={{ borderColor: '#e5e7eb' }}
                    />
                    </div>
                )}

                {/* Receipt Footer */}
                <div className="text-center pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                    <p className="text-xs text-gray-500">Thank you for your payment!</p>
                    <p className="text-xs text-gray-400 mt-1">
                    Generated on {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                    </p>
                </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 p-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                <button
                    onClick={printReceipt}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-white"
                    style={{ backgroundColor: '#001F3D', minHeight: '44px' }}
                >
                    <Printer size={20} />
                    Print Receipt
                </button>
                <button
                    onClick={() => setShowReceiptModal(false)}
                    className="flex-1 py-3 rounded-lg font-medium border"
                    style={{ borderColor: '#001F3D', color: '#001F3D', minHeight: '44px' }}
                >
                    Close
                </button>
                </div>
            </div>
            </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg px-4 py-4" style={{ backgroundColor: '#001F3D' }}>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-300">Room</p>
                    <select
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: 'white', color: '#001F3D', minHeight: '28px' }}
                    >
                    <option value="1">Room 1</option>
                    <option value="2">Room 2</option>
                    <option value="3">Room 3</option>
                    <option value="4">Room 4</option>
                    <option value="5">Room 5</option>
                    <option value="6">Room 6</option>
                    <option value="7">Room 7</option>
                    <option value="8">Room 8</option>
                    <option value="9">Room 9</option>
                    <option value="10">Room 10</option>
                    <option value="11">Room 11 (Pad)</option>
                    </select>
                </div>
                </div>
            </div>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                style={{ minWidth: '44px', minHeight: '44px' }}
            >
                <Bell size={24} className="text-white" />
                {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-lg text-white text-xs flex items-center justify-center font-bold">
                    {notifications.length}
                </span>
                )}
            </button>
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
            <div className="mt-3 bg-white rounded-lg shadow-lg p-3">
                {notifications.map((notif, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2" style={{ color: '#001F3D' }}>
                    <Bell size={16} className="mt-1" />
                    <p className="text-sm">{notif}</p>
                </div>
                ))}
            </div>
            )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b" style={{ borderColor: '#e5e7eb' }}>
            <button
            onClick={() => setActiveTab('gcash')}
            className="flex-1 py-3 text-sm font-medium transition-colors min-w-0"
            style={{
                color: activeTab === 'gcash' ? '#001F3D' : '#6b7280',
                borderBottom: activeTab === 'gcash' ? '3px solid #001F3D' : 'none',
                minHeight: '44px',
            }}
            >
            Pay with GCash
            </button>
            <button
            onClick={() => setActiveTab('personal')}
            className="flex-1 py-3 text-sm font-medium transition-colors min-w-0"
            style={{
                color: activeTab === 'personal' ? '#001F3D' : '#6b7280',
                borderBottom: activeTab === 'personal' ? '3px solid #001F3D' : 'none',
                minHeight: '44px',
            }}
            >
            Personal Payment
            </button>
        </div>

        {/* Payment Schedule */}
        <div className="p-4 border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#001F3D' }}>Upcoming Payments</h3>
            <div className="space-y-2">
            {paymentSchedule.slice(0, 2).map(schedule => (
                <div key={schedule.id} className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#e5e7eb' }}>
                <div>
                    <p className="text-sm font-medium" style={{ color: '#001F3D' }}>{schedule.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Due: {new Date(schedule.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#001F3D' }}>₱{schedule.amount.toLocaleString()}</p>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Content */}
        <div className="p-4">
            {activeTab === 'gcash' ? (
            <div className="space-y-6">
                {/* GCash Number Display */}
                <div className="p-4 rounded-lg border-2" style={{ backgroundColor: '#f0f9ff', borderColor: '#001F3D' }}>
                <p className="text-xs text-gray-600 mb-2">Pay to this GCash number:</p>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
                    <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold" style={{ color: '#001F3D' }}>{gcashNumber}</p>
                    <p className="text-sm text-gray-600 mt-1">{gcashName}</p>
                    </div>
                    <button
                    onClick={() => copyToClipboard(gcashNumber)}
                    className="p-3 rounded-lg transition-colors self-center sm:self-auto"
                    style={{ 
                        backgroundColor: copied ? '#10b981' : '#001F3D',
                        minWidth: '44px',
                        minHeight: '44px',
                    }}
                    >
                    {copied ? <CheckCircle size={20} className="text-white" /> : <Copy size={20} className="text-white" />}
                    </button>
                </div>
                {copied && <p className="text-xs text-green-600 mt-2">Copied to clipboard!</p>}
                </div>

                {/* Payment Form */}
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#001F3D' }}>
                    Amount (₱) *
                    </label>
                    <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e5e7eb', minHeight: '44px' }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#001F3D' }}>
                    Reference Number
                    </label>
                    <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={referenceNumber}
                        readOnly
                        className="flex-1 px-4 py-3 border rounded-lg bg-gray-50"
                        style={{ borderColor: '#e5e7eb', minHeight: '44px' }}
                    />
                    <button
                        onClick={() => copyToClipboard(referenceNumber)}
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: '#001F3D', minWidth: '44px', minHeight: '44px' }}
                    >
                        <Copy size={20} className="text-white" />
                    </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">I-copy at i-paste sa GCash notes</p>
                </div>

                {amount && (
                    <button
                    onClick={() => setShowQR(!showQR)}
                    className="w-full py-3 rounded-lg font-medium transition-colors"
                    style={{ 
                        backgroundColor: showQR ? '#6b7280' : '#001F3D',
                        color: 'white',
                        minHeight: '44px',
                    }}
                    >
                    {showQR ? 'Hide QR Code' : 'Generate QR Code'}
                    </button>
                )}

                {showQR && amount && (
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <img
                        src={generateQRCode()}
                        alt="QR Code"
                        className="mx-auto mb-3"
                        style={{ width: '200px', height: '200px' }}
                    />
                    <p className="text-xs text-gray-600">Scan with GCash app</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#001F3D' }}>
                    Upload Screenshot *
                    </label>
                    <label
                    className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#001F3D', minHeight: '44px' }}
                    >
                    <Camera size={24} style={{ color: '#001F3D' }} />
                    <span className="text-sm" style={{ color: '#001F3D' }}>
                        {screenshot ? 'Change Screenshot' : 'Upload Screenshot'}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'gcash')}
                        className="hidden"
                    />
                    </label>
                    {screenshot && (
                    <div className="mt-2 relative">
                        <img src={screenshot} alt="Screenshot" className="w-full rounded-lg" />
                        <button
                        onClick={() => setScreenshot(null)}
                        className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                        >
                        <X size={16} className="text-white" />
                        </button>
                    </div>
                    )}
                </div>

                <button
                    onClick={handleGCashSubmit}
                    disabled={!amount || !screenshot}
                    className="w-full py-4 rounded-lg font-bold text-white transition-colors disabled:opacity-50"
                    style={{ 
                    backgroundColor: '#001F3D',
                    minHeight: '44px',
                    }}
                >
                    Submit Payment
                </button>
                </div>
            </div>
            ) : (
            <div className="space-y-6">
                {/* Personal Payment Form */}
                <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#001F3D' }}>
                    Record Cash Payment
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                    Mag-record ng cash payment na direktang binayad
                </p>
                </div>

                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#001F3D' }}>
                    Amount (₱) *
                    </label>
                    <input
                    type="number"
                    value={personalAmount}
                    onChange={(e) => setPersonalAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e5e7eb', minHeight: '44px' }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#001F3D' }}>
                    Date of Payment *
                    </label>
                    <input
                    type="date"
                    value={personalDate}
                    onChange={(e) => setPersonalDate(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e5e7eb', minHeight: '44px' }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#001F3D' }}>
                    Paid To (Recipient) *
                    </label>
                    <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Mrs. Santos"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e5e7eb', minHeight: '44px' }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#001F3D' }}>
                    Notes (Optional)
                    </label>
                    <textarea
                    value={personalNotes}
                    onChange={(e) => setPersonalNotes(e.target.value)}
                    placeholder="Add any additional details..."
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e5e7eb' }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#001F3D' }}>
                    Receipt Photo (Optional)
                    </label>
                    <label
                    className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#001F3D', minHeight: '44px' }}
                    >
                    <Upload size={24} style={{ color: '#001F3D' }} />
                    <span className="text-sm" style={{ color: '#001F3D' }}>
                        {personalReceipt ? 'Change Receipt' : 'Upload Receipt'}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'personal')}
                        className="hidden"
                    />
                    </label>
                    {personalReceipt && (
                    <div className="mt-2 relative">
                        <img src={personalReceipt} alt="Receipt" className="w-full rounded-lg" />
                        <button
                        onClick={() => setPersonalReceipt(null)}
                        className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                        >
                        <X size={16} className="text-white" />
                        </button>
                    </div>
                    )}
                </div>

                <button
                    onClick={handlePersonalSubmit}
                    disabled={!personalAmount || !personalDate || !recipient}
                    className="w-full py-4 rounded-lg font-bold text-white transition-colors disabled:opacity-50"
                    style={{ 
                    backgroundColor: '#001F3D',
                    minHeight: '44px',
                    }}
                >
                    Record Payment
                </button>
                </div>
            </div>
            )}

            {/* Payment History */}
            <div className="mt-8">
            <div className="mb-4">
                <h2 className="text-lg font-bold" style={{ color: '#001F3D' }}>
                Payment History
                </h2>
            </div>

            <div className="space-y-3">
                {activeTab === 'gcash' ? (
                gcashPayments.length > 0 ? (
                    gcashPayments.map(payment => (
                    <div key={payment.id} className="p-4 border rounded-lg" style={{ borderColor: '#e5e7eb' }}>
                        <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <p className="font-bold" style={{ color: '#001F3D' }}>₱{payment.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">{payment.referenceNumber}</p>
                        </div>
                        {getStatusBadge(payment.status)}
                        </div>
                        <p className="text-xs text-gray-600 mb-3">
                        {new Date(payment.transactionDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                        <button
                            onClick={() => viewReceipt(payment, 'gcash')}
                            className="flex items-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium"
                            style={{ borderColor: '#001F3D', color: '#001F3D' }}
                        >
                            <Eye size={16} />
                            View
                        </button>
                        <button
                            onClick={() => handleDeletePayment('gcash', payment.id)}
                            className="flex items-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium text-red-600 border-red-300 hover:bg-red-50"
                        >
                            <XCircle size={16} />
                            Delete
                        </button>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">No payments found</p>
                )
                ) : (
                personalPayments.length > 0 ? (
                    personalPayments.map(payment => (
                    <div key={payment.id} className="p-4 border rounded-lg" style={{ borderColor: '#e5e7eb' }}>
                        <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <p className="font-bold" style={{ color: '#001F3D' }}>₱{payment.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-600 mt-1">Paid to: {payment.recipient}</p>
                        </div>
                        {getStatusBadge(payment.status)}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                        {new Date(payment.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                        </p>
                        {payment.notes && (
                        <p className="text-xs text-gray-600 italic mb-3">Note: {payment.notes}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                        <button
                            onClick={() => viewReceipt(payment, 'personal')}
                            className="flex items-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium"
                            style={{ borderColor: '#001F3D', color: '#001F3D' }}
                        >
                            <Eye size={16} />
                            View
                        </button>
                        <button
                            onClick={() => handleDeletePayment('personal', payment.id)}
                            className="flex items-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium text-red-600 border-red-300 hover:bg-red-50"
                        >
                            <XCircle size={16} />
                            Delete
                        </button>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">No payments recorded</p>
                )
                )}
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default App;