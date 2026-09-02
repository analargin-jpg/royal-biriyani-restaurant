const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Admin = require('../models/Admin');
const User = require('../models/User');

const menuItems = [
  // 1. Biriyani Special
  {
    name: 'Mutton Biriyani',
    category: 'Biriyani',
    price: 280,
    description: 'Aromatic basmati rice layered with succulent tender mutton chunks, slow dum cooked in traditional copper handis.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    name: 'Chicken Biriyani',
    category: 'Biriyani',
    price: 240,
    description: 'Fragrant seeraga samba/basmati rice cooked with marinated bone-in chicken, infused with saffron, ghee, and royal spices.',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    name: 'Kabab Biriyani',
    category: 'Biriyani',
    price: 300,
    description: 'Royal blend of slow-cooked dum biriyani served with grilled, juicy spiced seekh chicken kababs.',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg'
  },
  {
    name: 'Kushka',
    category: 'Biriyani',
    price: 250,
    description: 'Rich, flavorful spiced plain dum biriyani rice served with royal onion raita and thick dalcha gravy.',
    imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg'
  },

  // 2. Fast Food & Noodles
  {
    name: 'Chicken Rice',
    category: 'Fast Food & Noodles',
    price: 150,
    description: 'Wok-tossed Indo-Chinese fragrant basmati rice tossed with spiced tender chicken cubes and crisp vegetables.',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    name: 'Egg Rice',
    category: 'Fast Food & Noodles',
    price: 120,
    description: 'Classic wok-fried rice with freshly scrambled eggs, crushed black pepper, and chopped scallions.',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'egg'
  },
  {
    name: 'Chicken Noodles',
    category: 'Fast Food & Noodles',
    price: 140,
    description: 'Sizzling hakka noodles stir-fried with shredded chicken, crunchy bell peppers, and savory soy garlic sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    name: 'Egg Noodles',
    category: 'Fast Food & Noodles',
    price: 110,
    description: 'Crisp stir-fried noodles with scrambled egg, shredded cabbage, carrots, and house chili seasoning.',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'egg'
  },

  // 3. Starters & Gravy
  {
    name: 'Chicken Fry',
    category: 'Starters & Gravy',
    price: 180,
    description: 'Crispy, deep-fried South Indian spiced chicken 65 pieces garnished with fried curry leaves and lemon.',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    name: 'Chicken Leg Piece',
    category: 'Starters & Gravy',
    price: 160,
    description: 'Juicy, succulent whole chicken drumstick marinated in yogurt and tandoori spices, flame-roasted to perfection.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  },
  {
    name: 'Liver Fry',
    category: 'Starters & Gravy',
    price: 150,
    description: 'Authentic Chettinad style chicken liver sauteed with freshly ground black pepper and shallots.',
    imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg'
  },
  {
    name: 'Kadai Fry',
    category: 'Starters & Gravy',
    price: 200,
    description: 'Spicy wok-tossed kadai chicken cooked with crushed coriander seeds, capsicum, and thick onion masala.',
    imageUrl: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'non-veg'
  },
  {
    name: 'Egg Masala',
    category: 'Starters & Gravy',
    price: 140,
    description: 'Hard-boiled eggs simmered in a rich, velvety onion-tomato masala gravy with ground cinnamon and cloves.',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: false,
    dietaryType: 'egg'
  },
  {
    name: 'Chicken Masala',
    category: 'Starters & Gravy',
    price: 220,
    description: 'Tender chicken pieces simmered in an aromatic South Indian homestyle thick gravy.',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isPopular: true,
    dietaryType: 'non-veg'
  }
];

const sampleOrders = [
  {
    orderId: 1001,
    customerName: 'Rajesh Kumar',
    phone: '9876543210',
    orderType: 'bulk',
    eventDate: '2026-09-15',
    eventTime: '18:00',
    guestCount: '100',
    dishes: 'Mutton Biriyani, Chicken Fry, Egg Masala',
    address: 'Salem Main Rd, Near TMMB Bank, Komarapalayam',
    status: 'pending',
    totalAmount: 28000
  },
  {
    orderId: 1002,
    customerName: 'Suresh Raina',
    phone: '9845123456',
    orderType: 'regular_delivery',
    eventDate: '2026-09-02',
    eventTime: '13:00',
    dishes: 'Chicken Biriyani (x2), Chicken Leg Piece (x1)',
    items: [
      { name: 'Chicken Biriyani', price: 240, quantity: 2, subtotal: 480 },
      { name: 'Chicken Leg Piece', price: 160, quantity: 1, subtotal: 160 }
    ],
    address: 'JKK Nattraja Nagar, Komarapalayam',
    status: 'confirmed',
    totalAmount: 640
  },
  {
    orderId: 1003,
    customerName: 'Priya Sundaram',
    phone: '9765432109',
    orderType: 'takeaway',
    eventDate: '2026-09-01',
    eventTime: '19:30',
    dishes: 'Chicken Noodles (x2), Chicken Fry (x1)',
    items: [
      { name: 'Chicken Noodles', price: 140, quantity: 2, subtotal: 280 },
      { name: 'Chicken Fry', price: 180, quantity: 1, subtotal: 180 }
    ],
    address: 'Takeaway / Self Pickup',
    status: 'completed',
    totalAmount: 460
  }
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/royal_biriyani';
    console.log('Connecting to MongoDB at:', uri);
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB.');

    // Clear existing data
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await Admin.deleteMany({});

    console.log('🧹 Cleaned existing collections.');

    // Insert menu items
    await MenuItem.insertMany(menuItems);
    console.log(`🍛 Seeded ${menuItems.length} authentic menu items with HD images.`);

    // Insert sample orders
    await Order.insertMany(sampleOrders);
    console.log(`📋 Seeded ${sampleOrders.length} sample orders.`);

    // Insert Admin user
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const admin = new Admin({
      username: adminUser,
      password: adminPass,
      phone: process.env.ADMIN_PHONE || '6384945599',
      role: 'admin'
    });
    await admin.save();
    console.log(`👨‍💼 Seeded Admin account (Username: ${adminUser}).`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
