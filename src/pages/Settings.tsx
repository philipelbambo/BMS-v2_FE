import React, { useState } from 'react';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'CJ,Cocolumber',
    address: 'Cocolumber Tagoloan, , Philippines',
    phone: '(555) 123-4567',
    email: 'bigwak@gmail.com',
    taxRate: 1.00,
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptCredit: true,
    acceptDebit: true,
    acceptMobile: false,
  });
  
  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    printReceipt: true,
    emailReceipt: false,
    includeDiscounts: true,
  });
  
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setPaymentSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setReceiptSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };
  
  return (
    <div className="container mx-auto w-full"> {/* <-- extended width here */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Settings</h1>
        <p className="text-gray-600">Manage your store settings</p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-black">General Settings</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                className="input w-full"
                value={generalSettings.storeName}
                onChange={handleGeneralChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                className="input w-full"
                value={generalSettings.address}
                onChange={handleGeneralChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                className="input w-full"
                value={generalSettings.phone}
                onChange={handleGeneralChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="input w-full"
                value={generalSettings.email}
                onChange={handleGeneralChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                name="taxRate"
                step="0.01"
                className="input w-full"
                value={generalSettings.taxRate}
                onChange={handleGeneralChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Payment Methods</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptCash"
                name="acceptCash"
                className="h-4 w-4 text-black focus:ring-primary-500 border-gray-300 rounded"
                checked={paymentSettings.acceptCash}
                onChange={handlePaymentChange}
              />
              <label htmlFor="acceptCash" className="ml-2 block text-sm text-gray-700">
                Accept Cash
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptCredit"
                name="acceptCredit"
                className="h-4 w-4 text-black focus:ring-primary-500 border-gray-300 rounded"
                checked={paymentSettings.acceptCredit}
                onChange={handlePaymentChange}
              />
              <label htmlFor="acceptCredit" className="ml-2 block text-sm text-gray-700">
                Accept Credit Cards
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptDebit"
                name="acceptDebit"
                className="h-4 w-4 text-black focus:ring-primary-500 border-gray-300 rounded"
                checked={paymentSettings.acceptDebit}
                onChange={handlePaymentChange}
              />
              <label htmlFor="acceptDebit" className="ml-2 block text-sm text-gray-700">
                Accept Debit Cards
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptMobile"
                name="acceptMobile"
                className="h-4 w-4 text-black focus:ring-primary-500 border-gray-300 rounded"
                checked={paymentSettings.acceptMobile}
                onChange={handlePaymentChange}
              />
              <label htmlFor="acceptMobile" className="ml-2 block text-sm text-gray-700">
                Accept Mobile Payments
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-black">Receipt Settings</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showLogo"
                name="showLogo"
                className="h-4 w-4 text-black focus:ring-primary-500 border-gray-300 rounded"
                checked={receiptSettings.showLogo}
                onChange={handleReceiptChange}
              />
              <label htmlFor="showLogo" className="ml-2 block text-sm text-gray-700">
                Show Store Logo on Receipt
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="printReceipt"
                name="printReceipt"
                className="h-4 w-4 text-black focus:ring-primary-500 border-gray-300 rounded"
                checked={receiptSettings.printReceipt}
                onChange={handleReceiptChange}
              />
              <label htmlFor="printReceipt" className="ml-2 block text-sm text-gray-700">
                Print Receipt by Default
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailReceipt"
                name="emailReceipt"
                className="h-4 w-4 text-black focus:ring-primary-500 border-gray-300 rounded"
                checked={receiptSettings.emailReceipt}
                onChange={handleReceiptChange}
              />
              <label htmlFor="emailReceipt" className="ml-2 block text-sm text-gray-700">
                Email Receipt Option
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeDiscounts"
                name="includeDiscounts"
                className="h-4 w-4 text-black focus:ring-primary-500 border-gray-300 rounded"
                checked={receiptSettings.includeDiscounts}
                onChange={handleReceiptChange}
              />
              <label htmlFor="includeDiscounts" className="ml-2 block text-sm text-gray-700">
                Show Discounts on Receipt
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          className="btn bg-black hover:bg-gray-700 text-white flex items-center"
          onClick={handleSaveSettings}
        >
          <Save size={18} className="mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
