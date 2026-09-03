'use client';

import React, { useState, useEffect } from 'react';
import StatCards from './StatCards';
import OrderCard from './OrderCard';
import MenuManager from './MenuManager';
import { Plus, RefreshCw, Search, Download, LogOut, Utensils, ShoppingBag, Phone, ShieldCheck, X, Truck, PartyPopper, Filter } from 'lucide-react';
import { orderApi } from '../lib/api';

export default function AdminDashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'menu'
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all'); // 'all', 'single', 'bulk'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  // Manual new order state
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    phone: '',
    eventDate: new Date().toISOString().split('T')[0],
    eventTime: '13:00',
    guestCount: '1 (Single Order)',
    dishes: '',
    totalAmount: 0,
    address: '',
    orderType: 'single',
    notes: ''
  });

  const adminPhone = admin?.phone || '6384945599';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        orderApi.getOrders({ status: statusFilter, search: searchQuery, orderType: orderTypeFilter }),
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
  }, [statusFilter, orderTypeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await orderApi.updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => (o._id === id || o.orderId === id) ? { ...o, status: newStatus } : o));
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
          eventTime: '13:00',
          guestCount: '1 (Single Order)',
          dishes: '',
          totalAmount: 0,
          address: '',
          orderType: 'single',
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
    const headers = ['Order ID', 'Type', 'Customer Name', 'Phone', 'Date', 'Time', 'Guests/Amount', 'Dishes', 'Address', 'Status', 'Received Date'];
    const rows = orders.map(o => [
      o.orderId || o._id,
      o.orderType || 'single',
      `"${o.customerName}"`,
      o.phone,
      o.eventDate,
      o.eventTime,
      o.orderType === 'bulk' ? `"${o.guestCount} Guests"` : `"₹${o.totalAmount || 0}"`,
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

  // Filtered orders based on current type tab
  const displayedOrders = orders.filter(o => {
    if (orderTypeFilter === 'bulk') return o.orderType === 'bulk';
    if (orderTypeFilter === 'single') return o.orderType !== 'bulk';
    return true;
  });

  const singleCount = orders.filter(o => o.orderType !== 'bulk').length;
  const bulkCount = orders.filter(o => o.orderType === 'bulk').length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      
      {/* Top Navbar */}
      <header className="bg-royal-charcoal text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-royal-crimson flex items-center justify-center text-royal-gold shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg sm:text-xl text-white leading-tight">
                  Royal Biriyani Admin Dashboard
                </h1>
                <span className="text-[10px] font-black uppercase bg-royal-crimson text-white px-2 py-0.5 rounded-full">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Manage Single Delivery Orders, Bulk Feast Catering &amp; Kitchen Inventory
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-royal-crimson text-white shadow-md'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Live Orders
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'bg-royal-gold text-royal-charcoal shadow-md'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Utensils className="w-4 h-4" /> Menu Catalog
            </button>

            <button
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-2 bg-red-950/60 hover:bg-red-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-white/20"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Stat Cards */}
            <StatCards stats={stats} orders={orders} />

            {/* Order Category Filter Tabs: All vs Single vs Bulk */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-royal-crimson" /> Category:
                </span>
                
                <button
                  onClick={() => setOrderTypeFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                    orderTypeFilter === 'all'
                      ? 'bg-royal-crimson text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Orders ({orders.length})
                </button>

                <button
                  onClick={() => setOrderTypeFilter('single')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                    orderTypeFilter === 'single'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" /> Single Orders ({singleCount})
                </button>

                <button
                  onClick={() => setOrderTypeFilter('bulk')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                    orderTypeFilter === 'bulk'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <PartyPopper className="w-3.5 h-3.5" /> Bulk Catering ({bulkCount})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddOrderOpen(true)}
                  className="px-3.5 py-1.5 bg-royal-crimson hover:bg-royal-crimson-dark text-white rounded-xl text-xs font-black transition flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Order
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  title="Export to CSV"
                >
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
            </div>

            {/* Status Filters & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition ${
                      statusFilter === st
                        ? 'bg-royal-crimson text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {st} {st === 'all' && `(${stats.total ?? orders.length})`}
                  </button>
                ))}
              </div>

              {/* Search + Refresh */}
              <div className="flex items-center gap-2">
                <form onSubmit={handleSearchSubmit} className="flex gap-1.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, phone, ID..."
                      className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none w-44 sm:w-56"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-gray-800 hover:bg-black text-white rounded-xl text-xs font-bold transition"
                  >
                    Search
                  </button>
                </form>

                <button
                  onClick={fetchData}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                  title="Refresh Orders"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {displayedOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-400 space-y-2">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-black text-gray-700">No Orders Found</h3>
                  <p className="text-xs max-w-sm mx-auto">
                    There are no orders matching status <strong>"{statusFilter}"</strong> or category <strong>"{orderTypeFilter}"</strong>.
                  </p>
                </div>
              ) : (
                displayedOrders.map((order) => (
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
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Order Type</label>
                    <select
                      value={newOrder.orderType}
                      onChange={(e) => setNewOrder({ 
                        ...newOrder, 
                        orderType: e.target.value,
                        guestCount: e.target.value === 'bulk' ? '100' : '1 (Single Order)'
                      })}
                      className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    >
                      <option value="single">Single / Delivery</option>
                      <option value="takeaway">Takeaway / Pickup</option>
                      <option value="bulk">Bulk Catering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newOrder.eventDate}
                      onChange={(e) => setNewOrder({ ...newOrder, eventDate: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {newOrder.orderType === 'bulk' ? 'Guests Count' : 'Total Amount (₹)'}
                    </label>
                    {newOrder.orderType === 'bulk' ? (
                      <input
                        type="text"
                        value={newOrder.guestCount}
                        onChange={(e) => setNewOrder({ ...newOrder, guestCount: e.target.value })}
                        placeholder="e.g. 100"
                        className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                      />
                    ) : (
                      <input
                        type="number"
                        value={newOrder.totalAmount}
                        onChange={(e) => setNewOrder({ ...newOrder, totalAmount: Number(e.target.value) })}
                        placeholder="e.g. 240"
                        className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Dishes / Order Items *</label>
                  <input
                    type="text"
                    required
                    value={newOrder.dishes}
                    onChange={(e) => setNewOrder({ ...newOrder, dishes: e.target.value })}
                    placeholder="e.g. Chicken Biriyani (x2), Chicken Fry (x1)"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Delivery / Venue Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={newOrder.address}
                    onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
                    placeholder="e.g. Salem Main Road, Komarapalayam"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Special Notes</label>
                  <input
                    type="text"
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                    placeholder="Optional notes or instructions"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOrderOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-royal-crimson hover:bg-royal-crimson-dark text-white rounded-xl text-xs font-black shadow"
                  >
                    Save &amp; Create Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
