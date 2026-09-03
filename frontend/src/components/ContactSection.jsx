'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MapPin, Phone, MessageCircle, Clock, Utensils, CheckCircle2, Navigation, RefreshCw, Sparkles, Truck } from 'lucide-react';

// Dynamically import RealTimeMap to prevent SSR errors
const RealTimeMap = dynamic(() => import('./RealTimeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 flex flex-col items-center justify-center bg-[#121010] text-amber-300">
      <RefreshCw className="w-6 h-6 animate-spin mb-2 text-royal-gold" />
      <p className="text-xs font-bold">Loading Interactive Map...</p>
    </div>
  )
});

export default function ContactSection() {
  const supportPhone = '6384945599';
  const restaurantPhone = '+917418525405';

  return (
    <section id="contact" className="py-20 max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold text-royal-crimson uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-200">
          Visit Us Or Reach Out
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-royal-crimson mt-2 tracking-tight">
          Contact &amp; Location
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Conveniently located on Salem Main Road, Komarapalayam. Hot &amp; fresh dining, takeaways &amp; catering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Embedded Interactive Map Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 flex flex-col">
          
          {/* Embedded Real-Time Map (No Google Maps Redirect!) */}
          <div className="h-80 sm:h-96 w-full relative bg-[#121010] overflow-hidden">
            <RealTimeMap
              restaurantLocation={[11.4428, 77.7126]}
              coverageRadiusMeters={7000}
            />

            {/* Floating Info Overlay inside the Map */}
            <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 bg-black/85 backdrop-blur-md rounded-2xl border border-amber-500/40 p-3 shadow-xl max-w-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <h4 className="text-xs font-black text-amber-300">Royal Biriyani &amp; Fast Food</h4>
              </div>
              <p className="text-[10px] text-gray-300 leading-tight">
                Salem Main Rd, Near TMMB Bank, Komarapalayam
              </p>
              <span className="inline-block mt-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                11:00 AM – 11:00 PM • Free Delivery in 7km Zone
              </span>
            </div>

            {/* Bottom-right button to open full tracking view inside web */}
            <div className="absolute bottom-3 right-3 z-10">
              <Link
                href="/track"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-royal-crimson to-royal-crimson-dark text-white text-xs font-black rounded-xl shadow-xl hover:brightness-110 transition border border-amber-400/40 active:scale-95"
              >
                <Truck className="w-3.5 h-3.5 text-amber-300" /> Open Live Delivery Tracker
              </Link>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-100 text-royal-crimson flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Opening Hours</p>
                <p className="text-xs text-gray-600 mt-0.5">Everyday: 11:00 AM – 11:00 PM</p>
                <p className="text-[11px] text-emerald-600 font-semibold">Hot Biriyani Ready at 12:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-royal-gold-dark flex-shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Services Available</p>
                <p className="text-xs text-gray-600 mt-0.5">Dine-In • Takeaway • Doorstep Delivery</p>
                <p className="text-[11px] text-royal-crimson font-semibold">Bulk Event Catering</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Cards & Special Services (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Call Restaurant */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-royal-gold transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kitchen &amp; Restaurant</p>
                <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">+91 74185 25405</h4>
              </div>
              <a
                href="tel:+917418525405"
                className="p-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition shadow"
                aria-label="Call Restaurant"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Customer Support WhatsApp */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-royal-gold transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Support &amp; Bulk Orders</p>
                <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">{supportPhone}</h4>
              </div>
              <a
                href={`https://wa.me/${supportPhone}?text=${encodeURIComponent('Hello Royal Biriyani Support, I have an inquiry!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#25D366] text-white hover:brightness-105 transition shadow"
                aria-label="WhatsApp Customer Support"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Highlights Card */}
          <div className="p-6 bg-gradient-to-br from-royal-crimson to-royal-crimson-dark text-white rounded-2xl shadow-md space-y-3">
            <h4 className="font-extrabold text-base flex items-center gap-2 text-royal-gold">
              <Utensils className="w-5 h-5" /> Our Catering Specialties
            </h4>
            <ul className="text-xs space-y-2 text-gray-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-royal-gold flex-shrink-0" />
                Marriages &amp; Engagement Grand Receptions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-royal-gold flex-shrink-0" />
                Birthday &amp; Family Get-together Banquets
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-royal-gold flex-shrink-0" />
                College, Corporate &amp; Factory Bulk Food Supply
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-royal-gold flex-shrink-0" />
                Hygienic Leaf / Box Packing on Demand
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
