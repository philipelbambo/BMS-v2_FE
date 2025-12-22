    import React, { useState } from 'react';
    import { User, FileText, Home, Phone, Download, ChevronDown, Calendar, DollarSign, MapPin } from 'lucide-react';

    interface TenantData {
    profile: {
        name: string;
        email: string;
        phone: string;
        moveInDate: string;
        tenantId: string;
    };
    contract: {
        startDate: string;
        endDate: string;
        monthlyRent: number;
        securityDeposit: number;
        contractUrl: string;
    };
    room: {
        number: string;
        building: string;
        floor: number;
        size: string;
        amenities: string[];
    };
    emergencyContacts: Array<{
        name: string;
        relationship: string;
        phone: string;
    }>;
    payments: Array<{
        date: string;
        amount: number;
        status: 'paid' | 'pending' | 'overdue';
    }>;
    }

    const Accordion: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    }> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="accordion-card">
        <button
            className="accordion-header"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
        >
            <div className="accordion-title">
            {icon}
            <span>{title}</span>
            </div>
            <ChevronDown
            className={`accordion-chevron ${isOpen ? 'open' : ''}`}
            size={20}
            />
        </button>
        <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
            {children}
        </div>
        </div>
    );
    };

    const TenantInfoView: React.FC = () => {
    const tenantData: TenantData = {
        profile: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        moveInDate: '2024-01-15',
        tenantId: 'TN-2024-001'
        },
        contract: {
        startDate: '2024-01-15',
        endDate: '2025-01-14',
        monthlyRent: 1850,
        securityDeposit: 3700,
        contractUrl: '#'
        },
        room: {
        number: '304',
        building: 'Tower A',
        floor: 3,
        size: '650 sq ft',
        amenities: ['Air Conditioning', 'Balcony', 'In-unit Washer/Dryer', 'Dishwasher']
        },
        emergencyContacts: [
        { name: 'John Johnson', relationship: 'Father', phone: '+1 (555) 234-5678' },
        { name: 'Mary Smith', relationship: 'Sister', phone: '+1 (555) 345-6789' }
        ],
        payments: [
        { date: '2024-12-01', amount: 1850, status: 'paid' },
        { date: '2024-11-01', amount: 1850, status: 'paid' },
        { date: '2024-10-01', amount: 1850, status: 'paid' }
        ]
    };

    const handleDownload = () => {
        alert('Contract download initiated');
    };

    return (
        <div className="tenant-container">
        <style>{`
            * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            }

            body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f7fa;
            overflow-x: hidden;
            }

            .tenant-container {
            width: 100%;
            min-height: 100vh;
            padding: 16px;
            }

            .tenant-header {
            margin-bottom: 24px;
            }

            .tenant-header h1 {
            font-size: clamp(20px, 5vw, 28px);
            color: #1a202c;
            margin-bottom: 8px;
            font-weight: 700;
            }

            .tenant-id {
            font-size: clamp(12px, 3vw, 14px);
            color: #718096;
            }

            .tenant-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            }

            .main-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
            }

            .sidebar {
            display: flex;
            flex-direction: column;
            gap: 16px;
            }

            .card, .accordion-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            }

            .card {
            padding: 20px;
            }

            .card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
            }

            .card-header svg {
            color: #3182ce;
            flex-shrink: 0;
            }

            .card-header h2 {
            font-size: clamp(16px, 4vw, 18px);
            color: #2d3748;
            font-weight: 600;
            }

            .accordion-header {
            width: 100%;
            padding: 20px;
            background: white;
            border: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: background 0.2s;
            text-align: left;
            }

            .accordion-header:hover {
            background: #f7fafc;
            }

            .accordion-header:active {
            background: #edf2f7;
            }

            .accordion-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: clamp(16px, 4vw, 18px);
            color: #2d3748;
            font-weight: 600;
            }

            .accordion-title svg {
            color: #3182ce;
            flex-shrink: 0;
            }

            .accordion-chevron {
            color: #718096;
            transition: transform 0.3s ease;
            flex-shrink: 0;
            }

            .accordion-chevron.open {
            transform: rotate(180deg);
            }

            .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            }

            .accordion-content.open {
            max-height: 2000px;
            padding: 0 20px 20px 20px;
            }

            .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f7fafc;
            font-size: clamp(14px, 4vw, 16px);
            line-height: 1.5;
            }

            .info-row:last-child {
            border-bottom: none;
            }

            .info-label {
            color: #718096;
            font-weight: 500;
            }

            .info-value {
            color: #2d3748;
            font-weight: 600;
            text-align: right;
            word-break: break-word;
            max-width: 60%;
            }

            .amenities-list {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
            margin-top: 12px;
            }

            .amenity-item {
            padding: 8px 12px;
            background: #f7fafc;
            border-radius: 6px;
            font-size: clamp(13px, 3.5vw, 14px);
            color: #4a5568;
            }

            .contact-card {
            padding: 16px;
            background: #f7fafc;
            border-radius: 8px;
            margin-bottom: 12px;
            }

            .contact-card:last-child {
            margin-bottom: 0;
            }

            .contact-name {
            font-size: clamp(15px, 4vw, 16px);
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 4px;
            }

            .contact-detail {
            font-size: clamp(13px, 3.5vw, 14px);
            color: #718096;
            margin-bottom: 4px;
            line-height: 1.5;
            }

            .payment-table-container {
            overflow-x: auto;
            margin-top: 12px;
            -webkit-overflow-scrolling: touch;
            }

            .payment-table {
            width: 100%;
            min-width: 300px;
            border-collapse: collapse;
            font-size: clamp(13px, 3.5vw, 14px);
            }

            .payment-table th {
            padding: 12px 8px;
            text-align: left;
            background: #f7fafc;
            color: #4a5568;
            font-weight: 600;
            border-bottom: 2px solid #e2e8f0;
            }

            .payment-table td {
            padding: 12px 8px;
            border-bottom: 1px solid #f7fafc;
            color: #2d3748;
            }

            .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: clamp(11px, 3vw, 12px);
            font-weight: 600;
            text-transform: uppercase;
            }

            .status-paid {
            background: #c6f6d5;
            color: #22543d;
            }

            .status-pending {
            background: #feebc8;
            color: #744210;
            }

            .status-overdue {
            background: #fed7d7;
            color: #742a2a;
            }

            .btn-download {
            width: 100%;
            padding: 14px 20px;
            background: #3182ce;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: clamp(14px, 4vw, 16px);
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: background 0.2s;
            margin-top: 16px;
            }

            .btn-download:hover {
            background: #2c5282;
            }

            .btn-download:active {
            background: #2a4365;
            }

            .quick-action {
            padding: 16px;
            background: #edf2f7;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            cursor: pointer;
            transition: background 0.2s;
            }

            .quick-action:hover {
            background: #e2e8f0;
            }

            .quick-action:last-child {
            margin-bottom: 0;
            }

            .quick-action-text {
            font-size: clamp(14px, 4vw, 15px);
            color: #2d3748;
            font-weight: 500;
            }

            .quick-action-icon {
            color: #3182ce;
            flex-shrink: 0;
            }

            @media (min-width: 768px) {
            .tenant-container {
                padding: 24px;
            }

            .tenant-layout {
                grid-template-columns: 60% 40%;
                gap: 24px;
            }

            .amenities-list {
                grid-template-columns: repeat(2, 1fr);
            }

            .btn-download {
                width: auto;
                align-self: flex-start;
            }
            }

            @media (min-width: 1024px) {
            .tenant-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 32px;
            }

            .tenant-layout {
                grid-template-columns: 70% 30%;
                gap: 32px;
            }

            .sidebar {
                position: sticky;
                top: 20px;
                align-self: flex-start;
            }

            .card, .accordion-card {
                transition: box-shadow 0.2s;
            }

            .card:hover, .accordion-card:hover {
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            }

            @media (max-width: 374px) {
            .tenant-container {
                padding: 12px;
            }

            .info-value {
                max-width: 55%;
                font-size: 13px;
            }
            }

            @media (orientation: landscape) and (max-height: 450px) {
            .tenant-container {
                padding: 12px;
            }

            .tenant-header h1 {
                font-size: 20px;
            }

            .accordion-content.open {
                max-height: 1500px;
            }
            }
        `}</style>

        <div className="tenant-header">
            <h1>Tenant Information</h1>
            <div className="tenant-id">ID: {tenantData.profile.tenantId}</div>
        </div>

        <div className="tenant-layout">
            <div className="main-content">
            <Accordion title="Profile Information" icon={<User size={20} />} defaultOpen={true}>
                <div className="info-row">
                <span className="info-label">Full Name</span>
                <span className="info-value">{tenantData.profile.name}</span>
                </div>
                <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{tenantData.profile.email}</span>
                </div>
                <div className="info-row">
                <span className="info-label">Phone</span>
                <span className="info-value">{tenantData.profile.phone}</span>
                </div>
                <div className="info-row">
                <span className="info-label">Move-in Date</span>
                <span className="info-value">{new Date(tenantData.profile.moveInDate).toLocaleDateString()}</span>
                </div>
            </Accordion>

            <Accordion title="Contract Details" icon={<FileText size={20} />}>
                <div className="info-row">
                <span className="info-label">Start Date</span>
                <span className="info-value">{new Date(tenantData.contract.startDate).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                <span className="info-label">End Date</span>
                <span className="info-value">{new Date(tenantData.contract.endDate).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                <span className="info-label">Monthly Rent</span>
                <span className="info-value">${tenantData.contract.monthlyRent.toLocaleString()}</span>
                </div>
                <div className="info-row">
                <span className="info-label">Security Deposit</span>
                <span className="info-value">${tenantData.contract.securityDeposit.toLocaleString()}</span>
                </div>
                <button className="btn-download" onClick={handleDownload}>
                <Download size={18} />
                Download Contract
                </button>
            </Accordion>

            <Accordion title="Room Details" icon={<Home size={20} />}>
                <div className="info-row">
                <span className="info-label">Room Number</span>
                <span className="info-value">{tenantData.room.number}</span>
                </div>
                <div className="info-row">
                <span className="info-label">Building</span>
                <span className="info-value">{tenantData.room.building}</span>
                </div>
                <div className="info-row">
                <span className="info-label">Floor</span>
                <span className="info-value">{tenantData.room.floor}</span>
                </div>
                <div className="info-row">
                <span className="info-label">Size</span>
                <span className="info-value">{tenantData.room.size}</span>
                </div>
                <div style={{ marginTop: '16px' }}>
                <span className="info-label" style={{ display: 'block', marginBottom: '8px' }}>Amenities</span>
                <div className="amenities-list">
                    {tenantData.room.amenities.map((amenity, idx) => (
                    <div key={idx} className="amenity-item">{amenity}</div>
                    ))}
                </div>
                </div>
            </Accordion>

            <Accordion title="Emergency Contacts" icon={<Phone size={20} />}>
                {tenantData.emergencyContacts.map((contact, idx) => (
                <div key={idx} className="contact-card">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-detail">{contact.relationship}</div>
                    <div className="contact-detail">{contact.phone}</div>
                </div>
                ))}
            </Accordion>
            </div>

            <div className="sidebar">
            <div className="card">
                <div className="card-header">
                <DollarSign size={20} />
                <h2>Recent Payments</h2>
                </div>
                <div className="payment-table-container">
                <table className="payment-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tenantData.payments.map((payment, idx) => (
                        <tr key={idx}>
                        <td>{new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                        <td>${payment.amount.toLocaleString()}</td>
                        <td>
                            <span className={`status-badge status-${payment.status}`}>
                            {payment.status}
                            </span>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                <Calendar size={20} />
                <h2>Quick Actions</h2>
                </div>
                <div className="quick-action" onClick={() => alert('Request maintenance')}>
                <span className="quick-action-text">Request Maintenance</span>
                <ChevronDown size={18} className="quick-action-icon" style={{ transform: 'rotate(-90deg)' }} />
                </div>
                <div className="quick-action" onClick={() => alert('Pay rent')}>
                <span className="quick-action-text">Pay Rent</span>
                <ChevronDown size={18} className="quick-action-icon" style={{ transform: 'rotate(-90deg)' }} />
                </div>
                <div className="quick-action" onClick={() => alert('Contact landlord')}>
                <span className="quick-action-text">Contact Landlord</span>
                <ChevronDown size={18} className="quick-action-icon" style={{ transform: 'rotate(-90deg)' }} />
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default TenantInfoView;