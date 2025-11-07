import React, { useState } from 'react';
import { Package, AlertTriangle, TrendingUp, Box, ShoppingCart, Calendar, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const InventoryDashboard = () => {
  const [selectedMonth] = useState('November 2025');

  // Sales data from January to December
  const monthlySalesData = [
    { month: 'Jan', sales: 45000, items: 234 },
    { month: 'Feb', sales: 52000, items: 267 },
    { month: 'Mar', sales: 48000, items: 245 },
    { month: 'Apr', sales: 61000, items: 298 },
    { month: 'May', sales: 58000, items: 287 },
    { month: 'Jun', sales: 63000, items: 312 },
    { month: 'Jul', sales: 71000, items: 341 },
    { month: 'Aug', sales: 68000, items: 328 },
    { month: 'Sep', sales: 59000, items: 294 },
    { month: 'Oct', sales: 73000, items: 356 },
    { month: 'Nov', sales: 81000, items: 389 },
    { month: 'Dec', sales: 0, items: 0 }
  ];

  // Materials sold this month
  const materialsSoldThisMonth = [
    { name: 'Cement Bags', quantity: 450, unit: 'bags' },
    { name: 'Hollow Blocks', quantity: 2340, unit: 'pcs' },
    { name: 'Roofing Sheets', quantity: 187, unit: 'sheets' },
    { name: 'Wood Planks', quantity: 324, unit: 'pcs' },
    { name: 'Plywood', quantity: 156, unit: 'sheets' },
    { name: 'Pliers/Cutters', quantity: 89, unit: 'pcs' }
  ];

  // Damaged materials
  const damagedMaterials = [
    { name: 'Cement Bags', quantity: 12, reason: 'Water damage', value: 3600 },
    { name: 'Hollow Blocks', quantity: 45, reason: 'Cracked', value: 2250 },
    { name: 'Roofing Sheets', quantity: 8, reason: 'Bent/Dented', value: 4800 },
    { name: 'Wood Planks', quantity: 15, reason: 'Termite damage', value: 7500 }
  ];

  // Low stock items
  const lowStockItems = [
    { name: 'Pliers Set', current: 12, minimum: 50, status: 'critical' },
    { name: 'Wire Cutters', current: 28, minimum: 40, status: 'warning' },
    { name: 'Cement (Premium)', current: 35, minimum: 100, status: 'critical' },
    { name: 'Roofing Nails', current: 67, minimum: 80, status: 'warning' }
  ];

  // Top selling items this month
  const topSellingItems = [
    { name: 'Hollow Blocks', sales: 234000, percentage: 28.9 },
    { name: 'Cement Bags', sales: 135000, percentage: 16.7 },
    { name: 'Wood Planks', sales: 97200, percentage: 12.0 },
    { name: 'Roofing Sheets', sales: 84150, percentage: 10.4 },
    { name: 'Plywood', sales: 78000, percentage: 9.6 }
  ];

  const totalSales = monthlySalesData[10].sales;
  const totalItemsSold = monthlySalesData[10].items;
  const totalDamagedValue = damagedMaterials.reduce((sum, item) => sum + item.value, 0);
  const totalDamagedItems = damagedMaterials.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Inventory Dashboard</h1>
          <p className="text-black mt-1">{selectedMonth}</p>
        </div>

        {/* Key Metrics Cards — BLACK NEUMORPHISM APPLIED HERE ONLY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-4 bg-[#1a1a1a] rounded-xl shadow-[6px_6px_12px_#000000, -6px_-6px_12px_#242424]">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white rounded-lg">
                <span className="text-black font-bold text-lg">₱</span>
              </div>
              <span className="text-xs text-white font-medium">This Month</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">₱{totalSales.toLocaleString()}</div>
            <p className="text-gray-300 text-xs">Total Sales Revenue</p>
          </div>

          <div className="p-4 bg-[#1a1a1a] rounded-xl shadow-[6px_6px_12px_#000000, -6px_-6px_12px_#242424]">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white rounded-lg">
                <ShoppingCart className="w-5 h-5 text-black" />
              </div>
              <span className="text-xs text-white font-medium">This Month</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{totalItemsSold}</div>
            <p className="text-gray-300 text-xs">Items Sold</p>
          </div>

          <div className="p-4 bg-[#1a1a1a] rounded-xl shadow-[6px_6px_12px_#000000, -6px_-6px_12px_#242424]">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white rounded-lg">
                <AlertTriangle className="w-5 h-5 text-black" />
              </div>
              <span className="text-xs text-white font-medium">Total Damaged</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{totalDamagedItems}</div>
            <p className="text-gray-300 text-xs">Worth ₱{totalDamagedValue.toLocaleString()}</p>
          </div>

          <div className="p-4 bg-[#1a1a1a] rounded-xl shadow-[6px_6px_12px_#000000, -6px_-6px_12px_#242424]">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white rounded-lg">
                <Activity className="w-5 h-5 text-black" />
              </div>
              <span className="text-xs text-white font-medium">Status</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{lowStockItems.length}</div>
            <p className="text-gray-300 text-xs">Low Stock Alerts</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Materials Sold This Month */}
          <div className="border-2 border-black p-6 bg-white rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-black" />
              <h2 className="text-xl font-bold text-black">Materials Sold This Month</h2>
            </div>
            <div className="space-y-4">
              {materialsSoldThisMonth.map((item, index) => (
                <div key={index} className="border-b border-black pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-black font-medium">{item.name}</span>
                    <span className="text-black font-bold">{item.quantity}</span>
                  </div>
                  <span className="text-sm text-black">{item.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Damaged Materials */}
          <div className="border-2 border-black p-6 bg-white rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-black" />
              <h2 className="text-xl font-bold text-black">Damaged Materials</h2>
            </div>
            <div className="space-y-4">
              {damagedMaterials.map((item, index) => (
                <div key={index} className="border-b border-black pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-black font-medium">{item.name}</span>
                    <span className="text-black font-bold">{item.quantity} pcs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">{item.reason}</span>
                    <span className="text-sm text-black font-medium">₱{item.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="border-2 border-black p-6 bg-white rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <Box className="w-6 h-6 text-black" />
              <h2 className="text-xl font-bold text-black">Low Stock Alert</h2>
            </div>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="border-b border-black pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-black font-medium">{item.name}</span>
                    <span className={`text-xs px-2 py-1 border border-black ${item.status === 'critical' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Current: {item.current}</span>
                    <span className="text-sm text-black">Min: {item.minimum}</span>
                  </div>
                  <div className="mt-2 bg-white border border-black h-2">
                    <div 
                      className="bg-black h-full" 
                      style={{ width: `${(item.current / item.minimum) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales Chart */}
          <div className="border-2 border-black p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-black" />
              <h2 className="text-xl font-bold text-black">Monthly Sales (Jan - Nov 2025)</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalesData.slice(0, 11)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                <XAxis dataKey="month" stroke="#000" />
                <YAxis stroke="#000" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '2px solid #000', color: '#000' }}
                  labelStyle={{ color: '#000' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#000" strokeWidth={2} dot={{ fill: '#000', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Selling Items */}
          <div className="border-2 border-black p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-black" />
              <h2 className="text-xl font-bold text-black">Top Selling Items</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSellingItems}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                <XAxis dataKey="name" stroke="#000" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#000" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '2px solid #000', color: '#000' }}
                  labelStyle={{ color: '#000' }}
                />
                <Bar dataKey="sales" fill="#000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;