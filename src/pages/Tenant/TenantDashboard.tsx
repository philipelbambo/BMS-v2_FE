import React, { useState, useEffect } from 'react';

// Types
interface SummaryCardData {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
  status: 'positive' | 'negative' | 'neutral';
  statusText: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
}

// Mock data
const mockSummaryData: SummaryCardData[] = [
  {
    id: 'rent',
    title: 'Rent Due',
    value: '$1,250',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    status: 'negative',
    statusText: 'Due in 3 days',
  },
  {
    id: 'balance',
    title: 'Account Balance',
    value: '$245.50',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    status: 'positive',
    statusText: 'Updated today',
  },
  {
    id: 'tickets',
    title: 'Open Tickets',
    value: '2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v4.5m0 12V21m0-3.75a1.875 1.875 0 01-1.875-1.875M12 4.5c1.035 0 1.875.84 1.875 1.875M12 19.5c-1.035 0-1.875-.84-1.875-1.875m-3.75-4.5h7.5" />
      </svg>
    ),
    status: 'negative',
    statusText: '+1 new today',
  },
  {
    id: 'lease',
    title: 'Lease End',
    value: 'Aug 2026',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    status: 'neutral',
    statusText: '11 months left',
  },
];

const mockQuickActions: QuickAction[] = [
  {
    id: 'pay-rent',
    label: 'Pay Rent',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    action: () => console.log('Pay rent clicked'),
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    action: () => console.log('Maintenance clicked'),
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    action: () => console.log('Documents clicked'),
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    action: () => console.log('Messages clicked'),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    action: () => console.log('Profile clicked'),
  },
];

const mockActivity: ActivityItem[] = [
  {
    id: 'act1',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Payment Received',
    description: 'December rent payment processed',
    timestamp: '2 hours ago',
  },
  {
    id: 'act2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: 'Maintenance Request',
    description: 'Leaky faucet in kitchen reported',
    timestamp: 'Yesterday',
  },
  {
    id: 'act3',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Lease Renewal',
    description: 'Lease renewal offer sent',
    timestamp: '3 days ago',
  },
];

// Loading Skeleton Component
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center animate-pulse">
    <div className="bg-gray-200 rounded-lg w-10 h-10 mr-4 flex-shrink-0"></div>
    <div className="flex-1 min-w-0">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="bg-gray-200 rounded-full w-16 h-4 flex-shrink-0 ml-2"></div>
  </div>
);

const SkeletonActivityItem: React.FC = () => (
  <div className="flex items-start pb-4 border-b border-gray-100 animate-pulse">
    <div className="bg-gray-200 rounded-full w-8 h-8 mt-1 mr-3 flex-shrink-0"></div>
    <div className="flex-1 min-w-0">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

// Main Component
const TenantDashboard: React.FC = () => {
  const [summaryData, setSummaryData] = useState<SummaryCardData[]>([]);
  const [quickActions] = useState<QuickAction[]>(mockQuickActions);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setSummaryData(mockSummaryData);
      setActivity(mockActivity);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Status indicator color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div 
      className="min-h-screen bg-white text-gray-800"
      style={
        {
          '--section-padding': '1rem',
          '--card-gap': '1rem',
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#001F3D]">Tenant Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Welcome back, Sarah Johnson</p>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:text-[#001F3D] hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <div className="flex items-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-9 h-9 sm:w-10 sm:h-10" />
            </div>
          </div>
        </div>
      </header>
    
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Summary Cards */}
        <section className="mb-8" aria-labelledby="summary-heading">
          <h2 
            id="summary-heading" 
            className="text-lg font-semibold text-[#001F3D] mb-4"
            style={{ paddingLeft: 'var(--section-padding)' }}
          >
            Account Overview
          </h2>
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--card-gap)]"
            style={{ paddingLeft: 'var(--section-padding)', paddingRight: 'var(--section-padding)' }}
          >
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              summaryData.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                >
                  <div className="text-[#001F3D] mr-4 flex-shrink-0">
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 truncate">{card.title}</p>
                    <p className="text-xl font-bold text-[#001F3D] mt-1">{card.value}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(card.status)} flex-shrink-0`}>
                    {card.statusText}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8" aria-labelledby="actions-heading">
          <h2 
            id="actions-heading" 
            className="text-lg font-semibold text-[#001F3D] mb-4"
            style={{ paddingLeft: 'var(--section-padding)' }}
          >
            Quick Actions
          </h2>
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
            style={{ paddingLeft: 'var(--section-padding)', paddingRight: 'var(--section-padding)' }}
          >
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="flex items-center justify-center bg-[#001F3D] text-white font-medium rounded-lg py-3 px-2 sm:px-4 transition-all duration-300 hover:bg-opacity-90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#001F3D] focus:ring-opacity-50 min-h-[56px]"
              >
                <span className="mr-2 flex-shrink-0">{action.icon}</span>
                <span className="truncate text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section aria-labelledby="activity-heading">
          <h2 
            id="activity-heading" 
            className="text-lg font-semibold text-[#001F3D] mb-4"
            style={{ paddingLeft: 'var(--section-padding)' }}
          >
            Recent Activity
          </h2>
          <div 
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            style={{ paddingLeft: 'var(--section-padding)', paddingRight: 'var(--section-padding)' }}
          >
            {loading ? (
              <div className="p-4">
                <SkeletonActivityItem />
                <SkeletonActivityItem />
                <SkeletonActivityItem />
              </div>
            ) : activity.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {activity.map((item) => (
                  <li key={item.id} className="p-4">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1 mr-3">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#001F3D] text-sm sm:text-base">{item.title}</p>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">{item.description}</p>
                        <p className="text-gray-500 text-xs mt-2">{item.timestamp}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 sm:py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-3 sm:mt-4 text-gray-500 text-sm sm:text-base">No recent activity</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TenantDashboard;