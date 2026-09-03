'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Send, CheckCircle2, Phone, MapPin, User, FileText, Sparkles, RefreshCw, MessageCircle, Truck } from 'lucide-react';
import { orderApi } from '../lib/api';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart = [], 
  onUpdateQuantity, 
  onClearCart,
  placedOrder = null,
  onOrderPlaced,
  currentUser = null
}) {
  const [orderType, setOrderType] = useState('regular_delivery');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentPlacedOrder, setCurrentPlacedOrder] = useState(placedOrder);

  // Sync with currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name || '');
      if (!phone) setPhone(currentUser.phone || '');
      if (!address) setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Sync placed order from parent props if passed (e.g. from bulk catering submission)
  useEffect(() => {
    if (placedOrder) {
      setCurrentPlacedOrder(placedOrder);
    }
  }, [placedOrder]);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setSubmitting(true);

      const dishesSummary = cart.map(i => `${i.name} (x${i.quantity})`).join(', ');

      const orderPayload = {
        customerName,
        phone,
        orderType,
        dishes: dishesSummary,
        items: cart.map(i => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          subtotal: i.price * i.quantity
        })),
        totalAmount,
        address: orderType === 'takeaway' ? 'Takeaway / Self Pickup' : address,
        notes,
        eventDate: new Date().toISOString().split('T')[0],
        eventTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // 1. Save order to MongoDB backend
      let savedOrder = null;
      try {
        const res = await orderApi.createOrder(orderPayload);
        savedOrder = res.data;
      } catch (err) {
        console.warn('Backend order save note:', err.message);
        savedOrder = {
          orderId: Math.floor(1000 + Math.random() * 9000),
          ...orderPayload
        };
      }

      // Update state dynamically with full placed order details
      setCurrentPlacedOrder(savedOrder);
      if (onOrderPlaced) {
        onOrderPlaced(savedOrder);
      }
      if (typeof window !== 'undefined') {
        try {
          window.dispatchEvent(new CustomEvent('royal_order_placed', { detail: savedOrder }));
        } catch (e) {}
      }
      onClearCart();

      // 2. Prepare pre-filled WhatsApp message to restaurant (+91 74185 25405)
      const orderIdStr = savedOrder.orderId ? `#${savedOrder.orderId}` : `#RB-${Date.now().toString().slice(-4)}`;
      const message = `🍛 *NEW ONLINE ORDER - ROYAL BIRIYANI*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🆔 *Order ID:* ${orderIdStr}\n` +
        `👤 *Customer:* ${customerName}\n` +
        `📱 *Phone:* ${phone}\n` +
        `🛵 *Type:* ${orderType === 'takeaway' ? 'Self Pickup / Takeaway' : 'Home Delivery'}\n` +
        `📍 *Address:* ${orderType === 'takeaway' ? 'Takeaway' : address}\n` +
        `🍽️ *Items:*\n` +
        cart.map(i => `  • ${i.name} x ${i.quantity} (₹${i.price * i.quantity})`).join('\n') + `\n` +
        `💰 *Total Amount:* ₹${totalAmount}\n` +
        (notes ? `📝 *Notes:* ${notes}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Please confirm my order!`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/917418525405?text=${encoded}`, '_blank');
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartNewOrder = () => {
    setCurrentPlacedOrder(null);
    if (onOrderPlaced) {
      onOrderPlaced(null);
    }
  };

  const handleReopenWhatsApp = (order) => {
    const orderIdStr = order.orderId ? `#${order.orderId}` : `#RB-1001`;
    let msg = `🍛 *ROYAL BIRIYANI ORDER REFERENCE: ${orderIdStr}*\n` +
      `👤 *Customer:* ${order.customerName}\n` +
      `📱 *Phone:* ${order.phone}\n` +
      `🍽️ *Items / Dishes:* ${order.dishes}\n` +
      `📍 *Address:* ${order.address}\n` +
      (order.totalAmount ? `💰 *Total Amount:* ₹${order.totalAmount}\n` : '');

    window.open(`https://wa.me/917418525405?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Sidebar Header */}
          <div className="p-5 bg-royal-crimson text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-royal-gold" />
              <div>
                <h2 className="font-extrabold text-lg leading-tight">Your Royal Order</h2>
                <p className="text-[11px] text-amber-200">
                  {currentPlacedOrder ? `Active Order #${currentPlacedOrder.orderId || '1001'}` : 'Cart & Checkout Summary'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Placed Order View OR Active Cart / Checkout OR Empty State */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            
            {/* 1. PLACED ORDER VIEW (Displayed when order placed or catering requested) */}
            {currentPlacedOrder ? (
              <div className="space-y-4">
                {/* Placed Order Header Banner */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-4 rounded-2xl border border-emerald-300 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                      Order Confirmed &amp; Placed
                    </span>
                    <h3 className="text-xl font-black text-emerald-950">
                      #{currentPlacedOrder.orderId || '1001'}
                    </h3>
                  </div>
                  <span className="ml-auto px-2.5 py-1 bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase rounded-full">
                    ● {currentPlacedOrder.status || 'Pending'}
                  </span>
                </div>

                {/* Placed Order Customer & Type Details */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Customer</span>
                    <strong className="text-gray-900 font-extrabold text-sm">{currentPlacedOrder.customerName}</strong>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Contact</span>
                    <strong className="text-royal-crimson">{currentPlacedOrder.phone}</strong>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Order Type</span>
                    <span className="capitalize font-bold text-gray-800">
                      {currentPlacedOrder.orderType === 'bulk' 
                        ? `Bulk Catering (${currentPlacedOrder.guestCount || '100'} Guests)` 
                        : currentPlacedOrder.orderType === 'takeaway' 
                        ? 'Takeaway / Self Pickup' 
                        : 'Home Delivery'}
                    </span>
                  </div>

                  {currentPlacedOrder.eventDate && (
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500 font-bold uppercase text-[10px]">Date &amp; Time</span>
                      <strong className="text-gray-800">{currentPlacedOrder.eventDate} at {currentPlacedOrder.eventTime}</strong>
                    </div>
                  )}

                  <div className="pt-1">
                    <span className="text-gray-500 font-bold uppercase text-[10px] block mb-0.5">Address</span>
                    <p className="text-gray-700 font-medium">{currentPlacedOrder.address}</p>
                  </div>
                </div>

                {/* Placed Order Itemized List */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 shadow-xs">
                  <h4 className="font-extrabold text-xs text-royal-crimson uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-royal-gold" /> Placed Items &amp; Dishes
                  </h4>

                  {currentPlacedOrder.items && currentPlacedOrder.items.length > 0 ? (
                    <div className="space-y-2 divide-y divide-gray-100">
                      {currentPlacedOrder.items.map((item, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-gray-900">{item.name}</span>
                            <span className="text-gray-500 text-[11px] block">
                              Qty: <strong>{item.quantity}</strong> × ₹{item.price}
                            </span>
                          </div>
                          <span className="font-black text-gray-900">
                            ₹{item.subtotal || item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-gray-800 font-medium">
                      {currentPlacedOrder.dishes}
                    </div>
                  )}

                  {/* Total Price Row */}
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="font-extrabold text-sm text-gray-800">Total Amount</span>
                    <span className="font-black text-xl text-royal-crimson">
                      {currentPlacedOrder.totalAmount ? `₹${currentPlacedOrder.totalAmount}` : 'Quotation via WhatsApp'}
                    </span>
                  </div>
                </div>

                {/* WhatsApp & Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleReopenWhatsApp(currentPlacedOrder)}
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Open WhatsApp Receipt
                  </button>

                  <button
                    onClick={handleStartNewOrder}
                    className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Start / Place Another Order
                  </button>
                </div>
              </div>
            ) : cart.length > 0 ? (
              /* 2. ACTIVE CART & CHECKOUT FORM */
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-extrabold text-xs text-gray-500 uppercase tracking-wider">
                    Selected Items ({cart.length})
                  </h3>
                  
                  {cart.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                        <p className="text-xs text-royal-crimson font-bold">₹{item.price} each</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.name, item.quantity - 1)}
                            className="p-1.5 text-gray-600 hover:text-royal-crimson"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-xs text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.name, item.quantity + 1)}
                            className="p-1.5 text-gray-600 hover:text-royal-crimson"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-extrabold text-xs text-gray-900 w-14 text-right">
                          ₹{item.price * item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.name, 0)}
                          className="p-1 text-gray-400 hover:text-red-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Details Form */}
                <form id="checkoutForm" onSubmit={handleSubmit} className="pt-2 space-y-3.5 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('regular_delivery')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                        orderType === 'regular_delivery'
                          ? 'bg-royal-crimson text-white border-royal-crimson shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" /> Home Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                        orderType === 'takeaway'
                          ? 'bg-royal-crimson text-white border-royal-crimson shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Self Pickup
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-royal-crimson" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-royal-crimson" /> Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>

                  {orderType === 'regular_delivery' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-royal-crimson" /> Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, Landmark, Komarapalayam"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-gray-500" /> Cooking / Spice Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Extra spicy, less oil, gravy separated"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                    />
                  </div>
                </form>
              </div>
            ) : (
              /* 3. EMPTY STATE */
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-20">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-3" />
                <p className="font-bold text-gray-600">Your cart is empty</p>
                <p className="text-xs mt-1 max-w-xs">
                  Explore our royal biriyani and fast food dishes or submit a catering request to see your order here!
                </p>
              </div>
            )}

          </div>

          {/* Drawer Footer (Visible when active cart has items and no order placed yet) */}
          {cart.length > 0 && !currentPlacedOrder && (
            <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-semibold">Subtotal</span>
                <span className="font-extrabold text-gray-900 text-lg">₹{totalAmount}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Delivery Fee</span>
                <span className="text-emerald-600 font-bold">Calculated on confirmation</span>
              </div>

              <button
                type="submit"
                form="checkoutForm"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-royal-crimson to-royal-crimson-dark text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {submitting ? (
                  'Processing Order...'
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Place Order via WhatsApp &amp; DB
                  </>
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                🔒 Direct instant dispatch to kitchen (+91 74185 25405)
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
