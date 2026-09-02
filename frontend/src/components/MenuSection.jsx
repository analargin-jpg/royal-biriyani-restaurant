'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Check, Flame, RefreshCw, AlertCircle } from 'lucide-react';
import { menuApi } from '../lib/api';

const fallbackMenu = [
  // Biriyani
  { _id: '1', name: 'Mutton Biriyani', category: 'Biriyani', price: 280, description: 'Aromatic basmati with tender mutton cooked to perfection', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍛' },
  { _id: '2', name: 'Chicken Biriyani', category: 'Biriyani', price: 240, description: 'Fragrant rice with succulent spiced chicken and royal masala', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍗' },
  { _id: '3', name: 'Kabab Biriyani', category: 'Biriyani', price: 300, description: 'Royal blend of biriyani with grilled seekh kababs', isAvailable: true, isPopular: false, dietaryType: 'non-veg', imageEmoji: '🍢' },
  { _id: '4', name: 'Kushka', category: 'Biriyani', price: 250, description: 'Premium biriyani special preparation with rich flavors', isAvailable: true, isPopular: false, dietaryType: 'non-veg', imageEmoji: '🍚' },

  // Fast Food & Noodles
  { _id: '5', name: 'Chicken Rice', category: 'Fast Food & Noodles', price: 150, description: 'Flavored wok-fried rice with tender chicken cubes', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🥡' },
  { _id: '6', name: 'Egg Rice', category: 'Fast Food & Noodles', price: 120, description: 'Classic fried rice with seasoned scrambled eggs', isAvailable: true, isPopular: false, dietaryType: 'egg', imageEmoji: '🍳' },
  { _id: '7', name: 'Chicken Noodles', category: 'Fast Food & Noodles', price: 140, description: 'Stir-fried noodles with chicken and fresh crunchy vegetables', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍜' },
  { _id: '8', name: 'Egg Noodles', category: 'Fast Food & Noodles', price: 110, description: 'Crispy tossed noodles with scrambled egg', isAvailable: true, isPopular: false, dietaryType: 'egg', imageEmoji: '🥢' },

  // Starters & Gravy
  { _id: '9', name: 'Chicken Fry', category: 'Starters & Gravy', price: 180, description: 'Crispy and spicy South Indian fried chicken pieces', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍗' },
  { _id: '10', name: 'Chicken Leg Piece', category: 'Starters & Gravy', price: 160, description: 'Tender, juicy marinated chicken leg fry', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍖' },
  { _id: '11', name: 'Liver Fry', category: 'Starters & Gravy', price: 150, description: 'Crispy liver delicacy with ground pepper masala', isAvailable: true, isPopular: false, dietaryType: 'non-veg', imageEmoji: '🍲' },
  { _id: '12', name: 'Kadai Fry', category: 'Starters & Gravy', price: 200, description: 'Restaurant specialty kadai chicken fry with capsicum', isAvailable: true, isPopular: false, dietaryType: 'non-veg', imageEmoji: '🥘' },
  { _id: '13', name: 'Egg Masala', category: 'Starters & Gravy', price: 140, description: 'Boiled eggs simmered in rich spiced onion-tomato gravy', isAvailable: true, isPopular: false, dietaryType: 'egg', imageEmoji: '🥚' },
  { _id: '14', name: 'Chicken Masala', category: 'Starters & Gravy', price: 220, description: 'Tender chicken pieces cooked in thick aromatic royal gravy', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍲' }
];

export default function MenuSection({ cart = [], onAddToCart, onUpdateQuantity }) {
  const [activeCategory, setActiveCategory] = useState('Biriyani');
  const [menuItems, setMenuItems] = useState(fallbackMenu);
  const [loading, setLoading] = useState(true);
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  const categories = ['Biriyani', 'Fast Food & Noodles', 'Starters & Gravy', 'All'];

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await menuApi.getMenuItems();
      if (res && res.data && res.data.length > 0) {
        setMenuItems(res.data);
      }
    } catch (err) {
      console.warn('Using local fallback menu items:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleAdd = (item) => {
    if (!item.isAvailable) return;
    onAddToCart(item);
    setAddedItemNotice(item.name);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 1500);
  };

  const getItemQuantityInCart = (itemName) => {
    const found = cart.find(c => c.name === itemName);
    return found ? found.quantity : 0;
  };

  return (
    <section id="menu" className="py-20 max-w-6xl mx-auto px-4">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-royal-crimson text-xs font-bold uppercase tracking-wider mb-2">
          <Flame className="w-3.5 h-3.5" /> Fresh From The Kitchen
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-royal-crimson tracking-tight">
          Explore Our Royal Menu
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Authentic South Indian recipes cooked fresh daily with royal spices and utmost cleanliness.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm ${
              activeCategory === category
                ? 'bg-royal-crimson text-white shadow-md scale-105 ring-2 ring-royal-crimson ring-offset-2'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {category === 'Biriyani' && '🍛 '}
            {category === 'Fast Food & Noodles' && '🍜 '}
            {category === 'Starters & Gravy' && '🍗 '}
            {category === 'All' && '✨ '}
            {category}
          </button>
        ))}
      </div>

      {/* Toast Notification when adding */}
      {addedItemNotice && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-royal-charcoal text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-royal-gold/40 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added <strong>{addedItemNotice}</strong> to your cart!</span>
        </div>
      )}

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const qty = getItemQuantityInCart(item.name);
          const isOut = item.isAvailable === false;

          return (
            <div
              key={item._id || item.name}
              className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                isOut
                  ? 'border-gray-200 opacity-60'
                  : 'border-gray-200 hover:border-royal-gold/50 shadow-sm hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {/* Dish Visual Header */}
              <div className="relative h-44 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center border-b border-gray-100 overflow-hidden group">
                <span className="text-6xl transform group-hover:scale-110 transition duration-300 drop-shadow">
                  {item.imageEmoji || '🍛'}
                </span>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                    item.dietaryType === 'veg'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : item.dietaryType === 'egg'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      item.dietaryType === 'veg' ? 'bg-emerald-600' : item.dietaryType === 'egg' ? 'bg-amber-600' : 'bg-red-600'
                    }`} />
                    {item.dietaryType || 'non-veg'}
                  </span>

                  {item.isPopular && (
                    <span className="bg-royal-crimson text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5 text-royal-gold" /> Bestseller
                    </span>
                  )}
                </div>

                {isOut && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white font-extrabold text-sm uppercase tracking-wider">
                    Sold Out Today
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-royal-crimson">
                      {item.name}
                    </h3>
                    <span className="font-extrabold text-lg text-royal-crimson whitespace-nowrap">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {item.description || 'Authentic traditional South Indian delicacy cooked fresh with royal spices.'}
                  </p>
                </div>

                {/* Cart Action Buttons */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">
                    {item.category}
                  </span>

                  {isOut ? (
                    <button
                      disabled
                      className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg text-xs font-semibold cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  ) : qty > 0 ? (
                    <div className="flex items-center bg-red-50 border border-red-200 rounded-xl overflow-hidden shadow-inner">
                      <button
                        onClick={() => onUpdateQuantity(item.name, qty - 1)}
                        className="p-2 text-royal-crimson hover:bg-red-100 transition"
                        title="Reduce"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-extrabold text-sm text-royal-crimson">
                        {qty}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.name, qty + 1)}
                        className="p-2 text-royal-crimson hover:bg-red-100 transition"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item)}
                      className="px-4 py-2 bg-royal-crimson hover:bg-royal-crimson-dark text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition flex items-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
