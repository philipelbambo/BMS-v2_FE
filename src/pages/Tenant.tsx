import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Upload, X, AlertCircle } from 'lucide-react';

type EmploymentStatus = 'Employed' | 'Self-employed' | 'Unemployed' | 'Student' | 'Retired';

interface Tenant {
    id: string;
    fullName: string;
    contact: string;
    unit: string;
    occupation: string;
    meterReadingDate: string;
    paymentStatus: 'paid' | 'pending' | 'overdue';
    proofOfPayment?: File | null;
    receipt?: File | null;

    currentAddress: string;
    employmentStatus: EmploymentStatus;
    businessName?: string;
    jobTitle: string;
    monthlyIncome: string;
    idType: string;
    idNumber: string;
    idFront: File | null;
    idBack?: File | null;
    desiredMoveInDate: string;

    emergencyContactName: string;
    emergencyContactRelationship: string;
    emergencyContactPhone: string;

    paymentMethod: 'GCash';
}

const EMPLOYMENT_STATUSES: EmploymentStatus[] = ['Employed', 'Self-employed', 'Unemployed', 'Student', 'Retired'];
const ID_TYPES = ['National ID (PhilSys)', 'Driver’s License', 'Passport', 'SSS ID', 'GSIS UMID', 'Other'];
const TOTAL_DOORS = 7;

const generateDoors = (count = TOTAL_DOORS) => Array.from({ length: count }, (_, i) => `Door ${i + 1}`);

const getNextAvailableDoor = (occupiedUnits: string[]): string => {
    const allDoors = generateDoors(TOTAL_DOORS);
    const available = allDoors.find(door => !occupiedUnits.includes(door));
    return available || allDoors[0];
};

const initialTenants: Tenant[] = [
    {
        id: '1',
        fullName: 'Maria Santos',
        contact: '0912-345-6789',
        unit: 'Door 1',
        occupation: 'Teacher',
        meterReadingDate: '2024-11-25',
        paymentStatus: 'paid',
        proofOfPayment: null,
        receipt: null,

        currentAddress: '123 Rizal St, Manila',
        employmentStatus: 'Employed',
        businessName: undefined,
        jobTitle: 'High School Teacher',
        monthlyIncome: '25,000',
        idType: 'National ID (PhilSys)',
        idNumber: '1234-5678-9012',
        idFront: null,
        idBack: null,
        desiredMoveInDate: '2025-12-15',

        emergencyContactName: 'Pedro Santos',
        emergencyContactRelationship: 'Spouse',
        emergencyContactPhone: '0987-654-3210',
        paymentMethod: 'GCash',
    },
];

export default function TenantManagement() {
    const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof Tenant>('fullName');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

    const emptyFormData: Omit<Tenant, 'id' | 'unit'> = {
        fullName: '',
        contact: '',
        occupation: '',
        meterReadingDate: '',
        paymentStatus: 'pending',
        proofOfPayment: null,
        receipt: null,

        currentAddress: '',
        employmentStatus: 'Employed',
        businessName: '',
        jobTitle: '',
        monthlyIncome: '',
        idType: 'National ID (PhilSys)',
        idNumber: '',
        idFront: null,
        idBack: null,
        desiredMoveInDate: '',

        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactPhone: '',
        paymentMethod: 'GCash',
    };

    const [formData, setFormData] = useState<Tenant>({
        id: '',
        unit: 'Door 1',
        ...emptyFormData,
    });

    const handleSort = (field: keyof Tenant) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedTenants = useMemo(() => {
        return tenants
            .filter(tenant => {
                const matchesSearch =
                    tenant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    tenant.contact.includes(searchTerm) ||
                    tenant.unit.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesSearch;
            })
            .sort((a, b) => {
                const aVal = String(a[sortField]);
                const bVal = String(b[sortField]);
                const modifier = sortDirection === 'asc' ? 1 : -1;
                if (aVal === bVal) return 0;
                return aVal > bVal ? modifier : -modifier;
            });
    }, [tenants, searchTerm, sortField, sortDirection]);

    const openModal = (mode: 'add' | 'edit', tenant?: Tenant) => {
        setModalMode(mode);
        if (mode === 'edit' && tenant) {
            setCurrentTenant(tenant);
            setFormData(tenant);
        } else {
            const occupiedUnits = tenants.map(t => t.unit);
            const nextUnit = getNextAvailableDoor(occupiedUnits);
            setFormData({
                id: Date.now().toString(),
                unit: nextUnit,
                ...emptyFormData,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTenant(null);
    };

    const handleSubmit = () => {
        // Required fields — proofOfPayment and receipt are OPTIONAL (admin-only)
        const requiredFields: (keyof Tenant)[] = [
            'fullName',
            'contact',
            'occupation',
            'meterReadingDate',
            'currentAddress',
            'employmentStatus',
            'jobTitle',
            'monthlyIncome',
            'idType',
            'idNumber',
            'idFront', // ID front is required for verification
            'desiredMoveInDate',
            'emergencyContactName',
            'emergencyContactRelationship',
            'emergencyContactPhone',
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                alert(`Please fill in all required fields. Missing: ${field}`);
                return;
            }
        }

        if (formData.employmentStatus === 'Self-employed' && !formData.businessName) {
            alert('Business Name is required for self-employed tenants.');
            return;
        }

        if (modalMode === 'add') {
            setTenants([...tenants, formData]);
        } else {
            setTenants(tenants.map(t => (t.id === formData.id ? formData : t)));
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this tenant?')) {
            setTenants(tenants.filter(t => t.id !== id));
        }
    };

    const handleFileUpload = (field: keyof Tenant, file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const overdueCount = tenants.filter(t => t.paymentStatus === 'overdue').length;

    const getImagePreview = (file: File | null) => {
        if (!file) return null;
        return URL.createObjectURL(file);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-2">
            <div className="w-full mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <button
                            onClick={() => openModal('add')}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                            Add Tenant
                        </button>
                    </div>

                    {overdueCount > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                            <AlertCircle className="text-red-600" size={24} />
                            <div>
                                <p className="text-red-800 font-semibold">Overdue Payments Alert</p>
                                <p className="text-red-700 text-sm">
                                    {overdueCount} tenant(s) have overdue payments that require attention
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, contact, or unit..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* === TABLE WITHOUT CATEGORY COLUMN === */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-blue-600 text-white">
                                    <th className="px-4 py-3 text-left cursor-pointer hover:bg-blue-700" onClick={() => handleSort('fullName')}>
                                        Full Name {sortField === 'fullName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-left cursor-pointer hover:bg-blue-700" onClick={() => handleSort('unit')}>
                                        Unit {sortField === 'unit' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-left cursor-pointer hover:bg-blue-700" onClick={() => handleSort('contact')}>
                                        Contact {sortField === 'contact' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-left cursor-pointer hover:bg-blue-700" onClick={() => handleSort('desiredMoveInDate')}>
                                        Move-in {sortField === 'desiredMoveInDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-left cursor-pointer hover:bg-blue-700" onClick={() => handleSort('paymentStatus')}>
                                        Status {sortField === 'paymentStatus' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedTenants.map((tenant, index) => (
                                    <tr key={tenant.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}>
                                        <td className="px-4 py-3 font-medium">{tenant.fullName}</td>
                                        <td className="px-4 py-3 font-semibold">{tenant.unit}</td>
                                        <td className="px-4 py-3">{tenant.contact}</td>
                                        <td className="px-4 py-3">{tenant.desiredMoveInDate}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tenant.paymentStatus)}`}>
                                                {tenant.paymentStatus.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openModal('edit', tenant)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tenant.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredAndSortedTenants.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No tenants found</p>
                            <p className="text-sm">Try adjusting your search or add a new tenant</p>
                        </div>
                    )}
                </div>
            </div>

            {/* === MODAL === */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-blue-600">
                                {modalMode === 'add' ? 'Add New Tenant' : 'Edit Tenant'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Personal Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Address *</label>
                                        <textarea
                                            required
                                            value={formData.currentAddress}
                                            onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Unit</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={formData.unit}
                                            className="w-full px-3 py-2 bg-blue-50 text-blue-800 font-semibold rounded-lg cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Employment */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Employment Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status *</label>
                                        <select
                                            value={formData.employmentStatus}
                                            onChange={(e) =>
                                                setFormData({ ...formData, employmentStatus: e.target.value as EmploymentStatus })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {EMPLOYMENT_STATUSES.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {formData.employmentStatus === 'Self-employed' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.businessName || ''}
                                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title / Role *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.jobTitle}
                                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₱) *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 25,000"
                                            required
                                            value={formData.monthlyIncome}
                                            onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ID Verification */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Government ID</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Type *</label>
                                        <select
                                            value={formData.idType}
                                            onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {ID_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.idNumber}
                                            onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* ID Front */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Front (Photo/Scan) *</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload('idFront', e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="idFrontUpload"
                                        />
                                        <label htmlFor="idFrontUpload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="text-blue-600 mb-2" size={32} />
                                            <span className="text-sm text-gray-600">Click to upload ID front</span>
                                            {formData.idFront && (
                                                <span className="text-xs text-green-600 mt-1">✓ Uploaded</span>
                                            )}
                                        </label>
                                        {formData.idFront && (
                                            <div className="mt-2 flex justify-center">
                                                <img
                                                    src={getImagePreview(formData.idFront)!}
                                                    alt="ID Front"
                                                    className="max-h-32 rounded border"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ID Back */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Back (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload('idBack', e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="idBackUpload"
                                        />
                                        <label htmlFor="idBackUpload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="text-blue-600 mb-2" size={32} />
                                            <span className="text-sm text-gray-600">Click to upload ID back</span>
                                            {formData.idBack && (
                                                <span className="text-xs text-green-600 mt-1">✓ Uploaded</span>
                                            )}
                                        </label>
                                        {formData.idBack && (
                                            <div className="mt-2 flex justify-center">
                                                <img
                                                    src={getImagePreview(formData.idBack)!}
                                                    alt="ID Back"
                                                    className="max-h-32 rounded border"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Move-in & Payment */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Desired Move-in Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.desiredMoveInDate}
                                        onChange={(e) => setFormData({ ...formData, desiredMoveInDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value="GCash"
                                        className="w-full px-3 py-2 bg-gray-100 rounded-lg cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.emergencyContactName}
                                            onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.emergencyContactRelationship}
                                            onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.emergencyContactPhone}
                                            onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Original fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.occupation}
                                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Meter Reading Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.meterReadingDate}
                                        onChange={(e) => setFormData({ ...formData, meterReadingDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status *</label>
                                    <select
                                        required
                                        value={formData.paymentStatus}
                                        onChange={(e) =>
                                            setFormData({ ...formData, paymentStatus: e.target.value as 'paid' | 'pending' | 'overdue' })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="paid">Paid</option>
                                        <option value="pending">Pending</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                </div>
                            </div>

                            {/* Admin Uploads */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Verification (Admin Use — Optional)</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    You may upload proof of payment or receipts later. Tenants are not required to provide these.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Payment (GCash)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={(e) => handleFileUpload('proofOfPayment', e.target.files?.[0] || null)}
                                                className="hidden"
                                                id="proofUpload"
                                            />
                                            <label htmlFor="proofUpload" className="cursor-pointer flex flex-col items-center">
                                                <Upload className="text-blue-600 mb-2" size={32} />
                                                <span className="text-sm text-gray-600">Click to upload GCash proof</span>
                                                {formData.proofOfPayment && (
                                                    <span className="text-xs text-green-600 mt-1">✓ Uploaded</span>
                                                )}
                                            </label>
                                            {formData.proofOfPayment && (
                                                <div className="mt-2 flex justify-center">
                                                    <img
                                                        src={getImagePreview(formData.proofOfPayment)!}
                                                        alt="GCash Proof"
                                                        className="max-h-32 rounded border"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Receipt (Optional)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={(e) => handleFileUpload('receipt', e.target.files?.[0] || null)}
                                                className="hidden"
                                                id="receiptUpload"
                                            />
                                            <label htmlFor="receiptUpload" className="cursor-pointer flex flex-col items-center">
                                                <Upload className="text-blue-600 mb-2" size={32} />
                                                <span className="text-sm text-gray-600">Click to upload receipt</span>
                                                {formData.receipt && (
                                                    <span className="text-xs text-green-600 mt-1">✓ Uploaded</span>
                                                )}
                                            </label>
                                            {formData.receipt && (
                                                <div className="mt-2 flex justify-center">
                                                    <img
                                                        src={getImagePreview(formData.receipt)!}
                                                        alt="Receipt"
                                                        className="max-h-32 rounded border"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    {modalMode === 'add' ? 'Add Tenant' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}