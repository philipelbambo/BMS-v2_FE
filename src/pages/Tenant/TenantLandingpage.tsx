// src/pages/tenant/TenantLandingpage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Home, CheckCircle, X, ChevronLeft, ChevronRight, MapPin, Phone, Mail 
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// ====== Interfaces (same as before) ======
interface Room {
  id: number;
  title: string;
  type: string;
  price: string;
  pricePerMonth: string;
  images: string[];
  amenities: string[];
  size: string;
  availability: 'Available' | 'Limited' | 'Unavailable'; // kept for data only
  description: string;
}

const TenantLandingpage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 🔹 You can replace this with auth context later
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // 🔹 Mock room data — in real app, fetch from API: `/api/rooms/${id}`
  const mockRoomData: Room[] = [
    {
      id: 1,
      title: 'Room 1',
      type: 'Double',
      price: '₱3,500',
      pricePerMonth: '₱3,500/month',
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
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
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
      ],
      amenities: ['Wi-Fi', 'Air Conditioning', 'Shared Bathroom', '2 Study Desks', '2 Beds', 'Balcony'],
      size: '18 sqm',
      availability: 'Available',
      description: 'Spacious room ideal for two occupants. Share the space with a roommate while enjoying comfortable living conditions.'
    },
    {
      id: 3,
      title: 'Room 3',
      type: 'Double',
      price: '₱2,800',
      pricePerMonth: '₱2,800/month',
      images: [
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop',
      ],
      amenities: ['Wi-Fi', 'Fan', 'Shared Bathroom', 'Study Desk', 'Bed', 'Window'],
      size: '10 sqm',
      availability: 'Available',
      description: 'Budget-friendly single room with essential amenities. Great for students looking for affordable accommodation.'
    },
    {
      id: 4,
      title: 'Room 4',
      type: 'Double',
      price: '₱3,200',
      pricePerMonth: '₱3,200/month',
      images: [
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
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
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
      ],
      amenities: ['Wi-Fi', 'Fan', 'Shared Bathroom', '2 Study Desks', '2 Beds', 'Storage'],
      size: '16 sqm',
      availability: 'Available',
      description: 'Affordable double room perfect for students who want to share expenses while having their own study space.'
    },
    {
      id: 6,
      title: 'Room 6',
      type: 'Double',
      price: '₱3,800',
      pricePerMonth: '₱3,800/month',
      images: [
        'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
      ],
      amenities: ['Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Study Desk', 'Bed', 'Closet', 'Mini Fridge'],
      size: '14 sqm',
      availability: 'Limited',
      description: 'Premium single room with private bathroom and mini fridge. Perfect for those who value privacy and convenience.'
    },
    {
      id: 11,
      title: 'Apartment 1',
      type: 'Apartment',
      price: '₱6,500',
      pricePerMonth: '₱6,500/month',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      ],
      amenities: ['Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'Full Kitchen', 'Living Room', 'Dining Area', 'Balcony', 'Parking'],
      size: '35 sqm',
      availability: 'Available',
      description: 'Spacious apartment unit perfect for small families or professionals. Comes with a complete kitchen and separate living area for maximum comfort.'
    },
  ];

  const room = mockRoomData.find(r => r.id === Number(id)) || mockRoomData[0];

  // Image carousel handlers
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const handleReserveClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 4000);
      return;
    }
    // 🟢 Go to reservation form
    navigate(`/tenant/reserve/${room.id}`);
  };

  // 🟠 Login prompt animation
  useEffect(() => {
    if (showLoginPrompt) {
      const timer = setTimeout(() => setShowLoginPrompt(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showLoginPrompt]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Same Header as Landing Page */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#001F3D] p-2 rounded-lg">
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

      {/* 🔹 Login Prompt (Top) */}
      {showLoginPrompt && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#001F3D] text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <p className="font-bold">❗ Please login or register to reserve a room.</p>
        </div>
      )}

      {/* 🔹 Back Button */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-[#001F3D] font-bold hover:text-[#003566] transition-colors mb-2"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Rooms
        </button>
      </div>

      {/* 🔹 Room Detail Section */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16">
        {/* 🔹 Image Gallery */}
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="h-[500px] overflow-hidden">
            <img
              src={room.images[currentImageIndex]}
              alt={`${room.title} - View ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#001F3D] text-gray-900 hover:text-white p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#001F3D] text-gray-900 hover:text-white p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {room.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white w-8' : 'bg-white/50'}`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          {/* Room Type Tag (no availability) */}
          <div className="absolute top-4 left-4 bg-[#001F3D] text-white px-4 py-2 rounded-lg shadow-md">
            <span className="text-sm font-bold">{room.type}</span>
          </div>
        </div>

        {/* 🔹 Room Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-4">{room.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">{room.description}</p>
            </div>
            <div className="text-right md:text-left md:w-64">
              <p className="text-5xl font-black text-[#001F3D]">{room.price}</p>
              <p className="text-gray-500">{room.pricePerMonth}</p>
            </div>
          </div>

          {/* 🔹 Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-500 mb-1">Room Type</p>
              <p className="text-lg font-bold text-gray-900">{room.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Size</p>
              <p className="text-lg font-bold text-gray-900">{room.size}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Amenities</p>
              <p className="text-lg font-bold text-gray-900">{room.amenities.length} items</p>
            </div>
          </div>

          {/* 🔹 Amenities */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Included Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {room.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 🔹 CTA */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Move In?</h3>
            <p className="text-gray-600 mb-6">Secure your spot today — limited rooms available.</p>
            <button
              onClick={handleReserveClick}
              className="w-full md:w-auto px-10 py-4 bg-[#001F3D] text-white text-lg font-bold rounded-lg hover:bg-[#003566] transition-all shadow-lg hover:shadow-xl"
            >
              ✅ Reserve This Room
            </button>
          </div>
        </div>
      </main>

      {/* 🔹 Footer (Compact) */}
      <footer className="bg-gray-950 text-white py-12 mt-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-[#001F3D] p-2 rounded-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black">BoardingHub</span>
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
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/tenant/rooms" className="hover:text-white">All Rooms</a></li>
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-900 mt-10 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Tatay|Boardinghouse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TenantLandingpage;