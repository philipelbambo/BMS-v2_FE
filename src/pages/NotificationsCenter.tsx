    import React, { useState, useEffect } from 'react';
    import { Bell, CheckCircle, XCircle, AlertCircle, DollarSign, Home, Clock, Check, Trash2, X } from 'lucide-react';

    // Notification Types
    type NotificationType = 'booking' | 'payment' | 'room' | 'system';
    type NotificationStatus = 'unread' | 'read';

    interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedTo: string;
    timestamp: Date;
    status: NotificationStatus;
    }

    // Mock API service for real-time notifications
    class NotificationService {
    private listeners: ((notification: Notification) => void)[] = [];
    private simulationInterval: number | null = null;

    subscribe(callback: (notification: Notification) => void) {
        this.listeners.push(callback);
    }

    unsubscribe(callback: (notification: Notification) => void) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    private notify(notification: Notification) {
        this.listeners.forEach(listener => listener(notification));
    }

    // Simulate real-time notifications
    startSimulation() {
        const scenarios = [
        {
            type: 'booking' as NotificationType,
            title: 'New Booking Request',
            getMessage: () => `John Smith has submitted a booking request for Room ${Math.floor(Math.random() * 20 + 1)}`,
            getRelatedTo: () => `Room ${Math.floor(Math.random() * 20 + 1)}`
        },
        {
            type: 'booking' as NotificationType,
            title: 'Booking Approved',
            getMessage: () => `Booking for Sarah Johnson (Room ${Math.floor(Math.random() * 20 + 1)}) has been approved`,
            getRelatedTo: () => `Sarah Johnson`
        },
        {
            type: 'payment' as NotificationType,
            title: 'Payment Overdue',
            getMessage: () => `Michael Brown has an unpaid balance of $${Math.floor(Math.random() * 500 + 300)}`,
            getRelatedTo: () => `Michael Brown`
        },
        {
            type: 'payment' as NotificationType,
            title: 'Payment Confirmed',
            getMessage: () => `Emma Davis paid $${Math.floor(Math.random() * 500 + 300)} for Room ${Math.floor(Math.random() * 20 + 1)}`,
            getRelatedTo: () => `Emma Davis`
        },
        {
            type: 'room' as NotificationType,
            title: 'Room Status Changed',
            getMessage: () => `Room ${Math.floor(Math.random() * 20 + 1)} status changed to ${['Available', 'Occupied', 'Maintenance'][Math.floor(Math.random() * 3)]}`,
            getRelatedTo: () => `Room ${Math.floor(Math.random() * 20 + 1)}`
        },
        {
            type: 'system' as NotificationType,
            title: 'System Update',
            getMessage: () => 'Monthly maintenance scheduled for tonight at 2:00 AM',
            getRelatedTo: () => 'System'
        }
        ];

        this.simulationInterval = setInterval(() => {
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const notification: Notification = {
            id: `notif-${Date.now()}-${Math.random()}`,
            type: scenario.type,
            title: scenario.title,
            message: scenario.getMessage(),
            relatedTo: scenario.getRelatedTo(),
            timestamp: new Date(),
            status: 'unread'
        };
        this.notify(notification);
        }, 8000);
    }

    stopSimulation() {
        if (this.simulationInterval) {
        clearInterval(this.simulationInterval);
        this.simulationInterval = null;
        }
    }
    }

    const notificationService = new NotificationService();

    const AdminNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
        id: '1',
        type: 'booking',
        title: 'New Booking Request',
        message: 'Alex Martinez has submitted a booking request for Room 12',
        relatedTo: 'Room 12',
        timestamp: new Date(Date.now() - 300000),
        status: 'unread'
        },
        {
        id: '2',
        type: 'payment',
        title: 'Payment Confirmed',
        message: 'Lisa Anderson paid $450 for Room 8',
        relatedTo: 'Lisa Anderson',
        timestamp: new Date(Date.now() - 900000),
        status: 'unread'
        },
        {
        id: '3',
        type: 'payment',
        title: 'Payment Overdue',
        message: 'Robert Wilson has an unpaid balance of $380',
        relatedTo: 'Robert Wilson',
        timestamp: new Date(Date.now() - 1800000),
        status: 'read'
        },
        {
        id: '4',
        type: 'room',
        title: 'Room Status Changed',
        message: 'Room 5 status changed to Available',
        relatedTo: 'Room 5',
        timestamp: new Date(Date.now() - 3600000),
        status: 'read'
        }
    ]);

    const [filter, setFilter] = useState<'all' | NotificationType>('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    useEffect(() => {
        const handleNewNotification = (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        };

        notificationService.subscribe(handleNewNotification);
        notificationService.startSimulation();

        return () => {
        notificationService.unsubscribe(handleNewNotification);
        notificationService.stopSimulation();
        };
    }, []);

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
        case 'booking':
            return <CheckCircle className="w-5 h-5" />;
        case 'payment':
            return <DollarSign className="w-5 h-5" />;
        case 'room':
            return <Home className="w-5 h-5" />;
        case 'system':
            return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getNotificationColor = (type: NotificationType) => {
        switch (type) {
        case 'booking':
            return 'text-blue-600 bg-blue-50';
        case 'payment':
            return 'text-green-600 bg-green-50';
        case 'room':
            return 'text-purple-600 bg-purple-50';
        case 'system':
            return 'text-orange-600 bg-orange-50';
        }
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, status: 'read' as NotificationStatus } : n))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'read' as NotificationStatus }))
        );
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const filteredNotifications = notifications.filter(n => {
        if (showUnreadOnly && n.status === 'read') return false;
        if (filter !== 'all' && n.type !== filter) return false;
        return true;
    });

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-full mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                <div className="bg-[#001F3D] p-3 rounded-lg">
                    <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 text-sm mt-1">
                    Stay updated with all system activities
                    </p>
                </div>
                </div>
                {unreadCount > 0 && (
                <div className="bg-[#001F3D] text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {unreadCount} Unread
                </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all'
                    ? 'bg-[#001F3D] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                >
                All
                </button>
                <button
                onClick={() => setFilter('booking')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'booking'
                    ? 'bg-[#001F3D] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                >
                Bookings
                </button>
                <button
                onClick={() => setFilter('payment')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'payment'
                    ? 'bg-[#001F3D] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                >
                Payments
                </button>
                <button
                onClick={() => setFilter('room')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'room'
                    ? 'bg-[#001F3D] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                >
                Rooms
                </button>
                <button
                onClick={() => setFilter('system')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'system'
                    ? 'bg-[#001F3D] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                >
                System
                </button>
            </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#001F3D] focus:ring-[#001F3D]"
                />
                <span className="text-sm font-medium text-gray-700">Show unread only</span>
            </label>
            <div className="flex gap-2">
                {unreadCount > 0 && (
                <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    <Check className="w-4 h-4" />
                    Mark all read
                </button>
                )}
                {notifications.length > 0 && (
                <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear all
                </button>
                )}
            </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">
                    {showUnreadOnly
                    ? 'All caught up! No unread notifications.'
                    : 'You have no notifications at this time.'}
                </p>
                </div>
            ) : (
                filteredNotifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md ${
                    notification.status === 'unread' ? 'border-l-4 border-[#001F3D]' : ''
                    }`}
                >
                    <div className="p-4 md:p-5">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`p-3 rounded-lg ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                                {notification.title}
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {notification.message}
                            </p>
                            </div>
                            {notification.status === 'unread' && (
                            <div className="bg-[#001F3D] w-2 h-2 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {formatTimestamp(notification.timestamp)}
                            </div>
                            <div className="text-sm font-medium text-[#001F3D]">
                            {notification.relatedTo}
                            </div>
                        </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                        {notification.status === 'unread' && (
                            <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-[#001F3D] hover:bg-gray-100 rounded-lg transition-colors"
                            title="Mark as read"
                            >
                            <Check className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                ))
            )}
            </div>

            {/* Real-time indicator */}
            <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Real-time notifications active
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default AdminNotifications;