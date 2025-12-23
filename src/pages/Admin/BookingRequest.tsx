    import { useState, useEffect } from 'react';
    import { Check, X, Clock, Phone, Mail, Calendar, DollarSign, Home, Search, Filter, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

    // Mock API functions - replace with actual API calls
    interface BookingRequest {
      id: string;
      tenantName: string;
      email: string;
      phone: string;
      roomNumber: string;
      roomType: string;
      monthlyRate: number;
      requestDate: string;
      status: 'pending' | 'approved' | 'rejected';
      moveInDate: string;
      approvedDate?: string;
      rejectedDate?: string;
      rejectionReason?: string;
      notes?: string;
    }
    
    const mockAPI = {
    fetchBookingRequests: async (): Promise<BookingRequest[]> => {
        return [
        {
            id: 'BRQ-001',
            tenantName: 'John Michael Santos',
            email: 'john.santos@email.com',
            phone: '+63 912 345 6789',
            roomNumber: '101',
            roomType: 'Single Room',
            monthlyRate: 5500,
            requestDate: '2024-12-18T10:30:00',
            status: 'pending',
            moveInDate: '2024-12-25',
            notes: 'Prefer ground floor room'
        },
        {
            id: 'BRQ-002',
            tenantName: 'Maria Clara Reyes',
            email: 'maria.reyes@email.com',
            phone: '+63 923 456 7890',
            roomNumber: '205',
            roomType: 'Double Room',
            monthlyRate: 7500,
            requestDate: '2024-12-19T14:20:00',
            status: 'pending',
            moveInDate: '2024-12-28',
            notes: 'Long-term stay (1 year)'
        },
        {
            id: 'BRQ-003',
            tenantName: 'Robert Johnson',
            email: 'robert.j@email.com',
            phone: '+63 934 567 8901',
            roomNumber: '303',
            roomType: 'Studio Room',
            monthlyRate: 9500,
            requestDate: '2024-12-17T09:15:00',
            status: 'approved',
            moveInDate: '2024-12-22',
            approvedDate: '2024-12-18T11:00:00',
            notes: 'Requests WiFi upgrade'
        },
        {
            id: 'BRQ-004',
            tenantName: 'Anna Marie Lopez',
            email: 'anna.lopez@email.com',
            phone: '+63 945 678 9012',
            roomNumber: '102',
            roomType: 'Single Room',
            monthlyRate: 5500,
            requestDate: '2024-12-16T16:45:00',
            status: 'rejected',
            moveInDate: '2024-12-20',
            rejectedDate: '2024-12-17T10:30:00',
            rejectionReason: 'Room no longer available'
        },
        {
            id: 'BRQ-005',
            tenantName: 'Carlos Mendoza',
            email: 'carlos.m@email.com',
            phone: '+63 956 789 0123',
            roomNumber: '404',
            roomType: 'Deluxe Room',
            monthlyRate: 12000,
            requestDate: '2024-12-19T11:00:00',
            status: 'pending',
            moveInDate: '2025-01-05',
            notes: 'Corporate booking'
        }
        ];
    },
    approveRequest: async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, message: 'Booking request approved successfully' };
    },
    rejectRequest: async (id: string, reason: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, message: 'Booking request rejected' };
    }
    };

    const BookingRequestsAdmin = () => {
    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('table');
    const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    // Fetch booking requests
    useEffect(() => {
        fetchRequests();
        
        // Simulate real-time updates
        const interval = setInterval(() => {
        fetchRequests();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Filter requests
    useEffect(() => {
        let filtered = requests;

        if (statusFilter !== 'all') {
        filtered = filtered.filter(req => req.status === statusFilter);
        }

        if (searchTerm) {
        filtered = filtered.filter(req =>
            req.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.roomNumber.includes(searchTerm) ||
            req.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        }

        setFilteredRequests(filtered);
    }, [requests, statusFilter, searchTerm]);

    const fetchRequests = async () => {
        try {
        const data = await mockAPI.fetchBookingRequests();
        setRequests(data);
        setFilteredRequests(data);
        } catch (error) {
        console.error('Error fetching requests:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleAction = (request: BookingRequest, type: string) => {
        setSelectedRequest(request);
        setActionType(type);
        setShowModal(true);
        setRejectionReason('');
    };

    const confirmAction = async () => {
        if (!selectedRequest) return;
        
        if (actionType === 'reject' && !rejectionReason.trim()) {
        alert('Please provide a rejection reason');
        return;
        }
    
        setProcessing(true);
        try {
        if (actionType === 'approve') {
            await mockAPI.approveRequest(selectedRequest.id);
            setRequests(prev => prev.map(req =>
            req.id === selectedRequest.id
                ? { ...req, status: 'approved', approvedDate: new Date().toISOString() }
                : req
            ));
        } else if (actionType === 'reject') {
            await mockAPI.rejectRequest(selectedRequest.id, rejectionReason);
            setRequests(prev => prev.map(req =>
            req.id === selectedRequest.id
                ? { ...req, status: 'rejected', rejectedDate: new Date().toISOString(), rejectionReason }
                : req
            ));
        }
        setShowModal(false);
        setSelectedRequest(null);
        } catch (error) {
        console.error('Error processing request:', error);
        alert('Failed to process request. Please try again.');
        } finally {
        setProcessing(false);
        }
    };

    const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
        const styles = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        approved: 'bg-green-100 text-green-800 border-green-300',
        rejected: 'bg-red-100 text-red-800 border-red-300'
        };

        const icons = {
        pending: Clock,
        approved: CheckCircle,
        rejected: XCircle
        };

        const Icon = icons[status];

        return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
            <Icon size={14} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const stats = {
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
        total: requests.length
    };

    if (loading) {
        return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#001F3D] mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading booking requests...</p>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Booking Requests</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#001F3D] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                <Home className="text-gray-700" size={24} />
                </div>
                <span className="text-3xl font-bold text-white">{stats.total}</span>
            </div>
            <p className="text-sm font-medium text-gray-200">Total Requests</p>
            </div>

            <div className="bg-[#001F3D] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                <Clock className="text-yellow-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-yellow-400">{stats.pending}</span>
            </div>
            <p className="text-sm font-medium text-gray-200">Pending Review</p>
            </div>

            <div className="bg-[#001F3D] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                <CheckCircle className="text-green-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-green-400">{stats.approved}</span>
            </div>
            <p className="text-sm font-medium text-gray-200">Approved</p>
            </div>

            <div className="bg-[#001F3D] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                <XCircle className="text-red-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-red-400">{stats.rejected}</span>
            </div>
            <p className="text-sm font-medium text-gray-200">Rejected</p>
            </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                type="text"
                placeholder="Search by name, email, room, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                />
            </div>

            {/* Status Filter */}
            <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3D] focus:border-transparent appearance-none bg-white"
                >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Only</option>
                <option value="approved">Approved Only</option>
                <option value="rejected">Rejected Only</option>
                </select>
            </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredRequests.length}</span> of <span className="font-semibold text-gray-900">{stats.total}</span> requests
            </p>
            <div className="flex gap-2">
                <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'table' 
                    ? 'bg-[#001F3D] text-white' 
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
                >
                Table View
                </button>
                <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'cards' 
                    ? 'bg-[#001F3D] text-white' 
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
                >
                Card View
                </button>
            </div>
            </div>
        </div>

        {/* Requests Display */}
        {filteredRequests.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
            <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No booking requests found</h3>
            <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'New booking requests will appear here'}
            </p>
            </div>
        ) : viewMode === 'table' ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Request ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tenant Details</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Room Info</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Monthly Rate</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Request Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{request.id}</span>
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#001F3D] flex items-center justify-center text-white font-semibold">
                            {request.tenantName.charAt(0)}
                            </div>
                            <div>
                            <p className="text-sm font-semibold text-gray-900">{request.tenantName}</p>
                            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                <Mail size={12} />
                                {request.email}
                            </p>
                            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                <Phone size={12} />
                                {request.phone}
                            </p>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Room {request.roomNumber}</p>
                            <p className="text-xs text-gray-600">{request.roomType}</p>
                            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                            <Calendar size={12} />
                            Move-in: {new Date(request.moveInDate).toLocaleDateString()}
                            </p>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                            <DollarSign size={16} className="text-green-600" />
                            {request.monthlyRate.toLocaleString()}
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-600">{formatDate(request.requestDate)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            {request.status === 'pending' ? (
                            <>
                                <button
                                onClick={() => handleAction(request, 'approve')}
                                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                title="Approve Request"
                                >
                                <Check size={18} />
                                </button>
                                <button
                                onClick={() => handleAction(request, 'reject')}
                                className="p-2 bg-[#001F3D] hover:bg-red-700 text-white rounded-lg transition-colors"
                                title="Reject Request"
                                >
                                <X size={18} />
                                </button>
                            </>
                            ) : (
                            <button
                                onClick={() => handleAction(request, 'view')}
                                className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                title="View Details"
                            >
                                <Eye size={18} />
                            </button>
                            )}
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#001F3D] flex items-center justify-center text-white font-bold text-lg">
                        {request.tenantName.charAt(0)}
                        </div>
                        <div>
                        <h3 className="text-lg font-bold text-gray-900">{request.tenantName}</h3>
                        <p className="text-xs text-gray-500 font-medium">{request.id}</p>
                        </div>
                    </div>
                    {getStatusBadge(request.status)}
                    </div>

                    <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={16} className="text-gray-400" />
                        <span>{request.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={16} className="text-gray-400" />
                        <span>{request.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Home size={16} className="text-gray-400" />
                        <span>Room {request.roomNumber} - {request.roomType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-bold text-gray-900">₱{request.monthlyRate.toLocaleString()}/month</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={16} className="text-gray-400" />
                        <span>Move-in: {new Date(request.moveInDate).toLocaleDateString()}</span>
                    </div>
                    </div>

                    {request.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Notes:</p>
                        <p className="text-sm text-gray-600">{request.notes}</p>
                    </div>
                    )}

                    <div className="text-xs text-gray-500 mb-4">
                    Requested: {formatDate(request.requestDate)}
                    </div>

                    {request.status === 'pending' ? (
                    <div className="flex gap-3">
                        <button
                        onClick={() => handleAction(request, 'approve')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                        >
                        <Check size={18} />
                        Approve
                        </button>
                        <button
                        onClick={() => handleAction(request, 'reject')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#001F3D] hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                        >
                        <X size={18} />
                        Reject
                        </button>
                    </div>
                    ) : (
                    <button
                        onClick={() => handleAction(request, 'view')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        <Eye size={18} />
                        View Details
                    </button>
                    )}
                </div>
                </div>
            ))}
            </div>
        )}

        {/* Confirmation Modal */}
        {showModal && selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div className="text-center mb-6">
                {actionType === 'approve' ? (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-600" size={32} />
                    </div>
                ) : actionType === 'reject' ? (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="text-[#001F3D]" size={32} />
                    </div>
                ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="text-gray-600" size={32} />
                    </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {actionType === 'approve' && 'Approve Booking Request'}
                    {actionType === 'reject' && 'Reject Booking Request'}
                    {actionType === 'view' && 'Request Details'}
                </h3>
                <p className="text-gray-600">
                    {actionType === 'view' ? (
                    `View details for ${selectedRequest.tenantName}'s booking request`
                    ) : (
                    `${selectedRequest.tenantName} - Room ${selectedRequest.roomNumber}`
                    )}
                </p>
                </div>

                {actionType === 'view' && (
                <div className="space-y-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Status: {getStatusBadge(selectedRequest.status)}</p>
                    {selectedRequest.status === 'approved' && selectedRequest.approvedDate && (
                        <p className="text-xs text-gray-600">Approved on: {formatDate(selectedRequest.approvedDate)}</p>
                    )}
                    {selectedRequest.status === 'rejected' && selectedRequest.rejectedDate && (
                        <>
                        <p className="text-xs text-gray-600 mb-2">Rejected on: {formatDate(selectedRequest.rejectedDate)}</p>
                        {selectedRequest.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                            <p className="text-xs font-semibold text-red-800">Reason:</p>
                            <p className="text-xs text-red-700">{selectedRequest.rejectionReason}</p>
                            </div>
                        )}
                        </>
                    )}
                    </div>
                </div>
                )}

                {actionType === 'reject' && (
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rejection Reason <span className="text-[#001F3D]">*</span>
                    </label>
                    <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3D] focus:border-transparent resize-none"
                    rows={4}
                    />
                </div>
                )}

                {actionType !== 'view' && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">This action will:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                    {actionType === 'approve' ? (
                        <>
                        <li>• Update room status to occupied</li>
                        <li>• Assign tenant to the room</li>
                        <li>• Notify tenant of approval</li>
                        <li>• Update dashboard statistics</li>
                        </>
                    ) : (
                        <>
                        <li>• Mark request as rejected</li>
                        <li>• Notify tenant of rejection</li>
                        <li>• Keep room available for others</li>
                        <li>• Update request history</li>
                        </>
                    )}
                    </ul>
                </div>
                )}

                <div className="flex gap-3">
                {actionType === 'view' ? (
                    <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                    Close
                    </button>
                ) : (
                    <>
                    <button
                        onClick={() => setShowModal(false)}
                        disabled={processing}
                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmAction}
                        disabled={processing}
                        className={`flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        actionType === 'approve'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-[#001F3D] hover:bg-red-700'
                        }`}
                    >
                        {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing...
                        </span>
                        ) : (
                        `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`
                        )}
                    </button>
                    </>
                )}
                </div>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default BookingRequestsAdmin;