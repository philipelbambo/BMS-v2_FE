    import React, { useState } from 'react';
    import { Search, Upload, Check, X, DollarSign, AlertCircle, TrendingUp, Filter } from 'lucide-react';

    interface PaymentProof {
    id: string;
    file: string;
    uploadedAt: string;
    verified: boolean;
    }

    interface Payment {
    id: string;
    month: string;
    amount: number;
    dueDate: string;
    paidDate: string | null;
    status: 'paid' | 'pending' | 'overdue';
    proofOfPayment?: PaymentProof;
    }

    type Category = 'Social' | 'Affordable' | 'Premium' | 'Deluxe';

    interface Tenant {
    id: string;
    name: string;
    unit: string; // e.g., "Door 1"
    email: string;
    phone: string;
    leaseType: 'month-to-month' | 'fixed';
    monthlyRent: number;
    category: Category; // 🔹 NEW FIELD
    payments: Payment[];
    }

    const RentPaymentsDashboard: React.FC = () => {
    const [selectedUnit, setSelectedUnit] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [selectedTenant, setSelectedTenant] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all'); // 🔹 NEW STATE
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showProofModal, setShowProofModal] = useState<boolean>(false);
    const [selectedProof, setSelectedProof] = useState<{ file: string; tenant: string; month: string } | null>(null);

    const [tenants, setTenants] = useState<Tenant[]>([
        {
        id: '1',
        name: 'John Smith',
        unit: 'Door 1',
        email: 'john@email.com',
        phone: '555-0101',
        leaseType: 'month-to-month',
        monthlyRent: 1500,
        category: 'Affordable',
        payments: [
            { id: 'p1', month: 'November 2025', amount: 1500, dueDate: '2025-11-01', paidDate: '2025-11-01', status: 'paid', proofOfPayment: { id: 'pr1', file: 'receipt_nov.pdf', uploadedAt: '2025-11-01', verified: true } },
            { id: 'p2', month: 'October 2025', amount: 1500, dueDate: '2025-10-01', paidDate: '2025-10-03', status: 'paid', proofOfPayment: { id: 'pr2', file: 'receipt_oct.pdf', uploadedAt: '2025-10-03', verified: true } },
            { id: 'p3', month: 'September 2025', amount: 1500, dueDate: '2025-09-01', paidDate: '2025-09-01', status: 'paid' },
        ]
        },
        {
        id: '2',
        name: 'Sarah Johnson',
        unit: 'Door 2',
        email: 'sarah@email.com',
        phone: '555-0102',
        leaseType: 'fixed',
        monthlyRent: 1800,
        category: 'Premium',
        payments: [
            { id: 'p4', month: 'November 2025', amount: 1800, dueDate: '2025-11-01', paidDate: null, status: 'pending', proofOfPayment: { id: 'pr3', file: 'payment_proof.jpg', uploadedAt: '2025-11-27', verified: false } },
            { id: 'p5', month: 'October 2025', amount: 1800, dueDate: '2025-10-01', paidDate: '2025-10-01', status: 'paid' },
            { id: 'p6', month: 'September 2025', amount: 1800, dueDate: '2025-09-01', paidDate: '2025-09-02', status: 'paid' },
        ]
        },
        {
        id: '3',
        name: 'Michael Chen',
        unit: 'Door 3',
        email: 'michael@email.com',
        phone: '555-0201',
        leaseType: 'month-to-month',
        monthlyRent: 1600,
        category: 'Social',
        payments: [
            { id: 'p7', month: 'November 2025', amount: 1600, dueDate: '2025-11-01', paidDate: null, status: 'overdue' },
            { id: 'p8', month: 'October 2025', amount: 1600, dueDate: '2025-10-01', paidDate: '2025-10-15', status: 'paid' },
            { id: 'p9', month: 'September 2025', amount: 1600, dueDate: '2025-09-01', paidDate: '2025-09-01', status: 'paid' },
        ]
        },
        {
        id: '4',
        name: 'Emily Rodriguez',
        unit: 'Door 4',
        email: 'emily@email.com',
        phone: '555-0202',
        leaseType: 'fixed',
        monthlyRent: 2000,
        category: 'Deluxe',
        payments: [
            { id: 'p10', month: 'November 2025', amount: 2000, dueDate: '2025-11-01', paidDate: '2025-11-01', status: 'paid', proofOfPayment: { id: 'pr4', file: 'bank_transfer.pdf', uploadedAt: '2025-11-01', verified: true } },
            { id: 'p11', month: 'October 2025', amount: 2000, dueDate: '2025-10-01', paidDate: '2025-10-01', status: 'paid' },
            { id: 'p12', month: 'September 2025', amount: 2000, dueDate: '2025-09-01', paidDate: '2025-09-05', status: 'paid' },
        ]
        },
    ]);

    // Summary stats (unchanged)
    const totalRevenue = tenants.reduce((sum, tenant) => 
        sum + tenant.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0), 0
    );

    const overduePayments = tenants.reduce((sum, tenant) => 
        sum + tenant.payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0), 0
    );

    const pendingPayments = tenants.reduce((sum, tenant) => 
        sum + tenant.payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0), 0
    );

    const unverifiedProofs = tenants.reduce((count, tenant) => 
        count + tenant.payments.filter(p => p.proofOfPayment && !p.proofOfPayment.verified).length, 0
    );

    // 🔹 Updated: include category in filters
    const units = ['all', ...new Set(tenants.map(t => t.unit))];
    const months = ['all', ...new Set(tenants.flatMap(t => t.payments.map(p => p.month)))];
    const tenantNames = ['all', ...tenants.map(t => t.name)];
    const categories: (Category | 'all')[] = ['all', 'Social', 'Affordable', 'Premium', 'Deluxe'];

    // 🔹 Updated: include category filter
    const filteredTenants = tenants.filter(tenant => {
        const matchesUnit = selectedUnit === 'all' || tenant.unit === selectedUnit;
        const matchesTenant = selectedTenant === 'all' || tenant.name === selectedTenant;
        const matchesCategory = selectedCategory === 'all' || tenant.category === selectedCategory;
        const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tenant.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tenant.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesUnit && matchesTenant && matchesCategory && matchesSearch;
    });

    const handleVerifyPayment = (tenantId: string, paymentId: string) => {
        setTenants(tenants.map(tenant => {
        if (tenant.id === tenantId) {
            return {
            ...tenant,
            payments: tenant.payments.map(payment => {
                if (payment.id === paymentId && payment.proofOfPayment) {
                return {
                    ...payment,
                    status: 'paid',
                    paidDate: new Date().toISOString().split('T')[0],
                    proofOfPayment: {
                    ...payment.proofOfPayment,
                    verified: true
                    }
                };
                }
                return payment;
            })
            };
        }
        return tenant;
        }));
    };

    const handleRejectPayment = (tenantId: string, paymentId: string) => {
        setTenants(tenants.map(tenant => {
        if (tenant.id === tenantId) {
            return {
            ...tenant,
            payments: tenant.payments.map(payment => {
                if (payment.id === paymentId) {
                return {
                    ...payment,
                    proofOfPayment: undefined
                };
                }
                return payment;
            })
            };
        }
        return tenant;
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
        case 'paid': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'overdue': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent & Payments</h1>
            <p className="text-gray-600">Manage tenant payments and track rental income</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">₱{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                    <DollarSign className="text-blue-600" size={24} />
                </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
                    <p className="text-2xl font-bold text-yellow-600">₱{pendingPayments.toLocaleString()}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                    <TrendingUp className="text-yellow-600" size={24} />
                </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Overdue Payments</p>
                    <p className="text-2xl font-bold text-red-600">₱{overduePayments.toLocaleString()}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                    <AlertCircle className="text-red-600" size={24} />
                </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Unverified Proofs</p>
                    <p className="text-2xl font-bold text-custom-navy">{unverifiedProofs}</p>
                </div>
                <div className="bg-custom-navy p-3 rounded-full">
                    <Upload className="text-white" size={24} />
                </div>
                </div>
            </div>
            </div>

            {/* 🔹 Filters and Search — added Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Filter size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                    type="text"
                    placeholder="Search tenants, units, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {units.map(unit => (
                    <option key={unit} value={unit}>{unit === 'all' ? 'All Units' : unit}</option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {months.map(month => (
                    <option key={month} value={month}>{month === 'all' ? 'All Months' : month}</option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenant</label>
                <select
                    value={selectedTenant}
                    onChange={(e) => setSelectedTenant(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {tenantNames.map(name => (
                    <option key={name} value={name}>{name === 'all' ? 'All Tenants' : name}</option>
                    ))}
                </select>
                </div>

                {/* 🔹 NEW: Category Filter */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                    ))}
                </select>
                </div>
            </div>
            </div>

            {/* Tenants Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-blue-50 border-b border-gray-200">
                    <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tenant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Unit</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th> {/* 🔹 NEW COLUMN */}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Monthly Rent</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment History</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredTenants.map(tenant => (
                    <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                        <div>
                            <p className="font-medium text-gray-900">{tenant.name}</p>
                            <p className="text-sm text-gray-600">{tenant.email}</p>
                            <p className="text-sm text-gray-600">{tenant.phone}</p>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {tenant.unit}
                        </span>
                        </td>
                        <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            tenant.category === 'Social' ? 'bg-purple-100 text-purple-800' :
                            tenant.category === 'Affordable' ? 'bg-green-100 text-green-800' :
                            tenant.category === 'Premium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {tenant.category}
                        </span>
                        </td>
                        <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">₱{tenant.monthlyRent.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                        <div className="space-y-2">
                            {tenant.payments
                            .filter(p => selectedMonth === 'all' || p.month === selectedMonth)
                            .map(payment => (
                                <div key={payment.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                    <p className="text-sm font-medium text-gray-900">{payment.month}</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                        {payment.status.toUpperCase()}
                                    </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                    Due: {new Date(payment.dueDate).toLocaleDateString()}
                                    {payment.paidDate && ` | Paid: ${new Date(payment.paidDate).toLocaleDateString()}`}
                                    </p>
                                    {payment.proofOfPayment && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <button
                                        onClick={() => {
                                            setSelectedProof({
                                            file: payment.proofOfPayment!.file,
                                            tenant: tenant.name,
                                            month: payment.month
                                            });
                                            setShowProofModal(true);
                                        }}
                                        className="text-xs text-blue-600 underline cursor-pointer hover:text-blue-800"
                                        >
                                        View Proof: {payment.proofOfPayment.file}
                                        </button>
                                        {!payment.proofOfPayment.verified && (
                                        <span className="text-xs bg-custom-navy text-white px-2 py-1 rounded">Pending Verification</span>
                                        )}
                                        {payment.proofOfPayment.verified && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                                            <Check size={12} /> Verified
                                        </span>
                                        )}
                                    </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    {payment.status === 'pending' && payment.proofOfPayment && !payment.proofOfPayment.verified && (
                                    <>
                                        <button
                                        onClick={() => handleVerifyPayment(tenant.id, payment.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                                        title="Verify Payment"
                                        >
                                        <Check size={16} />
                                        </button>
                                        <button
                                        onClick={() => handleRejectPayment(tenant.id, payment.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                                        title="Reject Payment"
                                        >
                                        <X size={16} />
                                        </button>
                                    </>
                                    )}
                                </div>
                                </div>
                            ))}
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>

        {/* View Proof Modal */}
        {showProofModal && selectedProof && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Proof of Payment</h3>
                    <p className="text-sm text-gray-600 mt-1">
                    Tenant: {selectedProof.tenant} | Month: {selectedProof.month}
                    </p>
                </div>
                <button
                    onClick={() => {
                    setShowProofModal(false);
                    setSelectedProof(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-8 bg-gray-50 text-center">
                <div className="bg-white rounded-lg p-6 inline-block">
                    <p className="text-gray-600 mb-2">📄 {selectedProof.file}</p>
                    <p className="text-sm text-gray-500">
                    (In production, this would display the actual screenshot/image)
                    </p>
                </div>
                </div>

                <div className="flex gap-3 mt-6">
                <button
                    onClick={() => {
                    setShowProofModal(false);
                    setSelectedProof(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                    Close
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default RentPaymentsDashboard;