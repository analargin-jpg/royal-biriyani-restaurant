const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Admin = require('../models/Admin');

const menuItemsData = [
  // Biriyani
  {
    name: 'Mutton Biriyani',
    category: 'Biriyani',
    price: 280,
    description: 'Aromatic long-grain basmati rice slow-cooked with tender succulent mutton & authentic spices',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg',
    imageEmoji: '🍛'
  },
  {
    name: 'Chicken Biriyani',
    category: 'Biriyani',
    price: 240,
    description: 'Fragrant biriyani rice infused with saffron, caramelized onions, and juicy spiced chicken pieces',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg',
    imageEmoji: '🍗'
  },
  {
    name: 'Kabab Biriyani',
    category: 'Biriyani',
    price: 300,
    description: 'A royal grand combination of dum biriyani served with freshly grilled, tender seekh kababs',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg',
    imageEmoji: '🍢'
  },
  {
    name: 'Kushka',
    category: 'Biriyani',
    price: 250,
    description: 'Flavorful spiced biriyani rice cooked in rich meat broth, served with raita and brinjal gravy',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg',
    imageEmoji: '🍚'
  },

  // Fast Food & Noodles
  {
    name: 'Chicken Rice',
    category: 'Fast Food & Noodles',
    price: 150,
    description: 'Wok-tossed aromatic rice with seasoned chicken cubes, spring onions, and special sauces',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg',
    imageEmoji: '🥡'
  },
  {
    name: 'Egg Rice',
    category: 'Fast Food & Noodles',
    price: 120,
    description: 'Classic wok fried rice tossed with seasoned fluffy scrambled eggs and crisp vegetables',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'egg',
    imageEmoji: '🍳'
  },
  {
    name: 'Chicken Noodles',
    category: 'Fast Food & Noodles',
    price: 140,
    description: 'Hot wok-fried hakka noodles with shredded tender chicken, peppers, and savory spices',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg',
    imageEmoji: '🍜'
  },
  {
    name: 'Egg Noodles',
    category: 'Fast Food & Noodles',
    price: 110,
    description: 'Tossed noodles with scrambled eggs, fresh cabbage, carrots, and house seasoning',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'egg',
    imageEmoji: '🥢'
  },

  // Starters & Gravy
  {
    name: 'Chicken Fry',
    category: 'Starters & Gravy',
    price: 180,
    description: 'Crispy, deep-fried chicken marinated in South Indian spices, curry leaves, and green chillies',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg',
    imageEmoji: '🍗'
  },
  {
    name: 'Chicken Leg Piece',
    category: 'Starters & Gravy',
    price: 160,
    description: 'Juicy whole chicken drumstick coated in secret masala and roasted to perfection',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg',
    imageEmoji: '🍖'
  },
  {
    name: 'Liver Fry',
    category: 'Starters & Gravy',
    price: 150,
    description: 'Pan-fried mutton/chicken liver tossed in coarse black pepper and caramelized shallots',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg',
    imageEmoji: '🍲'
  },
  {
    name: 'Kadai Fry',
    category: 'Starters & Gravy',
    price: 200,
    description: 'Chef special dry fry preparation cooked in iron kadai with bell peppers and roasted coriander',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg',
    imageEmoji: '🥘'
  },
  {
    name: 'Egg Masala',
    category: 'Starters & Gravy',
    price: 140,
    description: 'Hard-boiled eggs simmered in a rich tomato, onion, and roasted coconut gravy',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'egg',
    imageEmoji: '🥚'
  },
  {
    name: 'Chicken Masala',
    category: 'Starters & Gravy',
    price: 220,
    description: 'Tender chicken pieces cooked in a thick aromatic Chettinad-style royal gravy',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg',
    imageEmoji: '🍲'
  }
];

const sampleOrders = [
  {
    orderId: 1001,
    customerName: 'Rajesh Kumar',
    phone: '9876543210',
    orderType: 'bulk',
    eventDate: '2024-09-15',
    eventTime: '18:00',
    guestCount: '100',
    dishes: 'Mutton Biriyani, Chicken Fry, Chicken Noodles',
    address: 'Salem Main Rd, Near TMMB Bank, Komarapalayam',
    status: 'pending',
    totalAmount: 28000,
    notes: 'Wedding reception dinner'
  },
  {
    orderId: 1002,
    customerName: 'Suresh Raina',
    phone: '9845123456',
    orderType: 'bulk',
    eventDate: '2024-09-20',
    eventTime: '12:30',
    guestCount: '250',
    dishes: 'Chicken Biriyani, Egg Masala, Chicken Leg Piece',
    address: 'JKK Nattraja Nagar, Komarapalayam, Tamil Nadu',
    status: 'confirmed',
    totalAmount: 60000,
    notes: 'Birthday celebration'
  },
  {
    orderId: 1003,
    customerName: 'Priya Sundaram',
    phone: '9765432109',
    orderType: 'regular_delivery',
    eventDate: '2024-09-10',
    eventTime: '19:30',
    guestCount: '10',
    dishes: 'Mutton Biriyani (x3), Chicken Rice (x2), Liver Fry (x2)',
    address: 'Main Bazaar Street, Komarapalayam',
    status: 'completed',
    totalAmount: 1440,
    notes: 'Home delivery order'
  }
];

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/royal_biriyani';

  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB.');

    // Clear existing data
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await Admin.deleteMany({});
    console.log('🧹 Cleaned existing collections.');

    // Seed Menu Items
    const createdMenuItems = await MenuItem.insertMany(menuItemsData);
    console.log(`🍛 Seeded ${createdMenuItems.length} authentic menu items.`);

    // Seed Orders
    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`📋 Seeded ${createdOrders.length} sample orders.`);

    // Seed Admin
    const adminUser = new Admin({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      phone: process.env.ADMIN_PHONE || '6384945599',
      role: 'admin'
    });
    await adminUser.save();
    console.log(`👨‍💼 Seeded Admin account (Username: ${adminUser.username}).`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Error:', error.message);
    console.warn('📌 Note: If MongoDB server is not running, start it or update MONGODB_URI in .env');
    process.exit(1);
  }
};

seedDB();
