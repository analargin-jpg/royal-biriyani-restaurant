const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dish name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Biriyani', 'Fast Food & Noodles', 'Starters & Gravy', 'Beverages & Desserts', 'Specials'],
    default: 'Biriyani'
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  description: {
    type: String,
    trim: true,
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
  },
  imageEmoji: {
    type: String,
    default: '🍛'
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
