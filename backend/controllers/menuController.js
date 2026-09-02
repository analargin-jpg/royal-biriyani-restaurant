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
  // Biriyani
  { _id: 'menu_1', name: 'Mutton Biriyani', category: 'Biriyani', price: 280, description: 'Aromatic basmati with tender mutton cooked to perfection', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍛' },
  { _id: 'menu_2', name: 'Chicken Biriyani', category: 'Biriyani', price: 240, description: 'Fragrant rice with succulent spiced chicken and royal masala', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍗' },
  { _id: 'menu_3', name: 'Kabab Biriyani', category: 'Biriyani', price: 300, description: 'Royal blend of biriyani with grilled seekh kababs', isAvailable: true, isPopular: false, dietaryType: 'non-veg', imageEmoji: '🍢' },
  { _id: 'menu_4', name: 'Kushka', category: 'Biriyani', price: 250, description: 'Premium biriyani special preparation with rich flavors', isAvailable: true, isPopular: false, dietaryType: 'non-veg', imageEmoji: '🍚' },

  // Fast Food & Noodles
  { _id: 'menu_5', name: 'Chicken Rice', category: 'Fast Food & Noodles', price: 150, description: 'Flavored wok-fried rice with tender chicken cubes', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🥡' },
  { _id: 'menu_6', name: 'Egg Rice', category: 'Fast Food & Noodles', price: 120, description: 'Classic fried rice with seasoned scrambled eggs', isAvailable: true, isPopular: false, dietaryType: 'egg', imageEmoji: '🍳' },
  { _id: 'menu_7', name: 'Chicken Noodles', category: 'Fast Food & Noodles', price: 140, description: 'Stir-fried noodles with chicken and fresh crunchy vegetables', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍜' },
  { _id: 'menu_8', name: 'Egg Noodles', category: 'Fast Food & Noodles', price: 110, description: 'Crispy tossed noodles with scrambled egg', isAvailable: true, isPopular: false, dietaryType: 'egg', imageEmoji: '🥢' },

  // Starters & Gravy
  { _id: 'menu_9', name: 'Chicken Fry', category: 'Starters & Gravy', price: 180, description: 'Crispy and spicy South Indian fried chicken pieces', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍗' },
  { _id: 'menu_10', name: 'Chicken Leg Piece', category: 'Starters & Gravy', price: 160, description: 'Tender, juicy marinated chicken leg fry', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍖' },
  { _id: 'menu_11', name: 'Liver Fry', category: 'Starters & Gravy', price: 150, description: 'Crispy liver delicacy with ground pepper masala', isAvailable: true, isPopular: false, dietaryType: 'non-veg', imageEmoji: '🍲' },
  { _id: 'menu_12', name: 'Kadai Fry', category: 'Starters & Gravy', price: 200, description: 'Restaurant specialty kadai chicken fry with capsicum', isAvailable: true, isPopular: false, dietaryType: 'non-veg', imageEmoji: '🥘' },
  { _id: 'menu_13', name: 'Egg Masala', category: 'Starters & Gravy', price: 140, description: 'Boiled eggs simmered in rich spiced onion-tomato gravy', isAvailable: true, isPopular: false, dietaryType: 'egg', imageEmoji: '🥚' },
  { _id: 'menu_14', name: 'Chicken Masala', category: 'Starters & Gravy', price: 220, description: 'Tender chicken pieces cooked in thick aromatic royal gravy', isAvailable: true, isPopular: true, dietaryType: 'non-veg', imageEmoji: '🍲' }
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
      if (category) filter.category = category;
      if (availableOnly === 'true') filter.isAvailable = true;
      items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    }

    if (!items || items.length === 0) {
      memoryMenu = loadFileMenu();
      items = memoryMenu.filter(item => {
        if (category && item.category !== category) return false;
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
    const { name, category, price, description, isAvailable, isPopular, dietaryType, imageEmoji } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const itemData = {
      name,
      category: category || 'Biriyani',
      price: Number(price),
      description: description || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isPopular: Boolean(isPopular),
      dietaryType: dietaryType || 'non-veg',
      imageEmoji: imageEmoji || '🍛'
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
