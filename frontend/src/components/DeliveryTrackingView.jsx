'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft, 
  Search, 
  Phone, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Utensils, 
  Truck, 
  Navigation, 
  ShoppingBag, 
  Flame, 
  Home, 
  PartyPopper, 
  RefreshCw,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { orderApi, authApi } from '../lib/api';

// Dynamic import for RealTimeMap to prevent SSR window reference error
const RealTimeMap = dynamic(() => import('./RealTimeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[#121010] text-amber-300">
      <RefreshCw className="w-8 h-8 animate-spin mb-3 text-royal-gold" />
      <p className="font-extrabold text-sm tracking-wide">Loading Royal Biriyani Satellite Map...</p>
    </div>
  )
});

export default function DeliveryTrackingView({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [driverPosition, setDriverPosition] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(28);

  const restaurantCoords = [11.4428, 77.7126]; // Salem Main Rd, Komarapalayam

  // Check current open/closed status (11:00 AM to 11:00 PM)
  const isRestaurantOpen = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 11 && currentHour < 23;
  }, []);

  // Compute customer coordinates based on selected order
  const customerCoords = useMemo(() => {
    if (!selectedOrder) return [11.4365, 77.7215]; // default nearby location in Komarapalayam

    // Derive deterministic coordinates based on order ID / address for smooth map plotting
    const idSeed = (selectedOrder.orderId || 1001) % 100;
    const latOffset = ((idSeed % 7) - 3) * 0.0035;
    const lngOffset = (((idSeed * 3) % 7) - 3) * 0.0038;

    return [
      restaurantCoords[0] + (latOffset || -0.006),
      restaurantCoords[1] + (lngOffset || 0.007)
    ];
  }, [selectedOrder]);

  // Simulated live driver movement interpolation along route
  useEffect(() => {
    if (!customerCoords) return;

    let progress = 0.2;
    const interval = setInterval(() => {
      progress = (progress + 0.05) % 0.95;
      const curLat = restaurantCoords[0] + (customerCoords[0] - restaurantCoords[0]) * progress;
      const curLng = restaurantCoords[1] + (customerCoords[1] - restaurantCoords[1]) * progress;
      setDriverPosition([curLat, curLng]);
    }, 3000);

    return () => clearInterval(interval);
  }, [customerCoords]);

  // Load initial orders or user session
  useEffect(() => {
    const initTracking = async () => {
      setLoading(true);
      try {
        const storedUser = authApi.getStoredUser();
        const searchTarget = initialQuery || (storedUser ? storedUser.phone : '1001');

        if (searchTarget) {
          setQuery(searchTarget);
          const res = await orderApi.trackOrder(searchTarget);
          if (res && res.data && res.data.length > 0) {
            setOrders(res.data);
            setSelectedOrder(res.data[0]);
          } else {
            // Fallback sample order to showcase live map
            loadSampleOrder();
          }
        } else {
          loadSampleOrder();
        }
      } catch (e) {
        loadSampleOrder();
      } finally {
        setLoading(false);
      }
    };

    initTracking();
  }, [initialQuery]);

  const loadSampleOrder = () => {
    const sample = {
      orderId: 1002,
      customerName: 'Karthick Raja',
      phone: '9876543210',
      orderType: 'single',
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: '13:30',
      dishes: 'Mutton Dum Biriyani (x1), Chicken 65 Fry (x1)',
      totalAmount: 460,
      address: 'JKK Nattraja Nagar, Salem Main Rd, Komarapalayam',
      status: 'confirmed',
      notes: 'Please send extra onion raita'
    };
    setOrders([sample]);
    setSelectedOrder(sample);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await orderApi.trackOrder(query.trim());
      if (res && res.data && res.data.length > 0) {
        setOrders(res.data);
        setSelectedOrder(res.data[0]);
      } else {
        alert(`No active order found for "${query}". Showing restaurant location.`);
      }
    } catch (err) {
      alert('Error querying order status.');
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'completed': return 4;
      case 'cancelled': return 0;
      default: return 2;
    }
  };

  const step = selectedOrder ? getStepProgress(selectedOrder.status) : 2;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#121010] text-white flex flex-col font-sans">
      
      {/* 1. Full-Screen Interactive Leaflet Map */}
      <div className="absolute inset-0 z-0">
        <RealTimeMap
          restaurantLocation={restaurantCoords}
          customerLocation={customerCoords}
          driverLocation={driverPosition}
          order={selectedOrder}
          coverageRadiusMeters={7000}
        />
      </div>

      {/* 2. Top Floating Navigation & Search Bar */}
      <div className="relative z-20 p-3 sm:p-5 max-w-5xl mx-auto w-full pointer-events-auto">
        <div className="bg-[#1A1616]/95 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-2xl p-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Home Link */}
          <div className="flex items-center gap-2.5">
            <Link 
              href="/" 
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#990000] to-[#550000] border border-amber-400 flex items-center justify-center text-amber-300 shadow">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-black text-sm sm:text-base text-white tracking-tight leading-tight">
                  Royal Biriyani <span className="text-amber-400">Live Tracker</span>
                </h1>
                <p className="text-[10px] text-gray-400">Salem Main Rd, Komarapalayam</p>
              </div>
            </div>
          </div>

          {/* Restaurant Working Hours Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs">
            <span className={`w-2 h-2 rounded-full ${isRestaurantOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
            <span className="font-bold text-gray-200">
              {isRestaurantOpen ? 'Kitchen Open' : 'Kitchen Closed'} (11:00 AM - 11:00 PM)
            </span>
          </div>

          {/* Search Order Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-1.5 flex-1 sm:flex-none max-w-xs w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order ID / Phone..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-black/80 text-white rounded-xl border border-amber-500/30 focus:border-amber-400 focus:outline-none placeholder-gray-500"
              />
              <Search className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-2.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 py-2 bg-gradient-to-r from-[#990000] to-[#770000] hover:brightness-110 text-white font-black text-xs rounded-xl shadow border border-amber-500/40 flex items-center gap-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Track'}
            </button>
          </form>

        </div>
      </div>

      {/* 3. Floating Left/Bottom Order Tracking & Live ETA Card */}
      <div className="relative z-20 flex-1 flex flex-col justify-end p-3 sm:p-5 max-w-xl pointer-events-none pb-20 md:pb-6">
        <div className="bg-[#1A1616]/95 backdrop-blur-md rounded-3xl border border-amber-500/40 shadow-2xl p-4 sm:p-5 pointer-events-auto space-y-4">
          
          {/* Header Row of Floating Card */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedOrder ? (selectedOrder.orderType === 'bulk' ? 'Bulk Catering' : 'Single Delivery') : 'Active Delivery'}
                </span>
                <span className="text-xs font-black text-white">
                  Order #{selectedOrder?.orderId || '1002'}
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-gray-200 mt-1">
                {selectedOrder?.customerName || 'Customer Delivery'}
              </h3>
            </div>

            {/* Estimated Delivery Time Countdown */}
            <div className="text-right bg-gradient-to-br from-amber-500/10 to-yellow-500/5 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Estimated Arrival</span>
              <div className="flex items-center gap-1 font-black text-base text-amber-300">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{etaMinutes} - {etaMinutes + 10} Mins</span>
              </div>
            </div>
          </div>

          {/* Real-Time Delivery Progress Stepper */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-gray-300">
              <span className={step >= 1 ? 'text-amber-400' : 'text-gray-500'}>1. Received</span>
              <span className={step >= 2 ? 'text-amber-400' : 'text-gray-500'}>2. Dum Kitchen</span>
              <span className={step >= 3 ? 'text-amber-400' : 'text-gray-500'}>3. On the Way</span>
              <span className={step >= 4 ? 'text-emerald-400' : 'text-gray-500'}>4. Delivered</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-lg"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Delivery Rider & Vehicle Card */}
          <div className="bg-black/40 rounded-2xl p-3 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-xs text-white">Rider: Muthu</p>
                <p className="text-[10px] text-gray-400">Hero Splendor (TN-34-BK-4050)</p>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live on Map
                </span>
              </div>
            </div>

            <a
              href="tel:+917418525405"
              className="px-3 py-2 bg-[#990000] hover:bg-[#770000] text-white text-xs font-black rounded-xl shadow transition flex items-center gap-1 active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" /> Call Rider
            </a>
          </div>

          {/* Ordered Dishes & Address Details */}
          <div className="text-xs space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="flex items-start gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 font-medium">
                <strong>Dishes:</strong> {selectedOrder?.dishes || 'Mutton Biriyani, Fast Food'}
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-royal-crimson flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 font-medium">
                <strong>Address:</strong> {selectedOrder?.address || 'Salem Main Rd, Komarapalayam'}
              </span>
            </div>
          </div>

          {/* Action Bar: WhatsApp, Call, Order Online, and Past Orders Toggle */}
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="tel:+917418525405"
              className="flex-1 min-w-[120px] py-2.5 bg-[#990000] hover:bg-[#770000] text-white text-xs font-black rounded-xl shadow flex items-center justify-center gap-1.5 transition active:scale-95 border border-amber-500/30"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" /> +91 74185 25405
            </a>

            <a
              href="https://wa.me/916384945599?text=Hello%20Royal%20Biriyani%20Support%2C%20I%20am%20tracking%20my%20order!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black rounded-xl shadow flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
            </a>

            <Link
              href="/#menu"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black text-xs font-black rounded-xl shadow flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Utensils className="w-3.5 h-3.5 text-black" /> Order More Food Online
            </Link>
          </div>

          {/* Past Orders History Drawer Button */}
          {orders.length > 1 && (
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className="w-full text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center justify-between"
              >
                <span>View Past Orders History ({orders.length} found)</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isHistoryOpen ? 'rotate-90' : ''}`} />
              </button>

              {isHistoryOpen && (
                <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {orders.map(o => (
                    <button
                      key={o.orderId || o._id}
                      onClick={() => {
                        setSelectedOrder(o);
                        setIsHistoryOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition ${
                        selectedOrder?.orderId === o.orderId 
                          ? 'bg-amber-500/20 border border-amber-400 text-amber-300' 
                          : 'bg-black/50 text-gray-300 hover:bg-black/80'
                      }`}
                    >
                      <div>
                        <strong className="block text-white">#{o.orderId}</strong>
                        <span className="text-[10px] text-gray-400">{o.dishes}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10">
                        {o.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 4. Bottom Navigation Bar matching Royal Biriyani */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#1A1616]/95 backdrop-blur-lg border-t border-amber-500/30 py-2 px-3 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto text-[10px] font-bold">
          
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-amber-300 transition py-1 px-2"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <Link
            href="/#menu"
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-amber-300 transition py-1 px-2"
          >
            <Utensils className="w-5 h-5" />
            <span>Menu</span>
          </Link>

          <Link
            href="/#bulk"
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-amber-300 transition py-1 px-2"
          >
            <PartyPopper className="w-5 h-5" />
            <span>Bulk Feast</span>
          </Link>

          <Link
            href="/track"
            className="flex flex-col items-center gap-1 text-amber-400 transition py-1 px-2 font-black"
          >
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Track</span>
          </Link>

          <Link
            href="/#contact"
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-amber-300 transition py-1 px-2"
          >
            <MapPin className="w-5 h-5" />
            <span>Contact</span>
          </Link>

        </div>
      </nav>

    </div>
  );
}
