'use client';

import React from 'react';
import { Utensils, Calendar, Phone, Sparkles, CheckCircle2, Award, Clock } from 'lucide-react';

export default function HeroSection({ onOpenBulk, onScrollMenu }) {
  return (
    <section className="relative overflow-hidden bg-royal-crimson text-white">
      {/* Background patterns */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px), radial-gradient(#D4AF37 1.5px, #990000 1.5px)`,
          backgroundSize: `30px 30px`,
          backgroundPosition: `0 0, 15px 15px`
        }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-royal-gold/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-black/40 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-royal-gold/40 text-royal-gold text-xs md:text-sm font-bold tracking-wide uppercase mb-6 shadow-inner animate-pulse">
          <Sparkles className="w-4 h-4 text-royal-gold" />
          Komarapalayam's Most Loved Biriyani & Fast Food
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight mb-4">
          Royal Biriyani <span className="text-royal-gold">&amp; Fast Food</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl font-medium text-amber-200 mb-8 max-w-2xl">
          🌟 Taste the Royalty in Every Grain! 🌟
        </p>

        <p className="text-gray-200 text-sm md:text-base max-w-2xl mb-10 leading-relaxed font-normal">
          Experience authentic South Indian flavors cooked with rich aromatic basmati rice, tender meats, and secret heritage spices. From quick cravings to grand wedding feasts!
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
          <button
            onClick={onScrollMenu}
            className="px-8 py-4 bg-white text-royal-crimson hover:bg-gray-100 font-extrabold text-base rounded-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
          >
            <Utensils className="w-5 h-5 text-royal-crimson" />
            Order Online Now
          </button>
          
          <button
            onClick={onOpenBulk}
            className="px-8 py-4 bg-gradient-to-r from-royal-gold to-royal-gold-dark text-royal-charcoal hover:brightness-105 font-extrabold text-base rounded-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 border border-yellow-300"
          >
            <Calendar className="w-5 h-5" />
            Book Bulk Catering (50 - 1000+)
          </button>

          <a
            href="tel:+917418525405"
            className="px-6 py-4 bg-black/30 hover:bg-black/40 text-white font-bold text-base rounded-xl border border-white/20 transition flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-royal-gold" />
            +91 74185 25405
          </a>
        </div>

        {/* Key Highlights Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left">
          <div className="bg-black/25 backdrop-blur-sm border border-white/10 p-3.5 rounded-xl flex items-center gap-3">
            <Award className="w-8 h-8 text-royal-gold flex-shrink-0" />
            <div>
              <p className="font-bold text-xs md:text-sm text-white">100% Authentic</p>
              <p className="text-[11px] text-gray-300">Heritage Secret Spices</p>
            </div>
          </div>

          <div className="bg-black/25 backdrop-blur-sm border border-white/10 p-3.5 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-xs md:text-sm text-white">Fresh &amp; Halal</p>
              <p className="text-[11px] text-gray-300">Highest Hygiene Prep</p>
            </div>
          </div>

          <div className="bg-black/25 backdrop-blur-sm border border-white/10 p-3.5 rounded-xl flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-royal-gold flex-shrink-0" />
            <div>
              <p className="font-bold text-xs md:text-sm text-white">Bulk Specialist</p>
              <p className="text-[11px] text-gray-300">Marriages &amp; Parties</p>
            </div>
          </div>

          <div className="bg-black/25 backdrop-blur-sm border border-white/10 p-3.5 rounded-xl flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-300 flex-shrink-0" />
            <div>
              <p className="font-bold text-xs md:text-sm text-white">Quick Delivery</p>
              <p className="text-[11px] text-gray-300">Hot &amp; Fresh to Door</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
