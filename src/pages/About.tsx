import React from 'react';
import { PhoneCall, Mail, MapPin, Clock } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="h-64 bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About BAOFEI COFFEE SHOP</h1>
            <p className="text-white text-lg max-w-2xl">Serving the finest coffee with a passion for quality and community since 2020.</p>
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-700 mb-6">
            BAOFEI COFFEE SHOP was born from a simple idea: to create a warm, welcoming space where people could enjoy 
            exceptional coffee. Founded by coffee enthusiasts with a passion for quality and community, our shop has 
            grown from a small corner café to a beloved local institution.
          </p>
          
          <p className="text-gray-700 mb-6">
            We source only the finest beans from sustainable farms around the world, and our skilled baristas are 
            trained to bring out the unique character of each variety. Whether you're a coffee connoisseur or just 
            looking for a delicious cup to start your day, we're dedicated to providing an experience that delights 
            all your senses.
          </p>
          
          <p className="text-gray-700 mb-6">
            Beyond great coffee, we're committed to being a positive force in our community. We partner with local 
            suppliers, minimize our environmental footprint, and create a space where everyone feels welcome. 
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 bg-primary-100 p-2 rounded-full mr-3">
                    <PhoneCall size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Phone</h4>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-primary-100 p-2 rounded-full mr-3">
                    <Mail size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Email</h4>
                    <p className="text-gray-600">info@baofeicoffee.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-primary-100 p-2 rounded-full mr-3">
                    <MapPin size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Address</h4>
                    <p className="text-gray-600">123 Coffee Street</p>
                    <p className="text-gray-600">Brew City, BC 98765</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Hours of Operation</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 bg-primary-100 p-2 rounded-full mr-3">
                    <Clock size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-800">Monday - Friday</h4>
                      <span className="text-gray-600">6:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-primary-100 p-2 rounded-full mr-3">
                    <Clock size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-800">Saturday</h4>
                      <span className="text-gray-600">7:00 AM - 9:00 PM</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-primary-100 p-2 rounded-full mr-3">
                    <Clock size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-800">Sunday</h4>
                      <span className="text-gray-600">8:00 AM - 7:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
        
        <form className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="input w-full"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input w-full"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="input w-full"
              placeholder="How can we help you?"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="input w-full"
              placeholder="Your message here..."
            ></textarea>
          </div>
          
          <div>
            <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default About;