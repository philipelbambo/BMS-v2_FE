    import React, { useState, useEffect, useCallback, useRef } from 'react';
    import { 
    Home, Bed, Calendar, CreditCard, AlertCircle, MessageSquare, 
    Settings, Menu, X, ChevronRight, Check, Clock, XCircle, Bell, Download 
    } from 'lucide-react';

    type MenuItem = {
    id: string;
    label: string;
    icon: React.ReactNode;
    };

    type MaintenanceRequest = {
    id: string;
    type: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    date: string;
    rating?: number;
    };

    type BookingRequest = {
    id: string;
    checkIn: string;
    checkOut: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    };

    type Payment = {
    id: string;
    date: string;
    amount: number;
    type: string;
    status: 'paid' | 'pending';
    };

    type Message = {
    id: string;
    subject: string;
    content: string;
    date: string;
    from: string;
    };

    const TenantDashboard: React.FC = () => {
    // Sidebar state
    const [sidebarExpanded, setSidebarExpanded] = useState(() => {
        if (typeof window !== 'undefined') {
        return localStorage.getItem('sidebarExpanded') !== 'false';
        }
        return true;
    });
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [showMobileTabs, setShowMobileTabs] = useState(false);

    const [activeSection, setActiveSection] = useState('dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications] = useState(['Payment due in 3 days', 'New announcement from admin']);

    const sidebarRef = useRef<HTMLDivElement>(null);

    // Detect mobile for bottom tabs
    useEffect(() => {
        const checkMobile = () => {
        const isMobile = window.innerWidth < 768;
        setShowMobileTabs(isMobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Persist sidebar state
    useEffect(() => {
        localStorage.setItem('sidebarExpanded', String(sidebarExpanded));
    }, [sidebarExpanded]);

    // Keyboard shortcut: Ctrl/Cmd + [
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === '[') {
            e.preventDefault();
            toggleSidebar();
        }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [sidebarExpanded]);

    // Close mobile sidebar on route change
    const closeMobileSidebar = useCallback(() => {
        setMobileSidebarOpen(false);
    }, []);

    const toggleSidebar = useCallback(() => {
        if (window.innerWidth < 768) {
        setMobileSidebarOpen(prev => !prev);
        } else {
        setSidebarExpanded(prev => !prev);
        }
    }, []);

    const menuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
        { id: 'room', label: 'My Room', icon: <Bed size={20} /> },
        { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
        { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
        { id: 'maintenance', label: 'Maintenance', icon: <AlertCircle size={20} /> },
        { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    const [maintenanceRequests] = useState<MaintenanceRequest[]>([
        { id: '1', type: 'Plumbing', description: 'Leaking faucet', status: 'in-progress', date: '2024-12-15' },
        { id: '2', type: 'Electrical', description: 'Light not working', status: 'completed', date: '2024-12-10', rating: 5 },
    ]);

    const [bookingRequests] = useState<BookingRequest[]>([
        { id: '1', checkIn: '2024-12-25', checkOut: '2024-12-28', reason: 'Holiday visit', status: 'pending' },
        { id: '2', checkIn: '2024-12-01', checkOut: '2024-12-05', reason: 'Family visit', status: 'approved' },
    ]);

    const [payments] = useState<Payment[]>([
        { id: '1', date: '2024-12-01', amount: 5000, type: 'Monthly Rent', status: 'paid' },
        { id: '2', date: '2024-12-01', amount: 500, type: 'Utilities', status: 'paid' },
        { id: '3', date: '2025-01-01', amount: 5000, type: 'Monthly Rent', status: 'pending' },
    ]);

    const [messages] = useState<Message[]>([
        { id: '1', subject: 'Welcome', content: 'Welcome to the tenant portal!', date: '2024-12-01', from: 'Admin' },
        { id: '2', subject: 'Maintenance Update', content: 'Your request has been processed.', date: '2024-12-15', from: 'Admin' },
    ]);

    const roomData = {
        number: '205',
        type: 'Deluxe Single',
        amenities: ['Air Conditioning', 'WiFi', 'Study Desk', 'Private Bathroom'],
        occupancy: 'Single',
    };

    const getStatusColor = (status: string) => {
        switch (status) {
        case 'approved':
        case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
        case 'approved': return <Check size={16} className="mr-1" />;
        case 'rejected': return <XCircle size={16} className="mr-1" />;
        case 'pending': return <Clock size={16} className="mr-1" />;
        default: return null;
        }
    };

    // ===== RENDER SECTIONS =====
    const renderDashboard = () => (
        <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-sm p-4 sm:p-6`}>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">Welcome back, John!</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Here's what's happening with your tenancy</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
            { title: 'Current Room', value: roomData.number, subtitle: roomData.type, icon: <Bed className="text-[#001F3D]" size={24} /> },
            { title: 'Next Payment', value: '₱5,000', subtitle: 'Due in 3 days', icon: <CreditCard className="text-[#001F3D]" size={24} /> },
            { title: 'Pending Requests', value: '2', subtitle: 'Awaiting response', icon: <Clock className="text-[#001F3D]" size={24} /> },
            ].map((item, idx) => (
            <div key={idx} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4`}>
                <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{item.title}</h3>
                {item.icon}
                </div>
                <p className="text-xl sm:text-2xl font-bold">{item.value}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{item.subtitle}</p>
            </div>
            ))}
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 sm:p-6`}>
            <div className="flex items-center mb-4">
            <Bell className="text-[#001F3D] mr-2" size={20} />
            <h3 className="font-semibold">Important Notifications</h3>
            </div>
            <div className="space-y-3">
            {notifications.map((note, idx) => (
                <div 
                key={idx} 
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-[#001F3D]`}
                >
                <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{note}</p>
                </div>
            ))}
            </div>
        </div>
        </div>
    );

    const renderRoom = () => (
        <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-sm p-4 sm:p-6`}>
            <h2 className="text-xl sm:text-2xl font-bold mb-5">My Room Details</h2>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>Room Number</p>
                <p className="text-xl font-semibold">{roomData.number}</p>
            </div>
            <div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>Room Type</p>
                <p className="text-xl font-semibold">{roomData.type}</p>
            </div>
            <div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>Occupancy</p>
                <p className="text-xl font-semibold">{roomData.occupancy}</p>
            </div>
            <div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-2`}>Amenities</p>
                <div className="flex flex-wrap gap-2">
                {roomData.amenities.map((amenity, idx) => (
                    <span 
                    key={idx} 
                    className="px-3 py-1.5 bg-[#001F3D] text-white text-xs sm:text-sm rounded-full whitespace-nowrap"
                    >
                    {amenity}
                    </span>
                ))}
                </div>
            </div>
            </div>

            <button 
            className="mt-6 w-full sm:w-auto px-4 py-2.5 bg-[#001F3D] text-white rounded-lg hover:bg-[#003566] transition text-sm font-medium"
            >
            Request Room Change
            </button>
        </div>
        </div>
    );

    const renderBookings = () => (
        <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-sm p-4 sm:p-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Booking Requests</h2>
            <button className="px-4 py-2 bg-[#001F3D] text-white rounded-lg hover:bg-[#003566] transition text-sm font-medium whitespace-nowrap">
                New Booking Request
            </button>
            </div>

            <div className="space-y-4">
            {bookingRequests.map(request => (
                <div 
                key={request.id} 
                className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{request.reason}</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        {request.checkIn} to {request.checkOut}
                    </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 whitespace-nowrap ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );

    const renderPayments = () => (
        <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-sm p-4 sm:p-6`}>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Payments</h2>
            
            <div className="space-y-4">
            {payments.map(payment => (
                <div 
                key={payment.id} 
                className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                    <p className="font-semibold">{payment.type}</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{payment.date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold">₱{payment.amount.toLocaleString()}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 justify-end">
                        <span className={`px-3 py-1 rounded-full text-sm ${payment.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                        {payment.status === 'paid' && (
                        <button 
                            aria-label="Download receipt"
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                        >
                            <Download size={16} className="text-[#001F3D]" />
                        </button>
                        )}
                        {payment.status === 'pending' && (
                        <button className="px-3 py-1 bg-[#001F3D] text-white text-sm rounded hover:bg-[#003566] whitespace-nowrap">
                            Pay Now
                        </button>
                        )}
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );

    const renderMaintenance = () => (
        <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-sm p-4 sm:p-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Maintenance Requests</h2>
            <button className="px-4 py-2 bg-[#001F3D] text-white rounded-lg hover:bg-[#003566] transition text-sm font-medium whitespace-nowrap">
                New Maintenance Request
            </button>
            </div>

            <div className="space-y-4">
            {maintenanceRequests.map(request => (
                <div 
                key={request.id} 
                className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                    <p className="font-semibold">{request.type}</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{request.description}</p>
                    <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs mt-1`}>Submitted: {request.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${getStatusColor(request.status === 'in-progress' ? 'in-progress' : request.status)}`}>
                    {request.status === 'in-progress' ? 'In Progress' : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                </div>
                {request.status === 'completed' && !request.rating && (
                    <button className="mt-3 px-4 py-1.5 bg-[#001F3D] text-white text-sm rounded hover:bg-[#003566]">
                    Rate Service
                    </button>
                )}
                {request.rating && (
                    <div className="mt-3 flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Rating: </span>
                    <span className="ml-2 text-yellow-500">{'★'.repeat(request.rating)}</span>
                    </div>
                )}
                </div>
            ))}
            </div>
        </div>
        </div>
    );

    const renderMessages = () => (
        <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-sm p-4 sm:p-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Messages</h2>
            <button className="px-4 py-2 bg-[#001F3D] text-white rounded-lg hover:bg-[#003566] transition text-sm font-medium whitespace-nowrap">
                New Message
            </button>
            </div>

            <div className="space-y-4">
            {messages.map(message => (
                <div 
                key={message.id} 
                className={`p-4 rounded-xl border cursor-pointer transition ${
                    darkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                    <p className="font-semibold line-clamp-1">{message.subject}</p>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs flex-shrink-0`}>{message.date}</span>
                </div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm line-clamp-2`}>{message.content}</p>
                <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs mt-2`}>From: {message.from}</p>
                </div>
            ))}
            </div>
        </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-sm p-4 sm:p-6`}>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Settings</h2>
            
            <div className="space-y-5">
            <div>
                <h3 className="font-semibold mb-3">Profile Information</h3>
                <div className="space-y-3">
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} 
                    defaultValue="John Doe" 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} 
                    defaultValue="john@example.com" 
                />
                <input 
                    type="tel" 
                    placeholder="Phone" 
                    className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} 
                    defaultValue="+1234567890" 
                />
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Security</h3>
                <button className="px-4 py-2.5 bg-[#001F3D] text-white rounded-lg hover:bg-[#003566] transition">
                Change Password
                </button>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Preferences</h3>
                <div 
                onClick={() => setDarkMode(!darkMode)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                }`}
                >
                <span>Dark Mode</span>
                <div className={`relative w-12 h-6 rounded-full transition ${darkMode ? 'bg-[#001F3D]' : 'bg-gray-300'}`}>
                    <div 
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                    />
                </div>
                </div>
            </div>

            <button className="w-full px-4 py-3 bg-[#001F3D] text-white rounded-lg hover:bg-[#003566] transition font-medium">
                Save Changes
            </button>
            </div>
        </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
        case 'dashboard': return renderDashboard();
        case 'room': return renderRoom();
        case 'bookings': return renderBookings();
        case 'payments': return renderPayments();
        case 'maintenance': return renderMaintenance();
        case 'messages': return renderMessages();
        case 'settings': return renderSettings();
        default: return renderDashboard();
        }
    };

    // ===== SIDEBAR =====
    const SidebarContent = () => (
        <>
        <div className="p-4 flex items-center justify-between border-b border-gray-700/30">
            {sidebarExpanded && (
            <h1 className="text-xl font-bold truncate">Tenant Portal</h1>
            )}
            <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-700/20"
            aria-label={mobileSidebarOpen ? "Close menu" : "Toggle menu"}
            >
            {mobileSidebarOpen || !sidebarExpanded ? (
                <X size={20} className={darkMode ? 'text-gray-200' : 'text-gray-700'} />
            ) : (
                <Menu size={20} className={darkMode ? 'text-gray-200' : 'text-gray-700'} />
            )}
            </button>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
            {menuItems.map(item => (
            <div key={item.id} className="relative group">
                <button
                onClick={() => {
                    setActiveSection(item.id);
                    closeMobileSidebar();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 text-left transition ${
                    activeSection === item.id
                    ? 'bg-[#001F3D] text-white'
                    : darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                >
                {item.icon}
                {sidebarExpanded && <span>{item.label}</span>}
                {sidebarExpanded && activeSection === item.id && (
                    <ChevronRight className="ml-auto" size={18} />
                )}
                </button>
                {/* Tooltip for collapsed mode */}
                {!sidebarExpanded && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.label}
                </div>
                )}
            </div>
            ))}
        </nav>

        <div className="p-4 border-t border-gray-700/30">
            <button
            onClick={() => {
                closeMobileSidebar();
                window.location.href = '/login-tenant';
            }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {sidebarExpanded && <span>Sign Out</span>}
            </button>
        </div>
        </>
    );

    return (
        <div 
        className={`flex min-h-screen transition-colors duration-200 ${
            darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'
        }`}
        onClick={(e) => {
            // Close mobile sidebar if clicked outside (but not on sidebar)
            if (mobileSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
            closeMobileSidebar();
            }
        }}
        >
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
            <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            aria-hidden="true"
            />
        )}

        {/* Desktop/Tablet Sidebar */}
        <aside 
            ref={sidebarRef}
            className={`${
            !sidebarExpanded ? 'w-20' : 'w-64'
            } ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 ease-in-out
            hidden md:flex flex-col fixed md:sticky top-0 left-0 h-screen z-30`}
            aria-label="Main navigation"
        >
            <SidebarContent />
        </aside>

        {/* Mobile Sidebar Drawer */}
        <aside 
            className={`${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl
            fixed inset-y-0 left-0 w-64 z-50 flex flex-col md:hidden transition-transform duration-300 ease-in-out`}
            aria-label="Mobile navigation"
            role="dialog"
            aria-modal="true"
            aria-hidden={!mobileSidebarOpen}
        >
            <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-0 md:pt-0 overflow-x-hidden">
            <div className="p-4 sm:p-6">
            {renderContent()}
            </div>
        </main>

        {/* Mobile Bottom Tab Bar (optional — enabled on mobile) */}
        {showMobileTabs && (
            <nav 
            className={`fixed bottom-0 left-0 right-0 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border-t z-50`}
            role="navigation"
            aria-label="Mobile navigation tabs"
            >
            <div className="flex justify-around items-center py-2 px-1">
                {menuItems.slice(0, 5).map(item => (
                <button
                    key={item.id}
                    onClick={() => {
                    setActiveSection(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-full ${
                    activeSection === item.id 
                        ? 'text-[#001F3D]' 
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    aria-label={item.label}
                >
                    <span className="mb-1">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                </button>
                ))}
                <button
                onClick={toggleSidebar}
                className={`flex flex-col items-center justify-center p-2 rounded-full ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
                aria-label="More options"
                >
                <Settings size={20} />
                <span className="text-xs">More</span>
                </button>
            </div>
            </nav>
        )}
        </div>
    );
    };

    export default TenantDashboard;