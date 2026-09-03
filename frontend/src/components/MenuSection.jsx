'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Check, Flame, Sparkles, Utensils, Award, Soup, Drumstick, Image as ImageIcon } from 'lucide-react';
import { menuApi } from '../lib/api';

const fallbackMenu = [
  {
    _id: '1',
    name: 'Mutton Biriyani',
    category: 'Biriyani',
    price: 280,
    description: 'Aromatic basmati rice layered with succulent tender mutton chunks, slow dum cooked in traditional copper handis.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    _id: '2',
    name: 'Chicken Biriyani',
    category: 'Biriyani',
    price: 240,
    description: 'Fragrant seeraga samba/basmati rice cooked with marinated bone-in chicken, infused with saffron, ghee, and royal spices.',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    _id: '3',
    name: 'Kabab Biriyani',
    category: 'Biriyani',
    price: 300,
    description: 'Royal blend of slow-cooked dum biriyani served with grilled, juicy spiced seekh chicken kababs.',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg'
  },
  {
    _id: '4',
    name: 'Kushka',
    category: 'Biriyani',
    price: 250,
    description: 'Rich, flavorful spiced plain dum biriyani rice served with royal onion raita and thick dalcha gravy.',
    imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg'
  },
  {
    _id: '5',
    name: 'Chicken Rice',
    category: 'Fast Food & Noodles',
    price: 150,
    description: 'Wok-tossed Indo-Chinese fragrant basmati rice tossed with spiced tender chicken cubes and crisp vegetables.',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    _id: '6',
    name: 'Egg Rice',
    category: 'Fast Food & Noodles',
    price: 120,
    description: 'Classic wok-fried rice with freshly scrambled eggs, crushed black pepper, and chopped scallions.',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'egg'
  },
  {
    _id: '7',
    name: 'Chicken Noodles',
    category: 'Fast Food & Noodles',
    price: 140,
    description: 'Sizzling hakka noodles stir-fried with shredded chicken, crunchy bell peppers, and savory soy garlic sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    _id: '8',
    name: 'Egg Noodles',
    category: 'Fast Food & Noodles',
    price: 110,
    description: 'Crisp stir-fried noodles with scrambled egg, shredded cabbage, carrots, and house chili seasoning.',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'egg'
  },
  {
    _id: '9',
    name: 'Chicken Fry',
    category: 'Starters & Gravy',
    price: 180,
    description: 'Crispy, deep-fried South Indian spiced chicken 65 pieces garnished with fried curry leaves and lemon.',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    _id: '10',
    name: 'Chicken Leg Piece',
    category: 'Starters & Gravy',
    price: 160,
    description: 'Juicy, succulent whole chicken drumstick marinated in yogurt and tandoori spices, flame-roasted to perfection.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    _id: '11',
    name: 'Liver Fry',
    category: 'Starters & Gravy',
    price: 150,
    description: 'Authentic Chettinad style chicken liver sauteed with freshly ground black pepper and shallots.',
    imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg'
  },
  {
    _id: '12',
    name: 'Kadai Fry',
    category: 'Starters & Gravy',
    price: 200,
    description: 'Spicy wok-tossed kadai chicken cooked with crushed coriander seeds, capsicum, and thick onion masala.',
    imageUrl: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg'
  },
  {
    _id: '13',
    name: 'Egg Masala',
    category: 'Starters & Gravy',
    price: 140,
    description: 'Hard-boiled eggs simmered in a rich, velvety onion-tomato masala gravy with ground cinnamon and cloves.',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'egg'
  },
  {
    _id: '14',
    name: 'Chicken Masala',
    category: 'Starters & Gravy',
    price: 220,
    description: 'Tender chicken pieces simmered in an aromatic South Indian homestyle thick gravy.',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  }
];

export default function MenuSection({ cart = [], onAddToCart, onUpdateQuantity }) {
  const [activeCategory, setActiveCategory] = useState('Biriyani');
  const [menuItems, setMenuItems] = useState(fallbackMenu);
  const [loading, setLoading] = useState(true);
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  const categories = [
    { id: 'Biriyani', label: 'Biriyani', icon: Utensils },
    { id: 'Fast Food & Noodles', label: 'Fast Food & Noodles', icon: Soup },
    { id: 'Starters & Gravy', label: 'Starters & Gravy', icon: Drumstick },
    { id: 'All', label: 'All Dishes', icon: Sparkles },
  ];

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
    <section id="menu" className="py-14 sm:py-20 max-w-6xl mx-auto px-4">
      
      {/* Section Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-royal-crimson text-xs font-extrabold uppercase tracking-wider mb-2.5">
          <Flame className="w-3.5 h-3.5 text-royal-crimson" /> Fresh Wood-Fired Dum Kitchen
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-royal-crimson tracking-tight">
          Explore Our Royal Menu
        </h2>
        <p className="text-gray-600 mt-2 text-xs sm:text-sm">
          Authentic South Indian recipes cooked fresh daily with royal spices and pure ghee.
        </p>
      </div>

      {/* Category Pills Slider for Mobile & Desktop */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 sm:pb-0 sm:flex-wrap sm:justify-center mb-8 sm:mb-12 px-1">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 shadow-xs flex-shrink-0 ${
              activeCategory === id
                ? 'bg-royal-crimson text-white shadow-md scale-102 ring-2 ring-royal-crimson ring-offset-2'
                : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
            }`}
          >
            <Icon className={`w-4 h-4 ${activeCategory === id ? 'text-royal-gold' : 'text-royal-crimson'}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Quick Cart Notification Toast */}
      {addedItemNotice && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-royal-charcoal text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-royal-gold/40 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added <strong>{addedItemNotice}</strong> to cart!</span>
        </div>
      )}

      {/* Modern Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredItems.map((item) => {
          const qty = getItemQuantityInCart(item.name);
          const isOut = item.isAvailable === false;
          const displayImg = item.imageUrl || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';

          return (
            <div
              key={item._id || item.name}
              className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group ${
                isOut
                  ? 'border-gray-200 opacity-60'
                  : 'border-gray-200 hover:border-amber-300 shadow-sm hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {/* Dish Photography Header */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                {/* Image */}
                <img
                  src={displayImg}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';
                  }}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${
                    item.dietaryType === 'veg'
                      ? 'bg-emerald-600/90 text-white'
                      : item.dietaryType === 'egg'
                      ? 'bg-amber-600/90 text-white'
                      : 'bg-red-700/90 text-white'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white mr-1" />
                    {item.dietaryType || 'non-veg'}
                  </span>

                  {item.isPopular && (
                    <span className="bg-royal-crimson text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow flex items-center gap-1">
                      <Flame className="w-3 h-3 text-royal-gold" /> Bestseller
                    </span>
                  )}
                </div>

                {/* Price Tag Badge over photo */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg border border-white/40">
                  <span className="text-xs text-gray-500 font-bold block leading-none">Price</span>
                  <span className="text-base font-black text-royal-crimson leading-tight">₹{item.price}</span>
                </div>

                {/* Out of Stock Overlay */}
                {isOut && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-black text-sm uppercase tracking-wider z-20">
                    Sold Out Today
                  </div>
                )}
              </div>

              {/* Dish Information */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-extrabold text-base sm:text-lg text-gray-900 group-hover:text-royal-crimson transition">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {item.description || 'Authentic traditional South Indian delicacy cooked fresh with royal spices.'}
                  </p>
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-lg">
                    {item.category}
                  </span>

                  {isOut ? (
                    <button
                      disabled
                      className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded-xl text-xs font-bold cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  ) : qty > 0 ? (
                    <div className="flex items-center bg-red-50 border border-red-200 rounded-xl overflow-hidden shadow-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.name, qty - 1)}
                        className="p-2 text-royal-crimson hover:bg-red-100 transition active:scale-90"
                        title="Reduce"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-black text-xs sm:text-sm text-royal-crimson">
                        {qty}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.name, qty + 1)}
                        className="p-2 text-royal-crimson hover:bg-red-100 transition active:scale-90"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item)}
                      className="px-3.5 sm:px-4 py-2 bg-royal-crimson hover:bg-royal-crimson-dark text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow transition flex items-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-royal-gold" /> Add to Order
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
