'use client';

import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Utensils, CheckCircle2, Navigation } from 'lucide-react';

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
        
        {/* Left: Map & Location Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 flex flex-col">
          {/* Map display box */}
          <div className="h-72 sm:h-80 bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 relative flex flex-col items-center justify-center p-6 text-center border-b border-gray-200">
            <div className="w-16 h-16 rounded-2xl bg-royal-crimson text-white flex items-center justify-center mb-3 shadow-lg transform hover:scale-105 transition">
              <MapPin className="w-8 h-8 text-royal-gold" />
            </div>
            <h3 className="text-xl font-extrabold text-royal-crimson">
              Royal Biriyani &amp; Fast Food
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 max-w-md mt-1 font-medium">
              Salem Main Rd, Near TMMB Bank, JKK Nattraja Nagar, Komarapalayam, Tamil Nadu 638183
            </p>

            <a
              href="https://maps.google.com/?q=Salem+Main+Rd+Komarapalayam+Tamil+Nadu+638183"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-royal-crimson text-white text-xs font-bold rounded-xl shadow hover:bg-royal-crimson-dark transition transform hover:-translate-y-0.5"
            >
              <Navigation className="w-4 h-4" /> Open in Google Maps
            </a>
          </div>

          {/* Quick Info Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50">
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
