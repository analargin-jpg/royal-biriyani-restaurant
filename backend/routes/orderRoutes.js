const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  getOrderStats,
  trackOrder
} = require('../controllers/orderController');

router.get('/stats', getOrderStats);
router.get('/track/:query', trackOrder);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById)
  .put(updateOrder)
  .delete(deleteOrder);

router.patch('/:id/status', updateOrderStatus);

module.exports = router;
