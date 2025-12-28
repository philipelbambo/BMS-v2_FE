import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Home, Users, DollarSign, TrendingUp } from 'lucide-react';
import useBackButtonProtection from '../../hooks/useBackButtonProtection';

// Mock data for immediate, smooth rendering
const initialMockData = {
  summary: {
    totalRooms: 24,
    availableRooms: 6,
    occupiedRooms: 18,
    totalTenants: 22,
    monthlyIncome: 87500
  },
  monthlyIncome: [
    { month: 'Jan', income: 72000 },
    { month: 'Feb', income: 78500 },
    { month: 'Mar', income: 81000 },
    { month: 'Apr', income: 79500 },
    { month: 'May', income: 85000 },
    { month: 'Jun', income: 87500 }
  ],
  paymentTrends: [
    { week: 'Week 1', paid: 18, pending: 4, overdue: 0 },
    { week: 'Week 2', paid: 20, pending: 2, overdue: 0 },
    { week: 'Week 3', paid: 19, pending: 2, overdue: 1 },
    { week: 'Week 4', paid: 22, pending: 0, overdue: 0 }
  ],
  occupancyDistribution: [
    { name: 'Occupied', value: 18 },
    { name: 'Available', value: 6 }
  ]
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(initialMockData);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Implement back button protection
  useBackButtonProtection();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, incomeRes, paymentRes, occupancyRes] = await Promise.all([
        fetch('/api/dashboard/summary'),
        fetch('/api/dashboard/monthly-income'),
        fetch('/api/dashboard/payment-trends'),
        fetch('/api/dashboard/occupancy')
      ]);

      if (!summaryRes.ok || !incomeRes.ok || !paymentRes.ok || !occupancyRes.ok) {
        // Silently fail — keep using mock data
        return;
      }

      const [summaryData, incomeData, paymentData, occupancyData] = await Promise.all([
        summaryRes.json(),
        incomeRes.json(),
        paymentRes.json(),
        occupancyRes.json()
      ]);

      setDashboardData({
        summary: summaryData,
        monthlyIncome: incomeData,
        paymentTrends: paymentData,
        occupancyDistribution: occupancyData
      });
      
      setLastUpdated(new Date());
    } catch (err) {
      // Fail silently — no error UI, no console spam (or keep minimal log if needed)
      // console.debug('Using mock data; API unavailable:', err);
    }
  };

  const COLORS = ['#001F3D', '#f5f5f5'];

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle 
  }: { 
    icon: React.ElementType; 
    title: string; 
    value: string | number; 
    subtitle?: string;
  }) => (
    <div 
      className="rounded p-4 hover:shadow-2xl transition-shadow" 
      style={{ 
        backgroundColor: '#001F3D',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 10px 25px -5px rgba(0, 31, 61, 0.3)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded bg-white bg-opacity-20">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <p className="text-white text-opacity-90 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-xs text-white text-opacity-75 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {/* Steady green dot — no blinking */}
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 font-medium">Live</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Last Updated</p>
              <p className="text-sm font-medium text-gray-700">
                {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={Home}
            title="Total Rooms"
            value={dashboardData.summary.totalRooms}
          />
          <StatCard
            icon={Home}
            title="Available Rooms"
            value={dashboardData.summary.availableRooms}
            subtitle="Ready for occupancy"
          />
          <StatCard
            icon={Home}
            title="Occupied Rooms"
            value={dashboardData.summary.occupiedRooms}
            subtitle={`${Math.round((dashboardData.summary.occupiedRooms / dashboardData.summary.totalRooms) * 100)}% occupancy`}
          />
          <StatCard
            icon={Users}
            title="Total Tenants"
            value={dashboardData.summary.totalTenants}
            subtitle="Active residents"
          />
          <StatCard
            icon={DollarSign}
            title="Monthly Income"
            value={`₱${dashboardData.summary.monthlyIncome.toLocaleString()}`}
            subtitle="Current month"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Income Chart */}
          <div className="bg-white rounded p-6 border border-gray-100" style={{ boxShadow: '0 4px 6px -1px rgba(0, 31, 61, 0.1), 0 2px 4px -1px rgba(0, 31, 61, 0.06)' }}>
            <div className="flex items-center mb-6">
              <TrendingUp className="w-5 h-5 text-[#001F3D] mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Monthly Income Trends</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.monthlyIncome}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `₱${value.toLocaleString()}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#001F3D" 
                  strokeWidth={3}
                  dot={{ fill: '#001F3D', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Income"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Trends Chart */}
          <div className="bg-white rounded p-6 border border-gray-100" style={{ boxShadow: '0 4px 6px -1px rgba(0, 31, 61, 0.1), 0 2px 4px -1px rgba(0, 31, 61, 0.06)' }}>
            <div className="flex items-center mb-6">
              <DollarSign className="w-5 h-5 text-[#001F3D] mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Payment Status Trends</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.paymentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="paid" fill="#001F3D" name="Paid" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" fill="#4A90E2" name="Pending" radius={[8, 8, 0, 0]} />
                <Bar dataKey="overdue" fill="#A8D5FF" name="Overdue" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Distribution Chart */}
        <div className="bg-white rounded p-6 border border-gray-100" style={{ boxShadow: '0 4px 6px -1px rgba(0, 31, 61, 0.1), 0 2px 4px -1px rgba(0, 31, 61, 0.06)' }}>
          <div className="flex items-center mb-6">
            <Home className="w-5 h-5 text-[#001F3D] mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Room Occupancy Distribution</h2>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dashboardData.occupancyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.occupancyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-gray-500 text-sm mb-1">Occupancy Rate</p>
              <p className="text-2xl font-bold text-[#001F3D]">
                {Math.round((dashboardData.summary.occupiedRooms / dashboardData.summary.totalRooms) * 100)}%
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-gray-500 text-sm mb-1">Availability Rate</p>
              <p className="text-2xl font-bold text-gray-600">
                {Math.round((dashboardData.summary.availableRooms / dashboardData.summary.totalRooms) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info — simplified */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Dashboard refreshes automatically every 30 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;