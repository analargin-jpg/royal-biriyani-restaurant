const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Order = require('../models/Order');

// Persistent JSON file path for offline/standalone mode
const DATA_DIR = path.join(__dirname, '../data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory and initial orders.json file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultInitialOrders = [
  {
    _id: 'mem_1',
    orderId: 1001,
    customerName: 'Rajesh Kumar',
    phone: '9876543210',
    orderType: 'bulk',
    eventDate: '2024-09-15',
    eventTime: '18:00',
    guestCount: '100',
    dishes: 'Biriyani Special, Noodles, Starters',
    address: 'Salem Main Rd, Near TMMB Bank, Komarapalayam',
    status: 'pending',
    totalAmount: 25000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const loadFileOrders = () => {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read orders.json, using defaults:', err.message);
  }
  saveFileOrders(defaultInitialOrders);
  return defaultInitialOrders;
};

const saveFileOrders = (orders) => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {
    console.error('Could not save orders.json:', err.message);
  }
};

let memoryOrders = loadFileOrders();

const isDbReady = () => mongoose.connection.readyState === 1;

// @desc    Get all orders with filtering and search
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const { status, search, orderType, limit = 100, page = 1 } = req.query;

    let dbOrders = [];
    let total = 0;

    if (isDbReady()) {
      const query = {};

      if (status && status !== 'all') {
        query.status = status.toLowerCase();
      }

      if (orderType && orderType !== 'all') {
        if (orderType === 'bulk') {
          query.orderType = 'bulk';
        } else if (orderType === 'single') {
          query.orderType = { $ne: 'bulk' };
        } else {
          query.orderType = orderType;
        }
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        const isNum = !isNaN(Number(search));
        if (isNum) {
          query.$or = [
            { orderId: Number(search) },
            { customerName: searchRegex },
            { phone: searchRegex }
          ];
        } else {
          query.$or = [
            { customerName: searchRegex },
            { phone: searchRegex },
            { dishes: searchRegex },
            { address: searchRegex }
          ];
        }
      }

      dbOrders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      total = await Order.countDocuments(query);
    }

    // Always merge any locally cached orders so nothing is ever dropped
    memoryOrders = loadFileOrders();
    const orderMap = new Map();

    // Add DB orders
    dbOrders.forEach(o => {
      const plain = o.toObject ? o.toObject() : o;
      orderMap.set(String(plain.orderId || plain._id), plain);
    });

    // Add memory orders if not already in DB
    memoryOrders.forEach(o => {
      const key = String(o.orderId || o._id);
      if (!orderMap.has(key)) {
        // Apply filters
        let matches = true;
        if (status && status !== 'all' && o.status !== status) matches = false;
        if (orderType && orderType !== 'all') {
          if (orderType === 'bulk' && o.orderType !== 'bulk') matches = false;
          if (orderType === 'single' && o.orderType === 'bulk') matches = false;
        }
        if (search) {
          const s = search.toLowerCase();
          const matchSearch =
            (o.customerName && o.customerName.toLowerCase().includes(s)) ||
            (o.phone && o.phone.includes(s)) ||
            String(o.orderId || '').includes(s) ||
            (o.dishes && o.dishes.toLowerCase().includes(s)) ||
            (o.address && o.address.toLowerCase().includes(s));
          if (!matchSearch) matches = false;
        }
        if (matches) {
          orderMap.set(key, o);
        }
      }
    });

    const allOrders = Array.from(orderMap.values()).sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return res.json({
      success: true,
      count: allOrders.length,
      total: Math.max(total, allOrders.length),
      data: allOrders,
      isFallback: !isDbReady()
    });
  } catch (error) {
    console.error('getOrders error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order by ID or orderId
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    if (isDbReady()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      } else {
        order = await Order.findOne({ orderId: Number(id) });
      }
    }

    if (!order) {
      memoryOrders = loadFileOrders();
      order = memoryOrders.find(o => String(o.orderId) === id || o._id === id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new order (Single item, Cart, Delivery, or Bulk Catering)
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      orderType = 'single',
      eventDate,
      eventTime,
      guestCount,
      dishes,
      items,
      totalAmount,
      address,
      notes
    } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name and phone number.'
      });
    }

    const normalizedOrderType = (orderType === 'bulk') ? 'bulk' : (orderType === 'takeaway' ? 'takeaway' : 'single');
    const finalAddress = (address && String(address).trim())
      ? String(address).trim()
      : (normalizedOrderType === 'takeaway' ? 'Takeaway / Self Pickup' : 'Komarapalayam (Address on phone)');

    let finalDishes = (dishes && String(dishes).trim()) ? String(dishes).trim() : '';
    if (!finalDishes && items && Array.isArray(items) && items.length > 0) {
      finalDishes = items.map(i => `${i.name || 'Dish'} (x${i.quantity || 1})`).join(', ');
    }
    if (!finalDishes) {
      finalDishes = 'Assorted Menu Order';
    }

    // Format and sanitize items array safely
    const formattedItems = (items && Array.isArray(items))
      ? items.map(i => ({
          name: i.name || 'Dish',
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
          subtotal: Number(i.subtotal) || ((Number(i.price) || 0) * (Number(i.quantity) || 1))
        }))
      : [];

    // Calculate totalAmount if not provided
    let finalTotal = Number(totalAmount);
    if (isNaN(finalTotal) || finalTotal <= 0) {
      finalTotal = formattedItems.reduce((sum, i) => sum + i.subtotal, 0);
    }

    // Determine sequential orderId
    let nextOrderId = 1002;
    if (isDbReady()) {
      try {
        const lastOrder = await Order.findOne({ orderId: { $exists: true } }).sort({ orderId: -1 });
        if (lastOrder && lastOrder.orderId && !isNaN(lastOrder.orderId)) {
          nextOrderId = Number(lastOrder.orderId) + 1;
        }
      } catch (e) {
        console.warn('Error querying last orderId:', e.message);
      }
    } else {
      memoryOrders = loadFileOrders();
      const maxId = memoryOrders.reduce((max, o) => Math.max(max, o.orderId || 0), 1000);
      nextOrderId = maxId + 1;
    }

    const newOrderData = {
      orderId: nextOrderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      orderType: normalizedOrderType,
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      eventTime: eventTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      guestCount: guestCount || (normalizedOrderType === 'bulk' ? '50+' : '1 (Single Order)'),
      dishes: finalDishes,
      items: formattedItems,
      totalAmount: finalTotal,
      address: finalAddress,
      notes: notes || '',
      status: 'pending'
    };

    let order = null;

    if (isDbReady()) {
      try {
        order = await Order.create(newOrderData);
        console.log(`✅ Order #${order.orderId} (${order.orderType}) saved directly to MongoDB Atlas!`);
      } catch (dbErr) {
        console.error('❌ DB create error, using backup file store:', dbErr.message);
      }
    }

    // Save to persistent file backup
    memoryOrders = loadFileOrders();
    const fallbackOrder = order ? (order.toObject ? order.toObject() : order) : {
      _id: 'ord_' + Date.now(),
      ...newOrderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Unshift to local memory and file
    const existingIdx = memoryOrders.findIndex(o => o.orderId === fallbackOrder.orderId);
    if (existingIdx === -1) {
      memoryOrders.unshift(fallbackOrder);
    } else {
      memoryOrders[existingIdx] = fallbackOrder;
    }
    saveFileOrders(memoryOrders);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order || fallbackOrder
    });
  } catch (error) {
    console.error('createOrder exception:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order details
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    if (isDbReady()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findByIdAndUpdate(id, req.body, { new: true });
      } else {
        order = await Order.findOneAndUpdate({ orderId: Number(id) }, req.body, { new: true });
      }
    }

    memoryOrders = loadFileOrders();
    const idx = memoryOrders.findIndex(o => String(o.orderId) === id || o._id === id);
    if (idx !== -1) {
      memoryOrders[idx] = { ...memoryOrders[idx], ...req.body, updatedAt: new Date().toISOString() };
      if (!order) order = memoryOrders[idx];
      saveFileOrders(memoryOrders);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Allowed: pending, confirmed, completed, cancelled'
      });
    }

    let order = null;

    if (isDbReady()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      } else {
        order = await Order.findOneAndUpdate({ orderId: Number(id) }, { status }, { new: true });
      }
    }

    memoryOrders = loadFileOrders();
    const idx = memoryOrders.findIndex(o => String(o.orderId) === id || o._id === id);
    if (idx !== -1) {
      memoryOrders[idx].status = status;
      memoryOrders[idx].updatedAt = new Date().toISOString();
      if (!order) order = memoryOrders[idx];
      saveFileOrders(memoryOrders);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbReady()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        await Order.findByIdAndDelete(id);
      } else {
        await Order.findOneAndDelete({ orderId: Number(id) });
      }
    }

    memoryOrders = loadFileOrders();
    const idx = memoryOrders.findIndex(o => String(o.orderId) === id || o._id === id);
    if (idx !== -1) {
      memoryOrders.splice(idx, 1);
      saveFileOrders(memoryOrders);
    }

    return res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order summary statistics
// @route   GET /api/orders/stats
exports.getOrderStats = async (req, res) => {
  try {
    if (isDbReady()) {
      const total = await Order.countDocuments();
      const pending = await Order.countDocuments({ status: 'pending' });
      const confirmed = await Order.countDocuments({ status: 'confirmed' });
      const completed = await Order.countDocuments({ status: 'completed' });
      const cancelled = await Order.countDocuments({ status: 'cancelled' });
      const singleOrders = await Order.countDocuments({ orderType: { $ne: 'bulk' } });
      const bulkOrders = await Order.countDocuments({ orderType: 'bulk' });

      const ordersWithGuests = await Order.find({ guestCount: { $exists: true, $ne: 'N/A' } }, 'guestCount');
      let totalGuests = 0;
      ordersWithGuests.forEach(o => {
        const num = parseInt(o.guestCount, 10);
        if (!isNaN(num)) totalGuests += num;
      });

      return res.json({
        success: true,
        data: { total, pending, confirmed, completed, cancelled, singleOrders, bulkOrders, totalGuests }
      });
    }

    memoryOrders = loadFileOrders();
    const total = memoryOrders.length;
    const pending = memoryOrders.filter(o => o.status === 'pending').length;
    const confirmed = memoryOrders.filter(o => o.status === 'confirmed').length;
    const completed = memoryOrders.filter(o => o.status === 'completed').length;
    const cancelled = memoryOrders.filter(o => o.status === 'cancelled').length;
    const singleOrders = memoryOrders.filter(o => o.orderType !== 'bulk').length;
    const bulkOrders = memoryOrders.filter(o => o.orderType === 'bulk').length;
    const totalGuests = memoryOrders.reduce((sum, o) => {
      const val = parseInt(o.guestCount, 10);
      return !isNaN(val) ? sum + val : sum;
    }, 0);

    return res.json({
      success: true,
      data: { total, pending, confirmed, completed, cancelled, singleOrders, bulkOrders, totalGuests },
      isFallback: true
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Customer Live Tracking by Phone or Order ID
// @route   GET /api/orders/track/:query
exports.trackOrder = async (req, res) => {
  try {
    const { query } = req.params;
    const raw = decodeURIComponent(query || '').trim();
    const cleanQuery = raw.replace(/^[#\s]+/, '').trim();

    let orders = [];

    if (isDbReady()) {
      const isNum = !isNaN(Number(cleanQuery)) && cleanQuery.length > 0;
      if (isNum) {
        orders = await Order.find({
          $or: [
            { orderId: Number(cleanQuery) },
            { phone: cleanQuery },
            { phone: new RegExp(cleanQuery + '$') }
          ]
        }).sort({ createdAt: -1 });
      } else {
        orders = await Order.find({
          $or: [
            { phone: new RegExp(cleanQuery, 'i') },
            { customerName: new RegExp(cleanQuery, 'i') }
          ]
        }).sort({ createdAt: -1 });
      }
    }

    if (orders.length === 0) {
      memoryOrders = loadFileOrders();
      orders = memoryOrders.filter(o => {
        return (
          String(o.orderId) === cleanQuery ||
          (o.phone && o.phone.includes(cleanQuery)) ||
          (o.customerName && o.customerName.toLowerCase().includes(cleanQuery.toLowerCase()))
        );
      });
    }

    return res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
