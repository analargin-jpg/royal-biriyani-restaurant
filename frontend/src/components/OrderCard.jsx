'use client';

import React, { useState } from 'react';
import { Phone, Calendar, Clock, Users, MapPin, MessageCircle, Send, Trash2, Edit, AlertCircle, Utensils } from 'lucide-react';

export default function OrderCard({ order, onStatusChange, onDelete, adminPhone = '6384945599' }) {
  const [updating, setUpdating] = useState(false);

  const handleStatusSelect = async (newStatus) => {
    try {
      setUpdating(true);
      await onStatusChange(order._id || order.orderId, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendToCustomer = () => {
    const message = `🎉 *Order Confirmation from Royal Biriyani*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ *Order ID:* #${order.orderId || order._id}\n` +
      `👤 *Name:* ${order.customerName}\n` +
      `📅 *Event Date:* ${order.eventDate}\n` +
      `🕐 *Time:* ${order.eventTime}\n` +
      (order.guestCount && order.guestCount !== 'N/A' ? `👥 *Guests:* ${order.guestCount} Guests\n` : '') +
      `🍽️ *Menu:* ${order.dishes}\n` +
      `📍 *Location:* ${order.address}\n` +
      (order.totalAmount ? `💰 *Total Amount:* ₹${order.totalAmount}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `We have confirmed your order and started preparations! For any adjustments, call +91 74185 25405.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${order.phone}?text=${encoded}`, '_blank');
  };

  const handleNotifyAdmin = () => {
    const message = `📋 *KITCHEN DISPATCH & ADMIN ALERT*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🆔 *Order ID:* #${order.orderId || order._id}\n` +
      `👤 *Customer:* ${order.customerName}\n` +
      `📱 *Phone:* ${order.phone}\n` +
      `📅 *Date:* ${order.eventDate}\n` +
      `🕐 *Time:* ${order.eventTime}\n` +
      (order.guestCount && order.guestCount !== 'N/A' ? `👥 *Guests:* ${order.guestCount} Guests\n` : '') +
      `🍽️ *Menu / Dishes:* ${order.dishes}\n` +
      `📍 *Address:* ${order.address}\n` +
      (order.notes ? `📝 *Notes:* ${order.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Please check kitchen stock and confirm delivery schedule.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${adminPhone}?text=${encoded}`, '_blank');
  };

  const statusBorderColor =
    order.status === 'completed' ? 'border-emerald-500' :
    order.status === 'confirmed' ? 'border-blue-500' :
    order.status === 'cancelled' ? 'border-red-500' :
    'border-amber-500';

  return (
    <div className={`bg-white rounded-2xl p-5 border-l-4 ${statusBorderColor} shadow-sm hover:shadow-md transition duration-200 border-t border-r border-b border-gray-200`}>
      
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg text-royal-crimson">
            #{order.orderId || '1001'}
          </span>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            {order.orderType?.replace('_', ' ') || 'Bulk'}
          </span>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-500">Status:</label>
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => handleStatusSelect(e.target.value)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-royal-crimson ${
              order.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
              order.status === 'confirmed' ? 'bg-blue-50 text-blue-800 border-blue-300' :
              order.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-300' :
              'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => onDelete(order._id || order.orderId)}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
            title="Delete Order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4 text-xs">
        <div>
          <span className="text-gray-400 uppercase font-bold block text-[10px]">Customer</span>
          <p className="font-extrabold text-gray-900 text-sm">{order.customerName}</p>
        </div>

        <div>
          <span className="text-gray-400 uppercase font-bold block text-[10px]">Phone</span>
          <a href={`tel:${order.phone}`} className="font-bold text-royal-crimson hover:underline flex items-center gap-1">
            <Phone className="w-3 h-3" /> {order.phone}
          </a>
        </div>

        <div>
          <span className="text-gray-400 uppercase font-bold block text-[10px]">Event Date &amp; Time</span>
          <p className="font-bold text-gray-800 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-500" /> {order.eventDate} @ {order.eventTime}
          </p>
        </div>

        <div>
          <span className="text-gray-400 uppercase font-bold block text-[10px]">Guest Count</span>
          <p className="font-bold text-gray-800 flex items-center gap-1">
            <Users className="w-3 h-3 text-gray-500" /> {order.guestCount} Guests
          </p>
        </div>

        {/* Menu/Dishes */}
        <div className="sm:col-span-2 lg:col-span-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <span className="text-gray-400 uppercase font-bold block text-[10px] mb-0.5 flex items-center gap-1">
            <Utensils className="w-3 h-3" /> Menu / Ordered Items
          </span>
          <p className="font-bold text-gray-900 text-xs sm:text-sm">{order.dishes}</p>
          {order.notes && (
            <p className="text-[11px] text-amber-800 mt-1 italic">
              <strong>Special Instructions:</strong> {order.notes}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2 lg:col-span-4">
          <span className="text-gray-400 uppercase font-bold block text-[10px]">Delivery / Venue Address</span>
          <p className="font-semibold text-gray-700 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-royal-crimson flex-shrink-0" /> {order.address}
          </p>
        </div>
      </div>

      {/* Timestamp & Quick Action Buttons */}
      <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[11px] text-gray-400">
          📅 Received: {new Date(order.createdAt || Date.now()).toLocaleString()}
        </span>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Send WhatsApp to Customer */}
          <button
            onClick={handleSendToCustomer}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" /> Send to Customer
          </button>

          {/* Notify Admin / Kitchen */}
          <button
            onClick={handleNotifyAdmin}
            className="flex-1 sm:flex-none px-4 py-2 bg-royal-crimson hover:bg-royal-crimson-dark text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Notify Admin ({adminPhone})
          </button>
        </div>
      </div>

    </div>
  );
}
