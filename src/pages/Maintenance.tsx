    import React, { useState, useCallback, useMemo } from 'react';
    import { Phone, Home, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';

    // ===========================
    // TYPES & INTERFACES
    // ===========================

    type MaintenanceStatus = 'pending' | 'in-progress' | 'completed';
    type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

    interface MaintenanceRequest {
    id: string;
    apartmentDoor: string;
    issue: string;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    createdAt: Date;
    tenantName: string;
    tenantPhone: string;
    notes?: string;
    }

    interface FilterOptions {
    status: MaintenanceStatus | 'all';
    apartmentDoor: string | 'all';
    priority: MaintenancePriority | 'all';
    }

    // ===========================
    // CUSTOM HOOKS
    // ===========================

    const useMaintenanceRequests = () => {
    const [requests, setRequests] = useState<MaintenanceRequest[]>([
        {
        id: '1',
        apartmentDoor: 'Door 3',
        issue: 'Leaking faucet in kitchen',
        priority: 'medium',
        status: 'pending',
        createdAt: new Date('2024-12-08'),
        tenantName: 'John Smith',
        tenantPhone: '+1 (555) 123-4567',
        notes: 'Water dripping constantly'
        },
        {
        id: '2',
        apartmentDoor: 'Door 1',
        issue: 'AC not working',
        priority: 'high',
        status: 'in-progress',
        createdAt: new Date('2024-12-07'),
        tenantName: 'Sarah Johnson',
        tenantPhone: '+1 (555) 987-6543',
        notes: 'Unit not cooling'
        },
        {
        id: '3',
        apartmentDoor: 'Door 5',
        issue: 'Light bulb replacement',
        priority: 'low',
        status: 'completed',
        createdAt: new Date('2024-12-06'),
        tenantName: 'Mike Davis',
        tenantPhone: '+1 (555) 456-7890'
        }
    ]);

    const updateRequestStatus = useCallback((id: string, status: MaintenanceStatus) => {
        setRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status } : req)
        );
    }, []);

    const deleteRequest = useCallback((id: string) => {
        setRequests(prev => prev.filter(req => req.id !== id));
    }, []);

    return { requests, updateRequestStatus, deleteRequest };
    };

    const useFilters = () => {
    const [filters, setFilters] = useState<FilterOptions>({
        status: 'all',
        apartmentDoor: 'all',
        priority: 'all'
    });

    const updateFilter = useCallback(<K extends keyof FilterOptions>(
        key: K,
        value: FilterOptions[K]
    ) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({ status: 'all', apartmentDoor: 'all', priority: 'all' });
    }, []);

    return { filters, updateFilter, resetFilters };
    };

    // ===========================
    // UTILITY FUNCTIONS
    // ===========================

    const getPriorityColor = (priority: MaintenancePriority): string => {
    const colors = {
        low: 'bg-blue-100 text-blue-700',
        medium: 'bg-yellow-100 text-yellow-700',
        high: 'bg-custom-navy text-white',
        urgent: 'bg-red-100 text-red-700'
    };
    return colors[priority];
    };

    const getStatusIcon = (status: MaintenanceStatus) => {
    const icons = {
        pending: <Clock className="w-4 h-4" />,
        'in-progress': <AlertCircle className="w-4 h-4" />,
        completed: <CheckCircle className="w-4 h-4" />
    };
    return icons[status];
    };

    const getStatusColor = (status: MaintenanceStatus): string => {
    const colors = {
        pending: 'bg-gray-100 text-gray-700',
        'in-progress': 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700'
    };
    return colors[status];
    };

    const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
    };

    const filterRequests = (
    requests: MaintenanceRequest[],
    filters: FilterOptions
    ): MaintenanceRequest[] => {
    return requests.filter(req => {
        if (filters.status !== 'all' && req.status !== filters.status) return false;
        if (filters.apartmentDoor !== 'all' && req.apartmentDoor !== filters.apartmentDoor) return false;
        if (filters.priority !== 'all' && req.priority !== filters.priority) return false;
        return true;
    });
    };

    // ===========================
    // COMPONENTS
    // ===========================

    const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({
    label,
    value,
    icon,
    color
    }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        </div>
    </div>
    );

    const FilterBar: React.FC<{
    filters: FilterOptions;
    onFilterChange: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
    onReset: () => void;
    }> = ({ filters, onFilterChange, onReset }) => {
    const apartmentDoors = ['all', 'Door 1', 'Door 2', 'Door 3', 'Door 4', 'Door 5', 'Door 6', 'Door 7'];
    
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value as FilterOptions['status'])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
            </div>

            <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Apartment</label>
            <select
                value={filters.apartmentDoor}
                onChange={(e) => onFilterChange('apartmentDoor', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                {apartmentDoors.map(door => (
                <option key={door} value={door}>
                    {door === 'all' ? 'All Apartments' : door}
                </option>
                ))}
            </select>
            </div>

            <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
                value={filters.priority}
                onChange={(e) => onFilterChange('priority', e.target.value as FilterOptions['priority'])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
            </select>
            </div>

            <button
            onClick={onReset}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
            Reset
            </button>
        </div>
        </div>
    );
    };

    const MaintenanceCard: React.FC<{
    request: MaintenanceRequest;
    onStatusChange: (id: string, status: MaintenanceStatus) => void;
    onDelete: (id: string) => void;
    }> = ({ request, onStatusChange, onDelete }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
            <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
            <h3 className="font-semibold text-gray-800 text-lg">{request.apartmentDoor}</h3>
            <p className="text-sm text-gray-500">{request.tenantName}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
            {request.priority.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
            {getStatusIcon(request.status)}
            {request.status.replace('-', ' ').toUpperCase()}
            </span>
        </div>
        </div>

        <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Issue:</h4>
        <p className="text-gray-600">{request.issue}</p>
        {request.notes && (
            <p className="text-sm text-gray-500 mt-2 italic">Note: {request.notes}</p>
        )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(request.createdAt)}
            </div>
        </div>

        <div className="flex gap-2">
            <a
            href={`tel:${request.tenantPhone}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
            <Phone className="w-4 h-4" />
            Call Tenant
            </a>
            
            {request.status !== 'completed' && (
            <select
                value={request.status}
                onChange={(e) => onStatusChange(request.id, e.target.value as MaintenanceStatus)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
            )}

            <button
            onClick={() => onDelete(request.id)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
            Delete
            </button>
        </div>
        </div>
    </div>
    );

    // ===========================
    // MAIN COMPONENT
    // ===========================

    const ApartmentMaintenanceModule: React.FC = () => {
    const { requests, updateRequestStatus, deleteRequest } = useMaintenanceRequests();
    const { filters, updateFilter, resetFilters } = useFilters();

    const filteredRequests = useMemo(
        () => filterRequests(requests, filters),
        [requests, filters]
    );

    const stats = useMemo(() => ({
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        inProgress: requests.filter(r => r.status === 'in-progress').length,
        completed: requests.filter(r => r.status === 'completed').length
    }), [requests]);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Maintenance Management</h1>
            <p className="text-gray-600">Track and manage apartment maintenance requests</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                label="Total Requests"
                value={stats.total}
                icon={<Home className="w-6 h-6 text-blue-600" />}
                color="bg-blue-50"
            />
            <StatCard
                label="Pending"
                value={stats.pending}
                icon={<Clock className="w-6 h-6 text-gray-600" />}
                color="bg-gray-50"
            />
            <StatCard
                label="In Progress"
                value={stats.inProgress}
                icon={<AlertCircle className="w-6 h-6 text-blue-600" />}
                color="bg-blue-50"
            />
            <StatCard
                label="Completed"
                value={stats.completed}
                icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                color="bg-green-50"
            />
            </div>

            {/* Filter Bar */}
            <FilterBar
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
            />

            {/* Requests List */}
            <div className="space-y-4">
            {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-100">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No requests found</h3>
                <p className="text-gray-500">Try adjusting your filters or check back later</p>
                </div>
            ) : (
                filteredRequests.map(request => (
                <MaintenanceCard
                    key={request.id}
                    request={request}
                    onStatusChange={updateRequestStatus}
                    onDelete={deleteRequest}
                />
                ))
            )}
            </div>
        </div>
        </div>
    );
    };

    export default ApartmentMaintenanceModule;