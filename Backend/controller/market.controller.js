// controllers/market.controller.js - Complete working version
const axios = require('axios');

// Mock stock data
const mockStockData = {
  trending: [
    { 
      symbol: "RELIANCE", 
      name: "Reliance Industries Ltd", 
      price: 2456.75, 
      change: 23.40, 
      changePercent: 0.95, 
      volume: "2.1M",
      marketCap: "16.6L Cr",
      pe: 25.6,
      sector: "Energy",
      exchange: "NSE"
    },
    { 
      symbol: "TCS", 
      name: "Tata Consultancy Services", 
      price: 3678.90, 
      change: -15.20, 
      changePercent: -0.41, 
      volume: "1.8M",
      marketCap: "13.4L Cr",
      pe: 28.3,
      sector: "Technology",
      exchange: "NSE"
    },
    { 
      symbol: "INFY", 
      name: "Infosys Limited", 
      price: 1534.25, 
      change: 12.45, 
      changePercent: 0.82, 
      volume: "3.2M",
      marketCap: "6.4L Cr",
      pe: 23.1,
      sector: "Technology",
      exchange: "NSE"
    },
    { 
      symbol: "HDFCBANK", 
      name: "HDFC Bank Limited", 
      price: 1678.30, 
      change: 8.90, 
      changePercent: 0.53, 
      volume: "2.5M",
      marketCap: "12.8L Cr",
      pe: 19.7,
      sector: "Banking",
      exchange: "NSE"
    }
  ]
};

// Helper function to generate mock chart data
const generateMockChartData = (symbol, period) => {
  const basePrice = getBasePrice(symbol);
  const dataPoints = getDataPoints(period);
  const data = [];
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = getTimestamp(period, i, dataPoints);
    const priceVariation = (Math.random() - 0.5) * 0.05 * basePrice;
    const trendFactor = (i / dataPoints) * 0.1 * basePrice;
    const price = basePrice + priceVariation + trendFactor;
    
    data.push({
      time: timestamp,
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      high: parseFloat((price * (1 + Math.random() * 0.02)).toFixed(2)),
      low: parseFloat((price * (1 - Math.random() * 0.02)).toFixed(2)),
      open: parseFloat((price + (Math.random() - 0.5) * 10).toFixed(2))
    });
  }
  
  return data;
};

const getBasePrice = (symbol) => {
  const prices = {
    'RELIANCE': 2456.75,
    'TCS': 3678.90,
    'INFY': 1534.25,
    'HDFCBANK': 1678.30,
    'ICICIBANK': 967.45
  };
  return prices[symbol] || 1000;
};

const getDataPoints = (period) => {
  const points = {
    '1D': 78,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    'ALL': 1000
  };
  return points[period] || 30;
};

const getTimestamp = (period, index, total) => {
  const now = new Date();
  
  switch (period) {
    case '1D':
      const tradingStart = new Date(now);
      tradingStart.setHours(9, 15, 0, 0);
      const minutes = Math.floor(index * 390 / total);
      const time = new Date(tradingStart.getTime() + minutes * 60000);
      return time.toTimeString().slice(0, 5);
    
    case '1W':
      const weekStart = new Date(now.getTime() - (6 - index) * 24 * 60 * 60 * 1000);
      return weekStart.toLocaleDateString('en-IN');
    
    default:
      const daysAgo = total - index - 1;
      const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      return date.toLocaleDateString('en-IN');
  }
};

// === GET EXPLORE PAGE DATA ===
exports.getExploreData = async (req, res) => {
  try {
    const mockIndices = {
      nifty50: {
        name: "NIFTY 50",
        value: 19674.25,
        change: 156.30,
        changePercent: 0.80
      },
      sensex: {
        name: "SENSEX",
        value: 66198.75,
        change: 445.87,
        changePercent: 0.68
      },
      banknifty: {
        name: "BANK NIFTY",
        value: 45123.80,
        change: -89.45,
        changePercent: -0.20
      }
    };

    const mockNews = [
      {
        id: 1,
        title: "Market hits new highs amid strong quarterly results",
        time: "2 hours ago",
        source: "Economic Times"
      },
      {
        id: 2,
        title: "RBI maintains repo rate, signals dovish stance", 
        time: "4 hours ago",
        source: "Business Standard"
      },
      {
        id: 3,
        title: "Tech stocks rally on AI optimism",
        time: "6 hours ago",
        source: "Mint"
      }
    ];

    const mockCategories = [
      { name: "Technology", stocks: 156, icon: "💻", growth: "+2.1%" },
      { name: "Banking", stocks: 89, icon: "🏦", growth: "+1.4%" },
      { name: "Healthcare", stocks: 67, icon: "🏥", growth: "+0.8%" },
      { name: "Energy", stocks: 45, icon: "⚡", growth: "-0.3%" },
      { name: "Automotive", stocks: 78, icon: "🚗", growth: "+1.2%" },
      { name: "FMCG", stocks: 54, icon: "🛒", growth: "+0.6%" }
    ];

    const marketData = {
      indices: mockIndices,
      trending: mockStockData.trending,
      gainers: mockStockData.trending.filter(s => s.change > 0),
      losers: mockStockData.trending.filter(s => s.change < 0),
      news: mockNews,
      categories: mockCategories,
      marketStatus: {
        isOpen: true,
        nextClose: "15:30",
        timezone: "IST"
      }
    };

    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ message: 'Failed to fetch market data' });
  }
};

// === GET STOCK DETAILS ===
exports.getStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    let stock = mockStockData.trending.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    
    if (!stock) {
      const basePrice = Math.random() * 1000 + 100;
      const change = (Math.random() - 0.5) * 20;
      
      stock = {
        symbol: symbol.toUpperCase(),
        name: `${symbol} Corporation`,
        price: parseFloat(basePrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat((change / basePrice * 100).toFixed(2)),
        volume: `${(Math.random() * 5 + 0.5).toFixed(1)}M`,
        marketCap: `${(Math.random() * 100 + 10).toFixed(1)}L Cr`,
        pe: parseFloat((15 + Math.random() * 20).toFixed(1)),
        sector: "Technology",
        exchange: "NSE"
      };
    }
    
    const enhancedStock = {
      ...stock,
      description: `${stock.name} is a leading company with strong market presence and consistent growth trajectory.`,
      high52Week: parseFloat((stock.price * 1.25).toFixed(2)),
      low52Week: parseFloat((stock.price * 0.75).toFixed(2)),
      dividendYield: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
      bookValue: parseFloat((stock.price * 0.6).toFixed(2)),
      eps: parseFloat((stock.price / (stock.pe || 25)).toFixed(2)),
      roe: parseFloat((10 + Math.random() * 15).toFixed(1)),
      debtToEquity: parseFloat((Math.random() * 0.8).toFixed(2))
    };
    
    res.json(enhancedStock);
  } catch (error) {
    console.error('Error fetching stock details:', error);
    res.status(500).json({ message: 'Failed to fetch stock details' });
  }
};

// === GET STOCK CHART DATA ===
exports.getStockChart = async (req, res) => {
  try {
    const { symbol, period = '1D' } = req.params;
    
    const chartData = generateMockChartData(symbol, period);
    
    res.json({
      symbol,
      period,
      chartData,
      dataSource: 'mock'
    });
    
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Failed to fetch chart data' });
  }
};

// === SEARCH STOCKS ===
exports.searchStocks = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 1) {
      return res.json({ results: [] });
    }
    
    const results = mockStockData.trending.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({ 
      results: results.slice(0, 10),
      query: query
    });
  } catch (error) {
    console.error('Error searching stocks:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};
// ADD THESE TWO FUNCTIONS TO THE END OF YOUR market.controller.js FILE

// === GET SECTOR STOCKS ===
exports.getSectorStocks = async (req, res) => {
  try {
    const { sector } = req.params;
    
    // Mock data by sector
    const sectorStocks = {
      'Technology': [
        { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3678.90, change: -15.20, changePercent: -0.41, volume: '1.8M', marketCap: '13.4L Cr', pe: 28.3 },
        { symbol: 'INFY', name: 'Infosys Limited', price: 1534.25, change: 12.45, changePercent: 0.82, volume: '3.2M', marketCap: '6.4L Cr', pe: 23.1 }
      ],
      'Banking': [
        { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', price: 1678.30, change: 8.90, changePercent: 0.53, volume: '2.5M', marketCap: '12.8L Cr', pe: 19.7 },
        { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', price: 967.45, change: 15.30, changePercent: 1.61, volume: '4.1M', marketCap: '6.8L Cr', pe: 17.4 }
      ],
      'Energy': [
        { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: 2456.75, change: 23.40, changePercent: 0.95, volume: '2.1M', marketCap: '16.6L Cr', pe: 25.6 }
      ]
    };

    const stocks = sectorStocks[sector] || [];

    res.json({
      sector: sector,
      stocks: stocks,
      totalStocks: stocks.length
    });
  } catch (error) {
    console.error('Error fetching sector stocks:', error);
    res.status(500).json({ message: 'Failed to fetch sector stocks' });
  }
};

// === GET WATCHLIST ===
exports.getWatchlist = async (req, res) => {
  try {
    // In production, fetch user's watchlist from database
    // For now, return mock watchlist
    const watchlistStocks = mockStockData.trending.slice(0, 3);
    
    res.json({
      watchlist: watchlistStocks,
      totalStocks: watchlistStocks.length
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ message: 'Failed to fetch watchlist' });
  }
};