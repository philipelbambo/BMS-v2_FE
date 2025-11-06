    import React, { useState, useEffect } from 'react';
    import { Printer, RefreshCw } from 'lucide-react';

    interface MaterialItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalValue: number;
    lastUpdated: string;
    }

    const StoreReport = () => {
    const [materials, setMaterials] = useState<MaterialItem[]>([
        {
        id: '1',
        name: 'Cement Bags',
        quantity: 250,
        unit: 'bags',
        unitPrice: 285.00,
        totalValue: 71250.00,
        lastUpdated: new Date().toISOString()
        },
        {
        id: '2',
        name: 'Hollow Blocks',
        quantity: 1500,
        unit: 'pcs',
        unitPrice: 12.50,
        totalValue: 18750.00,
        lastUpdated: new Date().toISOString()
        },
        {
        id: '3',
        name: 'Roofing Sheets',
        quantity: 80,
        unit: 'sheets',
        unitPrice: 450.00,
        totalValue: 36000.00,
        lastUpdated: new Date().toISOString()
        },
        {
        id: '4',
        name: 'Wood Planks',
        quantity: 120,
        unit: 'pcs',
        unitPrice: 180.00,
        totalValue: 21600.00,
        lastUpdated: new Date().toISOString()
        },
        {
        id: '5',
        name: 'Plywood',
        quantity: 45,
        unit: 'sheets',
        unitPrice: 650.00,
        totalValue: 29250.00,
        lastUpdated: new Date().toISOString()
        },
        {
        id: '6',
        name: 'Pliers/Cutters',
        quantity: 35,
        unit: 'pcs',
        unitPrice: 125.00,
        totalValue: 4375.00,
        lastUpdated: new Date().toISOString()
        }
    ]);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleRefresh = () => {
        setMaterials(prev => prev.map(item => ({
        ...item,
        lastUpdated: new Date().toISOString()
        })));
    };

    const totalInventoryValue = materials.reduce((sum, item) => sum + item.totalValue, 0);

    const formatCurrency = (amount: number) => {
        return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDateTime = (date: Date) => {
        return date.toLocaleString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-white p-8">
        <div className="w-full">
            {/* Header - Hidden on print */}
            <div className="flex justify-between items-center mb-8 print:hidden">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">Materials Inventory Report</h1>
                <p className="text-black text-sm">Real-time updated: {formatDateTime(currentTime)}</p>
            </div>
            <div className="flex gap-3">
                <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 border border-black text-black hover:bg-gray-100 transition-colors"
                >
                <RefreshCw size={18} />
                Refresh
                </button>
                <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                >
                <Printer size={18} />
                Print Report
                </button>
            </div>
            </div>

            {/* Print Header - Visible only on print */}
            <div className="hidden print:block mb-8">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-black mb-2">Materials Inventory Report</h1>
                <p className="text-black text-base">Generated: {formatDateTime(currentTime)}</p>
            </div>
            <div className="border-t-2 border-b-2 border-black py-2 mb-6">
                <p className="text-black font-semibold">Store Inventory Management System</p>
            </div>
            </div>

            {/* Report Table */}
            <div className="border-2 border-black">
            <table className="w-full">
                <thead>
                <tr className="border-b-2 border-black">
                    <th className="text-left p-4 text-black font-bold">Item No.</th>
                    <th className="text-left p-4 text-black font-bold">Material Name</th>
                    <th className="text-right p-4 text-black font-bold">Quantity</th>
                    <th className="text-left p-4 text-black font-bold">Unit</th>
                    <th className="text-right p-4 text-black font-bold">Unit Price</th>
                    <th className="text-right p-4 text-black font-bold">Total Value</th>
                </tr>
                </thead>
                <tbody>
                {materials.map((item, index) => (
                    <tr key={item.id} className="border-b border-black">
                    <td className="p-4 text-black">{index + 1}</td>
                    <td className="p-4 text-black font-medium">{item.name}</td>
                    <td className="p-4 text-black text-right">{item.quantity.toLocaleString()}</td>
                    <td className="p-4 text-black">{item.unit}</td>
                    <td className="p-4 text-black text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-4 text-black text-right font-medium">{formatCurrency(item.totalValue)}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr className="border-t-2 border-black bg-gray-50">
                    <td colSpan={5} className="p-4 text-black font-bold text-right">Total Inventory Value:</td>
                    <td className="p-4 text-black font-bold text-right text-lg">{formatCurrency(totalInventoryValue)}</td>
                </tr>
                </tfoot>
            </table>
            </div>

            {/* Summary Section */}
            <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="border border-black p-6">
                <p className="text-black text-sm mb-2">Total Items</p>
                <p className="text-black text-3xl font-bold">{materials.length}</p>
            </div>
            <div className="border border-black p-6">
                <p className="text-black text-sm mb-2">Total Units</p>
                <p className="text-black text-3xl font-bold">{materials.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}</p>
            </div>
            <div className="border border-black p-6">
                <p className="text-black text-sm mb-2">Inventory Value</p>
                <p className="text-black text-2xl font-bold">{formatCurrency(totalInventoryValue)}</p>
            </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-black">
            <div className="flex justify-between text-black text-sm">
                <div>
                <p className="font-semibold mb-1">Report Details</p>
                <p>Report Type: Inventory Summary</p>
                <p>Status: Real-time</p>
                </div>
                <div className="text-right">
                <p className="font-semibold mb-1">Prepared By</p>
                <p>Store Management System</p>
                <p className="print:hidden">Auto-generated report</p>
                </div>
            </div>
            </div>
        </div>

        {/* Print Styles */}
        <style>{`
            @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            .print\\:hidden {
                display: none !important;
            }
            .print\\:block {
                display: block !important;
            }
            @page {
                margin: 1cm;
                size: A4 portrait;
            }
            }
        `}</style>
        </div>
    );
    };

    export default StoreReport;