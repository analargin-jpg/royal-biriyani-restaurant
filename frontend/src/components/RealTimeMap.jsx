'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function RealTimeMap({
  restaurantLocation = [11.4428, 77.7126], // Salem Main Rd, Komarapalayam
  customerLocation = null, // e.g. [11.4365, 77.7215]
  driverLocation = null, // live moving driver position
  restaurantInfo = {},
  order = null,
  coverageRadiusMeters = 7000, // 7km coverage area
  onMarkerClick = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const routeLineRef = useRef(null);
  const circleRef = useRef(null);

  // 1. Initialize Map on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up if already initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create Leaflet Map with center at Komarapalayam
    const map = L.map(mapContainerRef.current, {
      center: restaurantLocation,
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    // Add Zoom Control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 100% Free OpenStreetMap Tile Layer - Absolutely NO API key required
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      className: 'dark-tiles',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Render / Update Restaurant Marker & Coverage Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old restaurant marker & circle
    if (markersRef.current.restaurant) {
      map.removeLayer(markersRef.current.restaurant);
    }
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }

    // Delivery Coverage Circle (Komarapalayam 7km radius)
    const circle = L.circle(restaurantLocation, {
      radius: coverageRadiusMeters,
      color: '#D4AF37',
      weight: 1.5,
      dashArray: '6, 8',
      fillColor: '#8B0000',
      fillOpacity: 0.08
    }).addTo(map);

    circle.bindTooltip('Komarapalayam Fast Delivery Zone (7 km)', {
      permanent: false,
      direction: 'top',
      className: 'bg-black text-amber-300 text-xs px-2 py-1 rounded border border-amber-500/40'
    });
    circleRef.current = circle;

    // Custom Royal Restaurant Marker Icon
    const restaurantHtml = `
      <div class="relative w-12 h-12 flex items-center justify-center cursor-pointer group">
        <div class="pulse-ring-gold"></div>
        <div class="pulse-ring-crimson"></div>
        <div class="relative z-10 w-10 h-10 rounded-2xl bg-gradient-to-br from-[#990000] to-[#550000] border-2 border-[#D4AF37] flex items-center justify-center shadow-2xl text-amber-300">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div class="absolute -bottom-6 whitespace-nowrap bg-black/90 text-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-amber-400/40 shadow-lg">
          Royal Biriyani
        </div>
      </div>
    `;

    const restaurantIcon = L.divIcon({
      html: restaurantHtml,
      className: 'custom-restaurant-pin',
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    const restaurantMarker = L.marker(restaurantLocation, { icon: restaurantIcon }).addTo(map);

    const popupContent = `
      <div class="p-4 w-64 text-left">
        <div class="flex items-center gap-2 mb-2 pb-2 border-b border-amber-500/30">
          <div class="w-8 h-8 rounded-xl bg-red-900 border border-amber-400 flex items-center justify-center text-amber-300 font-black text-sm">
            RB
          </div>
          <div>
            <h4 class="font-black text-sm text-amber-300 leading-tight">Royal Biriyani &amp; Fast Food</h4>
            <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Open 11:00 AM - 11:00 PM
            </span>
          </div>
        </div>
        <p class="text-[11px] text-gray-300 leading-relaxed mb-3">
          Salem Main Rd, Near TMMB Bank, JKK Nattraja Nagar, Komarapalayam, Tamil Nadu 638183
        </p>
        <div class="flex gap-2">
          <a href="tel:+917418525405" class="flex-1 py-1.5 bg-[#990000] hover:bg-[#770000] text-white text-[10px] font-bold rounded-lg text-center shadow transition flex items-center justify-center gap-1">
            📞 Call Kitchen
          </a>
          <a href="https://wa.me/916384945599" target="_blank" class="flex-1 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-bold rounded-lg text-center shadow transition flex items-center justify-center gap-1">
            💬 WhatsApp
          </a>
        </div>
      </div>
    `;

    restaurantMarker.bindPopup(popupContent);
    markersRef.current.restaurant = restaurantMarker;
  }, [restaurantLocation, coverageRadiusMeters]);

  // 3. Render / Update Customer Destination Marker, Route Line & Live Driver
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up old customer marker, driver marker & route
    if (markersRef.current.customer) {
      map.removeLayer(markersRef.current.customer);
      markersRef.current.customer = null;
    }
    if (markersRef.current.driver) {
      map.removeLayer(markersRef.current.driver);
      markersRef.current.driver = null;
    }
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    if (!customerLocation) {
      // If no order selected, center on restaurant
      map.setView(restaurantLocation, 14);
      return;
    }

    // Customer Pin HTML
    const customerHtml = `
      <div class="relative w-10 h-10 flex items-center justify-center cursor-pointer">
        <div class="pulse-ring-gold"></div>
        <div class="relative z-10 w-9 h-9 rounded-2xl bg-emerald-600 border-2 border-white flex items-center justify-center shadow-2xl text-white">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
        <div class="absolute -bottom-6 whitespace-nowrap bg-black/90 text-emerald-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-lg">
          Delivery Address
        </div>
      </div>
    `;

    const customerIcon = L.divIcon({
      html: customerHtml,
      className: 'custom-customer-pin',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const customerMarker = L.marker(customerLocation, { icon: customerIcon }).addTo(map);
    customerMarker.bindPopup(`
      <div class="p-3 w-56 text-left">
        <span class="text-[10px] font-black uppercase text-emerald-400 block mb-0.5">Delivery Destination</span>
        <h5 class="font-bold text-xs text-white mb-1">${order?.customerName || 'Customer Destination'}</h5>
        <p class="text-[10px] text-gray-300 mb-2">${order?.address || 'Komarapalayam, Tamil Nadu'}</p>
        <span class="inline-block px-2 py-0.5 bg-emerald-900/60 border border-emerald-400/40 text-emerald-300 rounded text-[9px] font-bold">
          Status: ${order?.status || 'Active Order'}
        </span>
      </div>
    `);
    markersRef.current.customer = customerMarker;

    // Generate Route points between Restaurant and Customer
    // (create realistic waypoints between restaurant and customer address)
    const midLat = (restaurantLocation[0] + customerLocation[0]) / 2 + 0.0015;
    const midLng = (restaurantLocation[1] + customerLocation[1]) / 2 + 0.001;
    const routeCoords = [
      restaurantLocation,
      [restaurantLocation[0] * 0.7 + midLat * 0.3, restaurantLocation[1] * 0.7 + midLng * 0.3],
      [midLat, midLng],
      [midLat * 0.3 + customerLocation[0] * 0.7, midLng * 0.3 + customerLocation[1] * 0.7],
      customerLocation
    ];

    // Animated dashed route polyline in Royal Gold
    const routeLine = L.polyline(routeCoords, {
      color: '#D4AF37',
      weight: 4,
      opacity: 0.9,
      className: 'animated-route-line'
    }).addTo(map);
    routeLineRef.current = routeLine;

    // Fit map bounds to contain restaurant and delivery destination
    const bounds = L.latLngBounds([restaurantLocation, customerLocation]);
    map.fitBounds(bounds, { padding: [80, 80] });

    // Live Driver Marker (if order status is not completed/cancelled)
    if (order?.status !== 'completed' && order?.status !== 'cancelled') {
      const activeDriverLoc = driverLocation || [midLat, midLng];

      const driverHtml = `
        <div class="relative w-11 h-11 flex items-center justify-center cursor-pointer">
          <div class="w-full h-full rounded-full bg-amber-400/30 animate-ping absolute"></div>
          <div class="relative z-10 w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 border-2 border-black flex items-center justify-center shadow-2xl text-black">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h1c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h1c1.1 0 2-.9 2-2v-5l-3-4zm-9 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
            </svg>
          </div>
          <div class="absolute -bottom-6 whitespace-nowrap bg-black/95 text-amber-300 font-black text-[9px] px-2 py-0.5 rounded-full border border-amber-400/50 shadow-lg">
            Delivery Rider
          </div>
        </div>
      `;

      const driverIcon = L.divIcon({
        html: driverHtml,
        className: 'custom-driver-pin',
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const driverMarker = L.marker(activeDriverLoc, { icon: driverIcon }).addTo(map);
      driverMarker.bindPopup(`
        <div class="p-3 w-52 text-left">
          <span class="text-[10px] font-black uppercase text-amber-400 block mb-0.5">Live Delivery Partner</span>
          <h5 class="font-extrabold text-xs text-white">Rider: Muthu</h5>
          <p class="text-[10px] text-gray-300 mb-2">Hero Splendor (TN-34-BK-4050)</p>
          <div class="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> On the way to your doorstep
          </div>
        </div>
      `);
      markersRef.current.driver = driverMarker;
    }
  }, [customerLocation, driverLocation, restaurantLocation, order]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}
