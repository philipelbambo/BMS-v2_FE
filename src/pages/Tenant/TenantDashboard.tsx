interface ActivityItem {
  id: string;
  type: 'payment' | 'maintenance' | 'message' | 'document';
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
}import React, { useState, useEffect } from 'react';
import { Home, DollarSign, FileText, AlertCircle } from 'lucide-react';

// TypeScript Interfaces
interface SummaryCard {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
  status?: 'success' | 'warning' | 'danger';
}

interface ActivityItem {
  id: string;
  type: 'payment' | 'maintenance' | 'message' | 'document';
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
}

interface ViewportSize {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Custom Hook for Viewport Detection
const useViewport = (): ViewportSize => {
  const [viewport, setViewport] = useState<ViewportSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewport({
        width,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

const TenantDashboard: React.FC = () => {
  const viewport = useViewport();
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);

  const summaryCards: SummaryCard[] = [
    {
      id: '1',
      title: 'Rent Status',
      value: 'Paid',
      icon: <Home size={24} />,
      status: 'success',
    },
    {
      id: '2',
      title: 'Next Payment',
      value: 'Jan 1',
      icon: <DollarSign size={24} />,
      status: 'warning',
    },
    {
      id: '3',
      title: 'Documents',
      value: '5 New',
      icon: <FileText size={24} />,
    },
    {
      id: '4',
      title: 'Maintenance',
      value: '2 Open',
      icon: <AlertCircle size={24} />,
      status: 'danger',
    },
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Important dates (rent due dates)
  const importantDates = [1, 15]; // 1st and 15th of each month

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isImportantDate = (day: number) => {
    return importantDates.includes(day);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const handleActivityScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Removed - no longer needed
  };

  return (
    <div className="dashboard-container">
      <style>{`
        :root {
          --primary-color: #001F3D;
          --background-color: #ffffff;
          --card-bg: #ffffff;
          --text-primary: #001F3D;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
          --success-color: #10b981;
          --warning-color: #f59e0b;
          --danger-color: #ef4444;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .dashboard-container {
          min-height: 100vh;
          background-color: #f9fafb;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: var(--text-primary);
        }

        .dashboard-header {
          background-color: var(--primary-color);
          color: var(--background-color);
          padding: clamp(16px, 4vw, 32px) clamp(16px, 4vw, 24px);
          box-shadow: var(--shadow-md);
          display: none;
        }

        .dashboard-title {
          font-size: clamp(20px, 5vw, 32px);
          font-weight: 700;
          margin-bottom: 4px;
          display: none;
        }

        .dashboard-subtitle {
          font-size: clamp(12px, 3vw, 16px);
          opacity: 0.9;
          display: none;
        }

        .dashboard-content {
          padding: clamp(16px, 4vw, 24px);
          padding-top: calc(clamp(16px, 4vw, 24px) + env(safe-area-inset-top));
          padding-right: calc(clamp(16px, 4vw, 24px) + env(safe-area-inset-right));
          padding-bottom: calc(clamp(16px, 4vw, 24px) + env(safe-area-inset-bottom));
          padding-left: calc(clamp(16px, 4vw, 24px) + env(safe-area-inset-left));
          width: 100%;
          height: 100%;
        }

        .dashboard-layout {
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 4vw, 24px);
        }

        /* Summary Cards Grid */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: clamp(12px, 3vw, 16px);
        }

        @media (min-width: 768px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .summary-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .summary-card {
          background-color: var(--card-bg);
          border-radius: clamp(8px, 2vw, 12px);
          padding: clamp(16px, 4vw, 24px);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          min-height: 120px;
          position: relative;
        }

        @media (hover: hover) {
          .summary-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
          }
        }

        .summary-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .summary-card-icon {
          width: clamp(40px, 10vw, 48px);
          height: clamp(40px, 10vw, 48px);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 31, 61, 0.1);
          color: var(--primary-color);
        }

        .summary-card-icon.success {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }

        .summary-card-icon.warning {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        }

        .summary-card-icon.danger {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
        }

        .summary-card-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-card-title {
          font-size: clamp(12px, 3vw, 14px);
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-card-value {
          font-size: clamp(24px, 6vw, 32px);
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Main Content Area */
        .main-content {
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 4vw, 24px);
        }

        /* Quick Actions */
        .quick-actions {
          background-color: var(--card-bg);
          border-radius: clamp(8px, 2vw, 12px);
          padding: clamp(16px, 4vw, 24px);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
        }

        .section-title {
          font-size: clamp(16px, 4vw, 20px);
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 12px;
        }

        @media (min-width: 768px) {
          .action-buttons {
            grid-template-columns: repeat(1, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .action-buttons {
            grid-template-columns: repeat(1, 1fr);
          }
        }

        .action-button {
          min-height: 44px;
          padding: 12px 16px;
          background-color: var(--primary-color);
          color: var(--background-color);
          border: none;
          border-radius: 8px;
          font-size: clamp(13px, 3.5vw, 15px);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          -webkit-tap-highlight-color: transparent;
        }

        @media (hover: hover) {
          .action-button:hover {
            background-color: #00152a;
            transform: scale(1.02);
          }
        }

        .action-button:active {
          transform: scale(0.98);
        }

        /* Activity Section */
        .activity-section {
          background-color: var(--card-bg);
          border-radius: clamp(8px, 2vw, 12px);
          padding: clamp(12px, 3vw, 20px);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          width: 100%;
        }
        .calendar-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
        }

        .calendar-month {
          font-size: clamp(16px, 4vw, 18px);
          font-weight: 600;
          color: var(--text-primary);
        }

        .calendar-nav-button {
          min-width: 40px;
          min-height: 40px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }

        @media (hover: hover) {
          .calendar-nav-button:hover {
            background-color: #00152a;
            transform: scale(1.05);
          }
        }

        .calendar-nav-button:active {
          transform: scale(0.95);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: clamp(3px, 0.8vw, 6px);
        }

        .calendar-day-header {
          text-align: center;
          font-size: clamp(10px, 2vw, 11px);
          font-weight: 600;
          color: var(--text-secondary);
          padding: 6px 2px;
          text-transform: uppercase;
        }

        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(12px, 2.5vw, 14px);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: #f9fafb;
          color: var(--text-primary);
          font-weight: 500;
          min-height: 36px;
          max-height: 50px;
          -webkit-tap-highlight-color: transparent;
        }

        .calendar-day.empty {
          background-color: transparent;
          cursor: default;
        }

        .calendar-day.important {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
          font-weight: 700;
          border: 2px solid var(--danger-color);
        }

        .calendar-day.today {
          background-color: var(--primary-color);
          color: white;
          font-weight: 700;
        }

        .calendar-day.today.important {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--danger-color) 100%);
          color: white;
          border: 2px solid var(--danger-color);
        }

        @media (hover: hover) {
          .calendar-day:not(.empty):hover {
            transform: scale(1.1);
            box-shadow: var(--shadow-md);
          }
        }

        .calendar-day:not(.empty):active {
          transform: scale(0.95);
        }

        .calendar-legend {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(12px, 3vw, 14px);
          color: var(--text-secondary);
        }

        .legend-dot {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .legend-dot.important {
          background-color: rgba(239, 68, 68, 0.1);
          border: 2px solid var(--danger-color);
        }

        .legend-dot.today {
          background-color: var(--primary-color);
        }

        /* Calendar Styles */
      `}</style>

      <main className="dashboard-content">
        <div className="dashboard-layout">
          <div className="main-content">
            <div className="summary-grid">
              {summaryCards.map((card) => (
                <div key={card.id} className="summary-card">
                  <div className="summary-card-header">
                    <div className={`summary-card-icon ${card.status || ''}`}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="summary-card-content">
                    <div className="summary-card-title">{card.title}</div>
                    <div className="summary-card-value">{card.value}</div>
                  </div>
                </div>
              ))}
            </div>


          </div>

          <aside className="activity-section">
            <h2 className="section-title">Payment Calendar</h2>
            <div className="calendar-container">
              <div className="calendar-header">
                <button className="calendar-nav-button" onClick={previousMonth}>
                  ←
                </button>
                <div className="calendar-month">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                <button className="calendar-nav-button" onClick={nextMonth}>
                  →
                </button>
              </div>
              
              <div className="calendar-grid">
                <div className="calendar-day-header">Sun</div>
                <div className="calendar-day-header">Mon</div>
                <div className="calendar-day-header">Tue</div>
                <div className="calendar-day-header">Wed</div>
                <div className="calendar-day-header">Thu</div>
                <div className="calendar-day-header">Fri</div>
                <div className="calendar-day-header">Sat</div>
                
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="calendar-day empty"></div>
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  return (
                    <div
                      key={day}
                      className={`calendar-day ${isImportantDate(day) ? 'important' : ''} ${isToday(day) ? 'today' : ''}`}
                      onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              
              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-dot important"></div>
                  <span>Rent Due Date</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot today"></div>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TenantDashboard;