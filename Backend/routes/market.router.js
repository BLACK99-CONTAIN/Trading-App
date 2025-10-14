// routes/market.router.js - FIXED VERSION

const express = require('express');
const router = express.Router();

// Import all controller functions
const {
  getExploreData,
  getStockDetails,
  getStockChart,
  searchStocks,
  getSectorStocks,
  getWatchlist
} = require('../controller/market.controller');

// Public routes
router.get('/explore', getExploreData);
router.get('/stock/:symbol', getStockDetails);
router.get('/chart/:symbol/:period', getStockChart);
router.get('/search', searchStocks);
router.get('/sector/:sector', getSectorStocks);
router.get('/watchlist', getWatchlist);

module.exports = router;