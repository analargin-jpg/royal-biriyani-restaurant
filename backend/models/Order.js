const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  subtotal: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    unique: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  orderType: {
    type: String,
    enum: ['bulk', 'regular_delivery', 'takeaway', 'dine_in'],
    default: 'bulk'
  },
  eventDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  eventTime: {
    type: String,
    default: '12:00'
  },
  guestCount: {
    type: String,
    default: 'N/A'
  },
  dishes: {
    type: String,
    required: [true, 'Dishes or menu description is required']
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    required: [true, 'Delivery or event address is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Pre-save hook to assign sequential orderId if not provided
OrderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    try {
      const lastOrder = await mongoose.model('Order').findOne({}, {}, { sort: { orderId: -1 } });
      this.orderId = lastOrder && lastOrder.orderId ? lastOrder.orderId + 1 : 1001;
    } catch (err) {
      this.orderId = Math.floor(1000 + Math.random() * 9000);
    }
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
