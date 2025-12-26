    import React, { useState, ChangeEvent } from 'react';
    import { User, Home, FileText, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';

    interface TenantFormData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    dateOfBirth: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    roomType: string;
    moveInDate: string;
    lengthOfStay: string;
    specialRequests: string;
    tenantType: string;
    schoolOrCompany: string;
    idType: string;
    idNumber: string;
    idFile: File | null;
    agreeToRules: boolean;
    }

    interface ValidationErrors {
    [key: string]: string;
    }

    const TenantForm: React.FC = () => {
    const [formData, setFormData] = useState<TenantFormData>({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        dateOfBirth: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        roomType: '',
        moveInDate: '',
        lengthOfStay: '',
        specialRequests: '',
        tenantType: '',
        schoolOrCompany: '',
        idType: '',
        idNumber: '',
        idFile: null,
        agreeToRules: false,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoggedIn] = useState(true); // Assume logged-in user

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.address.trim()) newErrors.address = 'Home address is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
        if (!formData.emergencyContactNumber.trim()) {
        newErrors.emergencyContactNumber = 'Emergency contact number is required';
        } else if (!validatePhone(formData.emergencyContactNumber)) {
        newErrors.emergencyContactNumber = 'Please enter a valid phone number';
        }
        if (!formData.roomType) newErrors.roomType = 'Room type is required';
        if (!formData.moveInDate) newErrors.moveInDate = 'Move-in date is required';
        if (!formData.lengthOfStay) newErrors.lengthOfStay = 'Length of stay is required';
        if (!formData.tenantType) newErrors.tenantType = 'Tenant type is required';
        if (!formData.schoolOrCompany.trim()) newErrors.schoolOrCompany = 'School/Company name is required';
        if (!formData.idType) newErrors.idType = 'ID type is required';
        if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
        if (!formData.idFile) newErrors.idFile = 'Valid ID upload is required';
        if (!formData.agreeToRules) newErrors.agreeToRules = 'You must agree to the boarding house rules';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
        setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, idFile: file }));
        
        if (errors.idFile) {
        setErrors(prev => ({ ...prev, idFile: '' }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
        const tenantData = {
            ...formData,
            status: 'Pending',
            submittedAt: new Date().toISOString(),
        };
        
        console.log('Tenant Application Submitted:', tenantData);
        setIsSubmitted(true);
        
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const isFormValid = () => {
        return (
        formData.fullName.trim() &&
        formData.email.trim() &&
        validateEmail(formData.email) &&
        formData.phone.trim() &&
        validatePhone(formData.phone) &&
        formData.address.trim() &&
        formData.gender &&
        formData.dateOfBirth &&
        formData.emergencyContactName.trim() &&
        formData.emergencyContactNumber.trim() &&
        validatePhone(formData.emergencyContactNumber) &&
        formData.roomType &&
        formData.moveInDate &&
        formData.lengthOfStay &&
        formData.tenantType &&
        formData.schoolOrCompany.trim() &&
        formData.idType &&
        formData.idNumber.trim() &&
        formData.idFile &&
        formData.agreeToRules
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="bg-[#001F3D] p-2 rounded">
                <Home className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">Tatay|Boardinghouse</span>
            </div>
            <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-[#001F3D] font-medium">Home</a>
                <a href="/tenant/rooms" className="text-gray-600 hover:text-[#001F3D] font-medium">All Rooms</a>
                {!isLoggedIn ? (
                <>
                    <a href="/login-tenant" className="text-[#001F3D] font-bold">Login</a>
                    <a href="/register" className="bg-[#001F3D] text-white px-4 py-2 rounded font-bold">Register</a>
                </>
                ) : (
                <a href="/tenant/dashboard" className="text-[#001F3D] font-bold">My Account</a>
                )}
            </nav>
            </div>
        </header>

        {/* Success Screen */}
        {isSubmitted ? (
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 flex-grow">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
                <CheckCircle size={64} className="mx-auto text-green-600 mb-6" />
                <h2 className="text-3xl font-black text-gray-900 mb-4">Application Submitted Successfully!</h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Your tenant application has been received and is now pending review. 
                We'll contact you shortly regarding your application status.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 bg-gray-100 text-[#001F3D] font-bold rounded hover:bg-gray-200 transition-all"
                >
                    Submit Another Application
                </button>
                <a
                    href="/tenant/dashboard"
                    className="px-6 py-3 bg-[#001F3D] text-white font-bold rounded hover:bg-[#003566] transition-all"
                >
                    Go to Dashboard
                </a>
                </div>
            </div>
            </div>
        ) : (
            /* Form Content */
            <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 flex-grow">
            <div className="max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="bg-[#001F3D] text-white rounded-2xl shadow-xl p-8 mb-8 text-center">
                <h1 className="text-4xl font-black mb-3">Tenant Application Form</h1>
                <p className="text-lg opacity-90">Please fill out all required fields to complete your boarding house application</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    {/* Tenant Information Section */}
                    <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#001F3D]">
                        <User size={24} className="text-[#001F3D]" />
                        <h2 className="text-2xl font-bold text-[#001F3D]">Tenant Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && <span className="text-xs text-red-500 mt-1">{errors.fullName}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.email ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                            placeholder="your.email@example.com"
                        />
                        {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                            placeholder="+63 912 345 6789"
                        />
                        {errors.phone && <span className="text-xs text-red-500 mt-1">{errors.phone}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Gender *</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.gender ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <span className="text-xs text-red-500 mt-1">{errors.gender}</span>}
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Home Address *</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.address ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                            placeholder="Enter your complete home address"
                        />
                        {errors.address && <span className="text-xs text-red-500 mt-1">{errors.address}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Date of Birth *</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.dateOfBirth ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                        />
                        {errors.dateOfBirth && <span className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Emergency Contact Name *</label>
                        <input
                            type="text"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.emergencyContactName ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                            placeholder="Contact person name"
                        />
                        {errors.emergencyContactName && <span className="text-xs text-red-500 mt-1">{errors.emergencyContactName}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Emergency Contact Number *</label>
                        <input
                            type="tel"
                            name="emergencyContactNumber"
                            value={formData.emergencyContactNumber}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.emergencyContactNumber ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                            placeholder="+63 912 345 6789"
                        />
                        {errors.emergencyContactNumber && <span className="text-xs text-red-500 mt-1">{errors.emergencyContactNumber}</span>}
                        </div>
                    </div>
                    </div>

                    {/* Room Request Section */}
                    <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#001F3D]">
                        <Home size={24} className="text-[#001F3D]" />
                        <h2 className="text-2xl font-bold text-[#001F3D]">Room Request</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Room Type *</label>
                        <select
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.roomType ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                        >
                            <option value="">Select room type</option>
                            <option value="single">Single Room</option>
                            <option value="shared">Shared Room</option>
                        </select>
                        {errors.roomType && <span className="text-xs text-red-500 mt-1">{errors.roomType}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Preferred Move-in Date *</label>
                        <input
                            type="date"
                            name="moveInDate"
                            value={formData.moveInDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.moveInDate ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                        />
                        {errors.moveInDate && <span className="text-xs text-red-500 mt-1">{errors.moveInDate}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Length of Stay *</label>
                        <select
                            name="lengthOfStay"
                            value={formData.lengthOfStay}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.lengthOfStay ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                        >
                            <option value="">Select duration</option>
                            <option value="1-month">1 Month</option>
                            <option value="3-months">3 Months</option>
                            <option value="6-months">6 Months</option>
                            <option value="1-year">1 Year</option>
                            <option value="long-term">Long Term</option>
                        </select>
                        {errors.lengthOfStay && <span className="text-xs text-red-500 mt-1">{errors.lengthOfStay}</span>}
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Special Requests</label>
                        <textarea
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleInputChange}
                            className="px-4 py-3 text-sm border-2 border-gray-300 rounded-lg outline-none transition-all focus:border-[#001F3D] resize-vertical min-h-[100px]"
                            placeholder="Any special requests or requirements (optional)"
                            rows={3}
                        />
                        </div>
                    </div>
                    </div>

                    {/* Rental Application Section */}
                    <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#001F3D]">
                        <FileText size={24} className="text-[#001F3D]" />
                        <h2 className="text-2xl font-bold text-[#001F3D]">Rental Application</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Tenant Type *</label>
                        <select
                            name="tenantType"
                            value={formData.tenantType}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.tenantType ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                        >
                            <option value="">Select tenant type</option>
                            <option value="student">Student</option>
                            <option value="worker">Worker</option>
                        </select>
                        {errors.tenantType && <span className="text-xs text-red-500 mt-1">{errors.tenantType}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            {formData.tenantType === 'student' ? 'School Name *' : 'Company Name *'}
                        </label>
                        <input
                            type="text"
                            name="schoolOrCompany"
                            value={formData.schoolOrCompany}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.schoolOrCompany ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                            placeholder={formData.tenantType === 'student' ? 'Enter school name' : 'Enter company name'}
                        />
                        {errors.schoolOrCompany && <span className="text-xs text-red-500 mt-1">{errors.schoolOrCompany}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">ID Type *</label>
                        <select
                            name="idType"
                            value={formData.idType}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.idType ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                        >
                            <option value="">Select ID type</option>
                            <option value="drivers-license">Driver's License</option>
                            <option value="passport">Passport</option>
                            <option value="national-id">National ID</option>
                            <option value="student-id">Student ID</option>
                            <option value="company-id">Company ID</option>
                        </select>
                        {errors.idType && <span className="text-xs text-red-500 mt-1">{errors.idType}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">ID Number *</label>
                        <input
                            type="text"
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleInputChange}
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all ${
                            errors.idNumber ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                            placeholder="Enter ID number"
                        />
                        {errors.idNumber && <span className="text-xs text-red-500 mt-1">{errors.idNumber}</span>}
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Upload Valid ID *</label>
                        <input
                            type="file"
                            name="idFile"
                            onChange={handleFileChange}
                            accept="image/*,.pdf"
                            className={`px-4 py-3 text-sm border-2 rounded-lg outline-none transition-all cursor-pointer ${
                            errors.idFile ? 'border-red-500' : 'border-gray-300 focus:border-[#001F3D]'
                            }`}
                        />
                        {formData.idFile && (
                            <p className="text-sm text-gray-600 mt-1">Selected: {formData.idFile.name}</p>
                        )}
                        {errors.idFile && <span className="text-xs text-red-500 mt-1">{errors.idFile}</span>}
                        </div>
                    </div>
                    </div>

                    {/* Terms and Submit */}
                    <div className="border-t border-gray-200 pt-8">
                    <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                        <input
                        type="checkbox"
                        name="agreeToRules"
                        checked={formData.agreeToRules}
                        onChange={handleInputChange}
                        className="w-5 h-5 mt-0.5 cursor-pointer accent-[#001F3D]"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        I agree to the boarding house rules and regulations *
                        </span>
                    </label>
                    {errors.agreeToRules && <span className="text-xs text-red-500 block mb-4">{errors.agreeToRules}</span>}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                        className={`w-full py-4 text-lg font-bold rounded-lg transition-all ${
                        isFormValid()
                            ? 'bg-[#001F3D] text-white hover:bg-[#003566] shadow-lg hover:shadow-xl cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Submit Application
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </main>
        )}

        {/* Footer */}
        <footer className="bg-gray-950 text-white py-12 mt-auto">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-[#001F3D] p-2 rounded">
                    <Home className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black">Tatay|Boardinghouse</span>
                </div>
                <p className="text-gray-400 text-sm">
                    Your trusted partner for boardinghouse living in Tagoloan.
                </p>
                </div>
                <div>
                <h4 className="font-bold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Tatay|Boardinghouse@gmail.com
                    </li>
                    <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> +63 123 456 7890
                    </li>
                    <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Tagoloan, Misamis Oriental
                    </li>
                </ul>
                </div>
                <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                    <li><a href="/tenant/rooms" className="hover:text-white transition-colors">Available Rooms</a></li>
                    <li><a href="/tenant/application" className="hover:text-white transition-colors">Apply as Tenant</a></li>
                    <li><a href="/tenant/dashboard" className="hover:text-white transition-colors">My Dashboard</a></li>
                    <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>
                </div>
            </div>
            <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Tatay|Boardinghouse. All rights reserved.
            </div>
            </div>
        </footer>
        </div>
    );
    };

    export default TenantForm;