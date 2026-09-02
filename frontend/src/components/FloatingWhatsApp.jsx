'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

export default function FloatingWhatsApp() {
  const adminPhone = '6384945599';
  const restaurantPhone = '+917418525405';

  const defaultMsg = encodeURIComponent('Hello Royal Biriyani, I would like to place an order / make an inquiry!');

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Quick Phone Call */}
      <a
        href={`tel:${restaurantPhone}`}
        className="w-12 h-12 rounded-full bg-royal-crimson text-white flex items-center justify-center shadow-xl hover:scale-110 transition duration-200 border-2 border-white"
        title="Call Restaurant (+91 74185 25405)"
        aria-label="Call Restaurant"
      >
        <Phone className="w-5 h-5 text-white" />
      </a>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${adminPhone}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition duration-200 border-2 border-white animate-pulse"
        title="Chat on WhatsApp (6384945599)"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
