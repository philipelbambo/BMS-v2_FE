import { useState } from 'react';
import { Plus, Edit2, Search, Filter } from 'lucide-react';

type Unit = {
    id: number;
    name: string;
    type: 'Medium 8k' | 'Big 10k';
    rent: number;
    electricity: number;
    water: number;
    deposit: number;
    status: 'occupied' | 'vacant';
};

const UnitsManagement = () => {
    const [units] = useState<Unit[]>([
        { id: 1, name: 'Door 1', type: 'Medium 8k', rent: 8000, electricity: 195, water: 300, deposit: 16000, status: 'occupied' },
        { id: 2, name: 'Door 2', type: 'Big 10k', rent: 10000, electricity: 195, water: 300, deposit: 20000, status: 'vacant' },
        { id: 3, name: 'Door 3', type: 'Medium 8k', rent: 8000, electricity: 195, water: 300, deposit: 16000, status: 'occupied' },
        { id: 4, name: 'Door 4', type: 'Big 10k', rent: 10000, electricity: 195, water: 300, deposit: 20000, status: 'vacant' },
        { id: 5, name: 'Door 5', type: 'Medium 8k', rent: 8000, electricity: 195, water: 300, deposit: 16000, status: 'occupied' },
        { id: 6, name: 'Door 6', type: 'Big 10k', rent: 10000, electricity: 195, water: 300, deposit: 20000, status: 'vacant' },
        { id: 7, name: 'Door 7', type: 'Medium 8k', rent: 8000, electricity: 195, water: 300, deposit: 16000, status: 'vacant' }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const filteredUnits = units.filter(unit => {
        const matchesSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || unit.status === filterStatus;
        const matchesType = filterType === 'all' || unit.type === filterType;
        return matchesSearch && matchesStatus && matchesType;
    });

    const occupiedCount = units.filter(u => u.status === 'occupied').length;
    const vacantCount = units.filter(u => u.status === 'vacant').length;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="w-full">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Simplified without category filters */}
                    {sidebarOpen && (
                        <div className="lg:w-64 bg-white rounded-lg shadow-md p-6 h-fit flex-shrink-0">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                                <button 
                                    onClick={() => setSidebarOpen(false)}
                                    className="lg:hidden text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Unit Type</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setFilterType('all')}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                            filterType === 'all' 
                                                ? 'bg-blue-100 text-blue-700 font-medium' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        All Types
                                    </button>
                                    <button
                                        onClick={() => setFilterType('Medium 8k')}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                            filterType === 'Medium 8k' 
                                                ? 'bg-blue-100 text-blue-700 font-medium' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        Medium 8k
                                    </button>
                                    <button
                                        onClick={() => setFilterType('Big 10k')}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                            filterType === 'Big 10k' 
                                                ? 'bg-blue-100 text-blue-700 font-medium' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        Big 10k
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Status</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setFilterStatus('all')}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                            filterStatus === 'all' 
                                                ? 'bg-blue-100 text-blue-700 font-medium' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        All Status
                                    </button>
                                    <button
                                        onClick={() => setFilterStatus('vacant')}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                            filterStatus === 'vacant' 
                                                ? 'bg-orange-100 text-orange-700 font-medium' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        Vacant
                                    </button>
                                    <button
                                        onClick={() => setFilterStatus('occupied')}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                            filterStatus === 'occupied' 
                                                ? 'bg-green-100 text-green-700 font-medium' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        Occupied
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {!sidebarOpen && (
                            <div className="lg:hidden mb-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Filter className="w-4 h-4" />
                                    Show Filters
                                </button>
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                                <div className="text-gray-600 text-sm font-medium mb-1">Total Units</div>
                                <div className="text-3xl font-bold text-gray-800">{units.length}</div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                                <div className="text-gray-600 text-sm font-medium mb-1">Occupied</div>
                                <div className="text-3xl font-bold text-gray-800">{occupiedCount}</div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                                <div className="text-gray-600 text-sm font-medium mb-1">Vacant</div>
                                <div className="text-3xl font-bold text-gray-800">{vacantCount}</div>
                            </div>
                        </div>

                        {/* Search and Add Unit */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search units..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    
                                    <div className="lg:hidden">
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="Medium 8k">Medium 8k</option>
                                            <option value="Big 10k">Big 10k</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-md whitespace-nowrap"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Unit
                                </button>
                            </div>
                        </div>

                        {/* Units Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {filteredUnits.map(unit => (
                                <div 
                                    key={unit.id} 
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-gray-500"
                                >
                                    <div className={`h-2 ${unit.status === 'occupied' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{unit.name}</h3>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full whitespace-nowrap">
                                                        {unit.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                                unit.status === 'occupied' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {unit.status === 'occupied' ? 'Occupied' : 'Vacant'}
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-xs">Monthly Rent</span>
                                                <span className="font-semibold text-gray-800 text-sm">₱{unit.rent.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-xs">Electricity Avg</span>
                                                <span className="font-semibold text-gray-800 text-sm">{unit.electricity} kWh</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-xs">Water Minimum</span>
                                                <span className="font-semibold text-gray-800 text-sm">₱{unit.water}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                                <span className="text-gray-600 text-xs font-medium">Deposit (2 months)</span>
                                                <span className="font-bold text-blue-600 text-sm">₱{unit.deposit.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setEditingUnit(unit)}
                                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-medium text-sm"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            Edit Unit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredUnits.length === 0 && (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <p className="text-gray-500 text-lg">No units found matching your filters</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Modal - Simplified without category */}
                {editingUnit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit {editingUnit.name}</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit Type
                                    </label>
                                    <select 
                                        id="edit-type"
                                        defaultValue={editingUnit.type} 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Medium 8k">Medium 8k</option>
                                        <option value="Big 10k">Big 10k</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="edit-rent" className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Rent (₱)
                                    </label>
                                    <input 
                                        id="edit-rent"
                                        type="number" 
                                        defaultValue={editingUnit.rent} 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select 
                                        id="edit-status"
                                        defaultValue={editingUnit.status} 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="vacant">Vacant</option>
                                        <option value="occupied">Occupied</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setEditingUnit(null)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setEditingUnit(null)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Modal - Simplified without category */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Unit</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit Name
                                    </label>
                                    <input 
                                        id="add-name"
                                        type="text" 
                                        placeholder="e.g., Door 8" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="add-type" className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit Type
                                    </label>
                                    <select 
                                        id="add-type"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Medium 8k">Medium 8k</option>
                                        <option value="Big 10k">Big 10k</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="add-rent" className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Rent (₱)
                                    </label>
                                    <input 
                                        id="add-rent"
                                        type="number" 
                                        placeholder="8000" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="add-status" className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select 
                                        id="add-status"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="vacant">Vacant</option>
                                        <option value="occupied">Occupied</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                                >
                                    Add Unit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnitsManagement;