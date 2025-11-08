    import React, { useState, useMemo } from 'react';
    import { TrendingUp, Package, ShoppingCart, AlertTriangle } from 'lucide-react';

    // TypeScript interfaces for type safety
    interface SaleItem {
    id: number;
    itemName: string;
    quantity: number;
    pricePerUnit: number;
    date: string;
    }

    interface InventoryItem {
    id: number;
    productName: string;
    category: string;
    availableQty: number;
    damagedQty: number;
    reorderLevel: number;
    }

    interface MonthlySale {
    month: string;
    revenue: number;
    transactions: number;
    }

    const ReportsPage: React.FC = () => {
    // Dummy data for daily sales
    const [dailySales] = useState<SaleItem[]>([
        { id: 1, itemName: 'Hammer', quantity: 5, pricePerUnit: 250, date: '2025-11-08' },
        { id: 2, itemName: 'Screwdriver Set', quantity: 3, pricePerUnit: 450, date: '2025-11-08' },
        { id: 3, itemName: 'Drill Machine', quantity: 2, pricePerUnit: 3500, date: '2025-11-08' },
        { id: 4, itemName: 'Paint Brush', quantity: 10, pricePerUnit: 80, date: '2025-11-08' },
        { id: 5, itemName: 'Nails (1kg)', quantity: 7, pricePerUnit: 120, date: '2025-11-08' },
        { id: 6, itemName: 'Measuring Tape', quantity: 4, pricePerUnit: 180, date: '2025-11-08' },
    ]);

    // Dummy data for inventory
    const [inventory] = useState<InventoryItem[]>([
        { id: 1, productName: 'Hammer', category: 'Hand Tools', availableQty: 45, damagedQty: 2, reorderLevel: 10 },
        { id: 2, productName: 'Screwdriver Set', category: 'Hand Tools', availableQty: 8, damagedQty: 0, reorderLevel: 15 },
        { id: 3, productName: 'Drill Machine', category: 'Power Tools', availableQty: 15, damagedQty: 1, reorderLevel: 5 },
        { id: 4, productName: 'Paint Brush', category: 'Painting', availableQty: 3, damagedQty: 5, reorderLevel: 20 },
        { id: 5, productName: 'Nails (1kg)', category: 'Fasteners', availableQty: 50, damagedQty: 0, reorderLevel: 10 },
        { id: 6, productName: 'Measuring Tape', category: 'Measuring Tools', availableQty: 22, damagedQty: 0, reorderLevel: 10 },
        { id: 7, productName: 'Safety Gloves', category: 'Safety', availableQty: 5, damagedQty: 3, reorderLevel: 25 },
    ]);

    // Dummy data for monthly sales
    const [monthlySales] = useState<MonthlySale[]>([
        { month: 'January', revenue: 125000, transactions: 234 },
        { month: 'February', revenue: 98000, transactions: 198 },
        { month: 'March', revenue: 142000, transactions: 267 },
        { month: 'April', revenue: 156000, transactions: 289 },
        { month: 'May', revenue: 134000, transactions: 245 },
        { month: 'June', revenue: 178000, transactions: 312 },
        { month: 'July', revenue: 165000, transactions: 298 },
        { month: 'August', revenue: 189000, transactions: 334 },
        { month: 'September', revenue: 172000, transactions: 305 },
        { month: 'October', revenue: 195000, transactions: 348 },
    ]);

    // Calculate summary metrics using useMemo for performance
    const summaryMetrics = useMemo(() => {
        // Total sales today
        const totalSalesToday = dailySales.reduce(
        (sum, item) => sum + item.quantity * item.pricePerUnit,
        0
        );

        // Total orders today
        const totalOrdersToday = dailySales.length;

        // Top-selling item (by quantity)
        const topItem = dailySales.reduce((prev, current) =>
        current.quantity > prev.quantity ? current : prev
        );

        return {
        totalSalesToday,
        totalOrdersToday,
        topSellingItem: topItem.itemName,
        };
    }, [dailySales]);

    // Calculate chart data for daily sales
    const chartData = useMemo(() => {
        return dailySales.map(item => ({
        name: item.itemName,
        quantity: item.quantity,
        total: item.quantity * item.pricePerUnit,
        }));
    }, [dailySales]);

    // Calculate top 5 items by revenue for pie chart
    const topItemsData = useMemo(() => {
        return dailySales
        .map(item => ({
            name: item.itemName,
            value: item.quantity * item.pricePerUnit,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    }, [dailySales]);

    return (
        <div className="min-h-screen bg-white p-6">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Sales & Inventory Reports</h1>
            <p className="text-gray-600 mt-2">Comprehensive overview of your hardware store performance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Sales Today Card */}
            <div className="bg-[#DC0E0E] text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-white/80 text-sm font-medium">Total Sales Today</p>
                <h3 className="text-3xl font-bold mt-2">
                    ₱{summaryMetrics.totalSalesToday.toLocaleString()}
                </h3>
                </div>
                <TrendingUp className="w-12 h-12 text-white/80" />
            </div>
            </div>

            {/* Total Orders Today Card */}
            <div className="bg-[#DC0E0E] text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-white/80 text-sm font-medium">Total Orders Today</p>
                <h3 className="text-3xl font-bold mt-2">{summaryMetrics.totalOrdersToday}</h3>
                </div>
                <ShoppingCart className="w-12 h-12 text-white/80" />
            </div>
            </div>

            {/* Top-Selling Item Card */}
            <div className="bg-[#DC0E0E] text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-white/80 text-sm font-medium">Top-Selling Item</p>
                <h3 className="text-2xl font-bold mt-2">{summaryMetrics.topSellingItem}</h3>
                </div>
                <Package className="w-12 h-12 text-white/80" />
            </div>
            </div>
        </div>

        {/* Daily Sales Table */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
            <div className="bg-[#DC0E0E] text-white px-6 py-4">
            <h2 className="text-xl font-bold">Daily Sales Report</h2>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price/Unit</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {dailySales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-800">{sale.itemName}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{sale.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">₱{sale.pricePerUnit.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        ₱{(sale.quantity * sale.pricePerUnit).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart - Daily Sales by Quantity */}
            <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Daily Sales by Quantity</h2>
            <div className="space-y-4">
                {chartData.map((item, index) => {
                const maxQty = Math.max(...chartData.map(d => d.quantity));
                const widthPercent = (item.quantity / maxQty) * 100;
                return (
                    <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <span className="text-gray-600">{item.quantity} units</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                        <div
                        className="bg-[#DC0E0E] h-6 rounded-full flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${widthPercent}%` }}
                        >
                        <span className="text-white text-xs font-bold">
                            ₱{item.total.toLocaleString()}
                        </span>
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>
            </div>

            {/* Pie Chart - Top Selling Items by Revenue */}
            <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Top Items by Revenue</h2>
            <div className="space-y-3">
                {topItemsData.map((item, index) => {
                const total = topItemsData.reduce((sum, i) => sum + i.value, 0);
                const percentage = ((item.value / total) * 100).toFixed(1);
                const colors = ['#DC0E0E', '#EF4444', '#F87171', '#FCA5A5', '#FEE2E2'];
                return (
                    <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colors[index] }}
                        ></div>
                        <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">₱{item.value.toLocaleString()}</span>
                        <span className="text-sm font-bold text-[#DC0E0E] w-12 text-right">
                        {percentage}%
                        </span>
                    </div>
                    </div>
                );
                })}
            </div>
            </div>
        </div>

        {/* Monthly Sales Overview */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
            <div className="bg-[#DC0E0E] text-white px-6 py-4">
            <h2 className="text-xl font-bold">Monthly Sales Overview</h2>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Revenue</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Transactions</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Avg/Transaction</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {monthlySales.map((month, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{month.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                        ₱{month.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{month.transactions}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                        ₱{Math.round(month.revenue / month.transactions).toLocaleString()}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#DC0E0E] text-white px-6 py-4">
            <h2 className="text-xl font-bold">Inventory Status</h2>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Available Qty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Damaged Qty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {inventory.map((item) => {
                    const isLowStock = item.availableQty < item.reorderLevel;
                    const hasDamaged = item.damagedQty > 0;
                    const needsAttention = isLowStock || hasDamaged;

                    return (
                    <tr
                        key={item.id}
                        className={`hover:bg-gray-50 transition ${
                        needsAttention ? 'bg-red-50' : ''
                        }`}
                    >
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {item.productName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                        <td
                        className={`px-6 py-4 text-sm font-semibold ${
                            isLowStock ? 'text-[#DC0E0E]' : 'text-gray-800'
                        }`}
                        >
                        {item.availableQty}
                        </td>
                        <td
                        className={`px-6 py-4 text-sm font-semibold ${
                            hasDamaged ? 'text-[#DC0E0E]' : 'text-gray-800'
                        }`}
                        >
                        {item.damagedQty}
                        </td>
                        <td className="px-6 py-4">
                        {needsAttention ? (
                            <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#DC0E0E]" />
                            <span className="text-sm font-semibold text-[#DC0E0E]">
                                {isLowStock && 'Low Stock'}
                                {isLowStock && hasDamaged && ' & '}
                                {hasDamaged && 'Has Damage'}
                            </span>
                            </div>
                        ) : (
                            <span className="text-sm text-green-600 font-medium">Normal</span>
                        )}
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
    };

    export default ReportsPage;