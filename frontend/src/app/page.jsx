'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MenuSection from '../components/MenuSection';
import BulkOrderForm from '../components/BulkOrderForm';
import ContactSection from '../components/ContactSection';
import CartDrawer from '../components/CartDrawer';
import OrderTrackingModal from '../components/OrderTrackingModal';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import AuthModal from '../components/AuthModal';
import UserProfileModal from '../components/UserProfileModal';
import { authApi } from '../lib/api';
import Link from 'next/link';
import { Heart, Sparkles, Phone, MapPin, ShieldCheck, Utensils } from 'lucide-react';

export default function HomePage() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Load existing logged in customer session on mount
  useEffect(() => {
    const user = authApi.getStoredUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Auth actions
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authApi.userLogout();
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  // Cart operations
  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { name: item.name, price: item.price, quantity: 1, category: item.category }];
    });
  };

  const handleUpdateQuantity = (name, newQty) => {
    setCart(prev => {
      if (newQty <= 0) {
        return prev.filter(i => i.name !== name);
      }
      return prev.map(i => i.name === name ? { ...i, quantity: newQty } : i);
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderPlaced = (order) => {
    setPlacedOrder(order);
  };

  const handleCateringOrderSubmitted = (order) => {
    setPlacedOrder(order);
    setIsCartOpen(true);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-royal-cream text-gray-900 selection:bg-royal-gold selection:text-royal-charcoal">
      
      {/* Top Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrack={() => setIsTrackOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onOpenBulk={() => scrollToSection('bulk')}
          onScrollMenu={() => scrollToSection('menu')}
        />

        {/* Menu Section */}
        <MenuSection
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />

        {/* Bulk Catering & Event Order Section */}
        <BulkOrderForm 
          onOrderSubmitted={handleCateringOrderSubmitted} 
          currentUser={currentUser}
        />

        {/* Services & Features Section */}
        <section id="services" className="py-20 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-royal-crimson uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-200">
                Why Royal Biriyani
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-royal-crimson mt-2 tracking-tight">
                Crafted With Heritage &amp; Passion
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Discover why food lovers and families across Komarapalayam choose Royal Biriyani.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 hover:border-royal-gold transition hover:shadow-xl group">
                <div className="w-14 h-14 rounded-2xl bg-red-100 text-royal-crimson flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                  🥘
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                  Wood-Fired Dum Cooking
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Slow-cooked in sealed copper handis over natural firewood, locking in maximum aroma, rich saffron spices, and mouth-watering tenderness.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 hover:border-royal-gold transition hover:shadow-xl group">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                  🎉
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                  Grand Bulk Catering
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Equipped to cater seamlessly for 50 up to 2000+ guests with prompt delivery, live counter setup options, and hygienic leaf packing.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 hover:border-royal-gold transition hover:shadow-xl group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                  🛵
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                  Fast Home Delivery
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Enjoy hot, steaming biriyani and fast food right at your doorstep in Komarapalayam with convenient WhatsApp order tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Map Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="bg-royal-charcoal text-white pt-16 pb-8 border-t-4 border-royal-gold">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-royal-crimson flex items-center justify-center text-white text-xl">
                🍛
              </div>
              <span className="font-extrabold text-xl text-white">Royal Biriyani</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Taste the Royalty in Every Grain! Serving the finest South Indian Biriyani, Fast Food, and Bulk Feast Catering.
            </p>
            <div className="text-xs text-amber-300 font-medium">
              📍 Salem Main Rd, Komarapalayam
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-royal-gold uppercase tracking-wider">Quick Navigation</h4>
            <ul className="text-xs space-y-2 text-gray-300">
              <li><button onClick={() => scrollToSection('menu')} className="hover:text-royal-gold transition">Our Royal Menu</button></li>
              <li><button onClick={() => scrollToSection('bulk')} className="hover:text-royal-gold transition">Bulk Event Booking</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-royal-gold transition">Special Services</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-royal-gold transition">Contact &amp; Location</button></li>
              <li><button onClick={() => setIsTrackOpen(true)} className="hover:text-royal-gold transition">Track Existing Order</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-royal-gold uppercase tracking-wider">Contact &amp; Timings</h4>
            <div className="text-xs space-y-2 text-gray-300">
              <p>🍴 <strong>Restaurant:</strong> <a href="tel:+917418525405" className="hover:text-white">+91 74185 25405</a></p>
              <p>📱 <strong>Admin WhatsApp:</strong> 6384945599</p>
              <p>🕒 <strong>Hours:</strong> 11:00 AM – 11:00 PM (All Days)</p>
              <p>📍 <strong>Location:</strong> Salem Main Rd, Near TMMB Bank, Komarapalayam 638183</p>
            </div>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-royal-gold uppercase tracking-wider">Admin &amp; Management</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Restaurant staff and managers can manage real-time orders and menu items via the admin portal.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-royal-crimson hover:bg-royal-crimson-dark text-white rounded-xl text-xs font-bold transition shadow"
            >
              <ShieldCheck className="w-4 h-4 text-royal-gold" /> Open Admin Portal
            </Link>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="max-w-6xl mx-auto px-4 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Royal Biriyani &amp; Fast Food. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-gray-400">
            Built with Next.js, Node.js, Express &amp; MongoDB Atlas
          </p>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        placedOrder={placedOrder}
        onOrderPlaced={handleOrderPlaced}
        currentUser={currentUser}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />

      {/* Customer Login & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Customer Profile & Orders History Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
      />

      {/* Floating Action Buttons */}
      <FloatingWhatsApp />
    </div>
  );
}
