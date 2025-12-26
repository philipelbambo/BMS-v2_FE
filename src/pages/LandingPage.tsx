  import React, { useState, useEffect } from 'react';
  import { 
    Home, Calendar, Shield, Bell, Clock, Lock, Users, CheckCircle, 
    Menu, X, MapPin, Phone, Mail, ChevronLeft, ChevronRight 
  } from 'lucide-react';
  import { useNavigate } from 'react-router-dom'; // ✅ Added for SPA navigation

  // ====== TypeScript Interfaces ======
  interface Room {
    id: number;
    title: string;
    type: string;
    price: string;
    pricePerMonth: string;
    images: string[];
    amenities: string[];
    size: string;
    availability: 'Available' | 'Limited' | 'Unavailable';
    description: string;
  }

  interface Benefit {
    icon: React.ReactNode;
    title: string;
    description: string;
  }

  const BoardinghouseLanding: React.FC = () => {
    const navigate = useNavigate(); // ✅ Initialize navigate

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [carouselRotation, setCarouselRotation] = useState(0);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const boardinghouseImages: string[] = [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
    ];

    const roomsData: Room[] = [
      {
        id: 1,
        title: 'Room 1',
        type: 'Single',
        price: '₱3,500',
        pricePerMonth: '₱3,500/month',
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Study Desk', 'Closet', 'Window'],
        size: '12 sqm',
        availability: 'Available',
        description: 'Perfect for students or young professionals seeking privacy and comfort. This cozy single room comes fully furnished with modern amenities.'
      },
      {
        id: 2,
        title: 'Room 2',
        type: 'Double',
        price: '₱2,800',
        pricePerMonth: '₱2,800/person/month',
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Air Conditioning', 'Shared Bathroom', '2 Study Desks', '2 Beds', 'Balcony'],
        size: '18 sqm',
        availability: 'Available',
        description: 'Spacious room ideal for two occupants. Share the space with a roommate while enjoying comfortable living conditions.'
      },
      {
        id: 3,
        title: 'Room 3',
        type: 'Single',
        price: '₱2,800',
        pricePerMonth: '₱2,800/month',
        images: [
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Fan', 'Shared Bathroom', 'Study Desk', 'Bed', 'Window'],
        size: '10 sqm',
        availability: 'Available',
        description: 'Budget-friendly single room with essential amenities. Great for students looking for affordable accommodation.'
      },
      {
        id: 4,
        title: 'Room 4',
        type: 'Single',
        price: '₱3,200',
        pricePerMonth: '₱3,200/month',
        images: [
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Air Conditioning', 'Shared Bathroom', 'Study Desk', 'Bed', 'Closet', 'Window'],
        size: '12 sqm',
        availability: 'Available',
        description: 'Comfortable single room with air conditioning. Ideal for students who want a cool and quiet study environment.'
      },
      {
        id: 5,
        title: 'Room 5',
        type: 'Double',
        price: '₱2,500',
        pricePerMonth: '₱2,500/person/month',
        images: [
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Fan', 'Shared Bathroom', '2 Study Desks', '2 Beds', 'Storage'],
        size: '16 sqm',
        availability: 'Available',
        description: 'Affordable double room perfect for students who want to share expenses while having their own study space.'
      },
      {
        id: 6,
        title: 'Room 6',
        type: 'Single',
        price: '₱3,800',
        pricePerMonth: '₱3,800/month',
        images: [
          'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Study Desk', 'Bed', 'Closet', 'Mini Fridge'],
        size: '14 sqm',
        availability: 'Limited',
        description: 'Premium single room with private bathroom and mini fridge. Perfect for those who value privacy and convenience.'
      },
      {
        id: 7,
        title: 'Room 7',
        type: 'Single',
        price: '₱2,600',
        pricePerMonth: '₱2,600/month',
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Fan', 'Shared Bathroom', 'Study Desk', 'Bed', 'Window'],
        size: '10 sqm',
        availability: 'Available',
        description: 'Economic single room with all the basic necessities. Great starter room for budget-conscious students.'
      },
      {
        id: 8,
        title: 'Room 8',
        type: 'Double',
        price: '₱3,000',
        pricePerMonth: '₱3,000/person/month',
        images: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Air Conditioning', 'Shared Bathroom', '2 Study Desks', '2 Beds', 'Closet', 'Window'],
        size: '18 sqm',
        availability: 'Available',
        description: 'Well-maintained double room with air conditioning. Perfect for roommates who want a comfortable living space.'
      },
      {
        id: 9,
        title: 'Room 9',
        type: 'Single',
        price: '₱3,300',
        pricePerMonth: '₱3,300/month',
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Air Conditioning', 'Shared Bathroom', 'Study Desk', 'Bed', 'Closet', 'Window', 'Shelf'],
        size: '12 sqm',
        availability: 'Available',
        description: 'Cozy single room with ample storage space. Ideal for students who need extra space for books and supplies.'
      },
      {
        id: 10,
        title: 'Room 10',
        type: 'Single',
        price: '₱2,900',
        pricePerMonth: '₱2,900/month',
        images: [
          'https://images.unsplash.com/photo-1617806118233-1c1ef2d93688?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Fan', 'Shared Bathroom', 'Study Desk', 'Bed', 'Window', 'Closet'],
        size: '11 sqm',
        availability: 'Available',
        description: 'Practical single room with good ventilation. Perfect for students who prefer natural airflow and save on electricity.'
      },
      {
        id: 11,
        title: 'Apartment 1',
        type: 'Apartment',
        price: '₱6,500',
        pricePerMonth: '₱6,500/month',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
        ],
        amenities: ['Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Full Kitchen', 'Living Room', 'Dining Area', 'Balcony', 'Parking'],
        size: '35 sqm',
        availability: 'Available',
        description: 'Spacious apartment unit perfect for small families or professionals. Comes with a complete kitchen and separate living area for maximum comfort.'
      },
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCarouselRotation(prev => prev + 0.5);
      }, 50);
      return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % roomsData.length);
    };
    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + roomsData.length) % roomsData.length);
    };

    // ✅ Updated: Navigate to /tenant-landingpage (no ID)
    const handleRoomClick = () => {
      navigate('/tenant-landingpage');
    };

    const benefits: Benefit[] = [
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
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-[100] border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-3">
                <div className="bg-[#001F3D] p-2 rounded">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">Tatay|Boardinghouse</span>
              </div>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-10">
                <div className="flex space-x-8">
                  <a href="#features" className="text-gray-600 font-bold hover:text-[#001F3D] transition-colors">Features</a>
                  <a href="#benefits" className="text-gray-600 font-bold hover:text-[#001F3D] transition-colors">Benefits</a>
                  <a href="#rooms" className="text-gray-600 font-bold hover:text-[#001F3D] transition-colors">Rooms</a>
                </div>
                <div className="h-8 w-[1px] bg-gray-200"></div>
                <div className="flex items-center space-x-4">
                  <a 
                    href="/login-tenant" 
                    className="px-7 py-2.5 text-[#001F3D] font-bold hover:bg-[#001F3D]/5 rounded transition-all text-center"
                  >
                    Login
                  </a>
                  <a 
                    href="/register" 
                    className="px-7 py-2.5 bg-[#001F3D] text-white rounded hover:bg-[#003566] transition-all font-bold shadow-lg shadow-[#001F3D]/20 text-center"
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
            <div className="md:hidden bg-white border-t border-gray-100">
              <div className="px-6 py-8 space-y-6">
                <a href="#features" className="block text-xl font-bold text-gray-900" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#benefits" className="block text-xl font-bold text-gray-900" onClick={() => setMobileMenuOpen(false)}>Benefits</a>
                <a href="#rooms" className="block text-xl font-bold text-gray-900" onClick={() => setMobileMenuOpen(false)}>Rooms</a>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <a 
                    href="/login-tenant" 
                    className="w-full px-6 py-4 text-[#001F3D] border-2 border-[#001F3D] rounded font-bold text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </a>
                  <a 
                    href="/register" 
                    className="w-full px-6 py-4 bg-[#001F3D] text-white rounded font-bold shadow-lg text-center"
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
        <section
          className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#001F3D]/90 via-[#001F3D]/60 to-transparent"></div>
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 lg:-ml-11">
                <div>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Find A Boardinghouse That Suits You
                  </h1>
                  <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                    Want to find a room? We are ready to help you find one that suits your lifestyle and needs
                  </p>
                </div>
                <div>
                  <a 
                    href="/register" 
                    className="inline-block px-10 py-4 bg-[#001F3D] text-white rounded hover:bg-[#0d0d20] transition-all font-bold shadow-xl text-lg"
                  >
                    Get Started
                  </a>
                </div>
                <div className="grid grid-cols-3 gap-8 pt-8 text-[#001F3D]">
                  <div>
                    <div className="text-4xl sm:text-5xl font-black mb-2">1200+</div>
                    <div className="font-medium">Listed Properties</div>
                  </div>
                  <div>
                    <div className="text-4xl sm:text-5xl font-black mb-2">4500+</div>
                    <div className="font-medium">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-4xl sm:text-5xl font-black mb-2">100+</div>
                    <div className="font-medium">Awards</div>
                  </div>
                </div>
              </div>
              <div className="relative w-full h-[600px]" style={{ perspective: '1500px' }}>
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
                          className="absolute top-1/2 left-1/2 w-[400px] h-[300px] -ml-[200px] -mt-[150px]"
                          style={{
                            transform: `rotateY(${angle}deg) translateZ(380px)`,
                            backfaceVisibility: 'hidden'
                          }}
                        >
                          <img
                            src={img}
                            alt={`Boardinghouse view ${index + 1}`}
                            className="w-full h-full object-cover rounded shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Our Rooms Section */}
        <section id="rooms" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                Explore Our <span className="text-[#001F3D]">Rooms</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Browse through our variety of comfortable and well-maintained rooms designed for your needs
              </p>
            </div>

            {showLoginPrompt && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#001F3D] text-white px-8 py-4 rounded shadow-2xl animate-bounce">
                <p className="text-lg font-bold">Please login or register to make a reservation</p>
              </div>
            )}

            <div className="relative">
              <div className="relative h-[700px] mb-8 rounded overflow-hidden shadow-2xl bg-white">
                <div 
                  className="relative h-[500px] overflow-hidden cursor-pointer" 
                  onClick={handleRoomClick} // ✅ No roomId
                >
                  <img
                    src={roomsData[currentSlide].images[0]}
                    alt={roomsData[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                  {/* Only Room Type — no availability badge */}
                  <div className="absolute top-4 left-4 bg-[#001F3D] text-white px-4 py-2 rounded shadow-lg">
                    <span className="text-sm font-bold">{roomsData[currentSlide].type}</span>
                  </div>
                </div>
                <div className="p-8 pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-3xl font-black text-gray-900 mb-2">{roomsData[currentSlide].title}</h3>
                      <p className="text-gray-600 mb-4">{roomsData[currentSlide].description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-4xl font-black text-[#001F3D]">{roomsData[currentSlide].price}</p>
                      <p className="text-sm text-gray-500">per month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex flex-wrap gap-2">
                      {roomsData[currentSlide].amenities.slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {roomsData[currentSlide].amenities.length > 4 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          +{roomsData[currentSlide].amenities.length - 4} more
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={handleRoomClick} // ✅ No roomId
                      className="bg-[#001F3D] text-white px-8 py-3 rounded hover:bg-[#003566] transition-all font-bold shadow-lg whitespace-nowrap ml-4"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <button
                  onClick={prevSlide}
                  className="absolute left-6 top-[250px] -translate-y-1/2 bg-white/90 hover:bg-[#001F3D] text-gray-900 hover:text-white p-4 rounded-full shadow-xl transition-all z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-6 top-[250px] -translate-y-1/2 bg-white/90 hover:bg-[#001F3D] text-gray-900 hover:text-white p-4 rounded-full shadow-xl transition-all z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 justify-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {roomsData.map((room, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      handleRoomClick(); // ✅ No roomId
                    }}
                    className={`flex-shrink-0 w-56 rounded overflow-hidden cursor-pointer transition-all duration-300 ${
                      currentSlide === index ? 'ring-4 ring-[#001F3D] scale-105 shadow-lg' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="relative h-32">
                      <img
                        src={room.images[0]}
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white font-bold text-sm truncate">{room.title}</p>
                        <p className="text-white/90 text-xs">{room.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <div className="inline-block bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-bold">
                  {currentSlide + 1} / {roomsData.length}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-24 px-6 sm:px-10 bg-gray-50">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6">
              Why Choose BoardingHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the advantages that make us the preferred choice for boardinghouse management
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 px-6 sm:px-10">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded border border-gray-100 shadow-md hover:shadow-2xl transition-all flex flex-col space-y-4"
              >
                <div className="text-[#001F3D] bg-[#001F3D]/10 w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
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
          <div className="max-w-[1440px] mx-auto bg-[#001F3D] rounded p-10 sm:p-20 text-center text-white shadow-md hover:shadow-2xl transition-all">
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

        {/* CTA Section */}
        <section className="py-28 px-6 bg-white">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-5xl sm:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              Ready to Get <span className="text-[#001F3D]">Started?</span>
            </h2>
            <a 
              href="/register" 
              className="inline-block px-12 py-5 bg-[#001F3D] text-white rounded hover:bg-[#003566] transition-all font-bold shadow-xl text-xl"
            >
              Join BoardingHub Today
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 text-white py-20 px-6 sm:px-10">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
              <div className="lg:col-span-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-[#001F3D] p-2 rounded">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-black tracking-tight">BoardingHub</span>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                  Modern boardinghouse management and booking made simple. We provide the best living experience in Tagoloan.
                </p>
              </div>
              <div className="lg:col-span-2">
                <h4 className="font-bold text-xl mb-6 text-white">Quick Links</h4>
                <ul className="space-y-4 text-gray-400">
                  <li><a href="#features" className="hover:text-[#001F3D] transition-colors">Features</a></li>
                  <li><a href="#benefits" className="hover:text-[#001F3D] transition-colors">Benefits</a></li>
                  <li><a href="#rooms" className="hover:text-[#001F3D] transition-colors">Rooms</a></li>
                  <li><a href="#" className="hover:text-[#001F3D] transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div className="lg:col-span-3">
                <h4 className="font-bold text-xl mb-6 text-white">Contact Us</h4>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-start space-x-3">
                    <Mail className="w-6 h-6 text-white shrink-0" />
                    <span>Tatay|Boardinghouse@gmail.com</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Phone className="w-6 h-6 text-white shrink-0" />
                    <span>+63 123 456 7890</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <MapPin className="w-6 h-6 text-white shrink-0" />
                    <span>Tagoloan, Misamis Oriental, Philippines</span>
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-3">
                <h4 className="font-bold text-xl mb-6 text-white">Meet the Owner</h4>
                <div className="bg-gray-900 rounded p-6 border border-gray-800 hover:border-[#001F3D]/50 transition-all shadow-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop"
                      alt="Owner"
                      className="w-16 h-16 rounded border-2 border-[#001F3D] object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-white text-lg leading-tight">Maria Santos</h5>
                      <p className="text-sm text-white font-medium">Owner & Manager</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-800 space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-gray-400">
                      <Phone className="w-4 h-4 text-white" />
                      <span>+63 917 123 4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-400">
                      <Mail className="w-4 h-4 text-white" />
                      <span>Tatay|Boardinghouse@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm font-medium">
              <p>&copy; {new Date().getFullYear()} BoardingHub. All rights reserved.</p>
              <div className="flex space-x-8">
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  export default BoardinghouseLanding;