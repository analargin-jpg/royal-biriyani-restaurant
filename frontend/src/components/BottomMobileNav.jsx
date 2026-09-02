'use client';

import React from 'react';
import { Home, Utensils, PartyPopper, Search, ShoppingBag } from 'lucide-react';

export default function BottomMobileNav({ cartCount = 0, onOpenCart, onOpenTrack }) {
  const scrollTo = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/90 py-2 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around max-w-md mx-auto text-[10px] font-bold">
        
        {/* 1. Home */}
        <button
          onClick={() => scrollTo('top')}
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-royal-crimson transition active:scale-95 py-1 px-2"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* 2. Menu */}
        <button
          onClick={() => scrollTo('menu')}
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-royal-crimson transition active:scale-95 py-1 px-2"
        >
          <Utensils className="w-5 h-5 text-royal-crimson" />
          <span>Menu</span>
        </button>

        {/* 3. Bulk Catering */}
        <button
          onClick={() => scrollTo('bulk')}
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-700 transition active:scale-95 py-1 px-2"
        >
          <PartyPopper className="w-5 h-5 text-amber-600" />
          <span>Bulk Feast</span>
        </button>

        {/* 4. Track Order */}
        <button
          onClick={onOpenTrack}
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-royal-crimson transition active:scale-95 py-1 px-2"
        >
          <Search className="w-5 h-5" />
          <span>Track</span>
        </button>

        {/* 5. Cart Button with Counter */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center gap-1 text-royal-crimson hover:text-royal-crimson-dark transition active:scale-95 py-1 px-2 relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-royal-crimson text-white text-[9px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center border border-white shadow animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <span className="font-extrabold">Cart</span>
        </button>

      </div>
    </div>
  );
}
