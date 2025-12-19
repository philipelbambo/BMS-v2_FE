    import React, { useState } from 'react';
    import { UserPlus, Edit2, Trash2, X, Save } from 'lucide-react';

    interface Staff {
    id: string;
    name: string;
    role: 'cleaner' | 'security' | 'maintenance';
    contact: string;
    email: string;
    tasks: string[];
    }

    const StaffManagement: React.FC = () => {
    const [staff, setStaff] = useState<Staff[]>([
        {
        id: '1',
        name: 'John Martinez',
        role: 'cleaner',
        contact: '+1-555-0123',
        email: 'john.m@facility.com',
        tasks: ['Floor cleaning - Building A', 'Window washing - Lobby']
        },
        {
        id: '2',
        name: 'Sarah Chen',
        role: 'security',
        contact: '+1-555-0124',
        email: 'sarah.c@facility.com',
        tasks: ['Night patrol', 'CCTV monitoring']
        },
        {
        id: '3',
        name: 'Michael Brown',
        role: 'maintenance',
        contact: '+1-555-0125',
        email: 'michael.b@facility.com',
        tasks: ['HVAC inspection', 'Plumbing repairs - 3rd floor']
        },
        // --- Newly Added Staff ---
        {
        id: '4',
        name: 'Aisha Johnson',
        role: 'cleaner',
        contact: '+1-555-0126',
        email: 'aisha.j@facility.com',
        tasks: ['Restroom sanitation', 'Trash collection - Floors 1-4']
        },
        {
        id: '5',
        name: 'David Kim',
        role: 'security',
        contact: '+1-555-0127',
        email: 'david.k@facility.com',
        tasks: ['Front desk monitoring', 'Access control verification']
        },
        {
        id: '6',
        name: 'Raj Patel',
        role: 'maintenance',
        contact: '+1-555-0128',
        email: 'raj.p@facility.com',
        tasks: ['Electrical system check', 'Light fixture replacements']
        },
        {
        id: '7',
        name: 'Elena Rodriguez',
        role: 'cleaner',
        contact: '+1-555-0129',
        email: 'elena.r@facility.com',
        tasks: ['Carpet deep cleaning', 'Kitchen area sanitation']
        },
        {
        id: '8',
        name: 'Tariq Hassan',
        role: 'security',
        contact: '+1-555-0130',
        email: 'tariq.h@facility.com',
        tasks: ['Parking lot patrol', 'Emergency response coordination']
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [formData, setFormData] = useState<Omit<Staff, 'id'>>({
        name: '',
        role: 'cleaner',
        contact: '',
        email: '',
        tasks: []
    });
    const [taskInput, setTaskInput] = useState('');

    const handleOpenModal = (staffMember?: Staff) => {
        if (staffMember) {
        setEditingStaff(staffMember);
        setFormData({
            name: staffMember.name,
            role: staffMember.role,
            contact: staffMember.contact,
            email: staffMember.email,
            tasks: [...staffMember.tasks]
        });
        } else {
        setEditingStaff(null);
        setFormData({
            name: '',
            role: 'cleaner',
            contact: '',
            email: '',
            tasks: []
        });
        }
        setTaskInput('');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStaff(null);
        setTaskInput('');
    };

    const handleAddTask = () => {
        if (taskInput.trim()) {
        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, taskInput.trim()]
        }));
        setTaskInput('');
        }
    };

    const handleRemoveTask = (index: number) => {
        setFormData(prev => ({
        ...prev,
        tasks: prev.tasks.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingStaff) {
        setStaff(prev => prev.map(s => 
            s.id === editingStaff.id ? { ...formData, id: s.id } : s
        ));
        } else {
        const newStaff: Staff = {
            ...formData,
            id: Date.now().toString()
        };
        setStaff(prev => [...prev, newStaff]);
        }
        
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to remove this staff member?')) {
        setStaff(prev => prev.filter(s => s.id !== id));
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
        case 'cleaner': return 'bg-blue-100 text-blue-700';
        case 'security': return 'bg-indigo-100 text-indigo-700';
        case 'maintenance': return 'bg-cyan-100 text-cyan-700';
        default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6">
        <div className="mx-auto w-full max-w-[1536px] px-2 sm:px-4">
            {/* Header */}
            <div className="mb-8">
            <div className="flex justify-between items-center">
                <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                <UserPlus size={20} />
                Add Staff Member
                </button>
            </div>
            </div>

            {/* Staff Grid — 4 per row on medium screens and up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {staff.map(member => (
                <div key={member.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(member.role)}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                    </div>
                    <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenModal(member)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Contact</p>
                    <p className="text-gray-900">{member.contact}</p>
                    </div>
                    <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Email</p>
                    <p className="text-gray-900 text-sm break-words">{member.email}</p>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Assigned Tasks ({member.tasks.length})</p>
                    {member.tasks.length > 0 ? (
                    <ul className="space-y-1">
                        {member.tasks.map((task, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="flex-1">{task}</span>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-sm text-gray-400 italic">No tasks assigned</p>
                    )}
                </div>
                </div>
            ))}
            </div>

            {staff.length === 0 && (
            <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No staff members yet. Add your first staff member to get started!</p>
            </div>
            )}
        </div>

        {/* Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">
                    {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h2>
                <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={24} />
                </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter staff member name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role *
                    </label>
                    <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as Staff['role'] }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                    <option value="cleaner">Cleaner</option>
                    <option value="security">Security</option>
                    <option value="maintenance">Maintenance</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Number *
                    </label>
                    <input
                        type="tel"
                        required
                        value={formData.contact}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="+1-555-0123"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="email@facility.com"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Tasks
                    </label>
                    <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter a task and press Add"
                    />
                    <button
                        type="button"
                        onClick={handleAddTask}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Add
                    </button>
                    </div>
                    
                    {formData.tasks.length > 0 && (
                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                        {formData.tasks.map((task, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                            <span className="text-gray-900">{task}</span>
                            <button
                            type="button"
                            onClick={() => handleRemoveTask(idx)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                            >
                            <X size={18} />
                            </button>
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                    <Save size={20} />
                    {editingStaff ? 'Save Changes' : 'Add Staff Member'}
                    </button>
                    <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                    Cancel
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default StaffManagement;