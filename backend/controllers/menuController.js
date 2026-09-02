const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const DATA_DIR = path.join(__dirname, '../data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultInitialMenuItems = [
  // 1. Biriyani
  {
    _id: 'menu_1',
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
    _id: 'menu_2',
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
    _id: 'menu_3',
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
    _id: 'menu_4',
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
    _id: 'menu_5',
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
    _id: 'menu_6',
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
    _id: 'menu_7',
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
    _id: 'menu_8',
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
    _id: 'menu_9',
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
    _id: 'menu_10',
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
    _id: 'menu_11',
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
    _id: 'menu_12',
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
    _id: 'menu_13',
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
    _id: 'menu_14',
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

const loadFileMenu = () => {
  try {
    if (fs.existsSync(MENU_FILE)) {
      const data = fs.readFileSync(MENU_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read menu.json, using defaults:', err.message);
  }
  saveFileMenu(defaultInitialMenuItems);
  return defaultInitialMenuItems;
};

const saveFileMenu = (items) => {
  try {
    fs.writeFileSync(MENU_FILE, JSON.stringify(items, null, 2), 'utf8');
  } catch (err) {
    console.error('Could not save menu.json:', err.message);
  }
};

let memoryMenu = loadFileMenu();

const isDbReady = () => mongoose.connection.readyState === 1;

// @desc    Get all menu items (optionally grouped by category)
// @route   GET /api/menu
exports.getMenuItems = async (req, res) => {
  try {
    const { category, availableOnly } = req.query;
    let items = [];

    if (isDbReady()) {
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      if (availableOnly === 'true') filter.isAvailable = true;
      items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    }

    if (!items || items.length === 0) {
      memoryMenu = loadFileMenu();
      items = memoryMenu.filter(item => {
        if (category && category !== 'All' && item.category !== category) return false;
        if (availableOnly === 'true' && !item.isAvailable) return false;
        return true;
      });
    }

    const grouped = items.reduce((acc, item) => {
      const cat = item.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    return res.json({
      success: true,
      count: items.length,
      data: items,
      grouped,
      isFallback: !isDbReady()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
exports.createMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, isAvailable, isPopular, dietaryType, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const itemData = {
      name: name.trim(),
      category: category || 'Biriyani',
      price: Number(price),
      description: description || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isPopular: Boolean(isPopular),
      dietaryType: dietaryType || 'non-veg'
    };

    let item = null;

    if (isDbReady()) {
      try {
        item = await MenuItem.create(itemData);
      } catch (dbErr) {
        console.warn('DB createMenuItem error:', dbErr.message);
      }
    }

    if (!item) {
      memoryMenu = loadFileMenu();
      item = {
        _id: 'menu_' + Date.now(),
        ...itemData,
        createdAt: new Date().toISOString()
      };
      memoryMenu.push(item);
      saveFileMenu(memoryMenu);
    }

    return res.status(201).json({ success: true, message: 'Menu item created', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    let item = null;

    if (isDbReady()) {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        }
      } catch (err) {
        console.warn('DB updateMenuItem error:', err.message);
      }
    }

    if (!item) {
      memoryMenu = loadFileMenu();
      const idx = memoryMenu.findIndex(m => m._id === id);
      if (idx !== -1) {
        memoryMenu[idx] = { ...memoryMenu[idx], ...req.body };
        item = memoryMenu[idx];
        saveFileMenu(memoryMenu);
      }
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    return res.json({ success: true, message: 'Menu item updated', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle item availability (in stock / out of stock)
// @route   PATCH /api/menu/:id/toggle
exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    let item = null;

    if (isDbReady()) {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          const existing = await MenuItem.findById(id);
          if (existing) {
            existing.isAvailable = !existing.isAvailable;
            await existing.save();
            item = existing;
          }
        }
      } catch (err) {
        console.warn('DB toggle error:', err.message);
      }
    }

    if (!item) {
      memoryMenu = loadFileMenu();
      const idx = memoryMenu.findIndex(m => m._id === id);
      if (idx !== -1) {
        memoryMenu[idx].isAvailable = !memoryMenu[idx].isAvailable;
        item = memoryMenu[idx];
        saveFileMenu(memoryMenu);
      }
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    return res.json({
      success: true,
      message: `Dish marked as ${item.isAvailable ? 'Available' : 'Out of Stock'}`,
      data: item
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbReady()) {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          await MenuItem.findByIdAndDelete(id);
        }
      } catch (err) {
        console.warn('DB delete error:', err.message);
      }
    }

    memoryMenu = loadFileMenu();
    const idx = memoryMenu.findIndex(m => m._id === id);
    if (idx !== -1) {
      memoryMenu.splice(idx, 1);
      saveFileMenu(memoryMenu);
    }

    return res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
