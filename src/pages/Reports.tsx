    import React, { useState, useEffect } from 'react';
    import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    } from 'recharts';
    import {
    Calendar,
    DollarSign,
    Home,
    FileText,
    TrendingUp,
    Users,
    Download,
    Filter,
    } from 'lucide-react';

    // Mock API service - Replace with actual API calls
    const mockAPI = {
    fetchOccupancyData: async (dateRange: string) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map((month) => ({
        month,
        occupied: Math.floor(Math.random() * 20) + 15,
        available: Math.floor(Math.random() * 10) + 5,
        vacant: Math.floor(Math.random() * 5) + 2,
        total: 40,
        }));
    },

    fetchIncomeData: async (dateRange: string) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map((month) => ({
        month,
        income: Math.floor(Math.random() * 50000) + 80000,
        expenses: Math.floor(Math.random() * 20000) + 30000,
        }));
    },

    fetchBookingHistory: async (dateRange: string) => {
        return [
        {
            id: 'BK001',
            tenant: 'John Smith',
            room: 'A-101',
            checkIn: '2024-12-01',
            checkOut: '2024-12-31',
            status: 'Active',
            amount: 5000,
        },
        {
            id: 'BK002',
            tenant: 'Maria Garcia',
            room: 'B-205',
            checkIn: '2024-11-15',
            checkOut: '2024-12-15',
            status: 'Completed',
            amount: 4500,
        },
        {
            id: 'BK003',
            tenant: 'James Wilson',
            room: 'C-310',
            checkIn: '2024-12-10',
            checkOut: '2025-01-10',
            status: 'Active',
            amount: 5200,
        },
        {
            id: 'BK004',
            tenant: 'Lisa Anderson',
            room: 'A-102',
            checkIn: '2024-11-20',
            checkOut: '2024-12-20',
            status: 'Completed',
            amount: 4800,
        },
        {
            id: 'BK005',
            tenant: 'Robert Brown',
            room: 'B-201',
            checkIn: '2024-12-05',
            checkOut: '2025-01-05',
            status: 'Active',
            amount: 4900,
        },
        {
            id: 'BK006',
            tenant: 'Emma Davis',
            room: 'C-315',
            checkIn: '2024-10-15',
            checkOut: '2024-11-15',
            status: 'Completed',
            amount: 4600,
        },
        {
            id: 'BK007',
            tenant: 'Michael Lee',
            room: 'A-105',
            checkIn: '2024-12-12',
            checkOut: '2025-01-12',
            status: 'Active',
            amount: 5100,
        },
        {
            id: 'BK008',
            tenant: 'Sarah Johnson',
            room: 'B-210',
            checkIn: '2024-11-01',
            checkOut: '2024-12-01',
            status: 'Cancelled',
            amount: 0,
        },
        ];
    },

    fetchSummaryStats: async () => {
        return {
        totalRooms: 40,
        occupiedRooms: 32,
        availableRooms: 8,
        occupancyRate: 80,
        monthlyIncome: 156000,
        totalBookings: 45,
        activeBookings: 32,
        };
    },
    };

    type OccupancyPoint = {
    month: string;
    occupied: number;
    available: number;
    vacant: number;
    total: number;
    };

    type IncomePoint = {
    month: string;
    income: number;
    expenses: number;
    };

    type Booking = {
    id: string;
    tenant: string;
    room: string;
    checkIn: string;
    checkOut: string;
    status: string; // relaxed to string
    amount: number;
    };

    type SummaryStats = {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    occupancyRate: number;
    monthlyIncome: number;
    totalBookings: number;
    activeBookings: number;
    };

    const Reports: React.FC = () => {
    const [activeReport, setActiveReport] = useState<'overview' | 'occupancy' | 'income' | 'bookings'>(
        'overview',
    );
    const [dateRange, setDateRange] = useState<'1month' | '3months' | '6months' | '1year'>('6months');

    const [occupancyData, setOccupancyData] = useState<OccupancyPoint[]>([]);
    const [incomeData, setIncomeData] = useState<IncomePoint[]>([]);
    const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
    const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);

    useEffect(() => {
        loadAllData();
    }, []);

    useEffect(() => {
        if (summaryStats) {
        loadAllData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    const loadAllData = async () => {
        try {
        const [occupancy, income, bookings, summary] = await Promise.all([
            mockAPI.fetchOccupancyData(dateRange),
            mockAPI.fetchIncomeData(dateRange),
            mockAPI.fetchBookingHistory(dateRange),
            mockAPI.fetchSummaryStats(),
        ]);

        setOccupancyData(occupancy);
        setIncomeData(income);
        setBookingHistory(bookings);
        setSummaryStats(
            summary || {
            totalRooms: 40,
            occupiedRooms: 32,
            availableRooms: 8,
            occupancyRate: 80,
            monthlyIncome: 156000,
            totalBookings: 45,
            activeBookings: 32,
            },
        );
        } catch (error) {
        console.error('Error loading data:', error);
        }
    };

    const exportReport = () => {
        const reportData = {
        reportType: activeReport,
        dateRange: dateRange,
        generatedAt: new Date().toISOString(),
        summary: summaryStats,
        occupancy: occupancyData,
        income: incomeData,
        bookings: bookingHistory,
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${activeReport}_report_${new Date()
        .toISOString()
        .split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const COLORS = ['#001F3D', '#0066CC', '#66B2FF', '#99CCFF'];

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#001F3D' }}>
            Reports & Analytics
            </h1>
        </div>

        {/* Controls Bar */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
            <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3D]"
            >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
            </select>

            <button
                onClick={loadAllData}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
                <Filter size={18} />
                Refresh
            </button>
            </div>

            <button
            onClick={exportReport}
            className="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-2"
            style={{ backgroundColor: '#001F3D' }}
            >
            <Download size={18} />
            Export Report
            </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div
            className="bg-white rounded-lg p-6 shadow-lg"
            style={{
                backgroundColor: '#001F3D',
                color: 'white',
                boxShadow:
                '0 4px 6px -1px rgba(0, 31, 61, 0.3), 0 2px 4px -1px rgba(0, 31, 61, 0.2)',
            }}
            >
            <div className="flex items-center justify-between mb-2">
                <Home size={24} style={{ color: 'white' }} />
                <span className="text-sm text-gray-200">Occupancy Rate</span>
            </div>
            <div className="text-3xl font-bold text-white">
                {(summaryStats ? summaryStats.occupancyRate : 80)}%
            </div>
            <div className="text-sm text-gray-200 mt-1">
                {summaryStats ? `${summaryStats.occupiedRooms} of ${summaryStats.totalRooms}` : '32 of 40'}{' '}
                rooms
            </div>
            </div>

            <div
            className="bg-white rounded-lg p-6 shadow-lg"
            style={{
                backgroundColor: '#001F3D',
                color: 'white',
                boxShadow:
                '0 4px 6px -1px rgba(0, 31, 61, 0.3), 0 2px 4px -1px rgba(0, 31, 61, 0.2)',
            }}
            >
            <div className="flex items-center justify-between mb-2">
                <DollarSign size={24} style={{ color: 'white' }} />
                <span className="text-sm text-gray-200">Monthly Income</span>
            </div>
            <div className="text-3xl font-bold text-white">
                ₱{(summaryStats ? summaryStats.monthlyIncome : 156000).toLocaleString()}
            </div>
            <div className="text-sm text-green-300 mt-1">+12% from last month</div>
            </div>

            <div
            className="bg-white rounded-lg p-6 shadow-lg"
            style={{
                backgroundColor: '#001F3D',
                color: 'white',
                boxShadow:
                '0 4px 6px -1px rgba(0, 31, 61, 0.3), 0 2px 4px -1px rgba(0, 31, 61, 0.2)',
            }}
            >
            <div className="flex items-center justify-between mb-2">
                <FileText size={24} style={{ color: 'white' }} />
                <span className="text-sm text-gray-200">Total Bookings</span>
            </div>
            <div className="text-3xl font-bold text-white">
                {summaryStats ? summaryStats.totalBookings : 45}
            </div>
            <div className="text-sm text-gray-200 mt-1">
                {summaryStats ? summaryStats.activeBookings : 32} currently active
            </div>
            </div>

            <div
            className="bg-white rounded-lg p-6 shadow-lg"
            style={{
                backgroundColor: '#001F3D',
                color: 'white',
                boxShadow:
                '0 4px 6px -1px rgba(0, 31, 61, 0.3), 0 2px 4px -1px rgba(0, 31, 61, 0.2)',
            }}
            >
            <div className="flex items-center justify-between mb-2">
                <TrendingUp size={24} style={{ color: 'white' }} />
                <span className="text-sm text-gray-200">Available Rooms</span>
            </div>
            <div className="text-3xl font-bold text-white">
                {summaryStats ? summaryStats.availableRooms : 8}
            </div>
            <div className="text-sm text-gray-200 mt-1">Ready for booking</div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
            {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'occupancy', label: 'Occupancy', icon: Home },
            { id: 'income', label: 'Income', icon: DollarSign },
            { id: 'bookings', label: 'Booking History', icon: FileText },
            ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id as any)}
                className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
                activeReport === tab.id
                    ? 'border-[#001F3D] text-[#001F3D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                <tab.icon size={18} />
                {tab.label}
            </button>
            ))}
        </div>

        {/* Content */}
        <>
            {/* Overview */}
            {activeReport === 'overview' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                    style={{
                    boxShadow:
                        '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                    }}
                >
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Occupancy Trends
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={occupancyData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="occupied" fill="#001F3D" name="Occupied" />
                        <Bar dataKey="available" fill="#0066CC" name="Available" />
                        <Bar dataKey="vacant" fill="#99CCFF" name="Vacant" />
                    </BarChart>
                    </ResponsiveContainer>
                </div>

                <div
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                    style={{
                    boxShadow:
                        '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                    }}
                >
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Income vs Expenses
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={incomeData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
                        <Legend />
                        <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#001F3D"
                        strokeWidth={2}
                        name="Income"
                        />
                        <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#FF6B6B"
                        strokeWidth={2}
                        name="Expenses"
                        />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
                </div>

                <div
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                style={{
                    boxShadow:
                    '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                }}
                >
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Performance Summary
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead>
                        <tr className="border-b" style={{ borderColor: '#001F3D' }}>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Metric
                        </th>
                        <th className="text-right py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Current
                        </th>
                        <th className="text-right py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Previous
                        </th>
                        <th className="text-right py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Change
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200">
                        <td className="py-3 px-4">Average Occupancy Rate</td>
                        <td className="text-right py-3 px-4 font-medium">
                            {summaryStats ? `${summaryStats.occupancyRate}%` : '80%'}
                        </td>
                        <td className="text-right py-3 px-4">75%</td>
                        <td className="text-right py-3 px-4 text-green-600">+5%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                        <td className="py-3 px-4">Total Revenue</td>
                        <td className="text-right py-3 px-4 font-medium">
                            {summaryStats
                            ? `₱${(summaryStats.monthlyIncome * 6).toLocaleString()}`
                            : '₱936,000'}
                        </td>
                        <td className="text-right py-3 px-4">₱825,000</td>
                        <td className="text-right py-3 px-4 text-green-600">+13.5%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                        <td className="py-3 px-4">Average Room Rate</td>
                        <td className="text-right py-3 px-4 font-medium">
                            {summaryStats
                            ? `₱${Math.round(
                                summaryStats.monthlyIncome / (summaryStats.occupiedRooms || 1),
                                ).toLocaleString()}`
                            : '₱4,875'}
                        </td>
                        <td className="text-right py-3 px-4">₱4,650</td>
                        <td className="text-right py-3 px-4 text-green-600">+4.8%</td>
                        </tr>
                        <tr>
                        <td className="py-3 px-4">Booking Conversion Rate</td>
                        <td className="text-right py-3 px-4 font-medium">
                            {summaryStats
                            ? `${Math.round(
                                (summaryStats.activeBookings / summaryStats.totalBookings) * 100,
                                )}%`
                            : '85%'}
                        </td>
                        <td className="text-right py-3 px-4">82%</td>
                        <td className="text-right py-3 px-4 text-green-600">+3%</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            )}

            {/* Occupancy */}
            {activeReport === 'occupancy' && (
            <div className="space-y-6">
                <div
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                style={{
                    boxShadow:
                    '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                }}
                >
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Room Occupancy Over Time
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={occupancyData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="occupied" fill="#001F3D" name="Occupied Rooms" />
                    <Bar dataKey="available" fill="#0066CC" name="Available Rooms" />
                    <Bar dataKey="vacant" fill="#99CCFF" name="Vacant Rooms" />
                    </BarChart>
                </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                    style={{
                    boxShadow:
                        '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                    }}
                >
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Current Room Status Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                        data={[
                            { name: 'Occupied', value: summaryStats?.occupiedRooms || 32 },
                            { name: 'Available', value: summaryStats?.availableRooms || 8 },
                            {
                            name: 'Vacant',
                            value: summaryStats
                                ? summaryStats.totalRooms -
                                summaryStats.occupiedRooms -
                                summaryStats.availableRooms
                                : 0,
                            },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props) => {
                            const name = (props.name as string) || '';
                            const percent = (props.percent as number) || 0;
                            return `${name}: ${(percent * 100).toFixed(0)}%`;
                        }}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        >
                        {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                        ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    </ResponsiveContainer>
                </div>

                <div
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                    style={{
                    boxShadow:
                        '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                    }}
                >
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Occupancy Statistics
                    </h3>
                    <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Peak Occupancy Month</span>
                        <span className="font-semibold">
                        May (
                        {summaryStats
                            ? `${Math.min(100, summaryStats.occupancyRate + 7.5)}%`
                            : '87.5%'}
                        )
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Lowest Occupancy Month</span>
                        <span className="font-semibold">
                        Jan (
                        {summaryStats
                            ? `${Math.max(0, summaryStats.occupancyRate - 10)}%`
                            : '70%'}
                        )
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Average Occupancy Rate</span>
                        <span className="font-semibold">
                        {summaryStats ? `${summaryStats.occupancyRate}%` : '80%'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Total Rooms</span>
                        <span className="font-semibold">
                        {summaryStats ? summaryStats.totalRooms : '40'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Currently Occupied</span>
                        <span className="font-semibold" style={{ color: '#001F3D' }}>
                        {summaryStats ? `${summaryStats.occupiedRooms} rooms` : '32 rooms'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Available for Booking</span>
                        <span className="font-semibold text-green-600">
                        {summaryStats ? `${summaryStats.availableRooms} rooms` : '6 rooms'}
                        </span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}

            {/* Income */}
            {activeReport === 'income' && (
            <div className="space-y-6">
                <div
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                style={{
                    boxShadow:
                    '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                }}
                >
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Income & Expenses Analysis
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={incomeData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#001F3D"
                        strokeWidth={3}
                        name="Income"
                    />
                    <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#FF6B6B"
                        strokeWidth={3}
                        name="Expenses"
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                    style={{
                    boxShadow:
                        '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                    }}
                >
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Monthly Income Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={incomeData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
                        <Bar dataKey="income" fill="#001F3D" name="Monthly Income" />
                    </BarChart>
                    </ResponsiveContainer>
                </div>

                <div
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                    style={{
                    boxShadow:
                        '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                    }}
                >
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Financial Summary
                    </h3>
                    <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Total Income (6 months)</span>
                        <span className="font-semibold text-green-600">
                        {summaryStats
                            ? `₱${(summaryStats.monthlyIncome * 6).toLocaleString()}`
                            : '₱936,000'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Total Expenses (6 months)</span>
                        <span className="font-semibold text-red-600">
                        {summaryStats
                            ? `₱${Math.round(
                                summaryStats.monthlyIncome * 0.35 * 6,
                            ).toLocaleString()}`
                            : '₱327,600'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Net Profit</span>
                        <span className="font-bold text-xl" style={{ color: '#001F3D' }}>
                        {summaryStats
                            ? `₱${Math.round(
                                summaryStats.monthlyIncome * 0.65 * 6,
                            ).toLocaleString()}`
                            : '₱608,400'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Average Monthly Income</span>
                        <span className="font-semibold">
                        {summaryStats
                            ? `₱${summaryStats.monthlyIncome.toLocaleString()}`
                            : '₱156,000'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Highest Income Month</span>
                        <span className="font-semibold">
                        May (
                        {summaryStats
                            ? `₱${Math.round(
                                summaryStats.monthlyIncome * 1.2,
                            ).toLocaleString()}`
                            : '₱187,200'}
                        )
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Profit Margin</span>
                        <span className="font-semibold text-green-600">65.2%</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}

            {/* Bookings */}
            {activeReport === 'bookings' && (
            <div className="space-y-6">
                <div
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                style={{
                    boxShadow:
                    '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                }}
                >
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Booking History
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead>
                        <tr className="border-b-2" style={{ borderColor: '#001F3D' }}>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Booking ID
                        </th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Tenant Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Room
                        </th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Check-In
                        </th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Check-Out
                        </th>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Status
                        </th>
                        <th className="text-right py-3 px-4 font-semibold" style={{ color: '#001F3D' }}>
                            Amount
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(bookingHistory || []).map((booking) => (
                        <tr
                            key={booking.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                        >
                            <td className="py-3 px-4 font-medium">{booking.id}</td>
                            <td className="py-3 px-4">{booking.tenant}</td>
                            <td className="py-3 px-4">{booking.room}</td>
                            <td className="py-3 px-4">{booking.checkIn}</td>
                            <td className="py-3 px-4">{booking.checkOut}</td>
                            <td className="py-3 px-4">
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.status === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : booking.status === 'Completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {booking.status}
                            </span>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold">
                            {booking.amount > 0
                                ? `₱${booking.amount.toLocaleString()}`
                                : '-'}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg"
                    style={{
                    boxShadow:
                        '0 4px 6px -1px rgba(0, 31, 61, 0.2), 0 2px 4px -1px rgba(0, 31, 61, 0.15)',
                    }}
                >
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#001F3D' }}>
                    Booking Statistics
                    </h3>
                    <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Total Bookings</span>
                        <span className="font-semibold">{bookingHistory.length}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Active Bookings</span>
                        <span className="font-semibold text-green-600">
                        {bookingHistory.filter((b) => b.status === 'Active').length}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Completed Bookings</span>
                        <span className="font-semibold text-blue-600">
                        {bookingHistory.filter((b) => b.status === 'Completed').length}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Cancelled Bookings</span>
                        <span className="font-semibold text-red-600">
                        {bookingHistory.filter((b) => b.status === 'Cancelled').length}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Average Booking Value</span>
                        <span className="font-semibold">
                        {bookingHistory.length > 0
                            ? `₱${Math.round(
                                bookingHistory.reduce((sum, b) => sum + b.amount, 0) /
                                bookingHistory.length,
                            ).toLocaleString()}`
                            : '₱0'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Revenue from Bookings</span>
                        <span className="font-bold" style={{ color: '#001F3D' }}>
                        {`₱${(bookingHistory || [])
                            .reduce((sum, b) => sum + b.amount, 0)
                            .toLocaleString()}`}
                        </span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}
        </>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Data is updated in real-time as bookings, payments, and room statuses change</p>
        </div>
        </div>
    );
    };

    export default Reports;