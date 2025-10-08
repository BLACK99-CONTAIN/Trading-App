import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import "../App.css";

export default function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState("1D");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("BUY");
  const [priceType, setPriceType] = useState("MARKET");
  const [limitPrice, setLimitPrice] = useState("");
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData(token);
    fetchStockData();
    fetchChartData("1D");
  }, [symbol]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchStockData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/market/stock/${symbol}`);
      const data = await response.json();
      setStock(data);
      setLimitPrice(data.price.toFixed(2));
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (period) => {
    try {
      const response = await fetch(`http://localhost:5000/api/market/chart/${symbol}/${period}`);
      const data = await response.json();
      setChartData(data.chartData || []);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Fallback mock chart data
      const mockData = generateMockChartData(period);
      setChartData(mockData);
    }
  };

  const generateMockChartData = (period) => {
    const dataPoints = period === "1D" ? 24 : period === "1W" ? 7 : 30;
    const basePrice = stock?.price || 2500;
    const data = [];

    for (let i = 0; i < dataPoints; i++) {
      const variation = (Math.random() - 0.5) * 0.1 * basePrice;
      const price = basePrice + variation + (i * 5);
      data.push({
        time: period === "1D" ? `${9 + Math.floor(i * 6.5 / dataPoints)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` 
             : period === "1W" ? new Date(Date.now() - (7-i) * 24 * 60 * 60 * 1000).toLocaleDateString()
             : new Date(Date.now() - (30-i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 100000) + 50000
      });
    }
    return data;
  };

  const handleChartPeriodChange = (period) => {
    setChartPeriod(period);
    fetchChartData(period);
  };

  const handleWatchlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/market/watchlist/${symbol}`, {
        method: isWatchlisted ? 'DELETE' : 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setIsWatchlisted(!isWatchlisted);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        symbol: stock.symbol,
        quantity: parseInt(quantity),
        orderType,
        priceType,
        price: priceType === 'LIMIT' ? parseFloat(limitPrice) : stock.price
      };

      const response = await fetch('http://localhost:5000/api/orders/place', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setShowOrderModal(false);
        alert(`${orderType} order placed successfully!`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-time">{label}</p>
          <p className="tooltip-price">₹{payload[0].value.toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="stock-loading">
        <div className="loading-spinner"></div>
        <p>Loading stock data...</p>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="stock-error">
        <h2>Stock not found</h2>
        <button onClick={() => navigate('/explore')}>Back to Explore</button>
      </div>
    );
  }

  return (
    <div className="stock-detail-container">
      {/* Header */}
      <header className="stock-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/explore')}>
            ←
          </button>
          <div className="stock-title">
            <div className="stock-logo">{stock.symbol.charAt(0)}</div>
            <div>
              <h1>{stock.symbol}</h1>
              <p>{stock.name}</p>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className={`watchlist-btn ${isWatchlisted ? 'active' : ''}`}
            onClick={handleWatchlist}
          >
            {isWatchlisted ? '★' : '☆'} Watchlist
          </button>
          <button className="alert-btn">🔔 Create Alert</button>
        </div>
      </header>

      {/* Price Section */}
      <section className="price-section">
        <div className="current-price">
          <span className="price">₹{stock.price.toLocaleString('en-IN')}</span>
          <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
            {stock.change >= 0 ? '+' : ''}₹{stock.change} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)
          </span>
        </div>
        <div className="price-range">
          <span>Day Range: ₹{(stock.price * 0.95).toFixed(2)} - ₹{(stock.price * 1.05).toFixed(2)}</span>
        </div>
      </section>

      {/* Chart Section */}
      <section className="chart-section">
        <div className="chart-controls">
          {['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'].map(period => (
            <button
              key={period}
              className={`chart-btn ${chartPeriod === period ? 'active' : ''}`}
              onClick={() => handleChartPeriodChange(period)}
            >
              {period}
            </button>
          ))}
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffb3" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ffb3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12 }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#00ffb3"
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">{stock.marketCap || '12.5L Cr'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">P/E Ratio</span>
            <span className="stat-value">{stock.pe || '25.6'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Volume</span>
            <span className="stat-value">{stock.volume}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">52W High</span>
            <span className="stat-value">₹{(stock.price * 1.25).toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">52W Low</span>
            <span className="stat-value">₹{(stock.price * 0.75).toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Dividend Yield</span>
            <span className="stat-value">1.2%</span>
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section className="order-section">
        <div className="order-tabs">
          <button 
            className={`order-tab ${orderType === 'BUY' ? 'active buy' : ''}`}
            onClick={() => setOrderType('BUY')}
          >
            BUY
          </button>
          <button 
            className={`order-tab ${orderType === 'SELL' ? 'active sell' : ''}`}
            onClick={() => setOrderType('SELL')}
          >
            SELL
          </button>
        </div>

        <div className="order-form">
          <div className="form-row">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="quantity-input"
            />
          </div>

          <div className="form-row">
            <label>Price Type</label>
            <div className="price-type-buttons">
              <button
                className={`price-type-btn ${priceType === 'MARKET' ? 'active' : ''}`}
                onClick={() => setPriceType('MARKET')}
              >
                Market
              </button>
              <button
                className={`price-type-btn ${priceType === 'LIMIT' ? 'active' : ''}`}
                onClick={() => setPriceType('LIMIT')}
              >
                Limit
              </button>
            </div>
          </div>

          {priceType === 'LIMIT' && (
            <div className="form-row">
              <label>Limit Price</label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                step="0.01"
                className="limit-price-input"
              />
            </div>
          )}

          <div className="order-summary">
            <div className="summary-row">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="summary-row">
              <span>Price</span>
              <span>₹{priceType === 'MARKET' ? stock.price.toFixed(2) : limitPrice}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{(quantity * (priceType === 'MARKET' ? stock.price : parseFloat(limitPrice || 0))).toFixed(2)}</span>
            </div>
          </div>

          <button 
            className={`place-order-btn ${orderType.toLowerCase()}`}
            onClick={handlePlaceOrder}
          >
            {orderType} {stock.symbol}
          </button>
        </div>
      </section>

      {/* Company Info */}
      <section className="company-info">
        <h3>About {stock.name}</h3>
        <p>
          {stock.name} is a leading company in the Indian stock market with strong fundamentals 
          and consistent growth trajectory. The company operates across multiple business segments 
          and has shown resilience in various market conditions.
        </p>
        
        <div className="key-metrics">
          <h4>Key Metrics</h4>
          <div className="metrics-grid">
            <div className="metric">
              <span>ROE</span>
              <span>15.2%</span>
            </div>
            <div className="metric">
              <span>Debt to Equity</span>
              <span>0.3</span>
            </div>
            <div className="metric">
              <span>EPS</span>
              <span>₹{(stock.price / (stock.pe || 25)).toFixed(2)}</span>
            </div>
            <div className="metric">
              <span>Book Value</span>
              <span>₹{(stock.price * 0.6).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}