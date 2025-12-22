    import React, { useState, useEffect, useRef } from 'react';
    import { Camera, Calendar, FileText, X, Edit2, Trash2, Check, Clock, AlertCircle } from 'lucide-react';

    // TypeScript Interfaces
    interface ServiceRequest {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    createdAt: Date;
    dueDate?: Date;
    attachments: string[];
    }

    interface FormData {
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    }

    interface FormErrors {
    title?: string;
    description?: string;
    category?: string;
    }

    // Custom Hook for Responsive Breakpoints
    const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

    useEffect(() => {
        const handleResize = () => {
        const width = window.innerWidth;
        if (width < 768) setBreakpoint('mobile');
        else if (width < 1024) setBreakpoint('tablet');
        else setBreakpoint('desktop');
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
    };

    // Form Validation
    const validateForm = (data: FormData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.title.trim()) errors.title = 'Title is required';
    if (data.title.length < 3) errors.title = 'Title must be at least 3 characters';
    if (!data.description.trim()) errors.description = 'Description is required';
    if (!data.category) errors.category = 'Please select a category';
    return errors;
    };

    const ServiceRequestManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
    const [requests, setRequests] = useState<ServiceRequest[]>([
        {
        id: '1',
        title: 'Repair Office AC Unit',
        description: 'AC unit in conference room not cooling properly',
        category: 'maintenance',
        priority: 'high',
        status: 'in-progress',
        createdAt: new Date('2024-12-20'),
        dueDate: new Date('2024-12-25'),
        attachments: []
        },
        {
        id: '2',
        title: 'Setup New Workstation',
        description: 'Need computer setup for new employee',
        category: 'it-support',
        priority: 'medium',
        status: 'pending',
        createdAt: new Date('2024-12-21'),
        attachments: []
        }
    ]);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        dueDate: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [swipedId, setSwipedId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    
    const breakpoint = useBreakpoint();
    const historyRef = useRef<HTMLDivElement>(null);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        const validationErrors = validateForm(formData);
        
        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
        }

        const newRequest: ServiceRequest = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'pending',
        createdAt: new Date(),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        attachments: []
        };

        setRequests(prev => [newRequest, ...prev]);
        setFormData({ title: '', description: '', category: '', priority: 'medium', dueDate: '' });
        setErrors({});
        
        if (breakpoint === 'mobile') {
        setActiveTab('history');
        }
    };

    // Touch gesture handlers for swipe actions
    const handleTouchStart = (e: React.TouchEvent, id: string) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const currentTouch = e.touches[0].clientX;
        const diff = touchStart - currentTouch;
        if (diff > 50) {
        setSwipedId(e.currentTarget.getAttribute('data-id'));
        } else if (diff < -50) {
        setSwipedId(null);
        }
    };

    const handleTouchEnd = () => {
        setTouchStart(null);
    };

    // Pull to refresh
    const handlePullStart = (e: React.TouchEvent) => {
        if (historyRef.current?.scrollTop === 0) {
        setTouchStart(e.touches[0].clientY);
        }
    };

    const handlePullMove = (e: React.TouchEvent) => {
        if (touchStart === null || historyRef.current?.scrollTop !== 0) return;
        const currentTouch = e.touches[0].clientY;
        const distance = currentTouch - touchStart;
        if (distance > 0 && distance < 100) {
        setPullDistance(distance);
        }
    };

    const handlePullEnd = () => {
        if (pullDistance > 60) {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setPullDistance(0);
        }, 1000);
        } else {
        setPullDistance(0);
        }
        setTouchStart(null);
    };

    // Delete request
    const handleDelete = (id: string) => {
        setRequests(prev => prev.filter(req => req.id !== id));
        setSwipedId(null);
    };

    // Status badge colors
    const getStatusColor = (status: ServiceRequest['status']) => {
        const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-gray-100 text-gray-800'
        };
        return colors[status];
    };

    const getPriorityColor = (priority: ServiceRequest['priority']) => {
        const colors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800'
        };
        return colors[priority];
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden pb-[env(safe-area-inset-bottom)]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 pt-[max(env(safe-area-inset-top),12px)]">
            <h1 className="text-xl font-semibold text-gray-900">Service Requests</h1>
        </header>

        {/* Mobile Tab Switcher */}
        {breakpoint === 'mobile' && (
            <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                onClick={() => setActiveTab('new')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'new'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600'
                }`}
                >
                New Request
                </button>
                <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'history'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600'
                }`}
                >
                History ({requests.length})
                </button>
            </div>
            </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 overflow-hidden ${
            breakpoint === 'mobile' ? '' : 'grid'
        } ${
            breakpoint === 'tablet' ? 'grid-cols-[60%_40%]' : ''
        } ${
            breakpoint === 'desktop' ? 'grid-cols-[1fr_400px]' : ''
        }`}>
            
            {/* New Request Form */}
            <div className={`bg-white overflow-y-auto ${
            breakpoint === 'mobile' && activeTab !== 'new' ? 'hidden' : ''
            } ${breakpoint !== 'mobile' ? 'border-r border-gray-200' : ''}`}>
            <div className="p-4 md:p-6 max-w-2xl mx-auto">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Request</h2>
                
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="space-y-4 pb-20 md:pb-6">{/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Request Title *
                    </label>
                    <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="Brief description of your request"
                    className={`w-full px-4 py-3 rounded-lg border ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all text-base`}
                    />
                    {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.title}
                    </p>
                    )}
                </div>

                {/* Category Select */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                    </label>
                    <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all text-base`}
                    >
                    <option value="">Select a category</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="it-support">IT Support</option>
                    <option value="facilities">Facilities</option>
                    <option value="hr">Human Resources</option>
                    <option value="other">Other</option>
                    </select>
                    {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.category}
                    </p>
                    )}
                </div>

                {/* Priority Select */}
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                    </label>
                    <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                    >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    </select>
                </div>

                {/* Due Date */}
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date (Optional)
                    </label>
                    <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                    />
                </div>

                {/* Description Textarea */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                    </label>
                    <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Provide detailed information about your request"
                    className={`w-full px-4 py-3 rounded-lg border ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all text-base resize-none`}
                    />
                    {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.description}
                    </p>
                    )}
                </div>

                {/* File Upload (iOS optimized) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Optional)
                    </label>
                    <label htmlFor="file-upload" className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors active:bg-gray-50">
                    <div className="text-center">
                        <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Tap to add photo or file</span>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        capture="environment"
                        multiple
                        className="hidden"
                    />
                    </label>
                </div>
                </div>
                </form>
            </div>

            {/* Sticky Submit Button (Mobile) */}
            {breakpoint === 'mobile' && activeTab === 'new' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-[max(env(safe-area-inset-bottom),16px)]">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm touch-manipulation"
                >
                    Submit Request
                </button>
                </div>
            )}

            {/* Desktop Submit Button */}
            {breakpoint !== 'mobile' && (
                <div className="p-4 md:p-6 max-w-2xl mx-auto">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Submit Request
                </button>
                </div>
            )}
            </div>

            {/* Request History */}
            <div 
            ref={historyRef}
            className={`bg-gray-50 overflow-y-auto ${
                breakpoint === 'mobile' && activeTab !== 'history' ? 'hidden' : ''
            }`}
            onTouchStart={breakpoint === 'mobile' ? handlePullStart : undefined}
            onTouchMove={breakpoint === 'mobile' ? handlePullMove : undefined}
            onTouchEnd={breakpoint === 'mobile' ? handlePullEnd : undefined}
            style={{ scrollPaddingTop: '60px' }}
            >
            {/* Pull to Refresh Indicator */}
            {breakpoint === 'mobile' && pullDistance > 0 && (
                <div 
                className="flex justify-center py-2 transition-opacity"
                style={{ opacity: pullDistance / 60 }}
                >
                <div className={`${isRefreshing ? 'animate-spin' : ''}`}>
                    ↻
                </div>
                </div>
            )}

            <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Request History</h2>

                {requests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
                    <p>No requests yet</p>
                </div>
                ) : (
                <div className="space-y-3">
                    {/* Mobile Card View */}
                    {breakpoint === 'mobile' ? (
                    requests.map(request => (
                        <div
                        key={request.id}
                        data-id={request.id}
                        onTouchStart={(e) => handleTouchStart(e, request.id)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="relative"
                        >
                        {/* Swipe Actions Background */}
                        <div className={`absolute inset-0 bg-red-500 rounded-lg flex items-center justify-end px-4 transition-opacity ${
                            swipedId === request.id ? 'opacity-100' : 'opacity-0'
                        }`}>
                            <button
                            onClick={() => handleDelete(request.id)}
                            className="text-white p-2 touch-manipulation"
                            >
                            <Trash2 size={20} />
                            </button>
                        </div>

                        {/* Card Content */}
                        <div className={`bg-white rounded-lg p-4 shadow-sm active:shadow-md transition-all ${
                            swipedId === request.id ? '-translate-x-16' : ''
                        }`}>
                            <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-gray-900 flex-1">{request.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                {request.priority}
                            </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                                {request.status.replace('-', ' ')}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {request.createdAt.toLocaleDateString()}
                            </span>
                            </div>
                        </div>
                        </div>
                    ))
                    ) : (
                    /* Tablet/Desktop Table View */
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {requests.map(request => (
                            <tr key={request.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">{request.title}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{request.description}</div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{request.category}</td>
                                <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                    {request.priority}
                                </span>
                                </td>
                                <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                    {request.status.replace('-', ' ')}
                                </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                {request.createdAt.toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                <button
                                    onClick={() => handleDelete(request.id)}
                                    className="text-red-600 hover:text-red-700 p-1 touch-manipulation"
                                >
                                    <Trash2 size={16} />
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    )}
                </div>
                )}
            </div>
            </div>
        </div>


        </div>
    );
    };

    export default ServiceRequestManager;