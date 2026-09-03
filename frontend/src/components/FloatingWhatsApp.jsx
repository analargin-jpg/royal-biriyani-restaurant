'use client';

import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const adminPhone = '6384945599';
  const restaurantPhone = '+917418525405';
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMsg = encodeURIComponent('Hello Royal Biriyani, I would like to place an order / make an inquiry!');

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2.5">
      
      {/* Exact WhatsApp Floating Tooltip / Chat Callout */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-gray-800 text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl border border-gray-100 animate-fade-in group relative">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse flex-shrink-0" />
            <span className="text-gray-900 font-extrabold">Order on WhatsApp</span>
          </div>
          
          {/* Close tooltip button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full transition ml-1"
            title="Dismiss message"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Speech bubble pointer arrow */}
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-white" />
        </div>
      )}

      {/* Floating Buttons Column */}
      <div className="flex flex-col gap-2.5 items-end">
        
        {/* Quick Phone Call Button */}
        <a
          href={`tel:${restaurantPhone}`}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-royal-crimson hover:bg-royal-crimson-dark text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/90"
          title="Call Kitchen Hotline (+91 74185 25405)"
          aria-label="Call Kitchen Hotline"
        >
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </a>

        {/* Exact Official WhatsApp Floating Button */}
        <a
          href={`https://wa.me/${adminPhone}?text=${defaultMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] hover:scale-108 active:scale-95 transition-all duration-300 border-2 border-white/90"
          title="Chat on WhatsApp (6384945599)"
          aria-label="Chat on WhatsApp"
        >
          {/* Concentric expanding ripple wave */}
          <span className="animate-ripple" />

          {/* Official WhatsApp SVG Logo */}
          <svg 
            viewBox="0 0 448 512" 
            className="w-7 h-7 sm:w-8 sm:h-8 fill-white relative z-10 transition-transform duration-300 group-hover:scale-110" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>

          {/* Active Online Green Dot Badge */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-md z-20" />
        </a>

      </div>

    </div>
  );
}
