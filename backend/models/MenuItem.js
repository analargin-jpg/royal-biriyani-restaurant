const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide dish name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['Biriyani', 'Fast Food & Noodles', 'Starters & Gravy', 'Desserts & Beverages', 'Specials'],
    default: 'Biriyani'
  },
  price: {
    type: Number,
    required: [true, 'Please specify price in INR'],
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  dietaryType: {
    type: String,
    enum: ['non-veg', 'veg', 'egg'],
    default: 'non-veg'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
