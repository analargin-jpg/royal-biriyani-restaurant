'use client';

import React from 'react';
import { Utensils, Calendar, Phone, Sparkles, CheckCircle2, Award, Clock, Flame, PartyPopper } from 'lucide-react';

export default function HeroSection({ onOpenBulk, onScrollMenu }) {
  return (
    <section className="relative overflow-hidden bg-royal-crimson text-white">
      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px), radial-gradient(#D4AF37 1.5px, #990000 1.5px)`,
          backgroundSize: `28px 28px`,
          backgroundPosition: `0 0, 14px 14px`
        }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-royal-gold/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-black/40 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-20 md:py-24 flex flex-col items-center text-center">
        
        {/* Top Floating Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-royal-gold/40 text-royal-gold text-[11px] sm:text-xs font-black tracking-wide uppercase mb-5 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-royal-gold" />
          Komarapalayam&apos;s Signature Biriyani &amp; Fast Food
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl leading-tight mb-3 sm:mb-4">
          Royal Biriyani <span className="text-royal-gold">&amp; Fast Food</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-2xl font-bold text-amber-200 mb-6 sm:mb-8 max-w-2xl flex items-center justify-center gap-2">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-royal-gold" />
          Taste The Royalty in Every Grain!
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-royal-gold" />
        </p>

        <p className="text-gray-200 text-xs sm:text-sm md:text-base max-w-2xl mb-8 sm:mb-10 leading-relaxed font-normal">
          Experience authentic South Indian flavors slow-cooked in copper handis over firewood with rich saffron basmati rice, tender meats, and secret heritage spices.
        </p>

        {/* Action Button Group */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mb-10 sm:mb-12">
          <button
            onClick={onScrollMenu}
            className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-white text-royal-crimson hover:bg-gray-100 font-black text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95"
          >
            <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-royal-crimson" />
            Order Food Online
          </button>
          
          <button
            onClick={onOpenBulk}
            className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-gradient-to-r from-royal-gold to-yellow-500 text-royal-charcoal hover:brightness-105 font-black text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-yellow-300 active:scale-95"
          >
            <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 text-royal-charcoal" />
            Book Bulk Catering (50 - 2000+)
          </button>

          <a
            href="tel:+917418525405"
            className="w-full sm:w-auto px-5 py-3.5 sm:py-4 bg-black/30 hover:bg-black/40 text-white font-bold text-sm sm:text-base rounded-2xl border border-white/20 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Phone className="w-4 h-4 text-royal-gold" />
            Call Restaurant
          </a>
        </div>

        {/* Key Features Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-4xl text-left">
          <div className="bg-black/25 backdrop-blur-sm border border-white/10 p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-royal-gold flex-shrink-0" />
            <div>
              <p className="font-extrabold text-xs sm:text-sm text-white">100% Authentic</p>
              <p className="text-[10px] sm:text-[11px] text-gray-300">Heritage Secret Spices</p>
            </div>
          </div>

          <div className="bg-black/25 backdrop-blur-sm border border-white/10 p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3">
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-extrabold text-xs sm:text-sm text-white">Fresh &amp; Halal</p>
              <p className="text-[10px] sm:text-[11px] text-gray-300">Highest Hygiene Prep</p>
            </div>
          </div>

          <div className="bg-black/25 backdrop-blur-sm border border-white/10 p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-royal-gold flex-shrink-0" />
            <div>
              <p className="font-extrabold text-xs sm:text-sm text-white">Bulk Specialist</p>
              <p className="text-[10px] sm:text-[11px] text-gray-300">Marriages &amp; Parties</p>
            </div>
          </div>

          <div className="bg-black/25 backdrop-blur-sm border border-white/10 p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 sm:gap-3">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 flex-shrink-0" />
            <div>
              <p className="font-extrabold text-xs sm:text-sm text-white">Quick Delivery</p>
              <p className="text-[10px] sm:text-[11px] text-gray-300">Hot &amp; Fresh to Door</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
