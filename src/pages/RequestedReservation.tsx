    import React, { useState, useEffect } from 'react';
    import { Calendar, Clock, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react';

    interface Reservation {
    id: string;
    customerName: string;
    customerPhone: string;
    category: 'Social' | 'Affordable' | 'Premium' | 'Deluxe';
    doorNumber: number;
    requestDate: Date;
    expiresAt: Date;
    status: 'pending' | 'expired';
    }

    const App: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([
        {
        id: '1',
        customerName: 'John Smith',
        customerPhone: '+1 555-123-4567',
        category: 'Premium',
        doorNumber: 1,
        requestDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        status: 'pending'
        },
        {
        id: '2',
        customerName: 'Sarah Johnson',
        customerPhone: '+1 555-987-6543',
        category: 'Deluxe',
        doorNumber: 2,
        requestDate: new Date(Date.now() - 1000 * 60 * 60 * 48),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: 'pending'
        },
        {
        id: '3',
        customerName: 'Mike Davis',
        customerPhone: '+1 555-456-7890',
        category: 'Affordable',
        doorNumber: 3,
        requestDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: 'expired'
        },
        {
        id: '4',
        customerName: 'Emily Brown',
        customerPhone: '+1 555-234-5678',
        category: 'Social',
        doorNumber: 4,
        requestDate: new Date(Date.now() - 1000 * 60 * 60 * 12),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2.5),
        status: 'pending'
        }
    ]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Reservation>>({});
    const [filter, setFilter] = useState<'all' | 'pending' | 'expired'>('all');

    useEffect(() => {
        const interval = setInterval(() => {
        setReservations(prev =>
            prev.map(res => ({
            ...res,
            status: new Date() > res.expiresAt ? 'expired' : 'pending'
            }))
        );
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const getCategoryColor = (category: string) => {
        const colors = {
        Social: 'bg-blue-100 text-blue-800',
        Affordable: 'bg-green-100 text-green-800',
        Premium: 'bg-purple-100 text-purple-800',
        Deluxe: 'bg-amber-100 text-amber-800'
        };
        return colors[category as keyof typeof colors];
    };

    const getTimeRemaining = (expiresAt: Date) => {
        const now = new Date();
        const diff = expiresAt.getTime() - now.getTime();
        
        if (diff < 0) return 'Expired';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ${hours % 24}h remaining`;
        return `${hours}h remaining`;
    };

    const formatDateTimeLocal = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    const handleEdit = (reservation: Reservation) => {
        setEditingId(reservation.id);
        setEditForm(reservation);
    };

    const handleSave = () => {
        if (editingId) {
        setReservations(prev =>
            prev.map(res =>
            res.id === editingId ? { ...res, ...editForm } : res
            )
        );
        setEditingId(null);
        setEditForm({});
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
        setReservations(prev => prev.filter(res => res.id !== id));
        }
    };

    const filteredReservations = reservations.filter(res => {
        if (filter === 'all') return true;
        return res.status === filter;
    });

    const pendingCount = reservations.filter(r => r.status === 'pending').length;
    const expiredCount = reservations.filter(r => r.status === 'expired').length;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white p-0 m-0">
        {/* Header - Full width */}
        <div className="bg-white shadow-sm border-b border-blue-100">
            <div className="px-6 py-6">
            <h1 className="text-3xl font-bold text-blue-900">Apartment Reservations</h1>
            <p className="mt-1 text-sm text-gray-600">Manage customer reservation requests</p>
            </div>
        </div>

        {/* Main Content - FULL WIDTH (no max-width limit) */}
        <div className="w-full px-6 py-6"> {/* Removed max-w-7xl */}
            {/* Stats Cards - Stretched */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
                { label: 'Total Requests', value: reservations.length, color: 'blue', icon: <Calendar className="w-8 h-8 text-blue-600" /> },
                { label: 'Pending', value: pendingCount, color: 'green', icon: <Clock className="w-8 h-8 text-green-600" /> },
                { label: 'Expired', value: expiredCount, color: 'red', icon: <AlertCircle className="w-8 h-8 text-red-600" /> }
            ].map((item, i) => (
                <div 
                key={i}
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-${item.color}-500`}
                >
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${
                        item.color === 'blue' ? 'text-blue-900' :
                        item.color === 'green' ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {item.value}
                    </p>
                    </div>
                    <div className={`bg-${item.color}-100 rounded-full p-3`}>
                    {item.icon}
                    </div>
                </div>
                </div>
            ))}
            </div>

            {/* Filter Buttons */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-3">
                {(['all', 'pending', 'expired'] as const).map((status) => {
                const count = status === 'all' ? reservations.length 
                            : status === 'pending' ? pendingCount 
                            : expiredCount;
                return (
                    <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                        filter === status
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    >
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                    </button>
                );
                })}
            </div>
            </div>

            {/* Reservations Table - Full width */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                <thead className="bg-blue-600 text-white">
                    <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Door Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Request Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Expires At</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-blue-50 transition-colors">
                        {editingId === reservation.id ? (
                        <>
                            <td className="px-6 py-4">
                            <input
                                type="text"
                                value={editForm.customerName || ''}
                                onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Customer Name"
                            />
                            <input
                                type="tel"
                                value={editForm.customerPhone || ''}
                                onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
                                className="w-full mt-2 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Phone Number"
                            />
                            </td>
                            <td className="px-6 py-4">
                            <select
                                value={editForm.category || ''}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Social">Social</option>
                                <option value="Affordable">Affordable</option>
                                <option value="Premium">Premium</option>
                                <option value="Deluxe">Deluxe</option>
                            </select>
                            </td>
                            <td className="px-6 py-4">
                            <select
                                value={editForm.doorNumber || ''}
                                onChange={(e) => setEditForm({ ...editForm, doorNumber: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>Door 1</option>
                                <option value={2}>Door 2</option>
                                <option value={3}>Door 3</option>
                                <option value={4}>Door 4</option>
                            </select>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                            {editForm.requestDate?.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                            <input
                                type="datetime-local"
                                value={editForm.expiresAt ? formatDateTimeLocal(editForm.expiresAt) : ''}
                                onChange={(e) => setEditForm({ ...editForm, expiresAt: new Date(e.target.value) })}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <span className="text-xs text-gray-500 mt-1 block">Set expiration</span>
                            </td>
                            <td className="px-6 py-4" colSpan={2}>
                            <div className="flex gap-3 justify-center">
                                <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                <Save className="w-4 h-4" />
                                Save
                                </button>
                                <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                <X className="w-4 h-4" />
                                Cancel
                                </button>
                            </div>
                            </td>
                        </>
                        ) : (
                        <>
                            <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{reservation.customerName}</div>
                            <div className="text-sm text-gray-500">{reservation.customerPhone}</div>
                            </td>
                            <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(reservation.category)}`}>
                                {reservation.category}
                            </span>
                            </td>
                            <td className="px-6 py-4">
                            <span className="font-mono font-semibold text-blue-900">Door {reservation.doorNumber}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                            {reservation.requestDate.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{reservation.expiresAt.toLocaleString()}</div>
                            <span className={`text-xs font-medium ${
                                reservation.status === 'expired' ? 'text-red-600' : 'text-green-600'
                            }`}>
                                {getTimeRemaining(reservation.expiresAt)}
                            </span>
                            </td>
                            <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                reservation.status === 'pending'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                                {reservation.status.toUpperCase()}
                            </span>
                            </td>
                            <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
                                <button
                                onClick={() => handleEdit(reservation)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="Edit"
                                >
                                <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                onClick={() => handleDelete(reservation.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Cancel Reservation"
                                >
                                <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            </td>
                        </>
                        )}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            
            {filteredReservations.length === 0 && (
                <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No reservations found</p>
                </div>
            )}
            </div>
        </div>
        </div>
    );
    };

    export default App;