import React, { useState, useEffect, useRef } from 'react';
import { Search, DollarSign, CheckCircle, AlertCircle, Clock, X, Menu, Download, Receipt, Printer } from 'lucide-react';

// Define the Tenant type
interface Payment {
date: string;
amount: number;
method: string;
}

interface Tenant {
id: number;
name: string;
room: string;
rent: number;
status: 'paid' | 'unpaid';
dueDate: string;
lastPaid: string;
paymentHistory: Payment[];
}

// Helper function to format currency as PHP
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
};

// Mock API Service
const mockTenantsData: Tenant[] = [
{ id: 1, name: 'John Anderson', room: '101', rent: 8000, status: 'unpaid', dueDate: '2025-01-01', lastPaid: '2024-12-01', paymentHistory: [
    { date: '2024-12-01', amount: 8000, method: 'Bank Transfer' },
    { date: '2024-11-01', amount: 8000, method: 'Cash' },
    { date: '2024-10-01', amount: 8000, method: 'Bank Transfer' }
]},
{ id: 2, name: 'Sarah Mitchell', room: '102', rent: 8500, status: 'paid', dueDate: '2025-01-01', lastPaid: '2024-12-20', paymentHistory: [
    { date: '2024-12-20', amount: 8500, method: 'Bank Transfer' },
    { date: '2024-11-18', amount: 8500, method: 'Bank Transfer' },
    { date: '2024-10-15', amount: 8500, method: 'Bank Transfer' }
]},
{ id: 3, name: 'Michael Chen', room: '103', rent: 8000, status: 'unpaid', dueDate: '2025-01-01', lastPaid: '2024-12-01', paymentHistory: [
    { date: '2024-12-01', amount: 8000, method: 'Cash' },
    { date: '2024-11-01', amount: 8000, method: 'Cash' }
]},
{ id: 4, name: 'Emily Rodriguez', room: '201', rent: 9000, status: 'paid', dueDate: '2025-01-01', lastPaid: '2024-12-18', paymentHistory: [
    { date: '2024-12-18', amount: 9000, method: 'Bank Transfer' },
    { date: '2024-11-20', amount: 9000, method: 'Bank Transfer' }
]},
{ id: 5, name: 'David Thompson', room: '202', rent: 8500, status: 'unpaid', dueDate: '2025-01-01', lastPaid: '2024-12-01', paymentHistory: [
    { date: '2024-12-01', amount: 8500, method: 'Cash' }
]},
{ id: 6, name: 'Lisa Wang', room: '203', rent: 9000, status: 'paid', dueDate: '2025-01-01', lastPaid: '2024-12-19', paymentHistory: [
    { date: '2024-12-19', amount: 9000, method: 'Bank Transfer' }
]},
{ id: 7, name: 'James Wilson', room: '301', rent: 9500, status: 'unpaid', dueDate: '2025-01-01', lastPaid: '2024-12-01', paymentHistory: [
    { date: '2024-12-01', amount: 9500, method: 'Bank Transfer' }
]},
{ id: 8, name: 'Maria Garcia', room: '302', rent: 8500, status: 'paid', dueDate: '2025-01-01', lastPaid: '2024-12-17', paymentHistory: [
    { date: '2024-12-17', amount: 8500, method: 'Cash' }
]}
];

const PaymentsBillingDashboard = () => {
const [tenants, setTenants] = useState<Tenant[]>(mockTenantsData);
const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
const [searchQuery, setSearchQuery] = useState('');
const [filterStatus, setFilterStatus] = useState('all');
const [sidebarOpen, setSidebarOpen] = useState(true);
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentMethod, setPaymentMethod] = useState('bank-transfer');
const [paymentAmount, setPaymentAmount] = useState('');
const receiptRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    if (tenants.length > 0 && !selectedTenant) {
    setSelectedTenant(tenants[0] as Tenant);
    }
}, [tenants, selectedTenant]);

// Filter and categorize tenants
const categorizedTenants = {
    unpaid: tenants.filter(t => t.status === 'unpaid'),
    paid: tenants.filter(t => t.status === 'paid')
};

const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tenant.room.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || tenant.status === filterStatus;
    return matchesSearch && matchesFilter;
});

// Calculate statistics
const totalUnpaid = categorizedTenants.unpaid.reduce((sum, t) => sum + t.rent, 0);
const totalPaid = categorizedTenants.paid.reduce((sum, t) => sum + t.rent, 0);
const totalExpected = tenants.reduce((sum, t) => sum + t.rent, 0);

const handleMarkAsPaid = () => {
    if (!selectedTenant) return;
    
    const amount = parseFloat(paymentAmount) || selectedTenant.rent;
    const newPayment = {
    date: new Date().toISOString().split('T')[0],
    amount: amount,
    method: paymentMethod === 'bank-transfer' ? 'Bank Transfer' : 'Cash'
    };

    setTenants(tenants.map(tenant => {
    if (tenant.id === selectedTenant.id) {
        return {
        ...tenant,
        status: 'paid',
        lastPaid: newPayment.date,
        paymentHistory: [newPayment, ...tenant.paymentHistory]
        };
    }
    return tenant;
    }));

    setSelectedTenant({
    ...selectedTenant,
    status: 'paid',
    lastPaid: newPayment.date,
    paymentHistory: [newPayment, ...selectedTenant.paymentHistory]
    } as Tenant);

    setShowPaymentModal(false);
    setPaymentAmount('');
};

const handleMarkAsUnpaid = () => {
    if (!selectedTenant) return;

    setTenants(tenants.map(tenant => {
    if (tenant.id === selectedTenant.id) {
        return { ...tenant, status: 'unpaid' };
    }
    return tenant;
    }));

    setSelectedTenant({ ...selectedTenant, status: 'unpaid' } as Tenant);
};

const handlePrintReceipt = () => {
    if (!selectedTenant) return;
    
    const latestPayment = selectedTenant.paymentHistory[0];
    if (latestPayment) {
        // Create a new window with just the receipt content
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Payment Receipt</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            max-width: 800px; 
                            margin: 0 auto; 
                            padding: 20px; 
                        }
                        .receipt-header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            border-bottom: 2px solid #333; 
                            padding-bottom: 15px; 
                        }
                        .receipt-details { 
                            display: grid; 
                            grid-template-columns: 1fr 1fr; 
                            gap: 20px; 
                            margin-bottom: 30px; 
                        }
                        .detail-item { 
                            margin-bottom: 10px; 
                        }
                        .detail-label { 
                            font-weight: bold; 
                            color: #666; 
                        }
                        .detail-value { 
                            font-size: 16px; 
                        }
                        .amount { 
                            font-size: 18px; 
                            font-weight: bold; 
                            color: #000; 
                        }
                        .status-paid { 
                            color: green; 
                            font-weight: bold; 
                        }
                        .footer { 
                            text-align: center; 
                            margin-top: 30px; 
                            padding-top: 15px; 
                            border-top: 1px solid #ccc; 
                            color: #666; 
                        }
                    </style>
                </head>
                <body onload="window.print()">
                    <div class="receipt-header">
                        <h1>PAYMENT RECEIPT</h1>
                        <p>BoardingHub Management System</p>
                    </div>
                    
                    <div class="receipt-details">
                        <div class="detail-item">
                            <div class="detail-label">Tenant Name</div>
                            <div class="detail-value">${selectedTenant.name}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Room Number</div>
                            <div class="detail-value">${selectedTenant.room}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Payment Date</div>
                            <div class="detail-value">${latestPayment.date}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Payment Method</div>
                            <div class="detail-value">${latestPayment.method}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Amount</div>
                            <div class="amount detail-value">${formatCurrency(latestPayment.amount)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Status</div>
                            <div class="status-paid detail-value">PAID</div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Thank you for your payment!</p>
                        <p>This is an official receipt. Please keep for your records.</p>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    } else {
        alert('No payment history found for this tenant.');
    }
};

return (
    <div className="min-h-screen bg-white">
    {/* Main Content */}
    <div className="min-h-screen bg-white">
    {/* Header */}
    <header className=" text-black z-40">
        <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-4 col-span-1">
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-2xl font-bold">Payments & Billing</h1>
            </div>
            </div>
            <div className="hidden lg:block"></div>
            <div className="flex items-center gap-3 justify-end col-span-1">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
            </button>
            </div>
        </div>
        </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-w-[1920px] mx-auto">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 lg:col-span-1 w-80 lg:w-auto bg-gray-50 border border-gray-200 rounded-xl transition-transform duration-300 flex flex-col max-h-[calc(100vh-8rem)] lg:max-h-[85vh]`}>
        <div className="p-4 border-b border-gray-200 bg-white">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                placeholder="Search tenants or rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
            />
            </div>
            <div className="flex gap-2 mt-3">
            <button
                onClick={() => setFilterStatus('all')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'all' 
                    ? 'bg-[#001F3D] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                All ({tenants.length})
            </button>
            <button
                onClick={() => setFilterStatus('unpaid')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'unpaid' 
                    ? 'bg-[#001F3D] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                Unpaid ({categorizedTenants.unpaid.length})
            </button>
            <button
                onClick={() => setFilterStatus('paid')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === 'paid' 
                    ? 'bg-[#001F3D] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                Paid ({categorizedTenants.paid.length})
            </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {/* Unpaid Tenants Section */}
            {(filterStatus === 'all' || filterStatus === 'unpaid') && categorizedTenants.unpaid.filter(t => 
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.room.includes(searchQuery)
            ).length > 0 && (
            <div className="mb-4">
                <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <h3 className="font-semibold text-red-900 text-sm uppercase tracking-wide">
                    Unpaid Tenants ({categorizedTenants.unpaid.filter(t => 
                        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.room.includes(searchQuery)
                    ).length})
                    </h3>
                </div>
                </div>
                <div className="p-2">
                {categorizedTenants.unpaid.filter(t => 
                    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.room.includes(searchQuery)
                ).map(tenant => (
                    <button
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant as Tenant)}
                    className={`w-full p-3 mb-2 rounded text-left transition-all ${
                        selectedTenant?.id === tenant.id
                        ? 'bg-[#001F3D] text-white shadow-md'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                    >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold truncate ${
                            selectedTenant?.id === tenant.id ? 'text-white' : 'text-gray-900'
                        }`}>
                            {tenant.name}
                        </h4>
                        <p className={`text-sm ${
                            selectedTenant?.id === tenant.id ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                            Room {tenant.room}
                        </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full whitespace-nowrap ml-2">
                        Unpaid
                        </span>
                    </div>
                    <div className={`flex items-center justify-between text-sm ${
                        selectedTenant?.id === tenant.id ? 'text-white' : 'text-gray-600'
                    }`}>
                        <span className="font-semibold">{formatCurrency(tenant.rent)}/mo</span>
                        <span className="text-xs">Due: Jan 1</span>
                    </div>
                    </button>
                ))}
                </div>
            </div>
            )}

            {/* Paid Tenants Section */}
            {(filterStatus === 'all' || filterStatus === 'paid') && categorizedTenants.paid.filter(t => 
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.room.includes(searchQuery)
            ).length > 0 && (
            <div>
                <div className="px-4 py-3 bg-green-50 border-b border-green-100">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h3 className="font-semibold text-green-900 text-sm uppercase tracking-wide">
                    Paid Tenants ({categorizedTenants.paid.filter(t => 
                        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.room.includes(searchQuery)
                    ).length})
                    </h3>
                </div>
                </div>
                <div className="p-2">
                {categorizedTenants.paid.filter(t => 
                    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.room.includes(searchQuery)
                ).map(tenant => (
                    <button
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant as Tenant)}
                    className={`w-full p-3 mb-2 rounded text-left transition-all ${
                        selectedTenant?.id === tenant.id
                        ? 'bg-[#001F3D] text-white shadow-md'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                    >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold truncate ${
                            selectedTenant?.id === tenant.id ? 'text-white' : 'text-gray-900'
                        }`}>
                            {tenant.name}
                        </h4>
                        <p className={`text-sm ${
                            selectedTenant?.id === tenant.id ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                            Room {tenant.room}
                        </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full whitespace-nowrap ml-2">
                        Paid
                        </span>
                    </div>
                    <div className={`flex items-center justify-between text-sm ${
                        selectedTenant?.id === tenant.id ? 'text-white' : 'text-gray-600'
                    }`}>
                        <span className="font-semibold">{formatCurrency(tenant.rent)}/mo</span>
                        <span className="text-xs">Paid: {tenant.lastPaid}</span>
                    </div>
                    </button>
                ))}
                </div>
            </div>
            )}

            {filteredTenants.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Search className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No tenants found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
            )}
        </div>

        {/* Summary Footer */}
        <div className="p-4 bg-white border-t border-gray-200">
            <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-600">Total Expected:</span>
                <span className="font-bold text-gray-900">{formatCurrency(totalExpected)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-green-600">Total Paid:</span>
                <span className="font-bold text-green-600">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-red-600">Total Unpaid:</span>
                <span className="font-bold text-red-600">{formatCurrency(totalUnpaid)}</span>
            </div>
            </div>
        </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
        />
        )}

        {/* Main Content */}
        <main className="lg:col-span-3 min-h-[85vh]">
        {selectedTenant ? (
            <div className="space-y-6">
            {/* Tenant Header */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-[#001F3D] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {selectedTenant.name.charAt(0)}
                    </div>
                    <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTenant.name}</h2>
                    <p className="text-gray-500 mt-1">Room {selectedTenant.room}</p>
                    </div>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold ${
                    selectedTenant.status === 'paid' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                    {selectedTenant.status === 'paid' ? (
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Paid
                    </div>
                    ) : (
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Unpaid
                    </div>
                    )}
                </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 rounded p-4">
                    <p className="text-gray-500 text-sm mb-1">Monthly Rent</p>
                    <p className="text-2xl font-bold text-[#001F3D]">{formatCurrency(selectedTenant.rent)}</p>
                </div>
                <div className="bg-gray-50 rounded p-4">
                    <p className="text-gray-500 text-sm mb-1">Due Date</p>
                    <p className="text-xl font-semibold text-gray-900">January 1, 2025</p>
                </div>
                <div className="bg-gray-50 rounded p-4">
                    <p className="text-gray-500 text-sm mb-1">Last Payment</p>
                    <p className="text-xl font-semibold text-gray-900">{selectedTenant.lastPaid}</p>
                </div>
                </div>

                <div className="flex gap-3 mt-6">
                {selectedTenant.status === 'unpaid' ? (
                    <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="flex-1 bg-[#001F3D] text-white px-6 py-3 rounded font-semibold hover:bg-[#003366] transition-colors flex items-center justify-center gap-2"
                    >
                    <DollarSign className="w-5 h-5" />
                    Mark as Paid
                    </button>
                ) : (
                    <button 
                    onClick={handleMarkAsUnpaid}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded font-semibold hover:bg-gray-300 transition-colors"
                    >
                    Mark as Unpaid
                    </button>
                )}
                <button 
                onClick={handlePrintReceipt}
                className="px-6 py-3 border-2 border-[#001F3D] text-[#001F3D] rounded font-semibold hover:bg-[#001F3D] hover:text-white transition-colors flex items-center gap-2">
                    <Printer className="w-5 h-5" />
                    Print Receipt
                </button>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Payment History
                </h3>
                <div className="space-y-3">
                {selectedTenant.paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                        <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-gray-500">{payment.method}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-gray-900">{payment.date}</p>
                        <p className="text-sm text-gray-500">Completed</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        ) : (
            <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Select a tenant to view billing details</p>
            </div>
            </div>
        )}
        </main>
    </div>

    {/* Payment Modal */}
    {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Record Payment</h3>
            <button 
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
            </div>

            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount
                </label>
                <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder={selectedTenant?.rent.toString()}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setPaymentMethod('bank-transfer')}
                    className={`p-3 rounded border-2 transition-colors ${
                    paymentMethod === 'bank-transfer'
                        ? 'border-[#001F3D] bg-blue-50 text-[#001F3D]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                    Bank Transfer
                </button>
                <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded border-2 transition-colors ${
                    paymentMethod === 'cash'
                        ? 'border-[#001F3D] bg-blue-50 text-[#001F3D]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                    Cash
                </button>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
                <button
                onClick={handleMarkAsPaid}
                className="w-full bg-[#001F3D] text-white py-3 rounded font-semibold hover:bg-[#003366] transition-colors"
                >
                Confirm Payment
                </button>
            </div>
            </div>
        </div>
        </div>
    )}
    </div>
    </div>
);
};

export default PaymentsBillingDashboard;