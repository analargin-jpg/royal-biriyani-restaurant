'use client';

import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle, AlertCircle, ChefHat, Truck, ArrowRight } from 'lucide-react';
import { orderApi } from '../lib/api';

export default function OrderTrackingModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-extrabold text-royal-crimson flex items-center gap-2">
              🔍 Live Order Tracking
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter your Order ID (e.g. 1001) or 10-digit Mobile Number
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="mt-5 flex gap-2">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order ID or Phone Number..."
            className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-royal-crimson text-white font-bold text-sm rounded-xl hover:bg-royal-crimson-dark transition shadow flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? 'Searching...' : <><Search className="w-4 h-4" /> Track</>}
          </button>
        </form>

        {/* Results display */}
        <div className="mt-6 max-h-96 overflow-y-auto space-y-4">
          {searched && orders.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="font-bold text-gray-600">No orders found for "{query}"</p>
              <p className="text-xs mt-1">Please double-check your Order ID or phone number.</p>
            </div>
          )}

          {orders.map((order) => {
            const step = getStatusStep(order.status);

            return (
              <div
                key={order._id || order.orderId}
                className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4"
              >
                {/* Top Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase">Order</span>
                    <h4 className="text-lg font-black text-royal-crimson">
                      #{order.orderId || '1001'}
                    </h4>
                    <p className="text-xs text-gray-600 font-semibold">{order.customerName}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
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

                {/* Status Timeline */}
                {order.status !== 'cancelled' ? (
                  <div className="py-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1.5">
                      <span className={step >= 1 ? 'text-royal-crimson' : ''}>1. Received</span>
                      <span className={step >= 2 ? 'text-blue-600' : ''}>2. Confirmed</span>
                      <span className={step >= 3 ? 'text-amber-600' : ''}>3. In Kitchen</span>
                      <span className={step >= 4 ? 'text-emerald-600' : ''}>4. Delivered</span>
                    </div>

                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                      <div className={`h-full transition-all duration-500 ${
                        step === 1 ? 'w-1/4 bg-amber-500' :
                        step === 2 ? 'w-2/4 bg-blue-500' :
                        step === 3 ? 'w-3/4 bg-amber-500' :
                        'w-full bg-emerald-500'
                      }`} />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-200">
                    This order has been cancelled. Contact restaurant at +91 74185 25405 for assistance.
                  </div>
                )}

                {/* Details breakdown */}
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                  <div>
                    <span className="text-gray-400 block">Date &amp; Time</span>
                    <strong>{order.eventDate} @ {order.eventTime}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Order Type</span>
                    <strong className="capitalize">{order.orderType?.replace('_', ' ') || 'Bulk'}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block">Dishes / Menu</span>
                    <strong className="text-gray-900">{order.dishes}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block">Location</span>
                    <span>📍 {order.address}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
