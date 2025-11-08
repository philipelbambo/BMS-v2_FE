import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, AlertTriangle, XCircle } from 'lucide-react';

// Define TypeScript interfaces for type safety
interface SaleItem {
  id: number;
  itemName: string;
  quantity: number;
  price: number;
  timestamp: Date;
}

interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  minStock: number;
  status: 'normal' | 'low' | 'damaged';
  damagedQuantity?: number;
}

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  highlight?: boolean;
  subtitle?: string;
}

const Dashboard: React.FC = () => {
  // Dummy sales data - represents today's transactions
  const [salesData] = useState<SaleItem[]>([
    { id: 1, itemName: 'Hammer', quantity: 3, price: 450, timestamp: new Date() },
    { id: 2, itemName: 'Screwdriver Set', quantity: 2, price: 850, timestamp: new Date() },
    { id: 3, itemName: 'Paint Brush', quantity: 5, price: 120, timestamp: new Date() },
    { id: 4, itemName: 'Nails (1kg)', quantity: 10, price: 250, timestamp: new Date() },
    { id: 5, itemName: 'Electric Drill', quantity: 1, price: 3500, timestamp: new Date() },
    { id: 6, itemName: 'Measuring Tape', quantity: 4, price: 180, timestamp: new Date() },
    { id: 7, itemName: 'Plywood Sheet', quantity: 6, price: 850, timestamp: new Date() },
    { id: 8, itemName: 'Wood Glue', quantity: 8, price: 95, timestamp: new Date() },
  ]);

  // Dummy inventory data - represents current stock status
  const [inventoryData] = useState<InventoryItem[]>([
    { id: 1, name: 'Hammer', stock: 5, minStock: 10, status: 'low' },
    { id: 2, name: 'Screwdriver Set', stock: 15, minStock: 8, status: 'normal' },
    { id: 3, name: 'Paint Brush', stock: 3, minStock: 15, status: 'low' },
    { id: 4, name: 'Nails (1kg)', stock: 45, minStock: 20, status: 'normal' },
    { id: 5, name: 'Electric Drill', stock: 2, minStock: 5, status: 'low' },
    { id: 6, name: 'Measuring Tape', stock: 25, minStock: 10, status: 'normal' },
    { id: 7, name: 'Plywood Sheet', stock: 12, minStock: 8, status: 'normal' },
    { id: 8, name: 'Wood Glue', stock: 8, minStock: 12, status: 'low' },
    { id: 9, name: 'Cement Mix', stock: 0, minStock: 10, status: 'damaged', damagedQuantity: 5 },
    { id: 10, name: 'Sandpaper Pack', stock: 0, minStock: 20, status: 'damaged', damagedQuantity: 3 },
    { id: 11, name: 'Wire Cutters', stock: 0, minStock: 6, status: 'damaged', damagedQuantity: 2 },
  ]);

  // State for calculated dashboard metrics
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalItemsSold, setTotalItemsSold] = useState<number>(0);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [damagedItemsCount, setDamagedItemsCount] = useState<number>(0);

  // Calculate all metrics when component mounts or data changes
  useEffect(() => {
    // Calculate total sales (sum of price * quantity for all sales)
    const sales = salesData.reduce((total, sale) => {
      return total + (sale.price * sale.quantity);
    }, 0);
    setTotalSales(sales);

    // Calculate total items sold (sum of all quantities)
    const itemsSold = salesData.reduce((total, sale) => {
      return total + sale.quantity;
    }, 0);
    setTotalItemsSold(itemsSold);

    // Count low stock items (where stock is below minimum threshold)
    const lowStock = inventoryData.filter(item => item.status === 'low').length;
    setLowStockCount(lowStock);

    // Count damaged items
    const damaged = inventoryData.filter(item => item.status === 'damaged').length;
    setDamagedItemsCount(damaged);
  }, [salesData, inventoryData]);

  // Reusable Dashboard Card Component with Neomorphism
  const DashboardCard: React.FC<DashboardCardProps> = ({ 
    title, 
    value, 
    icon, 
    highlight = false,
    subtitle 
  }) => (
    <div 
    className="rounded-xl p-6 transition-all duration-300"
    style={{
      background: '#DC0E0E',
      boxShadow: 'inset 0 4px 10px rgba(0, 0, 0, 0.4)'
    }}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
        <p className="text-4xl font-bold mb-1 text-white">
          {value}
        </p>
        {subtitle && (
          <p className="text-white/70 text-xs mt-1">{subtitle}</p>
        )}
      </div>
      <div className="text-white">
        {icon}
      </div>
    </div>
  </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hardware Store Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of today's performance and inventory status
        </p>
      </div>

      {/* Dashboard Cards Grid */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Sales Card */}
          <DashboardCard
            title="Total Sales Today"
            value={`₱${totalSales.toLocaleString()}`}
            icon={<ShoppingCart size={28} />}
            subtitle={`${salesData.length} transactions`}
          />

          {/* Total Items Sold Card */}
          <DashboardCard
            title="Total Items Sold Today"
            value={totalItemsSold}
            icon={<Package size={28} />}
            subtitle="Units sold"
          />

          {/* Low Stock Items Card - Highlighted */}
          <DashboardCard
            title="Low Stock Items"
            value={lowStockCount}
            icon={<AlertTriangle size={28} />}
            highlight={true}
            subtitle="Requires restocking"
          />

          {/* Damaged Items Card - Highlighted */}
          <DashboardCard
            title="Damaged Items"
            value={damagedItemsCount}
            icon={<XCircle size={28} />}
            highlight={true}
            subtitle="Need attention"
          />
        </div>

        {/* Low Stock Items List */}
        {lowStockCount > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={24} className="text-[#DC0E0E]" />
              Low Stock Alert
            </h2>
            <div className="space-y-3">
              {inventoryData
                .filter(item => item.status === 'low')
                .map(item => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Minimum required: {item.minStock} units
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#DC0E0E]">{item.stock}</p>
                      <p className="text-xs text-gray-600">in stock</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Damaged Items List */}
        {damagedItemsCount > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <XCircle size={24} className="text-[#DC0E0E]" />
              Damaged Items Report
            </h2>
            <div className="space-y-3">
              {inventoryData
                .filter(item => item.status === 'damaged')
                .map(item => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Requires inspection</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#DC0E0E]">
                        {item.damagedQuantity}
                      </p>
                      <p className="text-xs text-gray-600">damaged units</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Note for Future Enhancements */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-red-700 text-center">
            Future Enhancement: Sales trends charts and inventory analytics will be added here
        </p>
      </div>
    </div>
  );
};

export default Dashboard;