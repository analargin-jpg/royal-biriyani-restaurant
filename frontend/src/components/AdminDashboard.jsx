'use client';

import React, { useState, useEffect } from 'react';
import StatCards from './StatCards';
import OrderCard from './OrderCard';
import MenuManager from './MenuManager';
import { Plus, RefreshCw, Search, Download, LogOut, Utensils, ShoppingBag, Phone, ShieldCheck, X } from 'lucide-react';
import { orderApi } from '../lib/api';

export default function AdminDashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'menu'
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  // Manual new order state
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    phone: '',
    eventDate: new Date().toISOString().split('T')[0],
    eventTime: '18:00',
    guestCount: '100',
    dishes: '',
    address: '',
    orderType: 'bulk',
    notes: ''
  });

  const adminPhone = admin?.phone || '6384945599';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        orderApi.getOrders({ status: statusFilter, search: searchQuery }),
        orderApi.getStats()
      ]);

      if (ordersRes && ordersRes.data) {
        setOrders(ordersRes.data);
      }
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.warn('Orders load note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await orderApi.updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => (o._id === id || o.orderId === id) ? { ...o, status: newStatus } : o));
      // Refresh stats
      const statsRes = await orderApi.getStats();
      if (statsRes && statsRes.data) setStats(statsRes.data);
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await orderApi.deleteOrder(id);
      setOrders(prev => prev.filter(o => o._id !== id && o.orderId !== id));
      const statsRes = await orderApi.getStats();
      if (statsRes && statsRes.data) setStats(statsRes.data);
    } catch (err) {
      alert('Error deleting order: ' + err.message);
    }
  };

  const handleCreateManualOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await orderApi.createOrder(newOrder);
      if (res && res.data) {
        setOrders(prev => [res.data, ...prev]);
        setIsAddOrderOpen(false);
        setNewOrder({
          customerName: '',
          phone: '',
          eventDate: new Date().toISOString().split('T')[0],
          eventTime: '18:00',
          guestCount: '100',
          dishes: '',
          address: '',
          orderType: 'bulk',
          notes: ''
        });
        const statsRes = await orderApi.getStats();
        if (statsRes && statsRes.data) setStats(statsRes.data);
      }
    } catch (err) {
      alert('Error adding order: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return alert('No orders to export.');
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Event Date', 'Event Time', 'Guest Count', 'Dishes', 'Address', 'Status', 'Received Date'];
    const rows = orders.map(o => [
      o.orderId || o._id,
      `"${o.customerName}"`,
      o.phone,
      o.eventDate,
      o.eventTime,
      o.guestCount,
      `"${o.dishes?.replace(/"/g, '""')}"`,
      `"${o.address?.replace(/"/g, '""')}"`,
      o.status,
      o.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `royal_biriyani_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-royal-crimson via-royal-crimson-dark to-royal-crimson text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-royal-gold text-royal-charcoal flex items-center justify-center text-xl font-bold shadow">
                🍛
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Royal Biriyani Admin Dashboard
              </h1>
            </div>
            <p className="text-amber-200 text-xs sm:text-sm font-medium">
              Manage Bulk Catering Requests, Online Food Orders &amp; Live Restaurant Dispatch
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/30 border border-white/15 text-xs text-yellow-100 font-semibold">
              <Phone className="w-3.5 h-3.5 text-royal-gold" />
              Admin WhatsApp: <strong className="text-white">{adminPhone}</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-royal-gold text-royal-charcoal shadow-md scale-105'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Orders Management
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'bg-royal-gold text-royal-charcoal shadow-md scale-105'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Utensils className="w-4 h-4" /> Menu Catalog
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2.5 bg-red-950/60 hover:bg-red-950 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
              title="Logout from Admin"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <StatCards stats={stats} orders={orders} />

            {/* Actions Bar */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold capitalize transition ${
                      statusFilter === st
                        ? 'bg-royal-crimson text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {st} {st === 'all' && `(${stats.total ?? orders.length})`}
                  </button>
                ))}
              </div>

              {/* Search + Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, phone, ID..."
                      className="pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none w-48 sm:w-56"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-black transition"
                  >
                    Filter
                  </button>
                </form>

                <button
                  onClick={fetchData}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                  title="Refresh Orders"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                  title="Export to CSV"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>

                <button
                  onClick={() => setIsAddOrderOpen(true)}
                  className="px-4 py-2 bg-royal-crimson hover:bg-royal-crimson-dark text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1 shadow"
                >
                  <Plus className="w-4 h-4" /> Add Order
                </button>
              </div>

            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-400 space-y-2">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-bold text-gray-700">No Orders Found</h3>
                  <p className="text-xs max-w-sm mx-auto">
                    There are no orders matching the status <strong>"{statusFilter}"</strong> or current search criteria.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <OrderCard
                    key={order._id || order.orderId}
                    order={order}
                    adminPhone={adminPhone}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteOrder}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Menu Catalog Management */}
        {activeTab === 'menu' && (
          <MenuManager />
        )}

        {/* Manual Add Order Modal */}
        {isAddOrderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-royal-crimson flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Add New Order Manually
                </h3>
                <button
                  onClick={() => setIsAddOrderOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateManualOrder} className="mt-5 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                      placeholder="e.g. Anand"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newOrder.phone}
                      onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Event Date</label>
                    <input
                      type="date"
                      required
                      value={newOrder.eventDate}
                      onChange={(e) => setNewOrder({ ...newOrder, eventDate: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Event Time</label>
                    <input
                      type="time"
                      required
                      value={newOrder.eventTime}
                      onChange={(e) => setNewOrder({ ...newOrder, eventTime: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Guest Count</label>
                    <select
                      value={newOrder.guestCount}
                      onChange={(e) => setNewOrder({ ...newOrder, guestCount: e.target.value })}
                      className="w-full px-2 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none bg-white"
                    >
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="250">250</option>
                      <option value="500+">500+</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Dishes / Menu *</label>
                  <input
                    type="text"
                    required
                    value={newOrder.dishes}
                    onChange={(e) => setNewOrder({ ...newOrder, dishes: e.target.value })}
                    placeholder="e.g. Mutton Biriyani, Chicken Fry, Gravy, Sweet"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    value={newOrder.address}
                    onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
                    placeholder="Street, Landmark, Komarapalayam"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOrderOpen(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-royal-crimson text-white font-bold text-xs rounded-xl hover:bg-royal-crimson-dark transition shadow"
                  >
                    Create &amp; Save Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
