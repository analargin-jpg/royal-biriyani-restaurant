'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Menu as MenuIcon, 
  X, 
  Phone, 
  Utensils, 
  Search, 
  User, 
  LogIn, 
  LogOut, 
  ChevronDown, 
  Package, 
  Flame, 
  Sparkles, 
  PartyPopper, 
  MapPin, 
  Clock,
  ArrowRight
} from 'lucide-react';

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
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all">
        
        {/* Top Announcement Bar - Mobile Optimized */}
        <div className="bg-gradient-to-r from-royal-crimson via-royal-crimson-dark to-royal-crimson text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-2">
            <div className="flex items-center gap-1.5 font-medium min-w-0 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              <span className="truncate text-[10px] sm:text-xs">Now Open &amp; Delivering in Komarapalayam!</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 font-bold flex-shrink-0">
              <a 
                href="tel:+917418525405" 
                className="hover:text-royal-gold transition flex items-center gap-1 text-[11px] sm:text-xs bg-white/10 sm:bg-transparent px-2 sm:px-0 py-0.5 sm:py-0 rounded-full"
              >
                <Phone className="w-3 h-3 text-royal-gold flex-shrink-0" /> 
                <span className="hidden xs:inline">+91 74185 25405</span>
                <span className="xs:hidden font-semibold">Call Now</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0 flex-shrink">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-royal-crimson to-royal-crimson-dark flex items-center justify-center text-royal-gold shadow-md group-hover:scale-105 transition transform border border-amber-300/30 flex-shrink-0">
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base sm:text-xl leading-none text-royal-crimson tracking-tight truncate">
                  Royal Biriyani
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md border border-amber-300 uppercase">
                  Fast Food
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate hidden xs:block">
                Authentic South Indian • Salem Main Rd
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs sm:text-sm font-bold text-gray-700">
            <button onClick={() => scrollToSection('menu')} className="hover:text-royal-crimson transition flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-royal-crimson" /> Royal Menu
            </button>
            <button onClick={() => scrollToSection('bulk')} className="hover:text-royal-crimson transition flex items-center gap-1.5">
              <PartyPopper className="w-4 h-4 text-amber-600" /> Bulk Catering
            </button>
            <button onClick={() => scrollToSection('services')} className="hover:text-royal-crimson transition flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-royal-gold" /> Services
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-royal-crimson transition flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-500" /> Location
            </button>
            <button
              onClick={onOpenTrack}
              className="text-royal-crimson bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Track Order
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            
            {/* User Auth / Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-1.5 py-1 px-2 sm:py-1.5 sm:px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-royal-charcoal text-xs font-bold transition shadow-xs flex-shrink-0"
                  aria-label="User Account Menu"
                >
                  <div className="w-6 h-6 rounded-full bg-royal-crimson text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[70px] sm:max-w-[100px] truncate hidden md:inline">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                </button>

                {userDropdownOpen && (
                  <>
                    {/* Backdrop to close on click outside on mobile */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserDropdownOpen(false)} 
                    />
                    <div 
                      className="absolute right-0 mt-2 w-52 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 text-xs animate-fade-in"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-extrabold text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{currentUser.phone}</p>
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
                        <Package className="w-4 h-4 text-royal-gold" /> Order History
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-bold flex items-center gap-2 transition"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1 py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-royal-crimson font-extrabold text-xs transition shadow-xs flex-shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-royal-crimson" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 sm:p-2.5 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-800 hover:text-royal-crimson transition shadow-inner flex items-center justify-center active:scale-95 flex-shrink-0"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 text-royal-crimson" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-royal-crimson text-white text-[10px] font-black rounded-full h-5 min-w-5 px-1 flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Call Now Button (Desktop only) */}
            <a
              href="tel:+917418525405"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 bg-royal-crimson hover:bg-royal-crimson-dark text-white text-xs font-black rounded-xl shadow transition active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-royal-gold" /> Call Now
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none transition active:scale-90 flex-shrink-0"
              aria-label="Open Navigation"
            >
              <MenuIcon className="w-6 h-6 text-royal-charcoal" />
            </button>
          </div>
        </div>
      </header>

      {/* Modern Slide-out Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-in-right overflow-y-auto">
            
            <div>
              {/* Drawer Header */}
              <div className="p-4 bg-royal-crimson text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-royal-gold">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-black text-sm">Royal Biriyani</h2>
                    <p className="text-[10px] text-amber-200">Taste The Royalty</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Account Card inside Mobile Drawer */}
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                {currentUser ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-royal-crimson text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="max-w-[120px]">
                        <p className="font-extrabold text-xs text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{currentUser.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenProfile(); }}
                      className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-lg border border-amber-300"
                    >
                      Profile
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                    className="w-full py-2.5 bg-gradient-to-r from-royal-crimson to-royal-crimson-dark text-white font-extrabold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-royal-gold" /> Sign In / Sign Up
                  </button>
                )}
              </div>

              {/* Navigation Links */}
              <div className="p-3 space-y-1 text-xs font-bold text-gray-700">
                <button
                  onClick={() => scrollToSection('menu')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 hover:text-royal-crimson transition text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <Utensils className="w-4 h-4 text-royal-crimson" /> Explore Royal Menu
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <button
                  onClick={() => scrollToSection('bulk')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-amber-50 hover:text-amber-900 transition text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <PartyPopper className="w-4 h-4 text-amber-600" /> Bulk Event Catering
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <button
                  onClick={() => scrollToSection('services')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 hover:text-royal-crimson transition text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-royal-gold" /> Special Services
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 hover:text-royal-crimson transition text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-gray-500" /> Contact &amp; Location
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenTrack(); }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-red-50 text-royal-crimson border border-red-200 transition text-left"
                >
                  <span className="flex items-center gap-2.5 font-black">
                    <Search className="w-4 h-4 text-royal-crimson" /> Track Live Order
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-royal-crimson" />
                </button>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <a
                href="tel:+917418525405"
                className="w-full py-3 bg-royal-crimson hover:bg-royal-crimson-dark text-white text-xs font-black rounded-xl shadow flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Phone className="w-4 h-4 text-royal-gold" /> Call Restaurant (+91 74185 25405)
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
