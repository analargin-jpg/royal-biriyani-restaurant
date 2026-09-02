'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, CheckCircle2, Clock, AlertCircle, Phone, MapPin } from 'lucide-react';
import { orderApi } from '../../lib/api';

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const res = await orderApi.trackOrder(query.trim());
      setOrders(res.data || []);
    } catch (err) {
      console.error('Tracking query error:', err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'completed': return 4;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-royal-cream text-gray-900 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-royal-crimson hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍛</span>
            <span className="font-extrabold text-gray-900 text-sm">Royal Biriyani Order Tracker</span>
          </div>
        </div>
      </header>

      {/* Tracker Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* Banner Box */}
        <div className="bg-gradient-to-r from-royal-crimson to-royal-crimson-dark text-white p-8 sm:p-10 rounded-3xl shadow-xl text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-royal-gold/40 text-royal-gold">
            Live Order Status
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Track Your Royal Order
          </h1>
          <p className="text-amber-200 text-xs sm:text-sm max-w-lg mx-auto">
            Enter your assigned <strong>Order ID (e.g. 1001)</strong> or the <strong>Phone Number</strong> provided during order placement.
          </p>

          <form onSubmit={handleSearch} className="pt-4 max-w-lg mx-auto flex gap-2">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 1001 or 9876543210"
              className="flex-1 px-4 py-3 text-sm text-gray-900 bg-white rounded-xl focus:ring-2 focus:ring-royal-gold focus:outline-none shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-royal-gold hover:bg-yellow-400 text-royal-charcoal font-black text-sm rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? 'Searching...' : <><Search className="w-4 h-4" /> Track</>}
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          {searched && orders.length === 0 && !loading && (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
              <AlertCircle className="w-16 h-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-bold text-gray-800">No Orders Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We could not locate an active order with reference "<strong>{query}</strong>". Please verify your details or contact our kitchen at <strong>+91 74185 25405</strong>.
              </p>
            </div>
          )}

          {orders.map((order) => {
            const step = getStatusStep(order.status);

            return (
              <div
                key={order._id || order.orderId}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase">Order Reference</span>
                    <h3 className="text-2xl font-black text-royal-crimson">
                      #{order.orderId || '1001'}
                    </h3>
                    <p className="text-xs text-gray-600 font-semibold mt-0.5">
                      Customer: <strong>{order.customerName}</strong> ({order.phone})
                    </p>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    order.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : order.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    ● {order.status}
                  </span>
                </div>

                {/* Visual Timeline Progress */}
                {order.status !== 'cancelled' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 text-center text-xs font-bold text-gray-500">
                      <span className={step >= 1 ? 'text-royal-crimson' : ''}>1. Received</span>
                      <span className={step >= 2 ? 'text-blue-600' : ''}>2. Confirmed</span>
                      <span className={step >= 3 ? 'text-amber-600' : ''}>3. In Kitchen</span>
                      <span className={step >= 4 ? 'text-emerald-600' : ''}>4. Delivered</span>
                    </div>

                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                      <div className={`h-full transition-all duration-500 ${
                        step === 1 ? 'w-1/4 bg-amber-500' :
                        step === 2 ? 'w-2/4 bg-blue-500' :
                        step === 3 ? 'w-3/4 bg-amber-500' :
                        'w-full bg-emerald-500'
                      }`} />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl font-medium border border-red-200">
                    This order is marked as cancelled. Please contact the restaurant if you need further help.
                  </div>
                )}

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px] uppercase">Event / Delivery Date</span>
                    <strong className="text-gray-900 text-sm">{order.eventDate} @ {order.eventTime}</strong>
                  </div>

                  <div>
                    <span className="text-gray-400 block font-bold text-[10px] uppercase">Guest Count / Size</span>
                    <strong className="text-gray-900 text-sm">{order.guestCount || 'N/A'} Guests</strong>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-gray-400 block font-bold text-[10px] uppercase">Dishes / Menu Ordered</span>
                    <p className="text-gray-900 font-bold text-sm mt-0.5">{order.dishes}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-gray-400 block font-bold text-[10px] uppercase">Delivery Address</span>
                    <p className="text-gray-700 font-medium mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-royal-crimson flex-shrink-0" /> {order.address}
                    </p>
                  </div>
                </div>

                {/* Footer assistance */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-500">
                  <span>Questions about your order?</span>
                  <a
                    href="tel:+917418525405"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-royal-crimson text-white font-bold rounded-xl hover:bg-royal-crimson-dark transition shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Kitchen: +91 74185 25405
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
