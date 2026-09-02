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
    const { status, search, limit = 100, page = 1 } = req.query;

    if (isDbReady()) {
      const query = {};

      if (status && status !== 'all') {
        query.status = status.toLowerCase();
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

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Order.countDocuments(query);

      return res.json({
        success: true,
        count: orders.length,
        total,
        data: orders
      });
    }

    // Always reload from persistent file store
    memoryOrders = loadFileOrders();

    const filtered = memoryOrders.filter(o => {
      if (status && status !== 'all' && o.status !== status) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          (o.customerName && o.customerName.toLowerCase().includes(s)) ||
          (o.phone && o.phone.includes(s)) ||
          String(o.orderId || '').includes(s) ||
          (o.dishes && o.dishes.toLowerCase().includes(s)) ||
          (o.address && o.address.toLowerCase().includes(s))
        );
      }
      return true;
    });

    return res.json({
      success: true,
      count: filtered.length,
      total: filtered.length,
      data: filtered,
      isFallback: true
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

// @desc    Create new order (Bulk or Cart)
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      orderType = 'bulk',
      eventDate,
      eventTime,
      guestCount,
      dishes,
      items,
      totalAmount,
      address,
      notes
    } = req.body;

    if (!customerName || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name, phone number, and address.'
      });
    }

    let finalDishes = dishes;
    if (!finalDishes && items && Array.isArray(items) && items.length > 0) {
      finalDishes = items.map(i => `${i.name} (x${i.quantity})`).join(', ');
    }
    if (!finalDishes) {
      finalDishes = 'Assorted Menu Selection';
    }

    const newOrderData = {
      customerName,
      phone,
      orderType,
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      eventTime: eventTime || '12:00',
      guestCount: guestCount || 'N/A',
      dishes: finalDishes,
      items: items || [],
      totalAmount: totalAmount || 0,
      address,
      notes: notes || '',
      status: 'pending'
    };

    let order = null;

    if (isDbReady()) {
      try {
        order = await Order.create(newOrderData);
      } catch (dbErr) {
        console.warn('DB create failed, using persistent file store:', dbErr.message);
      }
    }

    if (!order) {
      memoryOrders = loadFileOrders();
      const maxId = memoryOrders.reduce((max, o) => Math.max(max, o.orderId || 0), 1000);
      order = {
        _id: 'ord_' + Date.now(),
        orderId: maxId + 1,
        ...newOrderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryOrders.unshift(order);
      saveFileOrders(memoryOrders);
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
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
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        } else {
          order = await Order.findOneAndUpdate({ orderId: Number(id) }, { status }, { new: true });
        }
      } catch (err) {
        console.warn('DB status update error:', err.message);
      }
    }

    if (!order) {
      memoryOrders = loadFileOrders();
      const idx = memoryOrders.findIndex(o => String(o.orderId) === id || o._id === id);
      if (idx !== -1) {
        memoryOrders[idx].status = status;
        memoryOrders[idx].updatedAt = new Date().toISOString();
        order = memoryOrders[idx];
        saveFileOrders(memoryOrders);
      }
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

// @desc    Update full order
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    if (isDbReady()) {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          order = await Order.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        } else {
          order = await Order.findOneAndUpdate({ orderId: Number(id) }, req.body, { new: true, runValidators: true });
        }
      } catch (err) {
        console.warn('DB update order error:', err.message);
      }
    }

    if (!order) {
      memoryOrders = loadFileOrders();
      const idx = memoryOrders.findIndex(o => String(o.orderId) === id || o._id === id);
      if (idx !== -1) {
        memoryOrders[idx] = { ...memoryOrders[idx], ...req.body, updatedAt: new Date().toISOString() };
        order = memoryOrders[idx];
        saveFileOrders(memoryOrders);
      }
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, message: 'Order updated', data: order });
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
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          await Order.findByIdAndDelete(id);
        } else {
          await Order.findOneAndDelete({ orderId: Number(id) });
        }
      } catch (err) {
        console.warn('DB delete error:', err.message);
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

      const ordersWithGuests = await Order.find({ guestCount: { $exists: true, $ne: 'N/A' } }, 'guestCount');
      let totalGuests = 0;
      ordersWithGuests.forEach(o => {
        const num = parseInt(o.guestCount, 10);
        if (!isNaN(num)) totalGuests += num;
      });

      return res.json({
        success: true,
        data: { total, pending, confirmed, completed, cancelled, totalGuests }
      });
    }

    memoryOrders = loadFileOrders();
    const total = memoryOrders.length;
    const pending = memoryOrders.filter(o => o.status === 'pending').length;
    const confirmed = memoryOrders.filter(o => o.status === 'confirmed').length;
    const completed = memoryOrders.filter(o => o.status === 'completed').length;
    const cancelled = memoryOrders.filter(o => o.status === 'cancelled').length;
    const totalGuests = memoryOrders.reduce((sum, o) => {
      const val = parseInt(o.guestCount, 10);
      return !isNaN(val) ? sum + val : sum;
    }, 0);

    return res.json({
      success: true,
      data: { total, pending, confirmed, completed, cancelled, totalGuests },
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
      orders = memoryOrders.filter(o => 
        String(o.orderId) === cleanQuery || 
        String(o.orderId) === raw ||
        (o.phone && o.phone.includes(cleanQuery)) || 
        (o.customerName && o.customerName.toLowerCase().includes(cleanQuery.toLowerCase()))
      );
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
