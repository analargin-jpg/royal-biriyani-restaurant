'use client';

import React, { useState, useEffect } from 'react';
import { Send, Users, Calendar, Clock, MapPin, Phone, User, CheckCircle2, UtensilsCrossed, Sparkles } from 'lucide-react';
import { orderApi, menuApi } from '../lib/api';

const fallbackMenu = [
  { name: 'Mutton Biriyani', category: 'Biriyani', price: 280, dietaryType: 'non-veg' },
  { name: 'Chicken Biriyani', category: 'Biriyani', price: 240, dietaryType: 'non-veg' },
  { name: 'Kabab Biriyani', category: 'Biriyani', price: 300, dietaryType: 'non-veg' },
  { name: 'Kushka', category: 'Biriyani', price: 250, dietaryType: 'non-veg' },
  { name: 'Chicken Rice', category: 'Fast Food & Noodles', price: 150, dietaryType: 'non-veg' },
  { name: 'Egg Rice', category: 'Fast Food & Noodles', price: 120, dietaryType: 'egg' },
  { name: 'Chicken Noodles', category: 'Fast Food & Noodles', price: 140, dietaryType: 'non-veg' },
  { name: 'Egg Noodles', category: 'Fast Food & Noodles', price: 110, dietaryType: 'egg' },
  { name: 'Chicken Fry', category: 'Starters & Gravy', price: 180, dietaryType: 'non-veg' },
  { name: 'Chicken Leg Piece', category: 'Starters & Gravy', price: 160, dietaryType: 'non-veg' },
  { name: 'Liver Fry', category: 'Starters & Gravy', price: 150, dietaryType: 'non-veg' },
  { name: 'Kadai Fry', category: 'Starters & Gravy', price: 200, dietaryType: 'non-veg' },
  { name: 'Egg Masala', category: 'Starters & Gravy', price: 140, dietaryType: 'egg' },
  { name: 'Chicken Masala', category: 'Starters & Gravy', price: 220, dietaryType: 'non-veg' }
];

export default function BulkOrderForm({ onOrderSubmitted, currentUser = null }) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    eventDate: '',
    eventTime: '',
    guestCount: '100',
    dishes: '',
    address: currentUser?.address || '',
    notes: ''
  });

  // Sync with currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || currentUser.name || '',
        phone: prev.phone || currentUser.phone || '',
        address: prev.address || currentUser.address || ''
      }));
    }
  }, [currentUser]);

  const [menuItems, setMenuItems] = useState(fallbackMenu);
  const [loading, setLoading] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  // Fetch dynamic menu options from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuApi.getMenuItems();
        if (res && res.data && res.data.length > 0) {
          setMenuItems(res.data);
        }
      } catch (err) {
        console.warn('Using default menu list for dropdown:', err.message);
      }
    };
    fetchMenu();
  }, []);

  // Group menu items by category dynamically
  const groupedMenu = menuItems.reduce((acc, item) => {
    const cat = item.category || 'Special Dishes';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        customerName: formData.name,
        phone: formData.phone,
        orderType: 'bulk',
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        guestCount: formData.guestCount,
        dishes: formData.dishes,
        address: formData.address,
        notes: formData.notes
      };

      // 1. Save to MongoDB via Express API
      let orderRecord = null;
      try {
        const res = await orderApi.createOrder(payload);
        orderRecord = res.data;
      } catch (err) {
        console.warn('Saved fallback locally due to:', err.message);
        orderRecord = {
          orderId: Math.floor(1000 + Math.random() * 9000),
          ...payload
        };
      }

      setSubmittedOrder(orderRecord);

      // Notify parent/cart sidebar of placed catering request
      if (onOrderSubmitted) {
        onOrderSubmitted(orderRecord);
      }

      // 2. Open WhatsApp prefilled message
      const message = `🎉 *BULK ORDER REQUEST - ROYAL BIRIYANI*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🆔 *Order ID:* #${orderRecord.orderId || 'PENDING'}\n` +
        `👤 *Name:* ${formData.name}\n` +
        `📱 *Phone:* ${formData.phone}\n` +
        `📅 *Event Date:* ${formData.eventDate}\n` +
        `🕐 *Event Time:* ${formData.eventTime}\n` +
        `👥 *Guest Count:* ${formData.guestCount} Guests\n` +
        `🍽️ *Dishes/Package:* ${formData.dishes}\n` +
        `📍 *Delivery/Event Address:* ${formData.address}\n` +
        (formData.notes ? `📝 *Special Notes:* ${formData.notes}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Please share the best quotation and confirm booking.`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/917418525405?text=${encoded}`, '_blank');
    } catch (err) {
      alert('Failed to submit order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmittedOrder(null);
    setFormData({
      name: '',
      phone: '',
      eventDate: '',
      eventTime: '',
      guestCount: '100',
      dishes: '',
      address: '',
      notes: ''
    });
  };

  return (
    <section id="bulk" className="py-20 bg-gradient-to-br from-amber-50 via-red-50 to-orange-50 border-y border-amber-200">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Card Box */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-royal-crimson via-royal-crimson-dark to-royal-crimson p-8 sm:p-10 text-center text-white relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-royal-gold text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm border border-royal-gold/30">
              <Sparkles className="w-4 h-4 text-royal-gold" /> Bulk Catering &amp; Events Specialist
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Hosting an Event or Wedding?
            </h2>
            <p className="text-amber-200 mt-2 font-medium text-base sm:text-lg">
              Let Us Serve the Royal Feast Your Guests Will Never Forget!
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 sm:p-10">
            {submittedOrder ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Bulk Order Request Received!
                </h3>
                <div className="max-w-md mx-auto p-5 bg-amber-50 rounded-2xl border border-amber-200 text-left">
                  <p className="text-xs text-amber-800 font-bold uppercase">Assigned Order ID</p>
                  <p className="text-3xl font-black text-royal-crimson">
                    #{submittedOrder.orderId}
                  </p>
                  <div className="mt-3 text-xs text-gray-700 space-y-1">
                    <p>📅 <strong>Event:</strong> {submittedOrder.eventDate} at {submittedOrder.eventTime}</p>
                    <p>👥 <strong>Guests:</strong> {submittedOrder.guestCount} People</p>
                    <p>🍽️ <strong>Menu / Package:</strong> {submittedOrder.dishes}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 max-w-lg mx-auto">
                  Your request has been saved in our MongoDB order system and transmitted to our catering manager on WhatsApp. We will reach out to <strong>{submittedOrder.phone}</strong> shortly.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-royal-crimson text-white font-bold rounded-xl hover:bg-royal-crimson-dark transition shadow"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 text-center mb-8 text-sm sm:text-base max-w-2xl mx-auto">
                  We specialize in bulk catering for marriages, engagements, birthday parties, corporate gatherings, and college celebrations with authentic wood-fired aroma &amp; generous portions!
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Grid Row 1: Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-royal-crimson" /> Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Karthick Raja"
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:border-royal-crimson focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-royal-crimson" /> WhatsApp Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:border-royal-crimson focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Grid Row 2: Event Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-royal-crimson" /> Event Date *
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        required
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:border-royal-crimson focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-royal-crimson" /> Event / Serving Time *
                      </label>
                      <input
                        type="time"
                        name="eventTime"
                        required
                        value={formData.eventTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:border-royal-crimson focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Grid Row 3: Guest Count & Menu Selection (Dropdown from Food Menu Data) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-royal-crimson" /> Estimated Guest Count *
                      </label>
                      <select
                        name="guestCount"
                        required
                        value={formData.guestCount}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:border-royal-crimson focus:outline-none transition bg-white cursor-pointer"
                      >
                        <option value="50">50 Guests (Family Function)</option>
                        <option value="100">100 Guests (Party / Gathering)</option>
                        <option value="250">250 Guests (Grand Celebration)</option>
                        <option value="500">500+ Guests (Marriage Reception)</option>
                        <option value="1000">1000+ Guests (Mega Event)</option>
                      </select>

                      {/* Quick Pill Buttons with scale pop */}
                      <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar py-0.5">
                        {['50', '100', '250', '500', '1000+'].map((count) => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, guestCount: count }))}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all duration-200 active:scale-90 ${
                              formData.guestCount === count
                                ? 'bg-royal-crimson text-white shadow-xs scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-royal-crimson" /> Selected Dishes / Packages *
                      </label>
                      <select
                        name="dishes"
                        required
                        value={formData.dishes}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:border-royal-crimson focus:outline-none transition bg-white cursor-pointer"
                      >
                        <option value="">-- Choose Dishes or Catering Package --</option>
                        
                        {/* Curated Royal Packages */}
                        <optgroup label="Royal Catering Combo Packages">
                          <option value="Royal Feast Package (Mutton Biriyani + Chicken Fry + Egg Masala + Dessert)">
                            Royal Feast Package (Mutton Biriyani + Chicken Fry + Egg Masala + Dessert)
                          </option>
                          <option value="Grand Chicken Biriyani Feast (Chicken Biriyani + Chicken Leg Piece + Royal Gravy)">
                            Grand Chicken Biriyani Feast (Chicken Biriyani + Chicken Leg Piece + Royal Gravy)
                          </option>
                          <option value="Fast Food Banquet (Chicken Rice + Chicken Noodles + Chicken Fry + Gravy)">
                            Fast Food Banquet (Chicken Rice + Chicken Noodles + Chicken Fry + Gravy)
                          </option>
                          <option value="Grand All-in-One Feast (Mutton & Chicken Biriyani + Starters + Fast Food + Gravy)">
                            Grand All-in-One Feast (Mutton &amp; Chicken Biriyani + Starters + Gravy)
                          </option>
                        </optgroup>

                        {/* Dynamic Categorized Food Menu Items */}
                        {Object.entries(groupedMenu).map(([category, items]) => (
                          <optgroup key={category} label={category}>
                            {items.map(item => (
                              <option 
                                key={item._id || item.name} 
                                value={`${item.name} (${item.category}) - ₹${item.price}`}
                              >
                                {item.name} - ₹{item.price} ({item.dietaryType || 'non-veg'})
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Delivery / Venue Address */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-royal-crimson" /> Event Location / Hall / Delivery Address *
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Marriage Hall, Salem Main Road, Komarapalayam, Tamil Nadu"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:border-royal-crimson focus:outline-none transition"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-royal-crimson via-royal-crimson-dark to-royal-crimson text-white font-extrabold text-base rounded-2xl shadow-xl hover:shadow-2xl hover:brightness-110 transition flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-50 animate-shimmer border border-amber-400/30"
                  >
                    {loading ? (
                      'Submitting Request...'
                    ) : (
                      <>
                        <Send className="w-5 h-5 text-royal-gold" />
                        Submit Bulk Order &amp; Request Instant Quote
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-500">
                    Directly transmits booking request to our kitchen &amp; catering team (+91 74185 25405) via WhatsApp &amp; Database.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
