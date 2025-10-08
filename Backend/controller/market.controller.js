// controllers/market.controller.js
const axios = require('axios');

// Mock data for demonstration - In production, you'd fetch from real APIs
const mockStockData = {
  trending: [
    { 
      symbol: "RELIANCE", 
      name: "Reliance Industries", 
      price: 2456.75, 
      change: 23.40, 
      changePercent: 0.95, 
      volume: "2.1M",
      marketCap: "16.6L Cr",
      pe: 25.6
    },
    { 
      symbol: "TCS", 
      name: "Tata Consultancy Services", 
      price: 3678.90, 
      change: -15.20, 
      changePercent: -0.41, 
      volume: "1.8M",
      marketCap: "13.4L Cr",
      pe: 28.3
    },
    { 
      symbol: "INFY", 
      name: "Infosys Limited", 
      price: 1534.25, 
      change: 12.45, 
      changePercent: 0.82, 
      volume: "3.2M",
      marketCap: "6.4L Cr",
      pe: 23.1
    },
    { 
      symbol: "HDFCBANK", 
      name: "HDFC Bank Limited", 
      price: 1678.30, 
      change: 8.90, 
      changePercent: 0.53, 
      volume: "2.5M",
      marketCap: "12.8L Cr",
      pe: 19.7
    },
    {
      symbol: "ICICIBANK",
      name: "ICICI Bank Limited",
      price: 967.45,
      change: 15.30,
      changePercent: 1.61,
      volume: "4.1M",
      marketCap: "6.8L Cr",
      pe: 17.4
    }
  ],
  
  gainers: [
    { 
      symbol: "ADANIPORTS", 
      name: "Adani Ports & SEZ", 
      price: 876.45, 
      change: 45.20, 
      changePercent: 5.44, 
      volume: "1.2M",
      marketCap: "1.9L Cr",
      pe: 15.2
    },
    { 
      symbol: "TATASTEEL", 
      name: "Tata Steel Limited", 
      price: 134.75, 
      change: 6.80, 
      changePercent: 5.31, 
      volume: "4.1M",
      marketCap: "1.6L Cr",
      pe: 8.9
    },
    { 
      symbol: "BAJFINANCE", 
      name: "Bajaj Finance Limited", 
      price: 6789.10, 
      change: 234.50, 
      changePercent: 3.58, 
      volume: "890K",
      marketCap: "4.2L Cr",
      pe: 31.5
    },
    {
      symbol: "COALINDIA",
      name: "Coal India Limited",
      price: 245.80,
      change: 8.90,
      changePercent: 3.76,
      volume: "2.8M",
      marketCap: "1.5L Cr",
      pe: 12.1
    },
    {
      symbol: "JSWSTEEL",
      name: "JSW Steel Limited",
      price: 789.25,
      change: 25.40,
      changePercent: 3.33,
      volume: "1.9M",
      marketCap: "1.9L Cr",
      pe: 14.7
    }
  ],
  
  losers: [
    { 
      symbol: "BHARTIARTL", 
      name: "Bharti Airtel Limited", 
      price: 912.35, 
      change: -34.65, 
      changePercent: -3.66, 
      volume: "2.3M",
      marketCap: "5.1L Cr",
      pe: 22.8
    },
    { 
      symbol: "MARUTI", 
      name: "Maruti Suzuki India", 
      price: 10234.80, 
      change: -287.90, 
      changePercent: -2.74, 
      volume: "567K",
      marketCap: "3.1L Cr",
      pe: 28.9
    },
    {
      symbol: "ASIANPAINT",
      name: "Asian Paints Limited",
      price: 3234.50,
      change: -76.20,
      changePercent: -2.30,
      volume: "678K",
      marketCap: "3.1L Cr",
      pe: 45.2
    },
    {
      symbol: "NESTLEIND",
      name: "Nestle India Limited",
      price: 22456.75,
      change: -456.80,
      changePercent: -2.00,
      volume: "123K",
      marketCap: "2.2L Cr",
      pe: 67.8
    }
  ]
};

const mockNews = [
  {
    id: 1,
    title: "Market hits new highs amid strong quarterly results",
    summary: "Indian equity markets reached record levels as companies reported better-than-expected earnings.",
    time: "2 hours ago",
    source: "Economic Times",
    category: "Market",
    image: null
  },
  {
    id: 2,
    title: "RBI maintains repo rate, signals dovish stance",
    summary: "Reserve Bank of India keeps key policy rate unchanged at 6.5% in latest monetary policy review.",
    time: "4 hours ago",
    source: "Business Standard",
    category: "Policy",
    image: null
  },
  {
    id: 3,
    title: "Tech stocks rally on AI optimism",
    summary: "Technology sector gains momentum as investors bet on artificial intelligence growth prospects.",
    time: "6 hours ago",
    source: "Mint",
    category: "Technology",
    image: null
  },
  {
    id: 4,
    title: "Banking sector shows strong recovery trends",
    summary: "Major banks report improved asset quality and loan growth in latest quarterly results.",
    time: "8 hours ago",
    source: "Financial Express",
    category: "Banking",
    image: null
  },
  {
    id: 5,
    title: "Foreign investors turn bullish on Indian markets",
    summary: "FII inflows surge as global funds increase allocation to Indian equities.",
    time: "10 hours ago",
    source: "Bloomberg Quint",
    category: "Investment",
    image: null
  }
];

const mockCategories = [
  { 
    name: "Technology", 
    stocks: 156, 
    icon: "💻", 
    growth: "+2.1%",
    description: "IT Services, Software, Hardware",
    marketCap: "45.2L Cr"
  },
  { 
    name: "Banking", 
    stocks: 89, 
    icon: "🏦", 
    growth: "+1.4%",
    description: "Public & Private Banks",
    marketCap: "38.7L Cr"
  },
  { 
    name: "Healthcare", 
    stocks: 67, 
    icon: "🏥", 
    growth: "+0.8%",
    description: "Pharmaceuticals, Hospitals",
    marketCap: "22.1L Cr"
  },
  { 
    name: "Energy", 
    stocks: 45, 
    icon: "⚡", 
    growth: "-0.3%",
    description: "Oil & Gas, Renewable Energy",
    marketCap: "19.8L Cr"
  },
  { 
    name: "Automotive", 
    stocks: 78, 
    icon: "🚗", 
    growth: "+1.2%",
    description: "Cars, Two-wheelers, Auto Parts",
    marketCap: "15.6L Cr"
  },
  { 
    name: "FMCG", 
    stocks: 54, 
    icon: "🛒", 
    growth: "+0.6%",
    description: "Consumer Goods, Food & Beverages",
    marketCap: "18.3L Cr"
  },
  { 
    name: "Metals", 
    stocks: 42, 
    icon: "🏭", 
    growth: "+2.8%",
    description: "Steel, Aluminum, Mining",
    marketCap: "12.4L Cr"
  },
  { 
    name: "Real Estate", 
    stocks: 38, 
    icon: "🏢", 
    growth: "+3.2%",
    description: "Construction, Property Development",
    marketCap: "8.9L Cr"
  }
];

const mockIndices = {
  nifty50: {
    name: "NIFTY 50",
    value: 19674.25,
    change: 156.30,
    changePercent: 0.80,
    high: 19789.45,
    low: 19567.80
  },
  sensex: {
    name: "SENSEX",
    value: 66198.75,
    change: 445.87,
    changePercent: 0.68,
    high: 66345.20,
    low: 65892.30
  },
  banknifty: {
    name: "BANK NIFTY",
    value: 45123.80,
    change: -89.45,
    changePercent: -0.20,
    high: 45287.60,
    low: 44956.40
  }
};

// Helper function to add some randomness to mock data
const addMarketRandomness = (baseData) => {
  return baseData.map(stock => ({
    ...stock,
    price: stock.price + (Math.random() - 0.5) * 10,
    change: stock.change + (Math.random() - 0.5) * 5,
    changePercent: stock.changePercent + (Math.random() - 0.5) * 0.5
  }));
};

// === GET EXPLORE PAGE DATA ===
exports.getExploreData = async (req, res) => {
  try {
    // In production, you would fetch real data from APIs like:
    // - NSE API
    // - BSE API  
    // - Alpha Vantage
    // - Yahoo Finance
    // - News APIs

    const marketData = {
      indices: mockIndices,
      trending: addMarketRandomness(mockStockData.trending),
      gainers: addMarketRandomness(mockStockData.gainers),
      losers: addMarketRandomness(mockStockData.losers),
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
    
    // Find stock in our mock data
    const allStocks = [
      ...mockStockData.trending,
      ...mockStockData.gainers,
      ...mockStockData.losers
    ];
    
    const stock = allStocks.find(s => s.symbol === symbol.toUpperCase());
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Add additional details
    const stockDetails = {
      ...stock,
      description: `${stock.name} is a leading company in the Indian market.`,
      sector: "Technology", // This would be dynamic
      high52Week: stock.price * 1.2,
      low52Week: stock.price * 0.8,
      dividendYield: 1.5,
      bookValue: stock.price * 0.6,
      eps: stock.price / stock.pe,
      roe: 15.2,
      debtToEquity: 0.3
    };

    res.json(stockDetails);
  } catch (error) {
    console.error('Error fetching stock details:', error);
    res.status(500).json({ message: 'Failed to fetch stock details' });
  }
};

// === GET SECTOR STOCKS ===
exports.getSectorStocks = async (req, res) => {
  try {
    const { sector } = req.params;
    
    // Filter stocks by sector (mock implementation)
    let sectorStocks = [];
    
    switch (sector.toLowerCase()) {
      case 'technology':
        sectorStocks = mockStockData.trending.filter(s => 
          ['TCS', 'INFY'].includes(s.symbol)
        );
        break;
      case 'banking':
        sectorStocks = mockStockData.trending.filter(s => 
          ['HDFCBANK', 'ICICIBANK'].includes(s.symbol)
        );
        break;
      default:
        sectorStocks = mockStockData.trending.slice(0, 3);
    }

    res.json({
      sector: sector,
      stocks: addMarketRandomness(sectorStocks),
      totalStocks: sectorStocks.length
    });
  } catch (error) {
    console.error('Error fetching sector stocks:', error);
    res.status(500).json({ message: 'Failed to fetch sector stocks' });
  }
};

// === SEARCH STOCKS ===
exports.searchStocks = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ results: [] });
    }

    const allStocks = [
      ...mockStockData.trending,
      ...mockStockData.gainers,
      ...mockStockData.losers
    ];

    const results = allStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );

    res.json({ results: results.slice(0, 10) }); // Limit to 10 results
  } catch (error) {
    console.error('Error searching stocks:', error);
    res.status(500).json({ message: 'Failed to search stocks' });
  }
};

// === GET WATCHLIST (if user has stocks saved) ===
exports.getWatchlist = async (req, res) => {
  try {
    // In production, fetch user's watchlist from database
    const userId = req.user?.id; // from JWT middleware
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Mock watchlist data
    const watchlistStocks = mockStockData.trending.slice(0, 3);
    
    res.json({
      watchlist: addMarketRandomness(watchlistStocks),
      totalStocks: watchlistStocks.length
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ message: 'Failed to fetch watchlist' });
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
    'ICICIBANK': 967.45,
    'ADANIPORTS': 876.45,
    'TATASTEEL': 134.75,
    'BAJFINANCE': 6789.10
  };
  return prices[symbol.toUpperCase()] || 1000;
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