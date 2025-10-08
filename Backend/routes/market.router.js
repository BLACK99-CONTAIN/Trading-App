// routes/market.router.js - Enhanced with Chart Routes
const express = require('express');
const {
  getExploreData,
  getStockDetails,
  getStockChart,
  getSectorStocks,
  searchStocks,
  getWatchlist
} = require('../controller/market.controller');

const router = express.Router();

// Public routes (no authentication required)
router.get('/explore', getExploreData);
router.get('/stock/:symbol', getStockDetails);
router.get('/chart/:symbol/:period', getStockChart); // New chart endpoint
router.get('/sector/:sector', getSectorStocks);
router.get('/search', searchStocks);

// Protected routes (authentication required)
router.get('/watchlist', getWatchlist);

module.exports = router;