    import React, { useState } from 'react';
    import {
    ChevronDown,
    Download,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    User,
    AlertCircle,
    } from 'lucide-react';

    interface TenantInfoProps {
    tenant?: {
        name: string;
        email: string;
        phone: string;
        photo: string;
        moveInDate: string;
        leaseEnd: string;
        roomImage?: string; // 👈 Image of the rented room/unit
    };
    }

    const TenantInformationView: React.FC<TenantInfoProps> = ({ tenant }) => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        profile: true,
        contract: true,
        room: true,
        emergency: true,
        payment: true,
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const tenantData = tenant || {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@email.com',
        phone: '+1 (555) 123-4567',
        photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="48" fill="none" stroke="%23333" stroke-width="4"/%3E%3Ccircle cx="50" cy="35" r="15" fill="none" stroke="%23333" stroke-width="4"/%3E%3Cpath d="M 20 75 Q 20 55 50 55 Q 80 55 80 75" fill="none" stroke="%23333" stroke-width="4" stroke-linecap="round"/%3E%3C/svg%3E',
        moveInDate: '2024-01-15',
        leaseEnd: '2025-01-14',
        roomImage: 'https://placehold.co/600x400/cccccc/333333?text=Room+7', // 👈 placeholder room image
    };

    const contractData = {
        contractNumber: 'TN-2024-001234',
        rent: '₱1,000',
        wifi: '₱100/month',
        wifiNote: 'Payable every end of month',
        deposit: '₱1,000',
        term: '12 months',
        status: 'Active',
    };

    const roomData = {
        unit: 'Room 7',
        address: 'Zone 4 Dike Timog Boardinghouse',
        city: 'Tagoloan, Misamis Oriental',
        sqft: '850 sq ft',
        bedrooms: 2,
        bathrooms: 1,
    };

    const emergencyContacts = [
        { name: 'John Mitchell', relation: 'Father', phone: '+1 (555) 234-5678' },
        { name: 'Emily Chen', relation: 'Friend', phone: '+1 (555) 345-6789' },
    ];

    const paymentHistory = [
        { date: '2024-12-01', amount: '₱1,000', status: 'Paid', method: 'Cash' },
        { date: '2024-11-30', amount: '₱100', status: 'Paid', method: 'GCash', type: 'WiFi' },
        { date: '2024-11-01', amount: '₱1,000', status: 'Paid', method: 'Cash' },
        { date: '2024-10-31', amount: '₱100', status: 'Paid', method: 'GCash', type: 'WiFi' },
    ];

    const InfoCard: React.FC<{ title: string; section: string; children: React.ReactNode }> = ({
        title,
        section,
        children,
    }) => (
        <div className="info-card">
        <button
            className="accordion-header"
            onClick={() => toggleSection(section)}
            aria-expanded={openSections[section]}
        >
            <h2>{title}</h2>
            <ChevronDown
            className={`chevron ${openSections[section] ? 'open' : ''}`}
            size={20}
            />
        </button>
        <div className={`accordion-content ${openSections[section] ? 'open' : ''}`}>
            {children}
        </div>
        </div>
    );

    return (
        <div className="tenant-view-container">
        <style>{`
            * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            }

            .tenant-view-container {
            min-height: 100vh;
            background: #ffffff;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }

            .content-wrapper {
            width: 100%;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            }

            @media (min-width: 768px) {
            .content-wrapper {
                grid-template-columns: 65% 35%;
            }
            }

            @media (min-width: 1024px) {
            .content-wrapper {
                grid-template-columns: 70% 30%;
            }
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

            .info-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
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
            background: #f8f9fa;
            }

            .accordion-header:active {
            background: #e9ecef;
            }

            .accordion-header h2 {
            font-size: clamp(18px, 4.5vw, 20px);
            font-weight: 600;
            color: #1a202c;
            }

            .chevron {
            transition: transform 0.3s ease;
            color: #667eea;
            flex-shrink: 0;
            margin-left: 12px;
            }

            .chevron.open {
            transform: rotate(180deg);
            }

            .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            }

            .accordion-content.open {
            max-height: 2000px;
            }

            .card-content {
            padding: 0 20px 20px 20px;
            }

            .profile-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            }

            .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid #667eea;
            flex-shrink: 0;
            margin-bottom: 16px;
            }

            /* 👇 Room Image Styling */
            .room-image {
            width: 100%;
            max-height: 300px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            margin-bottom: 16px;
            display: block;
            }

            .profile-info {
            text-align: center;
            }

            .profile-info h3 {
            font-size: clamp(20px, 5vw, 24px);
            color: #1a202c;
            margin-bottom: 8px;
            }

            .status-badge {
            display: inline-block;
            padding: 6px 16px;
            background: #d4edda;
            color: #155724;
            border-radius: 12px;
            font-size: clamp(12px, 3.5vw, 14px);
            font-weight: 500;
            }

            .info-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
            font-size: clamp(14px, 4vw, 16px);
            line-height: 1.5;
            }

            .info-row:last-child {
            border-bottom: none;
            }

            .info-row svg {
            color: #667eea;
            flex-shrink: 0;
            }

            .info-label {
            font-weight: 600;
            color: #495057;
            min-width: 100px;
            }

            .info-value {
            color: #1a202c;
            }

            .grid-2 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            }

            .grid-item {
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            }

            .grid-item-label {
            font-size: clamp(12px, 3.5vw, 14px);
            color: #6c757d;
            margin-bottom: 4px;
            font-weight: 500;
            }

            .grid-item-value {
            font-size: clamp(16px, 4.5vw, 18px);
            color: #1a202c;
            font-weight: 600;
            }

            .download-btn {
            width: 100%;
            padding: 14px 20px;
            background: #667eea;
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
            margin-top: 16px;
            transition: background 0.2s;
            }

            .download-btn:hover {
            background: #5568d3;
            }

            .download-btn:active {
            background: #4c5fc7;
            }

            .emergency-contact {
            padding: 16px;
            background: #001F3D;
            border-left: 4px solid #0066cc;
            border-radius: 8px;
            margin-bottom: 12px;
            }

            .emergency-contact:last-child {
            margin-bottom: 0;
            }

            .emergency-name {
            font-size: clamp(16px, 4.2vw, 18px);
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 4px;
            }

            .emergency-relation {
            font-size: clamp(13px, 3.8vw, 14px);
            color: #a8c5e6;
            margin-bottom: 8px;
            }

            .emergency-phone {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: clamp(14px, 4vw, 15px);
            color: #ffffff;
            }

            .table-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            margin-top: 12px;
            }

            .payment-table {
            width: 100%;
            min-width: 550px;
            border-collapse: collapse;
            }

            .payment-table th,
            .payment-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
            font-size: clamp(13px, 3.8vw, 14px);
            }

            .payment-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #495057;
            }

            .payment-table td {
            color: #1a202c;
            }

            .status-paid {
            color: #28a745;
            font-weight: 600;
            }

            .quick-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            }

            .action-btn {
            width: 100%;
            padding: 14px;
            background: white;
            border: 2px solid #667eea;
            color: #667eea;
            border-radius: 8px;
            font-size: clamp(14px, 4vw, 15px);
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
            }

            .action-btn:hover {
            background: #667eea;
            color: white;
            }

            .alert-box {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 16px;
            display: flex;
            gap: 12px;
            align-items: start;
            }

            .alert-box svg {
            color: #721c24;
            flex-shrink: 0;
            margin-top: 2px;
            }

            .alert-content {
            flex: 1;
            }

            .alert-title {
            font-size: clamp(14px, 4vw, 15px);
            font-weight: 600;
            color: #721c24;
            margin-bottom: 4px;
            }

            .alert-text {
            font-size: clamp(13px, 3.8vw, 14px);
            color: #721c24;
            line-height: 1.5;
            }

            @media (min-width: 768px) {
            .tenant-view-container {
                padding: 24px;
            }

            .content-wrapper {
                grid-template-columns: 60% 40%;
                gap: 24px;
            }

            .main-content,
            .sidebar {
                gap: 20px;
            }

            .info-card {
                margin-bottom: 0;
            }

            .grid-2 {
                grid-template-columns: 1fr 1fr;
            }

            .download-btn {
                width: auto;
                padding: 12px 24px;
            }

            .quick-actions {
                flex-direction: row;
            }

            .action-btn {
                width: auto;
                flex: 1;
            }
            }

            @media (min-width: 1024px) {
            .tenant-view-container {
                padding: 32px;
            }

            .content-wrapper {
                grid-template-columns: 70% 30%;
                gap: 32px;
            }

            .sidebar {
                position: sticky;
                top: 20px;
                align-self: start;
            }

            .accordion-header h2 {
                font-size: 22px;
            }

            .quick-actions {
                flex-direction: column;
            }

            .action-btn {
                width: 100%;
            }
            }

            @media (max-width: 374px) {
            .avatar {
                width: 100px;
                height: 100px;
            }
            }

            @media (orientation: landscape) and (max-height: 500px) {
            .tenant-view-container {
                padding: 12px;
            }

            .info-card {
                margin-bottom: 12px;
            }
            }
        `}</style>

        <div className="content-wrapper">
            <div className="main-content">
            <InfoCard title="Tenant Profile" section="profile">
                <div className="card-content">
                <div className="profile-header">
                    <img src={tenantData.photo} alt={tenantData.name} className="avatar" />
                    <div className="profile-info">
                    <h3>{tenantData.name}</h3>
                    <span className="status-badge">Active Tenant</span>
                    </div>
                </div>
                <div className="info-row">
                    <Mail size={20} />
                    <span className="info-value">{tenantData.email}</span>
                </div>
                <div className="info-row">
                    <Phone size={20} />
                    <span className="info-value">{tenantData.phone}</span>
                </div>
                <div className="info-row">
                    <Calendar size={20} />
                    <span className="info-label">Move-in:</span>
                    <span className="info-value">{tenantData.moveInDate}</span>
                </div>
                <div className="info-row">
                    <Calendar size={20} />
                    <span className="info-label">Lease End:</span>
                    <span className="info-value">{tenantData.leaseEnd}</span>
                </div>
                </div>
            </InfoCard>

            <InfoCard title="Contract Details" section="contract">
                <div className="card-content">
                <div className="grid-2">
                    <div className="grid-item">
                    <div className="grid-item-label">Contract Number</div>
                    <div className="grid-item-value">{contractData.contractNumber}</div>
                    </div>
                    <div className="grid-item">
                    <div className="grid-item-label">Status</div>
                    <div className="grid-item-value">{contractData.status}</div>
                    </div>
                    <div className="grid-item">
                    <div className="grid-item-label">Monthly Rent</div>
                    <div className="grid-item-value">{contractData.rent}</div>
                    </div>
                    <div className="grid-item">
                    <div className="grid-item-label">WiFi Fee</div>
                    <div className="grid-item-value">{contractData.wifi}</div>
                    <div style={{ fontSize: 'clamp(11px, 3vw, 12px)', color: '#6c757d', marginTop: '4px' }}>
                        {contractData.wifiNote}
                    </div>
                    </div>
                    <div className="grid-item">
                    <div className="grid-item-label">Security Deposit</div>
                    <div className="grid-item-value">{contractData.deposit}</div>
                    </div>
                    <div className="grid-item">
                    <div className="grid-item-label">Lease Term</div>
                    <div className="grid-item-value">{contractData.term}</div>
                    </div>
                </div>
                </div>
            </InfoCard>

            <InfoCard title="Room Details" section="room">
                <div className="card-content">
                {/* 👇 RENDER ROOM IMAGE IF AVAILABLE */}
                {tenantData.roomImage && (
                    <img
                    src={tenantData.roomImage}
                    alt={`Room ${roomData.unit}`}
                    className="room-image"
                    />
                )}

                <div className="info-row">
                    <MapPin size={20} />
                    <div>
                    <div className="info-value" style={{ fontWeight: 600 }}>
                        {roomData.unit}
                    </div>
                    <div className="info-value" style={{ fontSize: 'clamp(13px, 3.8vw, 14px)', color: '#6c757d' }}>
                        {roomData.address}
                    </div>
                    <div className="info-value" style={{ fontSize: 'clamp(13px, 3.8vw, 14px)', color: '#6c757d' }}>
                        {roomData.city}
                    </div>
                    </div>
                </div>
                <div className="grid-2" style={{ marginTop: '16px' }}>
                    <div className="grid-item">
                    <div className="grid-item-label">Size</div>
                    <div className="grid-item-value">{roomData.sqft}</div>
                    </div>
                    <div className="grid-item">
                    <div className="grid-item-label">Bedrooms</div>
                    <div className="grid-item-value">{roomData.bedrooms}</div>
                    </div>
                    <div className="grid-item">
                    <div className="grid-item-label">Bathrooms</div>
                    <div className="grid-item-value">{roomData.bathrooms}</div>
                    </div>
                </div>
                </div>
            </InfoCard>

            <InfoCard title="Payment History" section="payment">
                <div className="card-content">
                <div className="table-container">
                    <table className="payment-table">
                    <thead>
                        <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Method</th>
                        <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((payment, idx) => (
                        <tr key={idx}>
                            <td>{payment.date}</td>
                            <td>{payment.amount}</td>
                            <td className="status-paid">{payment.status}</td>
                            <td>{payment.method}</td>
                            <td>{payment.type || 'Rent'}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </InfoCard>
            </div>

            <div className="sidebar">
            <InfoCard title="Emergency Contacts" section="emergency">
                <div className="card-content">
                {emergencyContacts.map((contact, idx) => (
                    <div key={idx} className="emergency-contact">
                    <div className="emergency-name">{contact.name}</div>
                    <div className="emergency-relation">{contact.relation}</div>
                    <div className="emergency-phone">
                        <Phone size={16} />
                        {contact.phone}
                    </div>
                    </div>
                ))}
                </div>
            </InfoCard>
            </div>
        </div>
        </div>
    );
    };

    export default TenantInformationView;