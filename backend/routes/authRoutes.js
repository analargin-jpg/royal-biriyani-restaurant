const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  loginAdmin,
  getAdminProfile
} = require('../controllers/authController');

// Customer Auth Routes
router.post('/register', registerUser);
router.post('/user-login', loginUser);
router.get('/user-profile', getUserProfile);
router.put('/user-profile', updateUserProfile);

// Admin Auth Routes
router.post('/login', loginAdmin);
router.get('/me', getAdminProfile);

module.exports = router;
