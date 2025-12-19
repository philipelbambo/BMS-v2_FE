    import React, { useState } from 'react';
    import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    } from 'recharts';
    import {
    Filter,
    Download,
    TrendingUp,
    Users,
    Home,
    Wrench,
    } from 'lucide-react';

    // ✅ Helper to determine category from rent
    const getUnitCategory = (rent: number, isVacant = false): 'Social' | 'Affordable' | 'Premium' | 'Deluxe' => {
    if (isVacant) return 'Social';
    if (rent < 6500) return 'Social';
    if (rent < 7000) return 'Affordable';
    if (rent < 7500) return 'Premium';
    return 'Deluxe';
    };

    // ✅ Interfaces — with category
    interface RentData {
    month: string;
    collected: number;
    expected: number;
    [key: string]: any;
    }

    interface OccupancyData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
    }

    interface PaymentHistoryItem {
    id: number;
    tenant: string;
    unit: string;
    amount: number;
    date: string;
    status: 'Paid' | 'Pending';
    category: 'Social' | 'Affordable' | 'Premium' | 'Deluxe';
    }

    interface TenantItem {
    id: number;
    name: string;
    unit: string;
    moveIn: string;
    lease: 'Active' | 'Available';
    rent: number;
    category: 'Social' | 'Affordable' | 'Premium' | 'Deluxe';
    }

    interface MaintenanceLog {
    id: number;
    unit: string;
    issue: string;
    date: string;
    status: 'Completed' | 'In Progress' | 'Scheduled';
    cost: number;
    category: 'Social' | 'Affordable' | 'Premium' | 'Deluxe';
    }

    const ReportsDashboard: React.FC = () => {
    const [dateFilter, setDateFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
    const [unitFilter, setUnitFilter] = useState<string>('all');
    const [tenantFilter, setTenantFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Sample data with categories
    const tenantList: TenantItem[] = [
        { id: 1, name: 'John Smith', unit: 'Door 1', moveIn: '2023-01-15', lease: 'Active', rent: 6500, category: 'Affordable' },
        { id: 2, name: 'Sarah Johnson', unit: 'Door 2', moveIn: '2023-03-20', lease: 'Active', rent: 7000, category: 'Premium' },
        { id: 3, name: 'Mike Williams', unit: 'Door 3', moveIn: '2023-05-10', lease: 'Active', rent: 6800, category: 'Affordable' },
        { id: 4, name: 'Emily Davis', unit: 'Door 4', moveIn: '2023-07-01', lease: 'Active', rent: 7200, category: 'Premium' },
        { id: 5, name: 'Robert Brown', unit: 'Door 5', moveIn: '2023-09-15', lease: 'Active', rent: 6500, category: 'Affordable' },
        { id: 6, name: 'Lisa Anderson', unit: 'Door 6', moveIn: '2023-11-20', lease: 'Active', rent: 7500, category: 'Deluxe' },
        { id: 7, name: 'Vacant', unit: 'Door 7', moveIn: '-', lease: 'Available', rent: 0, category: 'Social' },
    ];

    const paymentHistory: PaymentHistoryItem[] = tenantList
        .filter(t => t.lease === 'Active')
        .map(t => ({
        id: t.id,
        tenant: t.name,
        unit: t.unit,
        amount: t.rent,
        date: '2024-11-01',
        status: t.name === 'Emily Davis' ? 'Pending' : 'Paid',
        category: t.category,
        }));

    const maintenanceLogs: MaintenanceLog[] = [
        { id: 1, unit: 'Door 2', issue: 'Plumbing leak', date: '2024-11-15', status: 'Completed', cost: 150, category: 'Premium' },
        { id: 2, unit: 'Door 5', issue: 'AC repair', date: '2024-11-18', status: 'In Progress', cost: 300, category: 'Affordable' },
        { id: 3, unit: 'Door 1', issue: 'Door lock replacement', date: '2024-11-20', status: 'Completed', cost: 80, category: 'Affordable' },
        { id: 4, unit: 'Door 3', issue: 'Paint touch-up', date: '2024-11-22', status: 'Scheduled', cost: 120, category: 'Affordable' },
        { id: 5, unit: 'Door 4', issue: 'Electrical inspection', date: '2024-11-25', status: 'Completed', cost: 200, category: 'Premium' },
    ];

    const monthlyRentData = [
        { month: 'Jan', collected: 42000, expected: 45000 },
        { month: 'Feb', collected: 45000, expected: 45000 },
        { month: 'Mar', collected: 43500, expected: 45000 },
        { month: 'Apr', collected: 45000, expected: 45000 },
        { month: 'May', collected: 44000, expected: 45000 },
        { month: 'Jun', collected: 45000, expected: 45000 },
    ];

    const occupancyData = [
        { name: 'Occupied', value: 6, color: '#2563eb' },
        { name: 'Vacant', value: 1, color: '#93c5fd' },
    ];

    const occupancyRate = ((6 / 7) * 100).toFixed(1);
    const paidPayments = paymentHistory.filter((p) => p.status === 'Paid');
    const totalRentCollected = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const avgRent = paidPayments.length > 0
        ? (totalRentCollected / paidPayments.length).toFixed(0)
        : '0';

    // ✅ Filtering with category support
    const filterPaymentHistory = () =>
        paymentHistory.filter(
        (item) =>
            (unitFilter === 'all' || item.unit === unitFilter) &&
            (tenantFilter === 'all' || item.tenant === tenantFilter) &&
            (categoryFilter === 'all' || item.category === categoryFilter)
        );

    const filterTenantList = () =>
        tenantList.filter(
        (item) =>
            (unitFilter === 'all' || item.unit === unitFilter) &&
            (tenantFilter === 'all' || item.name === tenantFilter) &&
            (categoryFilter === 'all' || item.category === categoryFilter)
        );

    const filterMaintenanceLogs = () =>
        maintenanceLogs.filter(
        (item) =>
            (unitFilter === 'all' || item.unit === unitFilter) &&
            (categoryFilter === 'all' || item.category === categoryFilter)
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="w-full">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 mx-6">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Date Range */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                    value={dateFilter}
                    onChange={(e) =>
                    setDateFilter(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                </div>

                {/* Unit */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Units</option>
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <option key={num} value={`Door ${num}`}>
                        Door {num}
                    </option>
                    ))}
                </select>
                </div>

                {/* Tenant */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenant</label>
                <select
                    value={tenantFilter}
                    onChange={(e) => setTenantFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Tenants</option>
                    {tenantList
                    .filter((t) => t.name !== 'Vacant')
                    .map((tenant) => (
                        <option key={tenant.id} value={tenant.name}>
                        {tenant.name}
                        </option>
                    ))}
                </select>
                </div>

                {/* Category */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Categories</option>
                    <option value="Social">Social</option>
                    <option value="Affordable">Affordable</option>
                    <option value="Premium">Premium</option>
                    <option value="Deluxe">Deluxe</option>
                </select>
                </div>
            </div>
            <button className="mt-4 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
            </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 px-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium text-green-600">+5.2%</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total Collected</h3>
                <p className="text-2xl font-bold text-gray-900">
                ₱{totalRentCollected.toLocaleString()}
                </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                <Home className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium text-green-600">{occupancyRate}%</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Occupancy Rate</h3>
                <p className="text-2xl font-bold text-gray-900">6/7 Units</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Active</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Active Tenants</h3>
                <p className="text-2xl font-bold text-gray-900">6 Tenants</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                <Wrench className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium text-orange-600">2 Pending</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Maintenance</h3>
                <p className="text-2xl font-bold text-gray-900">5 Requests</p>
            </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-6">
            {/* Monthly Rent Collected */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Rent Collection</h2>
                <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyRentData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" stroke="#6b7280" tickMargin={10} />
                    <YAxis stroke="#6b7280" width={60} tickFormatter={(value) => `₱${value / 1000}K`} />
                    <Tooltip
                    formatter={(value) => [`₱${value.toLocaleString()}`, 'Amount']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                    />
                    <Legend />
                    <Bar dataKey="collected" fill="#2563eb" name="Collected" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expected" fill="#cbd5e1" name="Expected" radius={[6, 6, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Unit Occupancy */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Unit Occupancy</h2>
                <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ payload }) => {
                        const p = payload as OccupancyData;
                        const percent = p.value / 7;
                        return `${p.name}: ${(percent * 100).toFixed(0)}%`;
                    }}
                    labelLine={false}
                    >
                    {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, 'Units']} />
                </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-8 mt-6">
                {occupancyData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
                    </div>
                ))}
                </div>
            </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 mx-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tenant</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unit</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filterPaymentHistory().map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{payment.tenant}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{payment.unit}</td>
                        <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            payment.category === 'Social' ? 'bg-gray-100 text-gray-800' :
                            payment.category === 'Affordable' ? 'bg-green-100 text-green-800' :
                            payment.category === 'Premium' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                        }`}>
                            {payment.category}
                        </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        ₱{payment.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{payment.date}</td>
                        <td className="py-3 px-4">
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'Paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                        >
                            {payment.status}
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>

            {/* Tenant List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 mx-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tenant List</h2>
            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tenant Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unit</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Move-In Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Lease Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Monthly Rent</th>
                    </tr>
                </thead>
                <tbody>
                    {filterTenantList().map((tenant) => (
                    <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{tenant.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{tenant.unit}</td>
                        <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            tenant.category === 'Social' ? 'bg-gray-100 text-gray-800' :
                            tenant.category === 'Affordable' ? 'bg-green-100 text-green-800' :
                            tenant.category === 'Premium' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                        }`}>
                            {tenant.category}
                        </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{tenant.moveIn}</td>
                        <td className="py-3 px-4">
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            tenant.lease === 'Active'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {tenant.lease}
                        </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {tenant.rent > 0 ? `₱${tenant.rent.toLocaleString()}` : '-'}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>

            {/* Maintenance Logs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mx-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Maintenance Logs</h2>
            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unit</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Issue</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {filterMaintenanceLogs().map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{log.unit}</td>
                        <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            log.category === 'Social' ? 'bg-gray-100 text-gray-800' :
                            log.category === 'Affordable' ? 'bg-green-100 text-green-800' :
                            log.category === 'Premium' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                        }`}>
                            {log.category}
                        </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{log.issue}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{log.date}</td>
                        <td className="py-3 px-4">
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            log.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : log.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {log.status}
                        </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        ₱{log.cost.toLocaleString()}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default ReportsDashboard;