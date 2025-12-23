import React, { useState, useEffect } from 'react';
import { Settings, Building2, DollarSign, Bell, Save, RotateCcw, Upload, X, Check, AlertCircle } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('boardinghouse');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Boardinghouse Information State
  const [boardinghouseInfo, setBoardinghouseInfo] = useState({
    name: 'Sunrise Boardinghouse',
    address: '123 Main Street',
    city: 'Tagoloan, Misamis Oriental',
    zipCode: '9001',
    phone: '+63 912 345 6789',
    email: 'info@sunriseboardinghouse.com',
    website: 'www.sunriseboardinghouse.com',
    description: 'A modern and comfortable boardinghouse providing quality accommodation for students and professionals.',
    logo: null as string | null
  });

  // Room Types and Pricing State
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, name: 'Single Room', basePrice: 5000, capacity: 1, amenities: 'Bed, Desk, Cabinet' },
    { id: 2, name: 'Double Room', basePrice: 8000, capacity: 2, amenities: 'Beds, Desks, Cabinets' },
    { id: 3, name: 'Quad Room', basePrice: 12000, capacity: 4, amenities: 'Beds, Desks, Cabinets, Study Area' }
  ]);

  const [additionalFees, setAdditionalFees] = useState([
    { id: 1, name: 'Electricity', amount: 500, type: 'monthly' },
    { id: 2, name: 'Water', amount: 300, type: 'monthly' },
    { id: 3, name: 'Security Deposit', amount: 5000, type: 'onetime' },
    { id: 4, name: 'Key Card Replacement', amount: 200, type: 'onetime' }
  ]);

  // System Preferences State
  const [systemPreferences, setSystemPreferences] = useState({
    billingCycle: 'monthly',
    billingDueDay: 5,
    lateFeeEnabled: true,
    lateFeeAmount: 200,
    lateFeeGraceDays: 3,
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    reminderDaysBefore: 3,
    autoGenerateInvoices: true,
    currency: 'PHP',
    timezone: 'Asia/Manila'
  });

  const [originalData, setOriginalData] = useState({
    boardinghouseInfo: { ...boardinghouseInfo },
    roomTypes: [...roomTypes],
    additionalFees: [...additionalFees],
    systemPreferences: { ...systemPreferences }
  });

  // Monitor changes
  useEffect(() => {
    const changed = JSON.stringify({
      boardinghouseInfo,
      roomTypes,
      additionalFees,
      systemPreferences
    }) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [boardinghouseInfo, roomTypes, additionalFees, systemPreferences, originalData]);

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBoardinghouseInfo({ ...boardinghouseInfo, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new room type
  const addRoomType = () => {
    const newId = Math.max(...roomTypes.map(r => r.id), 0) + 1;
    setRoomTypes([...roomTypes, {
      id: newId,
      name: '',
      basePrice: 0,
      capacity: 1,
      amenities: ''
    }]);
  };

  // Remove room type
  const removeRoomType = (id: number) => {
    setRoomTypes(roomTypes.filter(r => r.id !== id));
  };

  // Update room type
  const updateRoomType = (id: number, field: string, value: string | number) => {
    setRoomTypes(roomTypes.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  // Add additional fee
  const addAdditionalFee = () => {
    const newId = Math.max(...additionalFees.map(f => f.id), 0) + 1;
    setAdditionalFees([...additionalFees, {
      id: newId,
      name: '',
      amount: 0,
      type: 'monthly'
    }]);
  };

  // Remove fee
  const removeAdditionalFee = (id: number) => {
    setAdditionalFees(additionalFees.filter(f => f.id !== id));
  };

  // Update fee
  const updateAdditionalFee = (id: number, field: string, value: string | number) => {
    setAdditionalFees(additionalFees.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, send data to backend:
      // const response = await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     boardinghouseInfo,
      //     roomTypes,
      //     additionalFees,
      //     systemPreferences
      //   })
      // });

      setOriginalData({
        boardinghouseInfo: { ...boardinghouseInfo },
        roomTypes: [...roomTypes],
        additionalFees: [...additionalFees],
        systemPreferences: { ...systemPreferences }
      });

      setSaveStatus('success');
      setHasChanges(false);
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset changes
  const handleReset = () => {
    setBoardinghouseInfo({ ...originalData.boardinghouseInfo });
    setRoomTypes([...originalData.roomTypes]);
    setAdditionalFees([...originalData.additionalFees]);
    setSystemPreferences({ ...originalData.systemPreferences });
    setSaveStatus(null);
  };

  const tabs = [
    { id: 'boardinghouse', name: 'Boardinghouse Info', icon: Building2 },
    { id: 'pricing', name: 'Rooms & Pricing', icon: DollarSign },
    { id: 'system', name: 'System Preferences', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-3 lg:p-4">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#001F3D] rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-600">Configure your boardinghouse system preferences</p>
            </div>
          </div>
        </div>

        {/* Save Status Alert */}
        {saveStatus && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
            saveStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {saveStatus === 'success' ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Settings saved successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">Failed to save settings. Please try again.</span>
              </>
            )}
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#001F3D] text-[#001F3D]'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Boardinghouse Information Tab */}
            {activeTab === 'boardinghouse' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Boardinghouse Information</h2>
                  <p className="text-sm text-gray-600">Update your boardinghouse details and branding</p>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Boardinghouse Logo
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {boardinghouseInfo.logo ? (
                        <img src={boardinghouseInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#001F3D] text-white rounded-lg cursor-pointer hover:bg-[#003366] transition-colors">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm font-medium">Upload Logo</span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                      {boardinghouseInfo.logo && (
                        <button
                          onClick={() => setBoardinghouseInfo({ ...boardinghouseInfo, logo: null })}
                          className="ml-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px, PNG or JPG</p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Boardinghouse Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={boardinghouseInfo.name}
                      onChange={(e) => setBoardinghouseInfo({ ...boardinghouseInfo, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      placeholder="Enter boardinghouse name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={boardinghouseInfo.phone}
                      onChange={(e) => setBoardinghouseInfo({ ...boardinghouseInfo, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      placeholder="+63 912 345 6789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={boardinghouseInfo.email}
                      onChange={(e) => setBoardinghouseInfo({ ...boardinghouseInfo, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      placeholder="info@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      value={boardinghouseInfo.website}
                      onChange={(e) => setBoardinghouseInfo({ ...boardinghouseInfo, website: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      placeholder="www.example.com"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={boardinghouseInfo.address}
                      onChange={(e) => setBoardinghouseInfo({ ...boardinghouseInfo, address: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={boardinghouseInfo.zipCode}
                      onChange={(e) => setBoardinghouseInfo({ ...boardinghouseInfo, zipCode: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      City/Municipality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={boardinghouseInfo.city}
                      onChange={(e) => setBoardinghouseInfo({ ...boardinghouseInfo, city: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      placeholder="Tagoloan, Misamis Oriental"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={boardinghouseInfo.description}
                    onChange={(e) => setBoardinghouseInfo({ ...boardinghouseInfo, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent resize-none"
                    placeholder="Brief description of your boardinghouse..."
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be displayed on public-facing pages</p>
                </div>
              </div>
            )}

            {/* Rooms & Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Rooms & Pricing Configuration</h2>
                  <p className="text-sm text-gray-600">Define room types, prices, and additional fees</p>
                </div>

                {/* Room Types */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Room Types</h3>
                      <p className="text-sm text-gray-600">Configure available room categories and base prices</p>
                    </div>
                    <button
                      onClick={addRoomType}
                      className="px-4 py-2 bg-[#001F3D] text-white rounded-lg hover:bg-[#003366] transition-colors text-sm font-medium"
                    >
                      + Add Room Type
                    </button>
                  </div>

                  <div className="space-y-4">
                    {roomTypes.map((room, index) => (
                      <div key={room.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-sm font-medium text-gray-700">Room Type #{index + 1}</span>
                          {roomTypes.length > 1 && (
                            <button
                              onClick={() => removeRoomType(room.id)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Room Name</label>
                            <input
                              type="text"
                              value={room.name}
                              onChange={(e) => updateRoomType(room.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                              placeholder="e.g., Single Room"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Base Price (₱)</label>
                            <input
                              type="number"
                              value={room.basePrice}
                              onChange={(e) => updateRoomType(room.id, 'basePrice', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                              placeholder="5000"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Capacity</label>
                            <input
                              type="number"
                              value={room.capacity}
                              onChange={(e) => updateRoomType(room.id, 'capacity', parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                              placeholder="1"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Amenities</label>
                            <input
                              type="text"
                              value={room.amenities}
                              onChange={(e) => updateRoomType(room.id, 'amenities', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                              placeholder="Bed, Desk, Cabinet"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Fees */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Additional Fees</h3>
                      <p className="text-sm text-gray-600">Configure extra charges and deposits</p>
                    </div>
                    <button
                      onClick={addAdditionalFee}
                      className="px-4 py-2 bg-[#001F3D] text-white rounded-lg hover:bg-[#003366] transition-colors text-sm font-medium"
                    >
                      + Add Fee
                    </button>
                  </div>

                  <div className="space-y-4">
                    {additionalFees.map((fee, index) => (
                      <div key={fee.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-sm font-medium text-gray-700">Fee #{index + 1}</span>
                          {additionalFees.length > 1 && (
                            <button
                              onClick={() => removeAdditionalFee(fee.id)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Fee Name</label>
                            <input
                              type="text"
                              value={fee.name}
                              onChange={(e) => updateAdditionalFee(fee.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                              placeholder="e.g., Electricity"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Amount (₱)</label>
                            <input
                              type="number"
                              value={fee.amount}
                              onChange={(e) => updateAdditionalFee(fee.id, 'amount', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                              placeholder="500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Fee Type</label>
                            <select
                              value={fee.type}
                              onChange={(e) => updateAdditionalFee(fee.id, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="onetime">One-time</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* System Preferences Tab */}
            {activeTab === 'system' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">System Preferences</h2>
                  <p className="text-sm text-gray-600">Configure billing rules and notification settings</p>
                </div>

                {/* Billing Configuration */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Billing Cycle</label>
                      <select
                        value={systemPreferences.billingCycle}
                        onChange={(e) => setSystemPreferences({ ...systemPreferences, billingCycle: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">How often should tenants be billed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Payment Due Day</label>
                      <select
                        value={systemPreferences.billingDueDay}
                        onChange={(e) => setSystemPreferences({ ...systemPreferences, billingDueDay: parseInt(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      >
                        {[...Array(28)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Day of the month payments are due</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Currency</label>
                      <select
                        value={systemPreferences.currency}
                        onChange={(e) => setSystemPreferences({ ...systemPreferences, currency: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      >
                        <option value="PHP">Philippine Peso (₱)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Timezone</label>
                      <select
                        value={systemPreferences.timezone}
                        onChange={(e) => setSystemPreferences({ ...systemPreferences, timezone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                      >
                        <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                        <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                      </select>
                    </div>
                  </div>

                  {/* Late Fee Settings */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900">Late Fee Settings</h4>
                        <p className="text-sm text-gray-600">Configure penalties for late payments</p>
                      </div>
                      <button
                        onClick={() => setSystemPreferences({ ...systemPreferences, lateFeeEnabled: !systemPreferences.lateFeeEnabled })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          systemPreferences.lateFeeEnabled ? 'bg-[#001F3D]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            systemPreferences.lateFeeEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {systemPreferences.lateFeeEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Late Fee Amount (₱)</label>
                          <input
                            type="number"
                            value={systemPreferences.lateFeeAmount}
                            onChange={(e) => setSystemPreferences({ ...systemPreferences, lateFeeAmount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                            placeholder="200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Grace Period (Days)</label>
                          <input
                            type="number"
                            value={systemPreferences.lateFeeGraceDays}
                            onChange={(e) => setSystemPreferences({ ...systemPreferences, lateFeeGraceDays: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                            placeholder="3"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Auto Generate Invoices */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900">Auto-Generate Invoices</h4>
                        <p className="text-sm text-gray-600">Automatically create invoices on the billing due date</p>
                      </div>
                      <button
                        onClick={() => setSystemPreferences({ ...systemPreferences, autoGenerateInvoices: !systemPreferences.autoGenerateInvoices })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          systemPreferences.autoGenerateInvoices ? 'bg-[#001F3D]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            systemPreferences.autoGenerateInvoices ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#001F3D]" />
                    Notification Settings
                  </h3>

                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Send notifications via email to tenants</p>
                      </div>
                      <button
                        onClick={() => setSystemPreferences({ ...systemPreferences, emailNotifications: !systemPreferences.emailNotifications })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          systemPreferences.emailNotifications ? 'bg-[#001F3D]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            systemPreferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* SMS Notifications */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Send notifications via SMS to tenants</p>
                      </div>
                      <button
                        onClick={() => setSystemPreferences({ ...systemPreferences, smsNotifications: !systemPreferences.smsNotifications })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          systemPreferences.smsNotifications ? 'bg-[#001F3D]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            systemPreferences.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Payment Reminders */}
                    <div className="py-3">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Payment Reminders</h4>
                          <p className="text-sm text-gray-600">Send automatic reminders before payment due dates</p>
                        </div>
                        <button
                          onClick={() => setSystemPreferences({ ...systemPreferences, paymentReminders: !systemPreferences.paymentReminders })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            systemPreferences.paymentReminders ? 'bg-[#001F3D]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              systemPreferences.paymentReminders ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {systemPreferences.paymentReminders && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Send Reminder (Days Before Due Date)</label>
                          <select
                            value={systemPreferences.reminderDaysBefore}
                            onChange={(e) => setSystemPreferences({ ...systemPreferences, reminderDaysBefore: parseInt(e.target.value) })}
                            className="w-full md:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3D] focus:border-transparent"
                          >
                            <option value={1}>1 day before</option>
                            <option value={2}>2 days before</option>
                            <option value={3}>3 days before</option>
                            <option value={5}>5 days before</option>
                            <option value={7}>7 days before</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 md:px-8 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-600 order-2 sm:order-1">
                {hasChanges && (
                  <span className="flex items-center gap-2 text-amber-600 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    You have unsaved changes
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  disabled={!hasChanges || isSaving}
                  className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Changes
                </button>

                <button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[#001F3D] text-white rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;