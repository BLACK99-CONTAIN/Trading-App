// routes/order.router.js
const express = require('express');
const {
  placeOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getOrderSummary
} = require('../controller/order.controller');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// Order management routes
router.post('/place', placeOrder);
router.get('/history', getUserOrders);
router.get('/summary', getOrderSummary);
router.get('/:orderId', getOrderById);
router.patch('/:orderId/cancel', cancelOrder);

module.exports = router;