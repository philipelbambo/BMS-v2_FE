  import React, { useState } from 'react';
  import { Bell, User, Shield, FileText, Save, Mail, MessageSquare } from 'lucide-react';

  export default function SettingsPage() {
    const [profile, setProfile] = useState({
      name: 'John Smith',
      email: 'john.smith@property.com',
      phone: '+1 (555) 123-4567',
      company: 'Smith Property Management'
    });

    const [notifications, setNotifications] = useState({
      emailNewBooking: true,
      emailPaymentReceived: true,
      emailMaintenanceRequest: false,
      smsNewBooking: true,
      smsPaymentReceived: false,
      smsMaintenanceRequest: true,
      emailFrequency: 'immediate',
      smsFrequency: 'daily'
    });

    const [systemSettings, setSystemSettings] = useState({
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      language: 'en'
    });

    const [policies, setPolicies] = useState({
      securityDepositDays: 3,
      contractType: 'month-to-month',
      lateFeeEnabled: false,
      lateFeeAmount: 0,
      lateFeeGracePeriod: 0
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full w-full px-6 py-8 sm:px-8 lg:px-12 xl:px-16">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account, notifications, and system preferences</p>
          </div>

          {/* Owner Profile Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center">
              <User className="w-5 h-5 text-white mr-3" />
              <h2 className="text-xl font-semibold text-white">Owner Profile</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center">
              <Bell className="w-5 h-5 text-white mr-3" />
              <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
            </div>
            <div className="p-6">
              {/* Email Notifications */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                </div>
                <div className="space-y-3 ml-7">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">New Booking Notifications</span>
                    <button
                      onClick={() => setNotifications({ ...notifications, emailNewBooking: !notifications.emailNewBooking })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notifications.emailNewBooking ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.emailNewBooking ? 'transform translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Payment Received</span>
                    <button
                      onClick={() => setNotifications({ ...notifications, emailPaymentReceived: !notifications.emailPaymentReceived })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notifications.emailPaymentReceived ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.emailPaymentReceived ? 'transform translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Maintenance Requests</span>
                    <button
                      onClick={() => setNotifications({ ...notifications, emailMaintenanceRequest: !notifications.emailMaintenanceRequest })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notifications.emailMaintenanceRequest ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.emailMaintenanceRequest ? 'transform translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Frequency
                    </label>
                    <select
                      value={notifications.emailFrequency}
                      onChange={(e) => setNotifications({ ...notifications, emailFrequency: e.target.value })}
                      className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SMS/Text Notifications */}
              <div className="border-t pt-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">SMS/Text Notifications</h3>
                </div>
                <div className="space-y-3 ml-7">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">New Booking Notifications</span>
                    <button
                      onClick={() => setNotifications({ ...notifications, smsNewBooking: !notifications.smsNewBooking })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notifications.smsNewBooking ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.smsNewBooking ? 'transform translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Payment Received</span>
                    <button
                      onClick={() => setNotifications({ ...notifications, smsPaymentReceived: !notifications.smsPaymentReceived })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notifications.smsPaymentReceived ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.smsPaymentReceived ? 'transform translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Maintenance Requests</span>
                    <button
                      onClick={() => setNotifications({ ...notifications, smsMaintenanceRequest: !notifications.smsMaintenanceRequest })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notifications.smsMaintenanceRequest ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.smsMaintenanceRequest ? 'transform translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMS Frequency
                    </label>
                    <select
                      value={notifications.smsFrequency}
                      onChange={(e) => setNotifications({ ...notifications, smsFrequency: e.target.value })}
                      className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Settings Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center">
              <Shield className="w-5 h-5 text-white mr-3" />
              <h2 className="text-xl font-semibold text-white">System Settings</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={systemSettings.timezone}
                    onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={systemSettings.currency}
                    onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={systemSettings.dateFormat}
                    onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={systemSettings.language}
                    onChange={(e) => setSystemSettings({ ...systemSettings, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Policies & Rules Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center">
              <FileText className="w-5 h-5 text-white mr-3" />
              <h2 className="text-xl font-semibold text-white">Policies & Rules</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Security Deposit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit Return Period
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={policies.securityDepositDays}
                    onChange={(e) => setPolicies({ ...policies, securityDepositDays: parseInt(e.target.value) || 0 })}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                  <span className="text-gray-600">days after move-out</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Standard policy: 3 days</p>
              </div>

              {/* Contract Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Contract Type
                </label>
                <select
                  value={policies.contractType}
                  onChange={(e) => setPolicies({ ...policies, contractType: e.target.value })}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="month-to-month">Month-to-Month</option>
                  <option value="6-month">6-Month Lease</option>
                  <option value="1-year">1-Year Lease</option>
                  <option value="2-year">2-Year Lease</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Current policy: Month-to-month contracts</p>
              </div>

              {/* Late Fee Policy */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Late Fee Policy
                    </label>
                    <p className="text-sm text-gray-500 mt-1">Current policy: No late fees</p>
                  </div>
                  <button
                    onClick={() => setPolicies({ ...policies, lateFeeEnabled: !policies.lateFeeEnabled })}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      policies.lateFeeEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        policies.lateFeeEnabled ? 'transform translate-x-7' : ''
                      }`}
                    />
                  </button>
                </div>
                
                {policies.lateFeeEnabled && (
                  <div className="ml-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Late Fee Amount
                      </label>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600">$</span>
                        <input
                          type="number"
                          value={policies.lateFeeAmount}
                          onChange={(e) => setPolicies({ ...policies, lateFeeAmount: parseFloat(e.target.value) || 0 })}
                          className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grace Period
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          value={policies.lateFeeGracePeriod}
                          onChange={(e) => setPolicies({ ...policies, lateFeeGracePeriod: parseInt(e.target.value) || 0 })}
                          className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                        />
                        <span className="text-gray-600">days after due date</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end items-center space-x-4">
            {saved && (
              <span className="text-green-600 font-medium">Settings saved successfully!</span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    );
  }