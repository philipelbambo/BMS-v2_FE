    import React, { useState, useEffect, useRef } from 'react';
    import { Camera, FileText, Calendar, Send, ChevronRight, Edit2, X, RefreshCw, Plus, Home } from 'lucide-react';

    // TypeScript Interfaces
    interface ServiceRequest {
    id: string;
    requestType: 'maintenance' | 'room-transfer';
    issueTitle?: string;
    issueDescription?: string;
    currentRoom: string;
    requestedRoom?: string;
    transferReason?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    requestDate: string;
    attachments?: string[];
    }

    interface FormData {
    requestType: 'maintenance' | 'room-transfer';
    issueTitle: string;
    issueDescription: string;
    currentRoom: string;
    requestedRoom: string;
    transferReason: string;
    priority: 'low' | 'medium' | 'high';
    requestDate: string;
    attachments: File[];
    }

    interface FormErrors {
    issueTitle?: string;
    issueDescription?: string;
    currentRoom?: string;
    requestedRoom?: string;
    transferReason?: string;
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

    // Custom Hook for Touch Gestures
    const useSwipeGesture = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
        if (isRightSwipe && onSwipeRight) onSwipeRight();
    };

    return { onTouchStart, onTouchMove, onTouchEnd };
    };

    const ServiceRequestManager: React.FC = () => {
    const breakpoint = useBreakpoint();
    const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
    const [requests, setRequests] = useState<ServiceRequest[]>([
        {
        id: '1',
        requestType: 'maintenance',
        issueTitle: 'Door Lock Broken',
        issueDescription: 'The door lock is not working properly and gets stuck',
        currentRoom: '3',
        priority: 'high',
        status: 'in-progress',
        requestDate: '2024-12-20'
        },
        {
        id: '2',
        requestType: 'room-transfer',
        currentRoom: '5',
        requestedRoom: '8',
        transferReason: 'Need a quieter room for studying',
        priority: 'medium',
        status: 'pending',
        requestDate: '2024-12-19'
        },
        {
        id: '3',
        requestType: 'maintenance',
        issueTitle: 'Leaking Faucet',
        issueDescription: 'Bathroom faucet is dripping continuously',
        currentRoom: '7',
        priority: 'medium',
        status: 'pending',
        requestDate: '2024-12-18'
        }
    ]);
    const [formData, setFormData] = useState<FormData>({
        requestType: 'maintenance',
        issueTitle: '',
        issueDescription: '',
        currentRoom: '',
        requestedRoom: '',
        transferReason: '',
        priority: 'medium',
        requestDate: new Date().toISOString().split('T')[0],
        attachments: []
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [swipedCard, setSwipedCard] = useState<string | null>(null);
    const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    // Room numbers 1-11 (11 is the pad)
    const rooms = Array.from({ length: 11 }, (_, i) => {
        const roomNum = (i + 1).toString();
        return {
        value: roomNum,
        label: roomNum === '11' ? 'Room 11 (Pad)' : `Room ${roomNum}`
        };
    });

    // Form Validation
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!formData.currentRoom) {
        newErrors.currentRoom = 'Please select your current room';
        }

        if (formData.requestType === 'maintenance') {
        if (!formData.issueTitle.trim()) {
            newErrors.issueTitle = 'Issue title is required';
        } else if (formData.issueTitle.length < 3) {
            newErrors.issueTitle = 'Issue title must be at least 3 characters';
        }

        if (!formData.issueDescription.trim()) {
            newErrors.issueDescription = 'Issue description is required';
        } else if (formData.issueDescription.length < 10) {
            newErrors.issueDescription = 'Description must be at least 10 characters';
        }
        } else {
        if (!formData.requestedRoom) {
            newErrors.requestedRoom = 'Please select the room you want to transfer to';
        } else if (formData.requestedRoom === formData.currentRoom) {
            newErrors.requestedRoom = 'Requested room must be different from current room';
        }

        if (!formData.transferReason.trim()) {
            newErrors.transferReason = 'Please provide a reason for room transfer';
        } else if (formData.transferReason.length < 10) {
            newErrors.transferReason = 'Reason must be at least 10 characters';
        }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Form Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
        return;
        }

        if (editingRequest) {
        // Update existing request
        const updatedRequest: ServiceRequest = {
            ...editingRequest,
            requestType: formData.requestType,
            currentRoom: formData.currentRoom,
            priority: formData.priority,
            requestDate: formData.requestDate,
            ...(formData.requestType === 'maintenance' ? {
            issueTitle: formData.issueTitle,
            issueDescription: formData.issueDescription
            } : {
            requestedRoom: formData.requestedRoom,
            transferReason: formData.transferReason
            })
        };

        setRequests(requests.map(r => r.id === editingRequest.id ? updatedRequest : r));
        setEditingRequest(null);
        } else {
        // Create new request
        const newRequest: ServiceRequest = {
            id: Date.now().toString(),
            requestType: formData.requestType,
            currentRoom: formData.currentRoom,
            priority: formData.priority,
            status: 'pending',
            requestDate: formData.requestDate,
            attachments: formData.attachments.map(f => f.name),
            ...(formData.requestType === 'maintenance' ? {
            issueTitle: formData.issueTitle,
            issueDescription: formData.issueDescription
            } : {
            requestedRoom: formData.requestedRoom,
            transferReason: formData.transferReason
            })
        };

        setRequests([newRequest, ...requests]);
        }

        setFormData({
        requestType: 'maintenance',
        issueTitle: '',
        issueDescription: '',
        currentRoom: '',
        requestedRoom: '',
        transferReason: '',
        priority: 'medium',
        requestDate: new Date().toISOString().split('T')[0],
        attachments: []
        });
        setErrors({});
        
        if (breakpoint === 'mobile') {
        setActiveTab('history');
        }
    };

    // Handle File Upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setFormData({
            ...formData,
            attachments: [...formData.attachments, ...Array.from(e.target.files)]
        });
        }
    };

    // Pull to Refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        setTimeout(() => {
        setIsRefreshing(false);
        }, 1000);
    };

    // Swipe Gesture for Cards
    const handleSwipeLeft = (id: string) => {
        setSwipedCard(id);
    };

    const handleSwipeRight = () => {
        setSwipedCard(null);
    };

    const swipeHandlers = useSwipeGesture(
        () => handleSwipeLeft(''),
        handleSwipeRight
    );

    // Delete Request
    const deleteRequest = (id: string) => {
        setRequests(requests.filter(r => r.id !== id));
        setSwipedCard(null);
    };

    // Edit Request
    const startEditRequest = (request: ServiceRequest) => {
        setEditingRequest(request);
        setFormData({
        requestType: request.requestType,
        issueTitle: request.issueTitle || '',
        issueDescription: request.issueDescription || '',
        currentRoom: request.currentRoom,
        requestedRoom: request.requestedRoom || '',
        transferReason: request.transferReason || '',
        priority: request.priority,
        requestDate: request.requestDate,
        attachments: []
        });
        setActiveTab('new');
        setSwipedCard(null);
    };

    // Cancel Edit
    const cancelEdit = () => {
        setEditingRequest(null);
        setFormData({
        requestType: 'maintenance',
        issueTitle: '',
        issueDescription: '',
        currentRoom: '',
        requestedRoom: '',
        transferReason: '',
        priority: 'medium',
        requestDate: new Date().toISOString().split('T')[0],
        attachments: []
        });
        setErrors({});
    };

    // Priority Badge Colors
    const getPriorityColor = (priority: string) => {
        switch (priority) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Status Badge Colors
    const getStatusColor = (status: string) => {
        switch (status) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'in-progress': return 'bg-blue-100 text-blue-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Reset form when request type changes
    const handleRequestTypeChange = (type: 'maintenance' | 'room-transfer') => {
        setFormData({
        ...formData,
        requestType: type,
        issueTitle: '',
        issueDescription: '',
        requestedRoom: '',
        transferReason: ''
        });
        setErrors({});
    };

    // New Request Form Component
    const NewRequestForm = () => (
        <div 
        ref={formRef}
        className={`${breakpoint === 'mobile' ? 'h-full overflow-y-auto pb-24' : 'h-full overflow-y-auto'}`}
        style={{ scrollPaddingTop: '20px' }}
        >
        <div className="p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
                {editingRequest ? 'Edit Request' : 'New Request'}
            </h2>
            {editingRequest && (
                <button
                onClick={cancelEdit}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                <X className="w-4 h-4" />
                Cancel
                </button>
            )}
            </div>

            {/* Request Type Selection */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Request Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
                <button
                onClick={() => handleRequestTypeChange('maintenance')}
                className={`p-4 rounded-lg border-2 transition ${
                    formData.requestType === 'maintenance'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                >
                <div className="flex flex-col items-center gap-2">
                    <FileText className={`w-6 h-6 ${formData.requestType === 'maintenance' ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className={`font-medium ${formData.requestType === 'maintenance' ? 'text-blue-700' : 'text-gray-700'}`}>
                    Maintenance
                    </span>
                    <span className="text-xs text-gray-500 text-center">Report broken items</span>
                </div>
                </button>
                <button
                onClick={() => handleRequestTypeChange('room-transfer')}
                className={`p-4 rounded-lg border-2 transition ${
                    formData.requestType === 'room-transfer'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                >
                <div className="flex flex-col items-center gap-2">
                    <Home className={`w-6 h-6 ${formData.requestType === 'room-transfer' ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className={`font-medium ${formData.requestType === 'room-transfer' ? 'text-blue-700' : 'text-gray-700'}`}>
                    Room Transfer
                    </span>
                    <span className="text-xs text-gray-500 text-center">Request room change</span>
                </div>
                </button>
            </div>
            </div>

            {/* Current Room Selection */}
            <div>
            <label htmlFor="currentRoom" className="block text-sm font-medium text-gray-700 mb-2">
                Your Current Room *
            </label>
            <select
                id="currentRoom"
                value={formData.currentRoom}
                onChange={(e) => setFormData({ ...formData, currentRoom: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.currentRoom ? 'border-red-500' : 'border-gray-300'
                }`}
            >
                <option value="">Select your room</option>
                {rooms.map(room => (
                <option key={room.value} value={room.value}>{room.label}</option>
                ))}
            </select>
            {errors.currentRoom && (
                <p className="mt-1 text-sm text-red-600">{errors.currentRoom}</p>
            )}
            </div>

            {/* Maintenance Request Fields */}
            {formData.requestType === 'maintenance' && (
            <>
                {/* Issue Title */}
                <div>
                <label htmlFor="issueTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    What's Broken? *
                </label>
                <input
                    type="text"
                    id="issueTitle"
                    value={formData.issueTitle}
                    onChange={(e) => setFormData({ ...formData, issueTitle: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.issueTitle ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Door lock, Window, Ceiling fan, AC unit"
                    autoComplete="off"
                />
                {errors.issueTitle && (
                    <p className="mt-1 text-sm text-red-600">{errors.issueTitle}</p>
                )}
                </div>

                {/* Issue Description */}
                <div>
                <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Describe the Problem *
                </label>
                <textarea
                    id="issueDescription"
                    value={formData.issueDescription}
                    onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.issueDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Explain what happened and how it's broken"
                />
                {errors.issueDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.issueDescription}</p>
                )}
                </div>

                {/* Photo Upload for Maintenance */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos of the Issue (Optional)
                </label>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                >
                    <Camera className="w-5 h-5" />
                    <span>Take or Upload Photos</span>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    capture="environment"
                />
                {formData.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                    {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span className="truncate">{file.name}</span>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </>
            )}

            {/* Room Transfer Fields */}
            {formData.requestType === 'room-transfer' && (
            <>
                {/* Requested Room */}
                <div>
                <label htmlFor="requestedRoom" className="block text-sm font-medium text-gray-700 mb-2">
                    Which Room Do You Want? *
                </label>
                <select
                    id="requestedRoom"
                    value={formData.requestedRoom}
                    onChange={(e) => setFormData({ ...formData, requestedRoom: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.requestedRoom ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    <option value="">Select desired room</option>
                    {rooms
                    .filter(room => room.value !== formData.currentRoom)
                    .map(room => (
                        <option key={room.value} value={room.value}>{room.label}</option>
                    ))}
                </select>
                {errors.requestedRoom && (
                    <p className="mt-1 text-sm text-red-600">{errors.requestedRoom}</p>
                )}
                </div>

                {/* Transfer Reason */}
                <div>
                <label htmlFor="transferReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Why Do You Want to Transfer? *
                </label>
                <textarea
                    id="transferReason"
                    value={formData.transferReason}
                    onChange={(e) => setFormData({ ...formData, transferReason: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.transferReason ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Explain your reason for requesting a room change"
                />
                {errors.transferReason && (
                    <p className="mt-1 text-sm text-red-600">{errors.transferReason}</p>
                )}
                </div>
            </>
            )}

            {/* Date Field */}
            <div>
            <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700 mb-2">
                Request Date
            </label>
            <div className="relative">
                <input
                type="date"
                id="requestDate"
                value={formData.requestDate}
                onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            </div>

            {/* Submit Button - Desktop/Tablet */}
            {breakpoint !== 'mobile' && (
            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition active:scale-95"
            >
                <Send className="w-5 h-5" />
                {editingRequest ? 'Update Request' : 'Submit Request'}
            </button>
            )}
        </div>

        {/* Sticky Submit Button - Mobile */}
        {breakpoint === 'mobile' && (
            <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200 safe-area-inset-bottom">
            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 active:bg-blue-700 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition active:scale-95"
            >
                <Send className="w-5 h-5" />
                {editingRequest ? 'Update Request' : 'Submit Request'}
            </button>
            </div>
        )}
        </div>
    );

    // Request History Component
    const RequestHistory = () => (
        <div className={`${breakpoint === 'mobile' ? 'h-full' : 'h-full'} overflow-y-auto`}>
        {/* Pull to Refresh Indicator */}
        {isRefreshing && breakpoint === 'mobile' && (
            <div className="flex justify-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        )}

        <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Request History</h2>
            {breakpoint === 'mobile' && (
                <button
                onClick={handleRefresh}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                <RefreshCw className="w-5 h-5" />
                </button>
            )}
            </div>

            {/* Mobile Card Layout */}
            {breakpoint === 'mobile' && (
            <div className="space-y-3 pb-20">
                {requests.map((request) => (
                <div
                    key={request.id}
                    {...swipeHandlers}
                    className="relative overflow-hidden"
                >
                    {/* Swipe Actions Background */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button
                        onClick={() => startEditRequest(request)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => deleteRequest(request.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    </div>

                    {/* Card */}
                    <div
                    className={`relative bg-white border border-gray-200 rounded-lg p-4 transition-transform ${
                        swipedCard === request.id ? '-translate-x-20' : ''
                    } active:bg-gray-50`}
                    onTouchStart={(e) => swipeHandlers.onTouchStart(e)}
                    onTouchMove={(e) => swipeHandlers.onTouchMove(e)}
                    onTouchEnd={() => {
                        swipeHandlers.onTouchEnd();
                        handleSwipeLeft(request.id);
                    }}
                    >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {request.requestType === 'maintenance' ? (
                            <FileText className="w-4 h-4 text-blue-600" />
                            ) : (
                            <Home className="w-4 h-4 text-green-600" />
                            )}
                            <span className={`text-xs font-semibold uppercase ${
                            request.requestType === 'maintenance' ? 'text-blue-600' : 'text-green-600'
                            }`}>
                            {request.requestType === 'maintenance' ? 'Maintenance' : 'Room Transfer'}
                            </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">
                            {request.requestType === 'maintenance' 
                            ? request.issueTitle 
                            : `Transfer to Room ${request.requestedRoom}`}
                        </h3>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {request.requestType === 'maintenance' 
                        ? request.issueDescription 
                        : request.transferReason}
                    </p>
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <Home className="w-4 h-4" />
                        <span>
                        {request.requestType === 'maintenance' 
                            ? `Room ${request.currentRoom}` 
                            : `Room ${request.currentRoom} → ${request.requestedRoom}`}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {new Date(request.requestDate).toLocaleDateString()}
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}

            {/* Tablet/Desktop Table Layout */}
            {breakpoint !== 'mobile' && (
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                            {request.requestType === 'maintenance' ? (
                            <>
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-600">Maintenance</span>
                            </>
                            ) : (
                            <>
                                <Home className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600">Transfer</span>
                            </>
                            )}
                        </div>
                        </td>
                        <td className="px-4 py-4">
                        <div>
                            <div className="font-medium text-gray-900">
                            {request.requestType === 'maintenance' 
                                ? request.issueTitle 
                                : `Transfer to Room ${request.requestedRoom}`}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                            {request.requestType === 'maintenance' 
                                ? request.issueDescription 
                                : request.transferReason}
                            </div>
                        </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                        {request.requestType === 'maintenance' 
                            ? `Room ${request.currentRoom}` 
                            : `${request.currentRoom} → ${request.requestedRoom}`}
                        </td>
                        <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                        </span>
                        </td>
                        <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                        </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(request.requestDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                        <div className="flex gap-2">
                            <button 
                            onClick={() => startEditRequest(request)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                            >
                            <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                            onClick={() => deleteRequest(request.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                            >
                            <X className="w-4 h-4" />
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-gray-50">
        {/* Mobile Layout with Bottom Tab Bar */}
        {breakpoint === 'mobile' && (
            <>
            <div className="flex-1 overflow-hidden">
                {activeTab === 'new' ? <NewRequestForm /> : <RequestHistory />}
            </div>

            {/* Bottom Tab Bar */}
            <div className="bg-white border-t border-gray-200 safe-area-inset-bottom">
                <div className="flex">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
                    activeTab === 'new' ? 'text-blue-600' : 'text-gray-500'
                    }`}
                >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs font-medium">New Request</span>
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
                    activeTab === 'history' ? 'text-blue-600' : 'text-gray-500'
                    }`}
                >
                    <FileText className="w-6 h-6" />
                    <span className="text-xs font-medium">History</span>
                </button>
                </div>
            </div>
            </>
        )}

        {/* Tablet/Desktop Split Layout */}
        {breakpoint !== 'mobile' && (
            <div className={`flex-1 grid ${
            breakpoint === 'tablet' 
                ? 'grid-cols-[60%_40%]' 
                : 'grid-cols-[1fr_400px]'
            } gap-0 overflow-hidden`}>
            <div className="border-r border-gray-200 bg-white overflow-hidden">
                <NewRequestForm />
            </div>
            <div className="bg-gray-50 overflow-hidden">
                <RequestHistory />
            </div>
            </div>
        )}
        </div>
    );
    };

    export default ServiceRequestManager;