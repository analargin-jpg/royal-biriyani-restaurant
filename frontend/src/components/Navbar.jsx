'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Phone, Utensils, Search, ShieldCheck, User, LogIn, LogOut, ChevronDown, Package } from 'lucide-react';

export default function Navbar({ 
  cartCount = 0, 
  onOpenCart, 
  onOpenTrack,
  currentUser = null,
  onOpenAuth,
  onOpenProfile,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      {/* Top micro banner */}
      <div className="bg-royal-crimson text-white text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Now Open &amp; Delivering in Komarapalayam!</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+917418525405" className="hover:text-royal-gold transition flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91 74185 25405
            </a>
            <Link href="/admin" className="hidden sm:inline-flex items-center gap-1 text-yellow-200 hover:text-white transition">
              <ShieldCheck className="w-3 h-3" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-royal-crimson to-royal-crimson-dark flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-105 transition transform">
            🍛
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-tight text-royal-crimson tracking-tight flex items-center gap-1.5">
              Royal Biriyani
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                &amp; Fast Food
              </span>
            </h1>
            <p className="text-xs text-gray-500 font-medium">Authentic South Indian • Salem Main Rd</p>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
          <button onClick={() => scrollToSection('menu')} className="hover:text-royal-crimson transition flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-royal-crimson" /> Menu
          </button>
          <button onClick={() => scrollToSection('bulk')} className="hover:text-royal-crimson transition">
            🎉 Bulk Orders
          </button>
          <button onClick={() => scrollToSection('services')} className="hover:text-royal-crimson transition">
            Services
          </button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-royal-crimson transition">
            Contact
          </button>
          <button
            onClick={onOpenTrack}
            className="text-royal-crimson bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" /> Track Order
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* User Auth Button / User Profile Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-royal-charcoal text-xs font-bold transition shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-royal-crimson text-white flex items-center justify-center text-xs font-black">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 text-xs animate-fade-in"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-extrabold text-gray-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-gray-500">{currentUser.phone}</p>
                  </div>
                  <button
                    onClick={onOpenProfile}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-gray-700 hover:text-royal-crimson font-medium flex items-center gap-2 transition"
                  >
                    <User className="w-4 h-4 text-royal-crimson" /> My Profile &amp; Address
                  </button>
                  <button
                    onClick={onOpenProfile}
                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-gray-700 hover:text-royal-crimson font-medium flex items-center gap-2 transition"
                  >
                    <Package className="w-4 h-4 text-royal-gold" /> My Order History
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-bold flex items-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-royal-crimson font-bold text-xs transition shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-royal-gold" /> Sign In
            </button>
          )}

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-800 hover:text-royal-crimson transition shadow-inner flex items-center justify-center"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-royal-crimson text-white text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center border-2 border-white shadow animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Call button */}
          <a
            href="tel:+917418525405"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-royal-crimson hover:bg-royal-crimson-dark text-white text-xs font-bold rounded-xl shadow hover:shadow-md transition"
          >
            <Phone className="w-3.5 h-3.5" /> Call
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3 shadow-xl">
          {currentUser ? (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-xs text-gray-900">{currentUser.name}</p>
                <p className="text-[10px] text-gray-600">{currentUser.phone}</p>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenProfile(); }}
                className="text-xs bg-royal-crimson text-white px-2.5 py-1 rounded-lg font-bold"
              >
                Profile
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="w-full py-2.5 bg-amber-50 border border-amber-200 text-royal-crimson font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-royal-gold" /> Sign In / Sign Up to Royal Biriyani
            </button>
          )}

          <button
            onClick={() => scrollToSection('menu')}
            className="block w-full text-left py-2 font-semibold text-gray-700 hover:text-royal-crimson border-b border-gray-100"
          >
            🍽️ Explore Our Menu
          </button>
          <button
            onClick={() => scrollToSection('bulk')}
            className="block w-full text-left py-2 font-semibold text-gray-700 hover:text-royal-crimson border-b border-gray-100"
          >
            🎉 Bulk Catering &amp; Event Booking
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="block w-full text-left py-2 font-semibold text-gray-700 hover:text-royal-crimson border-b border-gray-100"
          >
            ✨ Special Services
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="block w-full text-left py-2 font-semibold text-gray-700 hover:text-royal-crimson border-b border-gray-100"
          >
            📍 Contact &amp; Location
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTrack();
            }}
            className="block w-full text-left py-2 font-semibold text-royal-crimson"
          >
            🔍 Track Existing Order
          </button>
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="tel:+917418525405"
              className="w-full py-2.5 bg-royal-crimson text-white text-center font-bold rounded-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call +91 74185 25405
            </a>
            <Link
              href="/admin"
              className="w-full py-2 bg-gray-100 text-gray-700 text-center font-semibold rounded-lg text-xs"
            >
              🔐 Admin Dashboard Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
