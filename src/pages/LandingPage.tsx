import React, { useState, useEffect } from 'react';
import { Home, Calendar, Shield, Bell, Clock, Lock, Users, CheckCircle, Menu, X, MapPin, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BoardinghouseLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselRotation, setCarouselRotation] = useState(0);

  // Boardinghouse exterior and interior images
  const boardinghouseImages = [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
  ];

  // Room images for slider
  const roomImages = [
    { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop', title: 'Deluxe Single Room' },
    { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop', title: 'Standard Double Room' },
    { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop', title: 'Premium Suite' },
    { url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop', title: 'Executive Room' },
    { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=400&fit=crop', title: 'Studio Type Room' },
    { url: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600&h=400&fit=crop', title: 'Economy Room' },
    { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&h=400&fit=crop', title: 'Family Room' },
    { url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop', title: 'Twin Bed Room' },
    { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop', title: 'Cozy Single Room' },
    { url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop', title: 'Modern Loft Room' },
  ];

  // Google Maps location for Tagoloan, Misamis Oriental
  const locationQRCode = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.google.com/maps/place/Tagoloan,+Misamis+Oriental/@8.5392,124.7528,14z';

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselRotation(prev => prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % roomImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + roomImages.length) % roomImages.length);
  };

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-Time Availability",
      description: "View up-to-the-minute room availability and make instant booking decisions with live updates."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Online Booking",
      description: "Book your preferred room anytime, anywhere with our intuitive online booking system."
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure Login",
      description: "Your data is protected with industry-standard encryption and secure authentication."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Instant Notifications",
      description: "Receive real-time updates about your bookings, payments, and important announcements."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User Management",
      description: "Easily manage your profile, booking history, and preferences in one centralized dashboard."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Payment Security",
      description: "Process payments safely with our secure payment gateway and transaction tracking."
    }
  ];

  const benefits = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Convenience",
      description: "Book rooms 24/7 from any device without phone calls or in-person visits."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Transparency",
      description: "See real-time pricing, availability, and room details before making decisions."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Time-Saving",
      description: "Complete bookings in minutes with our streamlined process and instant confirmation."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Reliability",
      description: "Trust our system with 99.9% uptime and automated backup systems."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
     {/* Navigation Bar - Extended Width with Anchors */}
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-[100] border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="bg-[#001F3D] p-2 rounded-lg">
              <Home className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">BoardingHub</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex space-x-8">
              <a href="#features" className="text-gray-600 font-bold hover:text-[#001F3D] transition-colors">Features</a>
              <a href="#benefits" className="text-gray-600 font-bold hover:text-[#001F3D] transition-colors">Benefits</a>
              <a href="#rooms" className="text-gray-600 font-bold hover:text-[#001F3D] transition-colors">Rooms</a>
            </div>
            
            <div className="h-8 w-[1px] bg-gray-200"></div>
            {/* Login and Register as Anchor Tags */}
            <div className="flex items-center space-x-4">
              <a 
                href="login-tenant" 
                className="px-7 py-2.5 text-[#001F3D] font-bold hover:bg-[#001F3D]/5 rounded-lg transition-all text-center"
              >
                Login
              </a>
              <a 
                href="register" 
                className="px-7 py-2.5 bg-[#001F3D] text-white rounded-lg hover:bg-[#003566] transition-all font-bold shadow-lg shadow-[#001F3D]/20 text-center"
              >
                Register
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-5">
          <div className="px-6 py-8 space-y-6">
            <a href="#features" className="block text-xl font-bold text-gray-900" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#benefits" className="block text-xl font-bold text-gray-900" onClick={() => setMobileMenuOpen(false)}>Benefits</a>
            <a href="#rooms" className="block text-xl font-bold text-gray-900" onClick={() => setMobileMenuOpen(false)}>Rooms</a>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <a 
                href="#login" 
                className="w-full px-6 py-4 text-[#001F3D] border-2 border-[#001F3D] rounded-2xl font-bold text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </a>
              <a 
                href="#register" 
                className="w-full px-6 py-4 bg-[#001F3D] text-white rounded-2xl font-bold shadow-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-[#001F3D]">BoardingHub</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your Modern Solution for Seamless Boardinghouse Management and Real-Time Booking
            </p>
          </div>

      {/* 3D Carousel - Balanced Wide Version */}
          <div className="relative w-full h-[500px] mb-12" style={{ perspective: '1500px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${carouselRotation}deg)`
                }}
              >
                {boardinghouseImages.map((img, index) => {
                  const angle = (360 / boardinghouseImages.length) * index;
                  return (
                    <div
                      key={index}
                      /* Mas sakto na ni nga gidak-on (600px x 350px) */
                      className="absolute top-1/2 left-1/2 w-[600px] h-[350px] -ml-[300px] -mt-[175px]"
                      style={{
                        /* Gi-adjust pud ang translateZ para sakto ang distansya sa rotation */
                        transform: `rotateY(${angle}deg) translateZ(550px)`,
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <img
                        src={img}
                        alt={`Boardinghouse view ${index + 1}`}
                        /* Gi-pino ang shadow ug rounded corners */
                        className="w-full h-full object-cover rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.25)] border-4 border-white transition-all duration-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            </div>
          </div>
        </div>
      </section>

    {/* Room Gallery Slider - Extended Width Version */}
    <section id="rooms" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Gi-increase ang max-width gikan sa 7xl ngadto sa mas dako nga size */}
      <div className="max-w-[1400px] mx-auto"> 
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Rooms
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse through our variety of comfortable and well-maintained rooms designed for your needs
          </p>
        </div>

        <div className="relative">
          {/* Main Image Display - Gi-pataas ang height (h-[550px]) para balance sa width */}
          <div className="relative h-[550px] mb-8 rounded-lg overflow-hidden shadow-2xl">
            <img
              src={roomImages[currentSlide].url}
              alt={roomImages[currentSlide].title}
              className="w-full h-full object-cover"
            />
            {/* Mas dako nga gradient overlay para sa mas lapad nga image */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10">
              <h3 className="text-3xl font-bold text-white">{roomImages[currentSlide].title}</h3>
            </div>
            
            {/* Navigation Arrows - Gi-move gamay sa gawas (left-6/right-6) */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#001F3D] text-gray-900 hover:text-white p-4 rounded-full shadow-xl transition-all z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#001F3D] text-gray-900 hover:text-white p-4 rounded-full shadow-xl transition-all z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Thumbnail Strip - Gi-pataas pud ang thumbnail sizes (w-44 h-28) */}
          <div className="flex gap-4 overflow-x-auto pb-4 justify-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {roomImages.map((room, index) => (
              <div
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`flex-shrink-0 w-44 h-28 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  currentSlide === index ? 'ring-4 ring-[#001F3D] scale-105 shadow-lg' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={room.url}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-6">
            <div className="inline-block bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-bold">
              {currentSlide + 1} / {roomImages.length}
            </div>
          </div>
        </div>
      </div>
    </section>

   {/* Features Section - Ultra-Wide with Deep Outer Shadows */}
  <section id="features" className="py-32 px-4 sm:px-10 lg:px-16 bg-gray-50/50">
    <div className="max-w-[1800px] mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-5xl sm:text-7xl font-black text-gray-900 mb-8 tracking-tight">
          Powerful <span className="text-[#001F3D]">Features</span>
        </h2>
        <p className="text-2xl text-gray-500 max-w-4xl mx-auto leading-relaxed">
          Everything you need to manage and book boardinghouse accommodations efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
        {features.map((feature, index) => (
          <div 
            key={index}
            /* Shadow-xl: Naghatag og klaro nga outer shadow base.
              hover:shadow-2xl: Mas mo-lawom ang shadow inig hover para naay "lifting" effect.
            */
            className="bg-white p-12 rounded-lg border border-gray-100 shadow-xl shadow-gray-200/60 hover:shadow-2xl hover:shadow-[#001F3D]/10 transition-all duration-500 group flex flex-col items-start hover:-translate-y-2"
          >
            {/* Icon Container */}
            <div className="bg-white p-6 rounded-3xl text-[#001F3D] mb-8 group-hover:bg-[#001F3D] group-hover:text-white transition-all duration-500 shadow-md border border-gray-50">
              <div className="w-10 h-10 flex items-center justify-center">
                {React.cloneElement(feature.icon, { size: 40 })}
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-gray-900 mb-5 group-hover:text-[#001F3D] transition-colors">
              {feature.title}
            </h3>
            
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              {feature.description}
            </p>
            
            <div className="mt-auto pt-4 text-[#001F3D] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              Explore Details <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Benefits Section - Full Width with Outer Shadows */}
<section id="benefits" className="py-24 px-6 sm:px-10 bg-gray-50">
  {/* Section header */}
  <div className="text-center mb-16">
    <h2 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6">
      Why Choose BoardingHub?
    </h2>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
      Discover the advantages that make us the preferred choice for boardinghouse management
    </p>
  </div>

  {/* Full-width benefits grid */}
  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-6 sm:px-10">
    {benefits.map((benefit, index) => (
      <div 
        key={index}
        className="bg-white p-8 rounded-lg border border-gray-100 shadow-md hover:shadow-2xl transition-all flex flex-col space-y-4"
      >
        <div className="text-[#001F3D] bg-[#001F3D]/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
          {benefit.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {benefit.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {benefit.description}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Real-Time Updates banner with outer shadow */}
  <div className="max-w-[1440px] mx-auto bg-[#001F3D] rounded-lg p-10 sm:p-20 text-center text-white shadow-md hover:shadow-2xl transition-all">
    <h3 className="text-3xl sm:text-5xl font-black mb-6">
      Real-Time Updates You Can Trust
    </h3>
    <p className="text-xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
      Our system synchronizes data instantly across all devices, ensuring you always have the most accurate information about room availability, bookings, and payments.
    </p>
    <div className="flex flex-wrap justify-center gap-12 sm:gap-24 text-center">
      <div>
        <div className="text-5xl sm:text-7xl font-black mb-2">99.9%</div>
        <div className="text-lg opacity-80 uppercase tracking-widest">System Uptime</div>
      </div>
      <div>
        <div className="text-5xl sm:text-7xl font-black mb-2">&lt;1s</div>
        <div className="text-lg opacity-80 uppercase tracking-widest">Latency</div>
      </div>
      <div>
        <div className="text-5xl sm:text-7xl font-black mb-2">24/7</div>
        <div className="text-lg opacity-80 uppercase tracking-widest">Support</div>
      </div>
    </div>
  </div>
</section>


    {/* CTA Section - Extended to 6xl */}
    <section className="py-28 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto text-center">
        <h2 className="text-5xl sm:text-7xl font-black text-gray-900 mb-8 tracking-tight">
          Ready to Get <span className="text-[#001F3D]">Started?</span>
        </h2>
      </div>
    </section>

    {/* Footer with Owner Information - Extended Width */}
    <footer className="bg-gray-950 text-white py-20 px-6 sm:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column - Occupies 4 columns on large screens */}
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-[#001F3D] p-2 rounded-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">BoardingHub</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              Modern boardinghouse management and booking made simple. We provide the best living experience in Tagoloan.
            </p>
          </div>

          {/* Quick Links Column - Occupies 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-xl mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#features" className="hover:text-[#001F3D] transition-colors">Features</a></li>
              <li><a href="#benefits" className="hover:text-[#001F3D] transition-colors">Benefits</a></li>
              <li><a href="#rooms" className="hover:text-[#001F3D] transition-colors">Rooms</a></li>
              <li><a href="#" className="hover:text-[#001F3D] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Column - Occupies 3 columns */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-xl mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-[#001F3D] shrink-0" />
                <span className="break-all">info@boardinghub.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-6 h-6 text-[#001F3D] shrink-0" />
                <span>+63 123 456 7890</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-[#001F3D] shrink-0" />
                <span>Tagoloan, Misamis Oriental, Philippines</span>
              </li>
            </ul>
          </div>

          {/* Meet the Owner - Occupies 3 columns */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-xl mb-6 text-white">Meet the Owner</h4>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-[#001F3D]/50 transition-all shadow-xl">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop"
                  alt="Owner"
                  className="w-16 h-16 rounded-xl border-2 border-[#001F3D] object-cover"
                />
                <div>
                  <h5 className="font-bold text-white text-lg leading-tight">Maria Santos</h5>
                  <p className="text-sm text-[#001F3D] font-medium">Owner & Manager</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <Phone className="w-4 h-4 text-[#001F3D]" />
                  <span>+63 917 123 4567</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <Mail className="w-4 h-4 text-[#001F3D]" />
                  <span>maria@boardinghub.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm font-medium">
          <p>&copy; 2024 BoardingHub. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
    {/* Inline style element removed - use CSS file or CSS-in-JS library instead */}
    </div>
  );
}