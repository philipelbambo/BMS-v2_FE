    import React, { useState, useEffect } from 'react';
    import { ChevronRight, CheckCircle2, Clock, AlertCircle, Plus, Bell, Home, FileText, LayoutDashboard, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';

    // TypeScript Interfaces and Enums
    enum StatusType {
    ON_TRACK = 'on_track',
    ATTENTION = 'attention',
    DELAYED = 'delayed',
    COMPLETED = 'completed'
    }

    enum PriorityLevel {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low'
    }

    enum ViewType {
    TIMELINE = 'timeline',
    CHECKLIST = 'checklist',
    KANBAN = 'kanban'
    }

    interface StatusData {
    id: string;
    title: string;
    value: number;
    total: number;
    status: StatusType;
    trend: number;
    }

    interface TimelineEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    status: StatusType;
    priority: PriorityLevel;
    }

    interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: PriorityLevel;
    dueDate: string;
    }

    interface KanbanItem {
    id: string;
    title: string;
    description: string;
    priority: PriorityLevel;
    assignee: string;
    }

    interface KanbanColumn {
    id: string;
    title: string;
    items: KanbanItem[];
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
    const useSwipeGesture = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) onSwipeLeft();
        if (isRightSwipe) onSwipeRight();
    };

    return { onTouchStart, onTouchMove, onTouchEnd };
    };

    // Main Dashboard Component
    const TenancyDashboard: React.FC = () => {
    const breakpoint = useBreakpoint();
    const [currentView, setCurrentView] = useState<ViewType>(ViewType.TIMELINE);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [kanbanColumnIndex, setKanbanColumnIndex] = useState(0);

    // Sample Data
    const statusData: StatusData[] = [
        { id: '1', title: 'Applications', value: 12, total: 15, status: StatusType.ON_TRACK, trend: 5 },
        { id: '2', title: 'Inspections', value: 3, total: 8, status: StatusType.ATTENTION, trend: -2 },
        { id: '3', title: 'Move-ins', value: 2, total: 2, status: StatusType.COMPLETED, trend: 0 }
    ];

    const timelineEvents: TimelineEvent[] = [
        { id: '1', title: 'Lease Agreement Signed', description: 'Unit 405 - John Doe', date: '2024-12-20', status: StatusType.COMPLETED, priority: PriorityLevel.HIGH },
        { id: '2', title: 'Property Inspection Scheduled', description: 'Unit 302 - Jane Smith', date: '2024-12-22', status: StatusType.ON_TRACK, priority: PriorityLevel.MEDIUM },
        { id: '3', title: 'Background Check Pending', description: 'Unit 501 - Mike Johnson', date: '2024-12-23', status: StatusType.ATTENTION, priority: PriorityLevel.HIGH },
        { id: '4', title: 'Move-in Date Confirmed', description: 'Unit 405 - John Doe', date: '2024-12-25', status: StatusType.ON_TRACK, priority: PriorityLevel.LOW }
    ];

    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
        { id: '1', title: 'Review Application Documents', description: 'Unit 302', completed: true, priority: PriorityLevel.HIGH, dueDate: '2024-12-20' },
        { id: '2', title: 'Schedule Property Inspection', description: 'Unit 405', completed: true, priority: PriorityLevel.MEDIUM, dueDate: '2024-12-21' },
        { id: '3', title: 'Process Security Deposit', description: 'Unit 501', completed: false, priority: PriorityLevel.HIGH, dueDate: '2024-12-22' },
        { id: '4', title: 'Send Welcome Package', description: 'Unit 302', completed: false, priority: PriorityLevel.LOW, dueDate: '2024-12-23' },
        { id: '5', title: 'Update Tenant Portal', description: 'Unit 405', completed: false, priority: PriorityLevel.MEDIUM, dueDate: '2024-12-24' }
    ]);

    const [kanbanData, setKanbanData] = useState<KanbanColumn[]>([
        {
        id: 'todo',
        title: 'To Do',
        items: [
            { id: '1', title: 'Process Application', description: 'Unit 601 - New applicant', priority: PriorityLevel.HIGH, assignee: 'Sarah' },
            { id: '2', title: 'Schedule Viewing', description: 'Unit 302 - Interested party', priority: PriorityLevel.MEDIUM, assignee: 'Mike' }
        ]
        },
        {
        id: 'inprogress',
        title: 'In Progress',
        items: [
            { id: '3', title: 'Background Verification', description: 'Unit 405 - Pending clearance', priority: PriorityLevel.HIGH, assignee: 'John' },
            { id: '4', title: 'Property Inspection', description: 'Unit 501 - Scheduled for today', priority: PriorityLevel.MEDIUM, assignee: 'Sarah' }
        ]
        },
        {
        id: 'done',
        title: 'Done',
        items: [
            { id: '5', title: 'Lease Signing', description: 'Unit 302 - Completed', priority: PriorityLevel.LOW, assignee: 'Mike' },
            { id: '6', title: 'Key Handover', description: 'Unit 405 - Tenant moved in', priority: PriorityLevel.LOW, assignee: 'John' }
        ]
        }
    ]);

    const swipeGesture = useSwipeGesture(
        () => {
        if (currentView === ViewType.TIMELINE) setCurrentView(ViewType.CHECKLIST);
        else if (currentView === ViewType.CHECKLIST) setCurrentView(ViewType.KANBAN);
        },
        () => {
        if (currentView === ViewType.KANBAN) setCurrentView(ViewType.CHECKLIST);
        else if (currentView === ViewType.CHECKLIST) setCurrentView(ViewType.TIMELINE);
        }
    );

    const kanbanSwipe = useSwipeGesture(
        () => setKanbanColumnIndex(prev => Math.min(prev + 1, kanbanData.length - 1)),
        () => setKanbanColumnIndex(prev => Math.max(prev - 1, 0))
    );

    const getStatusColor = (status: StatusType): string => {
        switch (status) {
        case StatusType.COMPLETED: return '#10B981';
        case StatusType.ON_TRACK: return '#3B82F6';
        case StatusType.ATTENTION: return '#F59E0B';
        case StatusType.DELAYED: return '#EF4444';
        default: return '#6B7280';
        }
    };

    const getPriorityColor = (priority: PriorityLevel): string => {
        switch (priority) {
        case PriorityLevel.HIGH: return '#EF4444';
        case PriorityLevel.MEDIUM: return '#F59E0B';
        case PriorityLevel.LOW: return '#10B981';
        default: return '#6B7280';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-[env(safe-area-inset-bottom)]" style={{ touchAction: 'pan-y' }}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#001F3D' }}>
            <div className="px-4 py-3 flex items-center justify-between">
            {breakpoint === 'desktop' && (
                <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors touch-manipulation"
                style={{ minWidth: '44px', minHeight: '44px' }}
                >
                <Menu className="text-white" size={24} />
                </button>
            )}
            <h1 className="text-white text-lg font-semibold flex-1 text-center md:text-left">
                Tenancy Dashboard
            </h1>
            <button
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors relative touch-manipulation"
                style={{ minWidth: '44px', minHeight: '44px' }}
            >
                <Bell className="text-white" size={24} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            </div>

            {/* Tablet/Desktop Navigation Tabs */}
            {breakpoint !== 'mobile' && (
            <div className="border-t border-white border-opacity-10">
                <div className="flex px-4">
                {[
                    { type: ViewType.TIMELINE, label: 'Timeline' },
                    { type: ViewType.CHECKLIST, label: 'Checklist' },
                    { type: ViewType.KANBAN, label: 'Kanban' }
                ].map(view => (
                    <button
                    key={view.type}
                    onClick={() => setCurrentView(view.type)}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                        currentView === view.type ? 'text-white' : 'text-white text-opacity-60'
                    } touch-manipulation`}
                    style={{ minHeight: '44px' }}
                    >
                    {view.label}
                    {currentView === view.type && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                    )}
                    </button>
                ))}
                </div>
            </div>
            )}
        </header>

        {/* Desktop Sidebar */}
        {breakpoint === 'desktop' && sidebarOpen && (
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg z-40 overflow-y-auto">
            <nav className="p-4 space-y-2">
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <Home size={20} />
                <span>Dashboard</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <FileText size={20} />
                <span>Applications</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <LayoutDashboard size={20} />
                <span>Properties</span>
                </a>
            </nav>
            </div>
        )}

        {/* Main Content */}
        <main className={`${breakpoint === 'desktop' && sidebarOpen ? 'ml-64' : ''} pb-20 md:pb-4`}>
            {/* Status Overview Cards */}
            <div className="p-4 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
            {statusData.map(stat => (
                <div key={stat.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold" style={{ color: '#001F3D' }}>
                        {stat.value}/{stat.total}
                    </p>
                    </div>
                    <div className="relative" style={{ width: '80px', height: '80px' }}>
                    <svg className="transform -rotate-90" width="80" height="80">
                        <circle
                        cx="40"
                        cy="40"
                        r="32"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        />
                        <circle
                        cx="40"
                        cy="40"
                        r="32"
                        fill="none"
                        stroke={getStatusColor(stat.status)}
                        strokeWidth="8"
                        strokeDasharray={`${(stat.value / stat.total) * 201} 201`}
                        strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold" style={{ color: '#001F3D' }}>
                        {Math.round((stat.value / stat.total) * 100)}%
                        </span>
                    </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className={`${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend >= 0 ? '↑' : '↓'} {Math.abs(stat.trend)}
                    </span>
                    <span className="text-gray-500">vs last week</span>
                </div>
                </div>
            ))}
            </div>

            {/* View Container */}
            <div className="p-4" {...(breakpoint === 'mobile' ? swipeGesture : {})}>
            {currentView === ViewType.TIMELINE && <TimelineView events={timelineEvents} breakpoint={breakpoint} getStatusColor={getStatusColor} getPriorityColor={getPriorityColor} />}
            {currentView === ViewType.CHECKLIST && <ChecklistView items={checklistItems} setItems={setChecklistItems} breakpoint={breakpoint} getPriorityColor={getPriorityColor} />}
            {currentView === ViewType.KANBAN && <KanbanView data={kanbanData} setData={setKanbanData} breakpoint={breakpoint} columnIndex={kanbanColumnIndex} swipeGesture={kanbanSwipe} getPriorityColor={getPriorityColor} />}
            </div>

            {/* Quick Actions (Mobile) */}
            {breakpoint === 'mobile' && (
            <div className="px-4 pb-4">
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#001F3D' }}>Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                <button className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-transform" style={{ minHeight: '88px' }}>
                    <Plus className="text-blue-600" size={24} />
                    <span className="text-sm font-medium">New Application</span>
                </button>
                <button className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-transform" style={{ minHeight: '88px' }}>
                    <Clock className="text-orange-600" size={24} />
                    <span className="text-sm font-medium">Schedule</span>
                </button>
                </div>
            </div>
            )}
        </main>

        {/* Mobile Bottom Navigation */}
        {breakpoint === 'mobile' && (
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
            <div className="flex justify-around items-center h-16">
                {[
                { type: ViewType.TIMELINE, icon: Clock, label: 'Timeline' },
                { type: ViewType.CHECKLIST, icon: CheckCircle2, label: 'Checklist' },
                { type: ViewType.KANBAN, icon: LayoutDashboard, label: 'Kanban' }
                ].map(view => (
                <button
                    key={view.type}
                    onClick={() => setCurrentView(view.type)}
                    className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    currentView === view.type ? 'text-blue-600' : 'text-gray-400'
                    } touch-manipulation`}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                >
                    <view.icon size={24} />
                    <span className="text-xs mt-1">{view.label}</span>
                </button>
                ))}
            </div>
            </nav>
        )}
        </div>
    );
    };

    // Timeline View Component
    const TimelineView: React.FC<{
    events: TimelineEvent[];
    breakpoint: string;
    getStatusColor: (status: StatusType) => string;
    getPriorityColor: (priority: PriorityLevel) => string;
    }> = ({ events, breakpoint, getStatusColor, getPriorityColor }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="space-y-4">
        <h2 className="text-lg font-semibold" style={{ color: '#001F3D' }}>Timeline</h2>
        <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 md:left-8"></div>
            
            <div className="space-y-4">
            {events.map((event, idx) => (
                <div key={event.id} className="relative pl-14 md:pl-20">
                {/* Timeline Dot */}
                <div
                    className="absolute left-4 top-4 w-4 h-4 rounded-full border-4 border-white md:left-6"
                    style={{ backgroundColor: getStatusColor(event.status) }}
                ></div>

                {/* Event Card */}
                <div
                    className="bg-white rounded-lg shadow-sm overflow-hidden active:scale-98 transition-transform cursor-pointer touch-manipulation"
                    onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                    style={{ touchAction: 'manipulation' }}
                >
                    <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate" style={{ color: '#001F3D' }}>{event.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getPriorityColor(event.priority) }}
                        ></span>
                        {expandedId === event.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>
                    
                    {expandedId === event.id && (
                        <div className="pt-3 border-t border-gray-100 mt-3">
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span
                            className="text-xs px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: getStatusColor(event.status) }}
                            >
                            {event.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">{event.priority.toUpperCase()} PRIORITY</span>
                        </div>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
    };

    // Checklist View Component
    const ChecklistView: React.FC<{
    items: ChecklistItem[];
    setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
    breakpoint: string;
    getPriorityColor: (priority: PriorityLevel) => string;
    }> = ({ items, setItems, breakpoint, getPriorityColor }) => {
    const [swipedId, setSwipedId] = useState<string | null>(null);

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const handleSwipe = (id: string) => {
        if (breakpoint === 'mobile') {
        setSwipedId(swipedId === id ? null : id);
        }
    };

    return (
        <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: '#001F3D' }}>Checklist</h2>
            <span className="text-sm text-gray-500">
            {items.filter(i => i.completed).length}/{items.length} completed
            </span>
        </div>

        <div className="space-y-2">
            {items.map(item => (
            <div
                key={item.id}
                className="relative bg-white rounded-lg shadow-sm overflow-hidden"
                style={{ touchAction: 'pan-y' }}
            >
                {/* Swipe Action Background */}
                {swipedId === item.id && breakpoint === 'mobile' && (
                <div className="absolute inset-0 bg-green-500 flex items-center justify-end px-6">
                    <CheckCircle2 className="text-white" size={24} />
                </div>
                )}

                {/* Item Content */}
                <div
                className={`p-4 transition-transform ${swipedId === item.id ? 'transform -translate-x-20' : ''}`}
                onClick={() => breakpoint !== 'mobile' && toggleItem(item.id)}
                onTouchStart={() => handleSwipe(item.id)}
                >
                <div className="flex items-start gap-3">
                    {/* iOS-style Checkbox */}
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleItem(item.id);
                    }}
                    className="flex-shrink-0 mt-0.5 touch-manipulation"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                    <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}
                    >
                        {item.completed && <CheckCircle2 className="text-white" size={16} />}
                    </div>
                    </button>

                    <div className="flex-1 min-w-0">
                    <h3
                        className={`font-medium ${item.completed ? 'line-through text-gray-400' : ''}`}
                        style={{ color: item.completed ? undefined : '#001F3D' }}
                    >
                        {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">Due: {item.dueDate}</span>
                        <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getPriorityColor(item.priority) }}
                        ></span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    };

    // Kanban View Component
    const KanbanView: React.FC<{
    data: KanbanColumn[];
    setData: React.Dispatch<React.SetStateAction<KanbanColumn[]>>;
    breakpoint: string;
    columnIndex: number;
    swipeGesture: any;
    getPriorityColor: (priority: PriorityLevel) => string;
    }> = ({ data, setData, breakpoint, columnIndex, swipeGesture, getPriorityColor }) => {
    if (breakpoint === 'mobile') {
        const column = data[columnIndex];
        return (
        <div className="space-y-4" {...swipeGesture}>
            <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: '#001F3D' }}>{column.title}</h2>
            <div className="flex gap-1">
                {data.map((_, idx) => (
                <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                    idx === columnIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'
                    }`}
                ></div>
                ))}
            </div>
            </div>

            <div className="space-y-3">
            {column.items.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium flex-1" style={{ color: '#001F3D' }}>{item.title}</h3>
                    <span
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ backgroundColor: getPriorityColor(item.priority) }}
                    ></span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{item.assignee}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">{item.priority.toUpperCase()}</span>
                </div>
                </div>
            ))}
            </div>
        </div>
        );
    }

    // Tablet/Desktop View
    const columnsToShow = breakpoint === 'tablet' ? 2 : 3;
    
    return (
        <div className="space-y-4">
        <h2 className="text-lg font-semibold" style={{ color: '#001F3D' }}>Kanban Board</h2>
        <div className={`grid gap-4 ${breakpoint === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'} overflow-x-auto`}>
            {data.slice(0, columnsToShow).map(column => (
            <div key={column.id} className="bg-gray-100 rounded-lg p-4 min-w-0">
                <h3 className="font-semibold mb-3 flex items-center justify-between" style={{ color: '#001F3D' }}>
                {column.title}
                <span className="text-sm text-gray-500">({column.items.length})</span>
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                {column.items.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-sm flex-1" style={{ color: '#001F3D' }}>{item.title}</h4>
                        <span
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: getPriorityColor(item.priority) }}
                        ></span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{item.assignee}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded">{item.priority.toUpperCase()}</span>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    };

    export default TenancyDashboard;