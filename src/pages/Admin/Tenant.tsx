    import React, { useState, useEffect } from 'react';
    import { Search, Edit2, Eye, MoreVertical, UserCheck, UserX, RefreshCw, Filter, Download, Plus } from 'lucide-react';

    // Types
    interface Tenant {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    roomNumber: string;
    roomType: string;
    baseRent: number;
    wifiFee: number;
    monthlyRent: number;
    status: 'active' | 'pending' | 'inactive' | 'moved_out';
    registrationDate: string;
    moveInDate?: string;
    emergencyContact?: string;
    }

    interface EditTenantData {
    fullName: string;
    email: string;
    phone: string;
    roomNumber: string;
    baseRent: number;
    wifiFee: number;
    monthlyRent: number;
    status: 'active' | 'pending' | 'inactive' | 'moved_out';
    emergencyContact: string;
    }

    const TenantManagement: React.FC = () => {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: string; tenant: Tenant | null }>({ type: '', tenant: null });
    const [editData, setEditData] = useState<EditTenantData>({
        fullName: '',
        email: '',
        phone: '',
        roomNumber: '',
        baseRent: 1000,
        wifiFee: 100,
        monthlyRent: 1100,
        status: 'active',
        emergencyContact: ''
    });
    const [loading, setLoading] = useState(false);

    // Mock initial data
    useEffect(() => {
        const mockTenants: Tenant[] = [
        {
            id: '1',
            fullName: 'John Michael Santos',
            email: 'john.santos@email.com',
            phone: '+63 912 345 6789',
            roomNumber: '1',
            roomType: 'Single',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'active',
            registrationDate: '2024-01-15',
            moveInDate: '2024-01-20',
            emergencyContact: '+63 912 345 0000'
        },
        {
            id: '2',
            fullName: 'Maria Clara Reyes',
            email: 'maria.reyes@email.com',
            phone: '+63 923 456 7890',
            roomNumber: '2',
            roomType: 'Double',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'active',
            registrationDate: '2024-02-10',
            moveInDate: '2024-02-15',
            emergencyContact: '+63 923 456 0000'
        },
        {
            id: '3',
            fullName: 'Robert Chen',
            email: 'robert.chen@email.com',
            phone: '+63 934 567 8901',
            roomNumber: '3',
            roomType: 'Single',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'pending',
            registrationDate: '2024-11-28',
            emergencyContact: '+63 934 567 0000'
        },
        {
            id: '4',
            fullName: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '+63 945 678 9012',
            roomNumber: '4',
            roomType: 'Studio',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'active',
            registrationDate: '2024-03-05',
            moveInDate: '2024-03-10',
            emergencyContact: '+63 945 678 0000'
        },
        {
            id: '5',
            fullName: 'Michael Torres',
            email: 'michael.torres@email.com',
            phone: '+63 956 789 0123',
            roomNumber: '5',
            roomType: 'Double',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'inactive',
            registrationDate: '2024-04-12',
            moveInDate: '2024-04-15',
            emergencyContact: '+63 956 789 0000'
        },
        {
            id: '6',
            fullName: 'Jennifer Lee',
            email: 'jennifer.lee@email.com',
            phone: '+63 967 890 1234',
            roomNumber: '6',
            roomType: 'Single',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'moved_out',
            registrationDate: '2023-09-20',
            moveInDate: '2023-09-25',
            emergencyContact: '+63 967 890 0000'
        },
        {
            id: '7',
            fullName: 'David Wilson',
            email: 'david.wilson@email.com',
            phone: '+63 978 901 2345',
            roomNumber: '7',
            roomType: 'Single',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'active',
            registrationDate: '2024-05-10',
            moveInDate: '2024-05-15',
            emergencyContact: '+63 978 901 0000'
        },
        {
            id: '8',
            fullName: 'Emma Thompson',
            email: 'emma.thompson@email.com',
            phone: '+63 989 012 3456',
            roomNumber: '8',
            roomType: 'Double',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'active',
            registrationDate: '2024-06-12',
            moveInDate: '2024-06-17',
            emergencyContact: '+63 989 012 0000'
        },
        {
            id: '9',
            fullName: 'James Rodriguez',
            email: 'james.rodriguez@email.com',
            phone: '+63 990 123 4567',
            roomNumber: '9',
            roomType: 'Single',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'active',
            registrationDate: '2024-07-14',
            moveInDate: '2024-07-19',
            emergencyContact: '+63 990 123 0000'
        },
        {
            id: '10',
            fullName: 'Olivia Parker',
            email: 'olivia.parker@email.com',
            phone: '+63 901 234 5678',
            roomNumber: '10',
            roomType: 'Studio',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'active',
            registrationDate: '2024-08-16',
            moveInDate: '2024-08-21',
            emergencyContact: '+63 901 234 0000'
        },
        {
            id: '11',
            fullName: 'Sophia Martinez',
            email: 'sophia.martinez@email.com',
            phone: '+63 912 345 6789',
            roomNumber: '11',
            roomType: 'Pad',
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'active',
            registrationDate: '2024-09-18',
            moveInDate: '2024-09-23',
            emergencyContact: '+63 912 345 0000'
        }
        ];
        setTenants(mockTenants);
        setFilteredTenants(mockTenants);
    }, []);

    // Filter and search logic
    useEffect(() => {
        let result = tenants;

        if (statusFilter !== 'all') {
        result = result.filter(t => t.status === statusFilter);
        }

        if (searchQuery) {
        result = result.filter(t =>
            t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.phone.includes(searchQuery)
        );
        }

        setFilteredTenants(result);
    }, [searchQuery, statusFilter, tenants]);

    const getStatusBadge = (status: string) => {
        const styles = {
        active: 'bg-green-100 text-green-800 border border-green-200',
        pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        inactive: 'bg-gray-100 text-gray-800 border border-gray-200',
        moved_out: 'bg-red-100 text-red-800 border border-red-200'
        };
        const labels = {
        active: 'Active',
        pending: 'Pending',
        inactive: 'Inactive',
        moved_out: 'Moved Out'
        };
        return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
            {labels[status as keyof typeof labels]}
        </span>
        );
    };

    const handleEdit = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setEditData({
        fullName: tenant.fullName,
        email: tenant.email,
        phone: tenant.phone,
        roomNumber: tenant.roomNumber,
        baseRent: tenant.baseRent,
        wifiFee: tenant.wifiFee,
        monthlyRent: tenant.baseRent + tenant.wifiFee,
        status: tenant.status,
        emergencyContact: tenant.emergencyContact || ''
        });
        setShowEditModal(true);
    };

    const handleViewDetails = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setShowDetailsModal(true);
    };

    const handleStatusChange = (tenant: Tenant, newStatus: string) => {
        setConfirmAction({ type: 'status', tenant: { ...tenant, status: newStatus as any } });
        setShowConfirmModal(true);
    };

    const handleSaveEdit = () => {
        if (!selectedTenant) return;
        
        // Validate room number is between 1 and 11
        const roomNumber = parseInt(editData.roomNumber);
        if (isNaN(roomNumber) || roomNumber < 1 || roomNumber > 11) {
            alert('Room number must be between 1 and 11');
            return;
        }
        
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
        const updatedTenants = tenants.map(t =>
            t.id === selectedTenant.id
            ? { ...t, ...editData, monthlyRent: editData.baseRent + editData.wifiFee }
        : t
        );
        setTenants(updatedTenants);
        setShowEditModal(false);
        setLoading(false);
        }, 800);
    };
    
    const handleAddTenant = () => {
        // Set initial state for adding a new tenant
        setEditData({
            fullName: '',
            email: '',
            phone: '',
            roomNumber: '1', // Default to room 1
            baseRent: 1000,
            wifiFee: 100,
            monthlyRent: 1100,
            status: 'pending',
            emergencyContact: ''
        });
        setSelectedTenant(null);
        setShowEditModal(true);
    };
    
    const handleSaveNewTenant = () => {
        // Validate room number is between 1 and 11
        const roomNumber = parseInt(editData.roomNumber);
        if (isNaN(roomNumber) || roomNumber < 1 || roomNumber > 11) {
            alert('Room number must be between 1 and 11');
            return;
        }
        
        // Check if room is already occupied
        const existingTenant = tenants.find(t => t.roomNumber === editData.roomNumber && t.status !== 'moved_out');
        if (existingTenant) {
            alert(`Room ${editData.roomNumber} is already occupied by ${existingTenant.fullName}`);
            return;
        }
        
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const newTenant: Tenant = {
                id: (tenants.length + 1).toString(),
                fullName: editData.fullName,
                email: editData.email,
                phone: editData.phone,
                roomNumber: editData.roomNumber,
                roomType: editData.roomNumber === '11' ? 'Pad' : 'Single', // Room 11 is a special 'Pad' type
                baseRent: editData.baseRent,
                wifiFee: editData.wifiFee,
                monthlyRent: editData.monthlyRent, // Use calculated monthly rent
                status: editData.status,
                registrationDate: new Date().toISOString().split('T')[0],
                emergencyContact: editData.emergencyContact
            };
            setTenants([...tenants, newTenant]);
            setShowEditModal(false);
            setLoading(false);
        }, 800);
    };

    const confirmStatusChange = () => {
        if (!confirmAction.tenant) return;
        
        setLoading(true);
        setTimeout(() => {
        const updatedTenants = tenants.map(t =>
            t.id === confirmAction.tenant?.id
            ? { ...t, status: confirmAction.tenant.status }
            : t
        );
        setTenants(updatedTenants);
        setShowConfirmModal(false);
        setLoading(false);
        }, 800);
    };

    const formatCurrency = (amount: number) => {
        return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-white p-6">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenant Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#001F3D] rounded p-6 shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-green-400 text-sm font-semibold mb-1">Active Tenants</p>
                <p className="text-3xl font-bold text-white">
                    {tenants.filter(t => t.status === 'active').length}
                </p>
                </div>
                <UserCheck className="w-12 h-12 text-green-400 opacity-80" />
            </div>
            </div>
            
            <div className="bg-[#001F3D] rounded p-6 shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-yellow-400 text-sm font-semibold mb-1">Pending</p>
                <p className="text-3xl font-bold text-white">
                    {tenants.filter(t => t.status === 'pending').length}
                </p>
                </div>
                <RefreshCw className="w-12 h-12 text-yellow-400 opacity-80" />
            </div>
            </div>
            
            <div className="bg-[#001F3D] rounded p-6 shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-gray-400 text-sm font-semibold mb-1">Inactive</p>
                <p className="text-3xl font-bold text-white">
                    {tenants.filter(t => t.status === 'inactive').length}
                </p>
                </div>
                <UserX className="w-12 h-12 text-gray-400 opacity-80" />
            </div>
            </div>
            
            <div className="bg-[#001F3D] rounded p-6 shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-red-400 text-sm font-semibold mb-1">Moved Out</p>
                <p className="text-3xl font-bold text-white">
                    {tenants.filter(t => t.status === 'moved_out').length}
                </p>
                </div>
                <Download className="w-12 h-12 text-red-400 opacity-80" />
            </div>
            </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                type="text"
                placeholder="Search by name, email, room number (1-11), or phone..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="flex gap-3">
                <select
                className="px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="moved_out">Moved Out</option>
                </select>
                
                <button onClick={handleAddTenant} className="px-6 py-3 bg-[#001F3D] text-white rounded hover:bg-[#003366] transition-colors font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Tenant
                </button>
            </div>
            </div>
        </div>

        {/* Tenant Table */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-[#001F3D] text-white">
                <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Tenant Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Contact Info</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Room Details</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Monthly Rent</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Registration Date</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {filteredTenants.map((tenant, index) => (
                    <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#001F3D] text-white flex items-center justify-center font-bold">
                            {tenant.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{tenant.fullName}</p>
                            <p className="text-sm text-gray-500">ID: {tenant.id}</p>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div>
                        <p className="text-sm text-gray-900">{tenant.email}</p>
                        <p className="text-sm text-gray-500">{tenant.phone}</p>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div>
                        <p className="font-semibold text-gray-900">{tenant.roomNumber}</p>
                        <p className="text-sm text-gray-500">{tenant.roomNumber === '11' ? 'Pad' : tenant.roomType}</p>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{formatCurrency(tenant.monthlyRent)}</p>
                    </td>
                    <td className="px-6 py-4">
                        {getStatusBadge(tenant.status)}
                    </td>
                    <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{formatDate(tenant.registrationDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => handleViewDetails(tenant)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleEdit(tenant)}
                            className="p-2 text-[#001F3D] hover:bg-blue-50 rounded transition-colors"
                            title="Edit Tenant"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                        <div className="relative group">
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                            <MoreVertical className="w-5 h-5" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border border-gray-200 hidden group-hover:block z-10">
                            <button
                                onClick={() => handleStatusChange(tenant, 'active')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                            >
                                Set as Active
                            </button>
                            <button
                                onClick={() => handleStatusChange(tenant, 'inactive')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                            >
                                Set as Inactive
                            </button>
                            <button
                                onClick={() => handleStatusChange(tenant, 'moved_out')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600"
                            >
                                Mark as Moved Out
                            </button>
                            </div>
                        </div>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {filteredTenants.length === 0 && (
            <div className="py-12 text-center text-gray-500">
                <p className="text-lg">No tenants found matching your criteria</p>
            </div>
            )}
        </div>

        {/* Edit Modal */}
        {showEditModal && selectedTenant && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-[#001F3D] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-bold">{selectedTenant ? 'Edit Tenant Information' : 'Add New Tenant'}</h2>
                <button onClick={() => setShowEditModal(false)} className="text-white hover:text-gray-200">
                    ✕
                </button>
                </div>
                
                <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.fullName}
                        onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
                    <input
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.emergencyContact}
                        onChange={(e) => setEditData({ ...editData, emergencyContact: e.target.value })}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number (1-11)</label>
                    <input
                        type="number"
                        min="1"
                        max="11"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.roomNumber}
                        onChange={(e) => setEditData({ ...editData, roomNumber: e.target.value })}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Base Rent</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.baseRent}
                        onChange={(e) => setEditData({ ...editData, baseRent: parseFloat(e.target.value), monthlyRent: parseFloat(e.target.value) + editData.wifiFee })}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WiFi Fee (End of Month)</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.wifiFee}
                        onChange={(e) => setEditData({ ...editData, wifiFee: parseFloat(e.target.value), monthlyRent: editData.baseRent + parseFloat(e.target.value) })}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Monthly Rent</label>
                    <input
                        type="number"
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none bg-gray-100"
                        value={editData.monthlyRent}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Base Rent</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.baseRent}
                        onChange={(e) => setEditData({ ...editData, baseRent: parseFloat(e.target.value), monthlyRent: parseFloat(e.target.value) + editData.wifiFee })}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WiFi Fee (End of Month)</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.wifiFee}
                        onChange={(e) => setEditData({ ...editData, wifiFee: parseFloat(e.target.value), monthlyRent: editData.baseRent + parseFloat(e.target.value) })}
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Monthly Rent</label>
                    <input
                        type="number"
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none bg-gray-100"
                        value={editData.monthlyRent}
                    />
                    </div>
                    
                    <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#001F3D] focus:border-transparent outline-none"
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value as 'active' | 'pending' | 'inactive' | 'moved_out' })}
                    >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                        <option value="moved_out">Moved Out</option>
                    </select>
                    </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                    <button
                    onClick={selectedTenant ? handleSaveEdit : handleSaveNewTenant}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-[#001F3D] text-white rounded hover:bg-[#003366] transition-colors font-semibold disabled:opacity-50"
                    >
                    {loading ? (selectedTenant ? 'Saving...' : 'Adding...') : (selectedTenant ? 'Save Changes' : 'Add Tenant')}
                    </button>
                    <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-semibold"
                    >
                    Cancel
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedTenant && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded max-w-2xl w-full">
                <div className="bg-[#001F3D] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-bold">Tenant Details</h2>
                <button onClick={() => setShowDetailsModal(false)} className="text-white hover:text-gray-200">
                    ✕
                </button>
                </div>
                
                <div className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 rounded-full bg-[#001F3D] text-white flex items-center justify-center text-2xl font-bold">
                    {selectedTenant.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedTenant.fullName}</h3>
                    <p className="text-gray-600">Tenant ID: {selectedTenant.id}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900">{selectedTenant.email}</p>
                    </div>
                    
                    <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Phone</p>
                    <p className="text-gray-900">{selectedTenant.phone}</p>
                    </div>
                    
                    <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Emergency Contact</p>
                    <p className="text-gray-900">{selectedTenant.emergencyContact || 'Not provided'}</p>
                    </div>
                    
                    <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Room Number</p>
                    <p className="text-gray-900 font-bold">{selectedTenant.roomNumber}</p>
                    </div>
                    
                    <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Room Type</p>
                    <p className="text-gray-900">{selectedTenant.roomNumber === '11' ? 'Pad' : selectedTenant.roomType}</p>
                    </div>
                    
                    <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Monthly Rent</p>
                    <p className="text-gray-900 font-bold text-lg">{formatCurrency(selectedTenant.monthlyRent)}</p>
                    </div>
                    
                    <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Status</p>
                    {getStatusBadge(selectedTenant.status)}
                    </div>
                    
                    <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Registration Date</p>
                    <p className="text-gray-900">{formatDate(selectedTenant.registrationDate)}</p>
                    </div>
                    
                    {selectedTenant.moveInDate && (
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Move-in Date</p>
                        <p className="text-gray-900">{formatDate(selectedTenant.moveInDate)}</p>
                    </div>
                    )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                    <button
                    onClick={() => {
                        setShowDetailsModal(false);
                        handleEdit(selectedTenant);
                    }}
                    className="flex-1 px-6 py-3 bg-[#001F3D] text-white rounded hover:bg-[#003366] transition-colors font-semibold"
                    >
                    Edit Tenant
                    </button>
                    <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-semibold"
                    >
                    Close
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && confirmAction.tenant && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded max-w-md w-full">
                <div className="bg-[#001F3D] text-white px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold">Confirm Status Change</h2>
                </div>
                
                <div className="p-6">
                <p className="text-gray-700 mb-6">
                    Are you sure you want to change the status of <strong>{confirmAction.tenant.fullName}</strong> to{' '}
                    <strong className="text-[#001F3D]">
                    {confirmAction.tenant.status === 'active' && 'Active'}
                    {confirmAction.tenant.status === 'pending' && 'Pending'}
                    {confirmAction.tenant.status === 'inactive' && 'Inactive'}
                    {confirmAction.tenant.status === 'moved_out' && 'Moved Out'}
                    </strong>?
                </p>
                
                {confirmAction.tenant.status === 'moved_out' && (
                    <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
                    <p className="text-red-800 text-sm">
                        <strong>Warning:</strong> Marking this tenant as "Moved Out" will affect room availability and may trigger automatic processes.
                    </p>
                    </div>
                )}
                
                <div className="flex gap-3">
                    <button
                    onClick={confirmStatusChange}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-[#001F3D] text-white rounded hover:bg-[#003366] transition-colors font-semibold disabled:opacity-50"
                    >
                    {loading ? 'Updating...' : 'Confirm'}
                    </button>
                    <button
                    onClick={() => setShowConfirmModal(false)}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                    >
                    Cancel
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}

        {/* Results Summary */}
        <div className="mt-6 text-center text-gray-600">
            <p>
            Showing <strong className="text-gray-900">{filteredTenants.length}</strong> of{' '}
            <strong className="text-gray-900">{tenants.length}</strong> total tenants
            </p>
        </div>
        </div>
    );
    };

    export default TenantManagement;