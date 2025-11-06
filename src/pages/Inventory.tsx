    import React, { useState, useEffect } from 'react';
    import { Package, Plus, Minus, Edit2, Save, X, Search, Download } from 'lucide-react';

    interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    minStock: number;
    lastUpdated: string;
    category: string;
    }

    export default function ConstructionInventory() {
    const [inventory, setInventory] = useState<InventoryItem[]>([
        { id: '1', name: 'Cement Bags', quantity: 150, unit: 'bags', minStock: 50, lastUpdated: new Date().toISOString(), category: 'Building Materials' },
        { id: '2', name: 'Hollow Blocks', quantity: 2500, unit: 'pcs', minStock: 500, lastUpdated: new Date().toISOString(), category: 'Building Materials' },
        { id: '3', name: 'Roofing Sheets', quantity: 85, unit: 'sheets', minStock: 20, lastUpdated: new Date().toISOString(), category: 'Roofing Materials' },
        { id: '4', name: 'Wood Planks (2x4x10)', quantity: 120, unit: 'pcs', minStock: 30, lastUpdated: new Date().toISOString(), category: 'Lumber' },
        { id: '5', name: 'Plywood (4x8)', quantity: 45, unit: 'sheets', minStock: 15, lastUpdated: new Date().toISOString(), category: 'Lumber' },
        { id: '6', name: 'Pliers', quantity: 12, unit: 'pcs', minStock: 5, lastUpdated: new Date().toISOString(), category: 'Tools' },
        { id: '7', name: 'Wire Cutters', quantity: 8, unit: 'pcs', minStock: 3, lastUpdated: new Date().toISOString(), category: 'Tools' },
        { id: '8', name: 'Steel Rebars (10mm)', quantity: 300, unit: 'pcs', minStock: 100, lastUpdated: new Date().toISOString(), category: 'Building Materials' },
        { id: '9', name: 'Sand', quantity: 15, unit: 'cu.m', minStock: 5, lastUpdated: new Date().toISOString(), category: 'Aggregates' },
        { id: '10', name: 'Gravel', quantity: 12, unit: 'cu.m', minStock: 5, lastUpdated: new Date().toISOString(), category: 'Aggregates' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const updateQuantity = (id: string, change: number) => {
        setInventory(prev => prev.map(item => 
        item.id === id 
            ? { ...item, quantity: Math.max(0, item.quantity + change), lastUpdated: new Date().toISOString() }
            : item
        ));
    };

    const startEdit = (id: string, currentQty: number) => {
        setEditingId(id);
        setEditValue(currentQty.toString());
    };

    const saveEdit = (id: string) => {
        const newQty = parseInt(editValue);
        if (!isNaN(newQty) && newQty >= 0) {
        setInventory(prev => prev.map(item =>
            item.id === id
            ? { ...item, quantity: newQty, lastUpdated: new Date().toISOString() }
            : item
        ));
        }
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const getStockStatus = (item: InventoryItem) => {
        if (item.quantity === 0) return { label: 'OUT OF STOCK', color: 'bg-red-100 text-red-800 border-red-300' };
        if (item.quantity <= item.minStock) return { label: 'LOW STOCK', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
        return { label: 'IN STOCK', color: 'bg-green-100 text-green-800 border-green-300' };
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = [...new Set(inventory.map(item => item.category))];

    const exportToCSV = () => {
        const headers = ['Item Name', 'Quantity', 'Unit', 'Minimum Stock', 'Category', 'Status', 'Last Updated'];
        const rows = inventory.map(item => {
        const status = getStockStatus(item);
        return [
            item.name,
            item.quantity,
            item.unit,
            item.minStock,
            item.category,
            status.label,
            new Date(item.lastUpdated).toLocaleString()
        ];
        });
        
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-white p-8">
        <div className="max-w-8xl mx-auto">
            {/* Header */}
            <div className="mb-8 border-b-2 border-black pb-6">
            <div className="flex items-center justify-between">
                <div>
                <div className="flex items-center gap-3 mb-2">
                    <Package className="w-10 h-10 text-black" />
                    <h1 className="text-4xl font-bold text-black">CONSTRUCTION MATERIALS INVENTORY</h1>
                </div>
                <p className="text-black text-sm mt-2">Real-time inventory tracking and management system</p>
                </div>
                <div className="text-right">
                <div className="text-2xl font-bold text-black">
                    {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-black">
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                </div>
            </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="border-2 border-black p-4">
                <div className="text-sm text-black mb-1">Total Items</div>
                <div className="text-3xl font-bold text-black">{inventory.length}</div>
            </div>
            <div className="border-2 border-black p-4">
                <div className="text-sm text-black mb-1">Categories</div>
                <div className="text-3xl font-bold text-black">{categories.length}</div>
            </div>
            <div className="border-2 border-black p-4">
                <div className="text-sm text-black mb-1">Low Stock Items</div>
                <div className="text-3xl font-bold text-black">
                {inventory.filter(item => item.quantity <= item.minStock && item.quantity > 0).length}
                </div>
            </div>
            <div className="border-2 border-black p-4">
                <div className="text-sm text-black mb-1">Out of Stock</div>
                <div className="text-3xl font-bold text-black">
                {inventory.filter(item => item.quantity === 0).length}
                </div>
            </div>
            </div>

            {/* Search and Export */}
            <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-black" />
                <input
                type="text"
                placeholder="Search by item name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-black text-black placeholder-gray-400 focus:outline-none"
                />
            </div>
            <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
            >
                <Download className="w-5 h-5" />
                Export CSV
            </button>
            </div>

            {/* Inventory Table */}
            <div className="border-2 border-black">
            <table className="w-full">
                <thead className="bg-black text-white">
                <tr>
                    <th className="px-6 py-4 text-left font-bold">ITEM NAME</th>
                    <th className="px-6 py-4 text-left font-bold">CATEGORY</th>
                    <th className="px-6 py-4 text-center font-bold">QUANTITY</th>
                    <th className="px-6 py-4 text-center font-bold">UNIT</th>
                    <th className="px-6 py-4 text-center font-bold">MIN. STOCK</th>
                    <th className="px-6 py-4 text-center font-bold">STATUS</th>
                    <th className="px-6 py-4 text-center font-bold">LAST UPDATED</th>
                    <th className="px-6 py-4 text-center font-bold">ACTIONS</th>
                </tr>
                </thead>
                <tbody>
                {filteredInventory.map((item, index) => {
                    const status = getStockStatus(item);
                    return (
                    <tr key={item.id} className={`border-t-2 border-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 text-black font-semibold">{item.name}</td>
                        <td className="px-6 py-4 text-black text-sm">{item.category}</td>
                        <td className="px-6 py-4 text-center">
                        {editingId === item.id ? (
                            <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24 px-2 py-1 border-2 border-black text-center text-black"
                            autoFocus
                            />
                        ) : (
                            <span className="text-black font-bold text-lg">{item.quantity}</span>
                        )}
                        </td>
                        <td className="px-6 py-4 text-center text-black text-sm">{item.unit}</td>
                        <td className="px-6 py-4 text-center text-black text-sm">{item.minStock}</td>
                        <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 text-xs font-bold border-2 inline-block ${status.color}`}>
                            {status.label}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-center text-black text-xs">
                        {new Date(item.lastUpdated).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                        {editingId === item.id ? (
                            <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => saveEdit(item.id)}
                                className="p-2 bg-black text-white hover:bg-gray-800"
                                title="Save"
                            >
                                <Save className="w-4 h-4" />
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="p-2 border-2 border-black text-black hover:bg-gray-100"
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-2 border-2 border-black text-black hover:bg-gray-100"
                                title="Decrease"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => startEdit(item.id, item.quantity)}
                                className="p-2 border-2 border-black text-black hover:bg-gray-100"
                                title="Edit"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-2 bg-black text-white hover:bg-gray-800"
                                title="Increase"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            </div>
                        )}
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>

            {filteredInventory.length === 0 && (
            <div className="text-center py-12 border-2 border-t-0 border-black">
                <p className="text-black text-lg">No items found matching your search.</p>
            </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t-2 border-black text-center text-black text-sm">
            <p>© 2025 Construction Materials Inventory System - Professional Real-Time Tracking</p>
            </div>
        </div>
        </div>
    );
    }