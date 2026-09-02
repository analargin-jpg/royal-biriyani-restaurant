'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, LogOut, Package, CheckCircle2, Clock, Sparkles, Edit2, Save } from 'lucide-react';
import { authApi, orderApi } from '../lib/api';

export default function UserProfileModal({ isOpen, onClose, user, onUpdateUser, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'orders'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || ''
      });
    }
  }, [user]);

  // Load user orders when opening orders tab
  useEffect(() => {
    if (isOpen && user?.phone) {
      const fetchUserOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await orderApi.trackOrder(user.phone);
          if (res && res.data) {
            setOrders(res.data);
          }
        } catch (err) {
          console.warn('Could not load user orders:', err.message);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchUserOrders();
    }
  }, [isOpen, user?.phone]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.updateUserProfile(formData);
      if (onUpdateUser && res.user) {
        onUpdateUser(res.user);
      }
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200 z-10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-royal-crimson via-royal-crimson-dark to-royal-crimson p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-royal-gold text-royal-charcoal flex items-center justify-center text-2xl font-black shadow-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black">{user.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-royal-gold text-[10px] font-bold border border-royal-gold/30">
                  Customer Club
                </span>
              </div>
              <p className="text-xs text-amber-200 mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {user.phone}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-5 border border-white/10">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'profile' ? 'bg-white text-royal-crimson shadow' : 'text-white/80 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" /> My Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'orders' ? 'bg-white text-royal-crimson shadow' : 'text-white/80 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Order History ({orders.length})
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {saveSuccess && (
            <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile updated successfully!
            </div>
          )}

          {activeTab === 'profile' ? (
            <div className="space-y-4">
              {!isEditing ? (
                <div className="space-y-3 text-xs">
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 font-bold uppercase text-[10px] block">Full Name</span>
                      <strong className="text-gray-900 text-sm">{user.name}</strong>
                    </div>
                    <User className="w-4 h-4 text-royal-crimson" />
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 font-bold uppercase text-[10px] block">Mobile Number</span>
                      <strong className="text-gray-900 text-sm">{user.phone}</strong>
                    </div>
                    <Phone className="w-4 h-4 text-royal-crimson" />
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 font-bold uppercase text-[10px] block">Email</span>
                      <span className="text-gray-800 font-medium">{user.email || 'Not provided'}</span>
                    </div>
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-500 font-bold uppercase text-[10px]">Saved Delivery Address</span>
                      <MapPin className="w-3.5 h-3.5 text-royal-crimson" />
                    </div>
                    <p className="text-gray-800 font-medium">
                      {user.address || 'No default address saved. Click edit to add for fast 1-click checkout.'}
                    </p>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Profile &amp; Address
                    </button>
                    <button
                      onClick={() => { onLogout(); onClose(); }}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Default Delivery Address</label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street, Landmark, Komarapalayam"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-royal-crimson text-white font-bold rounded-xl hover:bg-royal-crimson-dark transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Orders Tab */
            <div className="space-y-3">
              {loadingOrders ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  Loading your orders...
                </div>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <div key={ord._id || ord.orderId} className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Order ID</span>
                        <h4 className="font-extrabold text-sm text-gray-900">#{ord.orderId}</h4>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        ord.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        ● {ord.status || 'Pending'}
                      </span>
                    </div>

                    <div className="text-gray-700">
                      <strong>Dishes:</strong> {ord.dishes}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                      <span>{ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent'}</span>
                      <span className="font-extrabold text-royal-crimson text-xs">
                        {ord.totalAmount ? `₹${ord.totalAmount}` : 'Bulk Catering'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-400 text-xs">
                  <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="font-bold text-gray-600">No orders found</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Your placed orders will show up here.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
