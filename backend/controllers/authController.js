const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Order = require('../models/Order');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const loadFileUsers = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Could not read users.json:', e.message);
  }
  return [];
};

const saveFileUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {
    console.error('Could not save users.json:', e.message);
  }
};

const isDbReady = () => mongoose.connection.readyState === 1;

const generateToken = (id, role = 'customer') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'royal_biriyani_super_secret_jwt_key_2024', {
    expiresIn: '30d'
  });
};

// ==========================================
// 👤 USER AUTHENTICATION (SIGNUP & LOGIN)
// ==========================================

// @desc    Register a new customer account
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, address } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, phone number, and password'
      });
    }

    const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      });
    }

    // Check if user already exists
    if (isDbReady()) {
      const existingUser = await User.findOne({ phone: cleanPhone });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this phone number already exists. Please sign in.'
        });
      }
    }

    let user = null;

    if (isDbReady()) {
      try {
        user = await User.create({
          name: name.trim(),
          phone: cleanPhone,
          email: email ? email.trim().toLowerCase() : '',
          password,
          address: address ? address.trim() : '',
          role: 'customer'
        });
      } catch (dbErr) {
        console.warn('DB User create error, saving locally:', dbErr.message);
      }
    }

    if (!user) {
      const localUsers = loadFileUsers();
      if (localUsers.find(u => u.phone === cleanPhone)) {
        return res.status(400).json({
          success: false,
          message: 'An account with this phone number already exists. Please sign in.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = {
        _id: 'usr_' + Date.now(),
        name: name.trim(),
        phone: cleanPhone,
        email: email ? email.trim().toLowerCase() : '',
        password: hashedPassword,
        address: address ? address.trim() : '',
        role: 'customer',
        createdAt: new Date().toISOString()
      };

      localUsers.push(user);
      saveFileUsers(localUsers);
    }

    const token = generateToken(user._id, 'customer');

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Royal Biriyani.',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Customer Login
// @route   POST /api/auth/user-login
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be phone or email

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your phone number / email and password'
      });
    }

    const cleanIdentifier = identifier.trim();
    const cleanPhone = cleanIdentifier.replace(/\D/g, '').slice(-10);

    let user = null;
    let isMatch = false;

    if (isDbReady()) {
      try {
        user = await User.findOne({
          $or: [
            { phone: cleanPhone.length === 10 ? cleanPhone : cleanIdentifier },
            { email: cleanIdentifier.toLowerCase() }
          ]
        });
        if (user) {
          isMatch = await user.matchPassword(password);
        }
      } catch (err) {
        console.warn('DB user find error:', err.message);
      }
    }

    if (!user) {
      const localUsers = loadFileUsers();
      user = localUsers.find(u => 
        (cleanPhone.length === 10 && u.phone === cleanPhone) ||
        (u.email && u.email.toLowerCase() === cleanIdentifier.toLowerCase()) ||
        u.phone === cleanIdentifier
      );

      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password. Please try again.'
      });
    }

    const token = generateToken(user._id, user.role || 'customer');

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email || '',
        address: user.address || '',
        role: user.role || 'customer'
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/user-profile
exports.getUserProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'royal_biriyani_super_secret_jwt_key_2024');

    let user = null;
    if (isDbReady()) {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      const localUsers = loadFileUsers();
      user = localUsers.find(u => String(u._id) === String(decoded.id));
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email || '',
        address: user.address || '',
        role: user.role || 'customer'
      }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// @desc    Update User Profile
// @route   PUT /api/auth/user-profile
exports.updateUserProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'royal_biriyani_super_secret_jwt_key_2024');
    const { name, email, address } = req.body;

    let user = null;
    if (isDbReady()) {
      user = await User.findById(decoded.id);
      if (user) {
        if (name) user.name = name.trim();
        if (email !== undefined) user.email = email.trim().toLowerCase();
        if (address !== undefined) user.address = address.trim();
        await user.save();
      }
    }

    if (!user) {
      const localUsers = loadFileUsers();
      const idx = localUsers.findIndex(u => String(u._id) === String(decoded.id));
      if (idx !== -1) {
        if (name) localUsers[idx].name = name.trim();
        if (email !== undefined) localUsers[idx].email = email.trim().toLowerCase();
        if (address !== undefined) localUsers[idx].address = address.trim();
        user = localUsers[idx];
        saveFileUsers(localUsers);
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 🛡️ ADMIN AUTHENTICATION
// ==========================================

// @desc    Admin login
// @route   POST /api/auth/login
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const defaultAdminUser = process.env.ADMIN_USERNAME || 'admin';
    const defaultAdminPass = process.env.ADMIN_PASSWORD || 'admin123';

    let admin = null;
    if (isDbReady()) {
      try {
        admin = await Admin.findOne({ username: username.toLowerCase() });
      } catch (e) {
        admin = null;
      }
    }

    let isMatch = false;

    if (admin) {
      isMatch = await admin.matchPassword(password);
    } else {
      if (username.toLowerCase() === defaultAdminUser.toLowerCase() && password === defaultAdminPass) {
        isMatch = true;
        admin = {
          _id: 'default_admin_id',
          username: defaultAdminUser,
          phone: process.env.ADMIN_PHONE || '6384945599',
          role: 'admin'
        };
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = generateToken(admin._id, admin.role || 'admin');

    return res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        phone: admin.phone || '6384945599',
        role: admin.role || 'admin'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify admin token
// @route   GET /api/auth/me
exports.getAdminProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'royal_biriyani_super_secret_jwt_key_2024');

    return res.json({
      success: true,
      admin: {
        id: decoded.id,
        role: decoded.role,
        phone: process.env.ADMIN_PHONE || '6384945599'
      }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
