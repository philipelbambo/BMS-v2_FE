    import React, { useState, useEffect } from 'react';
    import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, Download, Bell, X, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';

    // TypeScript Interfaces
    interface PaymentRecord {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: string;
    method?: string;
    }

    interface ServiceRequest {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'submitted' | 'in-progress' | 'completed';
    submittedDate: string;
    estimatedCompletion?: string;
    managerResponse?: string;
    }

    interface ComplianceRule {
    id: string;
    category: string;
    rule: string;
    status: 'completed' | 'pending' | 'violation';
    dueDate?: string;
    feedback?: string;
    }

    interface Notification {
    id: string;
    type: 'payment' | 'request' | 'inspection' | 'rule';
    priority: 'urgent' | 'normal' | 'info';
    message: string;
    date: string;
    read: boolean;
    actionable: boolean;
    }

    // Custom Hook for Real-time Updates
    const useRealtimeUpdates = () => {
    const [lastUpdate, setLastUpdate] = useState(new Date());
    
    useEffect(() => {
        const interval = setInterval(() => {
        setLastUpdate(new Date());
        }, 30000); // Update every 30 seconds
        
        return () => clearInterval(interval);
    }, []);
    
    return lastUpdate;
    };

    const TenantDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState<'mobile' | 'desktop'>('mobile');
    const [showNotifications, setShowNotifications] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const lastUpdate = useRealtimeUpdates();

    // Mock Data
    const [payments] = useState<PaymentRecord[]>([
        { id: '1', date: '2024-12-01', amount: 1000, status: 'paid', dueDate: '2024-12-01', method: 'Cash' },
        { id: '2', date: '2024-12-31', amount: 100, status: 'paid', dueDate: '2024-12-31', method: 'Cash' },
        { id: '3', date: '2024-11-01', amount: 1000, status: 'paid', dueDate: '2024-11-01', method: 'Cash' },
        { id: '4', date: '2024-11-30', amount: 100, status: 'paid', dueDate: '2024-11-30', method: 'Cash' },
        { id: '5', date: '2024-10-01', amount: 1000, status: 'paid', dueDate: '2024-10-01', method: 'Cash' },
        { id: '6', date: '2024-10-31', amount: 100, status: 'paid', dueDate: '2024-10-31', method: 'Cash' },
        { id: '7', date: '2025-01-01', amount: 1000, status: 'pending', dueDate: '2025-01-01' },
        { id: '8', date: '2025-01-31', amount: 100, status: 'pending', dueDate: '2025-01-31' },
    ]);

    const [requests, setRequests] = useState<ServiceRequest[]>([
        {
        id: '1',
        title: 'Broken Light Bulb',
        description: 'Ceiling light in my room is not working',
        priority: 'high',
        status: 'in-progress',
        submittedDate: '2024-12-20',
        estimatedCompletion: '2024-12-26',
        managerResponse: 'Will replace the bulb this week'
        },
        {
        id: '2',
        title: 'Door Lock Issue',
        description: 'Room door lock is loose and difficult to lock',
        priority: 'medium',
        status: 'submitted',
        submittedDate: '2024-12-22'
        },
        {
        id: '3',
        title: 'Window Repair',
        description: 'Window pane is cracked',
        priority: 'low',
        status: 'completed',
        submittedDate: '2024-12-15',
        estimatedCompletion: '2024-12-18'
        }
    ]);

    const [compliance] = useState<ComplianceRule[]>([
        { id: '1', category: 'Cleanliness', rule: 'Weekly room inspection', status: 'completed', feedback: 'Excellent!' },
        { id: '2', category: 'Visitor Policy', rule: 'Register guests 24h advance', status: 'completed' },
        { id: '3', category: 'Noise', rule: 'Quiet hours 10PM-7AM', status: 'completed' },
        { id: '4', category: 'Facility Usage', rule: 'Kitchen cleanup after use', status: 'pending', dueDate: '2024-12-25' },
        { id: '5', category: 'Cleanliness', rule: 'Monthly deep clean', status: 'pending', dueDate: '2024-12-31' },
    ]);

    const [notifications, setNotifications] = useState<Notification[]>([
        {
        id: '1',
        type: 'payment',
        priority: 'urgent',
        message: 'Rent payment due in 7 days (Jan 1, 2025) - ₱1,000',
        date: '2024-12-24',
        read: false,
        actionable: true
        },
        {
        id: '2',
        type: 'payment',
        priority: 'normal',
        message: 'WiFi payment due on Jan 31, 2025 - ₱100',
        date: '2024-12-24',
        read: false,
        actionable: true
        },
        {
        id: '3',
        type: 'request',
        priority: 'normal',
        message: 'Broken light bulb repair scheduled for Dec 26',
        date: '2024-12-23',
        read: false,
        actionable: false
        },
        {
        id: '4',
        type: 'inspection',
        priority: 'info',
        message: 'Quarterly inspection scheduled for Jan 5, 2025',
        date: '2024-12-22',
        read: true,
        actionable: false
        }
    ]);

    useEffect(() => {
        const handleResize = () => {
        setActiveView(window.innerWidth >= 768 ? 'desktop' : 'mobile');
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const calculatePaymentStreak = () => {
        let streak = 0;
        const sortedPayments = [...payments].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        for (const payment of sortedPayments) {
        if (payment.status === 'paid') streak++;
        else break;
        }
        return streak;
    };

    const calculateComplianceScore = () => {
        const completed = compliance.filter(c => c.status === 'completed').length;
        return Math.round((completed / compliance.length) * 100);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
        case 'paid':
        case 'completed':
            return 'bg-green-500';
        case 'pending':
        case 'submitted':
        case 'in-progress':
            return 'bg-yellow-500';
        case 'overdue':
        case 'violation':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
        case 'high':
            return 'text-red-500 bg-red-50';
        case 'medium':
            return 'text-yellow-600 bg-yellow-50';
        case 'low':
            return 'text-blue-500 bg-blue-50';
        default:
            return 'text-gray-500 bg-gray-50';
        }
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const exportReport = () => {
        const report = {
        paymentStatus: {
            currentBalance: payments.find(p => p.status === 'pending')?.amount || 0,
            streak: calculatePaymentStreak(),
            history: payments
        },
        requests: requests,
        complianceScore: calculateComplianceScore(),
        compliance: compliance,
        generatedDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tenant-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const paymentStreak = calculatePaymentStreak();
    const complianceScore = calculateComplianceScore();
    const currentBalance = payments.find(p => p.status === 'pending')?.amount || 0;
    const nextDueDate = payments.find(p => p.status === 'pending')?.dueDate || 'N/A';

    return (
        <div className="min-h-screen bg-white pb-safe pt-4">

        {/* Notifications Panel */}
        {showNotifications && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16">
            <div className="bg-white rounded-t-3xl md:rounded-lg w-full md:max-w-md mx-4 max-h-[80vh] overflow-hidden shadow-2xl">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-lg font-bold">Notifications</h2>
                <div className="flex gap-2">
                    <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    >
                    Mark all read
                    </button>
                    <button onClick={() => setShowNotifications(false)}>
                    <X size={20} />
                    </button>
                </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
                {notifications.map(notif => (
                    <div
                    key={notif.id}
                    className={`p-4 border-b ${!notif.read ? 'bg-blue-50' : ''} ${
                        notif.priority === 'urgent' ? 'border-l-4 border-red-500' : ''
                    }`}
                    >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                        <p className={`font-medium ${notif.priority === 'urgent' ? 'text-red-600' : ''}`}>
                            {notif.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{notif.date}</p>
                        </div>
                        {notif.actionable && (
                        <button className="ml-2 text-blue-600 text-sm font-medium">
                            Act
                        </button>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        )}

        {/* Main Content */}
        <div className="w-full px-4 space-y-4">
            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Payment Status */}
            <div className="bg-white rounded-xl shadow-lg p-3">
                <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">Payment Status</h3>
                <TrendingUp className="text-green-500" size={18} />
                </div>
                <div className="space-y-1.5">
                <div>
                    <p className="text-xs text-gray-600">Current Balance</p>
                    <p className="text-xl font-bold text-blue-900">₱{currentBalance.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-600">Next Due Date</p>
                    <p className="text-sm font-semibold">{new Date(nextDueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 p-1.5 rounded-lg">
                    <CheckCircle className="text-green-500" size={16} />
                    <div>
                    <p className="text-xs font-semibold text-green-800">
                        {paymentStreak} Month Streak
                    </p>
                    <p className="text-xs text-green-600">On-time payments</p>
                    </div>
                </div>
                </div>
            </div>

            {/* Request Status */}
            <div className="bg-white rounded-xl shadow-lg p-3">
                <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">Service Requests</h3>
                <Clock className="text-yellow-500" size={18} />
                </div>
                <div className="space-y-1">
                {['submitted', 'in-progress', 'completed'].map(status => {
                    const count = requests.filter(r => r.status === status).length;
                    return (
                    <div key={status} className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
                        <span className="text-xs capitalize">{status.replace('-', ' ')}</span>
                        <span className="font-bold text-sm">{count}</span>
                    </div>
                    );
                })}
                </div>
                <div className="mt-2">
                <p className="text-xs text-gray-600">Active Requests</p>
                <p className="text-lg font-bold text-blue-900">
                    {requests.filter(r => r.status !== 'completed').length}
                </p>
                </div>
            </div>

            {/* Compliance Score */}
            <div className="bg-white rounded-xl shadow-lg p-3">
                <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">Compliance Score</h3>
                <CheckCircle className="text-blue-500" size={18} />
                </div>
                <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                    <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke={complianceScore >= 80 ? '#10b981' : complianceScore >= 60 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - complianceScore / 100)}`}
                        strokeLinecap="round"
                    />
                    </svg>
                    <span className="absolute text-xl font-bold">{complianceScore}%</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">Overall Standing</p>
                <p className="text-xs text-gray-500">
                    {compliance.filter(c => c.status === 'completed').length} of {compliance.length} rules met
                </p>
                </div>
            </div>
            </div>

            {/* Payment Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === 'payments' ? null : 'payments')}
            >
                <h3 className="font-bold text-lg flex items-center gap-2">
                <Calendar size={20} />
                Payment Timeline
                </h3>
                {expandedSection === 'payments' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
            
            {expandedSection === 'payments' && (
                <div className="mt-4">
                {activeView === 'mobile' ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                    {payments.map(payment => (
                        <div key={payment.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(payment.status)}`} />
                        <div className="flex-1">
                            <p className="font-semibold">{new Date(payment.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">{payment.method || 'Pending'}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">₱{payment.amount.toLocaleString()}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                            }`}>
                            {payment.status}
                            </span>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3">
                    {payments.map(payment => (
                        <div key={payment.id} className={`p-4 rounded-lg border-2 ${
                        payment.status === 'paid' ? 'border-green-500 bg-green-50' :
                        payment.status === 'pending' ? 'border-yellow-500 bg-yellow-50' :
                        'border-red-500 bg-red-50'
                        }`}>
                        <p className="font-bold text-sm">{new Date(payment.date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</p>
                        <p className="text-lg font-bold mt-1">₱{payment.amount.toLocaleString()}</p>
                        <p className="text-xs mt-1 capitalize">{payment.status}</p>
                        </div>
                    ))}
                    </div>
                )}
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-blue-900">Payment Forecast</p>
                    <p className="text-sm text-gray-600 mt-1">
                    Next month: <span className="font-bold">₱1,100</span> (Rent: ₱1,000 + WiFi: ₱100)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Based on monthly pattern</p>
                </div>
                </div>
            )}
            </div>

            {/* Request Tracker */}
            <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock size={20} />
                Service Request Tracker
            </h3>
            
            {activeView === 'mobile' ? (
                <div className="space-y-3">
                {requests.map(request => (
                    <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{request.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full ${getStatusColor(request.status)} text-white`}>
                        {request.status}
                        </span>
                    </div>
                    {request.managerResponse && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <p className="font-medium text-gray-700">Manager:</p>
                        <p className="text-gray-600">{request.managerResponse}</p>
                        </div>
                    )}
                    </div>
                ))}
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                {['submitted', 'in-progress', 'completed'].map(status => (
                    <div key={status} className="space-y-3">
                    <h4 className="font-semibold capitalize text-center p-2 bg-gray-100 rounded">
                        {status.replace('-', ' ')}
                    </h4>
                    {requests
                        .filter(r => r.status === status)
                        .map(request => (
                        <div key={request.id} className="border rounded-lg p-3 bg-white shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-sm">{request.title}</h5>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(request.priority)}`}>
                                {request.priority}
                            </span>
                            </div>
                            <p className="text-xs text-gray-600">{request.description}</p>
                        </div>
                        ))}
                    </div>
                ))}
                </div>
            )}
            </div>

            {/* Compliance Checklist */}
            <div className="bg-white rounded-xl shadow-lg p-6">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === 'compliance' ? null : 'compliance')}
            >
                <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle size={20} />
                Compliance Checklist
                </h3>
                {expandedSection === 'compliance' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
            
            {expandedSection === 'compliance' && (
                <div className="mt-4 space-y-3">
                {['Cleanliness', 'Visitor Policy', 'Noise', 'Facility Usage'].map(category => (
                    <div key={category} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold mb-2">{category}</h4>
                    {compliance
                        .filter(c => c.category === category)
                        .map(rule => (
                        <div key={rule.id} className="flex items-start gap-3 mb-2 p-2 bg-gray-50 rounded">
                            <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center ${getStatusColor(rule.status)}`}>
                            {rule.status === 'completed' && <CheckCircle size={14} className="text-white" />}
                            {rule.status === 'pending' && <Clock size={14} className="text-white" />}
                            {rule.status === 'violation' && <AlertCircle size={14} className="text-white" />}
                            </div>
                            <div className="flex-1">
                            <p className="text-sm font-medium">{rule.rule}</p>
                            {rule.dueDate && (
                                <p className="text-xs text-gray-500">Due: {new Date(rule.dueDate).toLocaleDateString()}</p>
                            )}
                            {rule.feedback && (
                                <p className="text-xs text-green-600 mt-1">✓ {rule.feedback}</p>
                            )}
                            </div>
                        </div>
                        ))}
                    </div>
                ))}
                </div>
            )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                ₱{payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">₱{currentBalance.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-sm text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status !== 'completed').length}
                </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-2xl font-bold text-purple-600">{complianceScore}%</p>
            </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 p-4 text-center text-sm text-gray-500">
            <p>Last updated: {lastUpdate.toLocaleTimeString()}</p>
            <p className="mt-1">Tenant Dashboard v1.0</p>
        </footer>
        </div>
    );
    };

    export default TenantDashboard;