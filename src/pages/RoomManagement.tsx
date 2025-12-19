    import React, { useState, useEffect } from 'react';
    import { Plus, Edit2, Trash2, X, Search, Filter, Home } from 'lucide-react';

    interface Room {
    id: string;
    number: string;
    type: string;
    floor: number;
    capacity: number;
    price: number;
    status: 'available' | 'occupied' | 'maintenance';
    amenities: string[];
    description: string;
    tenantName?: string;
    tenantId?: string;
    }

    type RoomStatus = 'available' | 'occupied' | 'maintenance';

    const ROOM_TYPES = ['Single', 'Double', 'Suite', 'Studio', 'Shared'];
    const AMENITIES = ['WiFi', 'AC', 'TV', 'Balcony', 'Kitchen', 'Bathroom', 'Parking'];
    const STORAGE_KEY = 'rooms-data';

    export default function RoomManagement() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<RoomStatus | 'all'>('all');

    const [formData, setFormData] = useState<Omit<Room, 'id'>>({
        number: '',
        type: 'Single',
        floor: 1,
        capacity: 1,
        price: 0,
        status: 'available',
        amenities: [],
        description: '',
    });

    // Load rooms from localStorage
    useEffect(() => {
        loadRooms();
    }, []);

    // Filter rooms based on search and status
    useEffect(() => {
        let filtered = rooms;

        if (searchTerm) {
        filtered = filtered.filter(room =>
            room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.tenantName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        }

        if (filterStatus !== 'all') {
        filtered = filtered.filter(room => room.status === filterStatus);
        }

        setFilteredRooms(filtered);
    }, [rooms, searchTerm, filterStatus]);

    const loadRooms = () => {
        try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const data = JSON.parse(storedData);
            setRooms(data.rooms || []);
        }
        } catch (error) {
        console.log('No existing rooms, starting fresh');
        setRooms([]);
        }
    };

    const saveRooms = (updatedRooms: Room[]) => {
        try {
        const dataToStore = JSON.stringify({ 
            rooms: updatedRooms, 
            lastUpdated: Date.now() 
        });
        localStorage.setItem(STORAGE_KEY, dataToStore);
        setRooms(updatedRooms);
        } catch (error) {
        console.error('Failed to save rooms:', error);
        alert('Failed to save changes. Please try again.');
        }
    };

    const handleSubmit = () => {
        if (!formData.number.trim()) {
        alert('Room number is required');
        return;
        }

        if (editingRoom) {
        const updatedRooms = rooms.map(room =>
            room.id === editingRoom.id ? { ...formData, id: editingRoom.id } : room
        );
        saveRooms(updatedRooms);
        } else {
        const newRoom: Room = {
            ...formData,
            id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        saveRooms([...rooms, newRoom]);
        }

        resetForm();
    };

    const handleDelete = (roomId: string) => {
        if (confirm('Are you sure you want to delete this room?')) {
        const updatedRooms = rooms.filter(room => room.id !== roomId);
        saveRooms(updatedRooms);
        }
    };

    const handleEdit = (room: Room) => {
        setEditingRoom(room);
        setFormData({
        number: room.number,
        type: room.type,
        floor: room.floor,
        capacity: room.capacity,
        price: room.price,
        status: room.status,
        amenities: room.amenities,
        description: room.description,
        tenantName: room.tenantName,
        tenantId: room.tenantId,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
        number: '',
        type: 'Single',
        floor: 1,
        capacity: 1,
        price: 0,
        status: 'available',
        amenities: [],
        description: '',
        });
        setEditingRoom(null);
        setShowModal(false);
    };

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
        ...prev,
        amenities: prev.amenities.includes(amenity)
            ? prev.amenities.filter(a => a !== amenity)
            : [...prev.amenities, amenity]
        }));
    };

    const getStatusColor = (status: RoomStatus) => {
        switch (status) {
        case 'available': return 'bg-green-100 text-green-800';
        case 'occupied': return 'bg-blue-100 text-blue-800';
        case 'maintenance': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
        }
    };

    const stats = {
        total: rooms.length,
        available: rooms.filter(r => r.status === 'available').length,
        occupied: rooms.filter(r => r.status === 'occupied').length,
        maintenance: rooms.filter(r => r.status === 'maintenance').length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#001F3D] text-white p-6 shadow-lg rounded-lg">
            <div className="px-6">
            <div className="flex items-center gap-3 mb-2">
                <Home size={32} />
                <h1 className="text-3xl font-bold">Room Management</h1>
            </div>
            </div>
        </div>

        <div className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#001F3D] text-white p-6 rounded-lg shadow">
                <p className="text-blue-200 text-sm font-medium">Total Rooms</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="bg-[#001F3D] text-white p-6 rounded-lg shadow">
                <p className="text-blue-200 text-sm font-medium">Available</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{stats.available}</p>
            </div>
            <div className="bg-[#001F3D] text-white p-6 rounded-lg shadow">
                <p className="text-blue-200 text-sm font-medium">Occupied</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{stats.occupied}</p>
            </div>
            <div className="bg-[#001F3D] text-white p-6 rounded-lg shadow">
                <p className="text-blue-200 text-sm font-medium">Maintenance</p>
                <p className="text-3xl font-bold text-orange-400 mt-2">{stats.maintenance}</p>
            </div>
            </div>

            {/* Controls */}
            <div className="rounded-lg shadow mb-6 p-4 bg-white">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by room number, type, or tenant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                </div>
                <div className="flex gap-2">
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as RoomStatus | 'all')}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none bg-white"
                    >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    </select>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#001F3D] text-white px-6 py-2 rounded-lg hover:bg-[#003366] transition-colors flex items-center gap-2 whitespace-nowrap font-semibold"
                >
                    <Plus size={20} />
                    Add Room
                </button>
                </div>
            </div>
            </div>

            {/* Rooms Grid */}
            {filteredRooms.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
                <Home size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No rooms found</h3>
                <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first room'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#001F3D] text-white px-6 py-2 rounded-lg hover:bg-[#003366] transition-colors inline-flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Room
                </button>
                )}
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRooms.map(room => (
                <div key={room.id} className="bg-[#001F3D] text-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <h3 className="text-xl font-bold text-white">Room {room.number}</h3>
                        <p className="text-blue-200">{room.type} • Floor {room.floor}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(room.status)}`}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </span>
                    </div>

                    <div className="space-y-2 mb-4">
                        <p className="text-sm text-blue-100">
                        <span className="font-medium">Capacity:</span> {room.capacity} person(s)
                        </p>
                        <p className="text-sm text-blue-100">
                        <span className="font-medium">Price:</span> ${room.price}/month
                        </p>
                        {room.tenantName && (
                        <p className="text-sm text-blue-100">
                            <span className="font-medium">Tenant:</span> {room.tenantName}
                        </p>
                        )}
                    </div>

                    {room.amenities.length > 0 && (
                        <div className="mb-4">
                        <p className="text-sm font-medium text-blue-100 mb-2">Amenities:</p>
                        <div className="flex flex-wrap gap-1">
                            {room.amenities.map(amenity => (
                            <span key={amenity} className="bg-blue-900 text-blue-100 text-xs px-2 py-1 rounded">
                                {amenity}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}

                    {room.description && (
                        <p className="text-sm text-blue-100 mb-4 line-clamp-2">{room.description}</p>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-blue-800">
                        <button
                        onClick={() => handleEdit(room)}
                        className="flex-1 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                        <Edit2 size={16} />
                        Edit
                        </button>
                        <button
                        onClick={() => handleDelete(room.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                        <Trash2 size={16} />
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        {/* Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#001F3D]">
                    {editingRoom ? 'Edit Room' : 'Add New Room'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
                </div>

                <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Number *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                        placeholder="e.g., 101"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Type *
                    </label>
                    <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                    >
                        {ROOM_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Floor *
                    </label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacity *
                    </label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($/month) *
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                    </label>
                    <select
                        required
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as RoomStatus })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                    >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Under Maintenance</option>
                    </select>
                    </div>
                </div>

                {formData.status === 'occupied' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tenant Name
                        </label>
                        <input
                        type="text"
                        value={formData.tenantName || ''}
                        onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                        placeholder="Optional"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tenant ID
                        </label>
                        <input
                        type="text"
                        value={formData.tenantId || ''}
                        onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                        placeholder="Optional"
                        />
                    </div>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                    </label>
                    <div className="flex flex-wrap gap-2">
                    {AMENITIES.map(amenity => (
                        <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            formData.amenities.includes(amenity)
                            ? 'bg-[#001F3D] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        >
                        {amenity}
                        </button>
                    ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                    </label>
                    <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                    placeholder="Additional details about the room..."
                    />
                </div>

                <div className="flex gap-3">
                    <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                    Cancel
                    </button>
                    <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-[#001F3D] text-white rounded-lg hover:bg-[#003366] transition-colors font-medium"
                    >
                    {editingRoom ? 'Update Room' : 'Add Room'}
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
    );
    }