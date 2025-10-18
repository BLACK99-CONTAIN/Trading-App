import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";

export default function Explore() {
  const [activeTab, setActiveTab] = useState("trending");
  const [marketData, setMarketData] = useState({
    trending: [],
    gainers: [],
    losers: [],
    news: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData(token);
    fetchMarketData();
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("https://trading-app-backend-6ibt.onrender.com/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
        // Token is invalid or expired, redirect to login
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        // For other errors, try to continue without user data
        console.error("Error fetching user data");
        setUser({ username: "User" }); // Default user
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Continue with default user on network error
      setUser({ username: "User" });
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await fetch("https://trading-app-backend-6ibt.onrender.com/api/market/explore");
      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      // Mock data fallback with MORE STOCKS
      setMarketData({
        trending: [
          { symbol: "RELIANCE", name: "Reliance Industries", price: 2456.75, change: 23.40, changePercent: 0.95, volume: "2.1M" },
          { symbol: "TCS", name: "Tata Consultancy Services", price: 3678.90, change: -15.20, changePercent: -0.41, volume: "1.8M" },
          { symbol: "INFY", name: "Infosys Limited", price: 1534.25, change: 12.45, changePercent: 0.82, volume: "3.2M" },
          { symbol: "HDFCBANK", name: "HDFC Bank Limited", price: 1678.30, change: 8.90, changePercent: 0.53, volume: "2.5M" },
          { symbol: "ICICIBANK", name: "ICICI Bank Limited", price: 967.45, change: 15.30, changePercent: 1.61, volume: "4.1M" },
          { symbol: "WIPRO", name: "Wipro Limited", price: 498.50, change: 5.20, changePercent: 1.05, volume: "2.8M" },
          { symbol: "LT", name: "Larsen & Toubro", price: 3567.20, change: 25.60, changePercent: 0.72, volume: "1.3M" },
          { symbol: "SBIN", name: "State Bank of India", price: 664.90, change: -4.20, changePercent: -0.63, volume: "3.8M" },
          { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1856.40, change: 12.50, changePercent: 0.68, volume: "1.2M" },
          { symbol: "AXISBANK", name: "Axis Bank Limited", price: 1089.30, change: 18.75, changePercent: 1.75, volume: "3.5M" },
          { symbol: "SUNPHARMA", name: "Sun Pharmaceuticals", price: 1245.80, change: -8.40, changePercent: -0.67, volume: "1.5M" },
          { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories", price: 6789.20, change: 45.60, changePercent: 0.68, volume: "890K" },
        ],
        gainers: [
          { symbol: "ADANIPORTS", name: "Adani Ports & SEZ", price: 876.45, change: 45.20, changePercent: 5.44, volume: "1.2M" },
          { symbol: "TATASTEEL", name: "Tata Steel Limited", price: 134.75, change: 6.80, changePercent: 5.31, volume: "4.1M" },
          { symbol: "BAJFINANCE", name: "Bajaj Finance Limited", price: 6789.10, change: 234.50, changePercent: 3.58, volume: "890K" },
          { symbol: "HINDALCO", name: "Hindalco Industries", price: 592.80, change: 21.30, changePercent: 3.73, volume: "2.4M" },
          { symbol: "ULTRACEMCO", name: "UltraTech Cement", price: 8765.90, change: 258.40, changePercent: 3.04, volume: "530K" },
          { symbol: "POWERGRID", name: "Power Grid Corporation", price: 254.40, change: 9.80, changePercent: 4.01, volume: "2.1M" },
          { symbol: "JSWSTEEL", name: "JSW Steel Limited", price: 856.20, change: 31.50, changePercent: 3.82, volume: "3.2M" },
          { symbol: "MARUTI", name: "Maruti Suzuki India", price: 10234.80, change: 156.40, changePercent: 1.55, volume: "567K" },
          { symbol: "M&M", name: "Mahindra & Mahindra", price: 2834.50, change: 89.20, changePercent: 3.25, volume: "1.9M" },
          { symbol: "VEDL", name: "Vedanta Limited", price: 445.60, change: 18.90, changePercent: 4.43, volume: "4.5M" },
          { symbol: "TECHM", name: "Tech Mahindra", price: 1234.50, change: 8.90, changePercent: 0.73, volume: "2.1M" },
          { symbol: "HCLTECH", name: "HCL Technologies", price: 1678.90, change: 12.40, changePercent: 0.74, volume: "1.6M" },
        ],
        losers: [
          { symbol: "BHARTIARTL", name: "Bharti Airtel Limited", price: 912.35, change: -34.65, changePercent: -3.66, volume: "2.3M" },
          { symbol: "COAL", name: "Coal India Limited", price: 456.80, change: -18.90, changePercent: -3.98, volume: "3.2M" },
          { symbol: "POWERGRID", name: "Power Grid Corp", price: 254.40, change: -12.45, changePercent: -3.58, volume: "2.1M" },
          { symbol: "ONGC", name: "Oil & Natural Gas", price: 287.50, change: -14.30, changePercent: -4.74, volume: "5.8M" },
          { symbol: "BPCL", name: "Bharat Petroleum", price: 345.20, change: -9.80, changePercent: -2.76, volume: "2.9M" },
          { symbol: "DLF", name: "DLF Limited", price: 892.30, change: -28.90, changePercent: -3.14, volume: "1.8M" },
          { symbol: "ASIANPAINT", name: "Asian Paints", price: 3245.60, change: -65.30, changePercent: -1.97, volume: "720K" },
          { symbol: "HEROMOTOCO", name: "Hero MotoCorp", price: 4810.20, change: -132.70, changePercent: -2.68, volume: "310K" },
          { symbol: "CIPLA", name: "Cipla Limited", price: 1567.80, change: -28.40, changePercent: -1.78, volume: "1.2M" },
          { symbol: "BRITANNIA", name: "Britannia Industries", price: 4234.50, change: -95.60, changePercent: -2.21, volume: "540K" },
          { symbol: "ITC", name: "ITC Limited", price: 451.10, change: -12.80, changePercent: -2.76, volume: "4.1M" },
          { symbol: "NESTLEIND", name: "Nestlé India", price: 21456.70, change: -456.80, changePercent: -2.08, volume: "210K" },
        ],
        news: [
          { title: "Market hits new highs amid strong quarterly results", time: "2 hours ago", source: "Economic Times" },
          { title: "RBI maintains repo rate, signals dovish stance", time: "4 hours ago", source: "Business Standard" },
          { title: "Tech stocks rally on AI optimism", time: "6 hours ago", source: "Mint" },
          { title: "Oil prices stabilize as global demand improves", time: "8 hours ago", source: "Moneycontrol" },
          { title: "Foreign inflows boost Indian equities", time: "1 day ago", source: "CNBC-TV18" },
        ],
        categories: [
          { name: "Technology", stocks: 156, icon: "💻", growth: "+2.1%" },
          { name: "Banking", stocks: 89, icon: "🏦", growth: "+1.4%" },
          { name: "Healthcare", stocks: 67, icon: "🏥", growth: "+0.8%" },
          { name: "Energy", stocks: 45, icon: "⚡", growth: "-0.3%" },
          { name: "FMCG", stocks: 52, icon: "🛒", growth: "+0.5%" },
          { name: "Metals", stocks: 38, icon: "⛏️", growth: "+1.8%" },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const renderStockCard = (stock) => (
    <div
      key={stock.symbol}
      className="stock-card"
      onClick={() => navigate(`/stock/${stock.symbol}`)}
    >
      <div className="stock-info">
        <div className="stock-symbol">{stock.symbol}</div>
        <div className="stock-name">{stock.name}</div>
        <div className="stock-volume">Vol: {stock.volume}</div>
      </div>
      <div className="stock-price">
        <div className="price">₹{stock.price.toLocaleString("en-IN")}</div>
        <div className={`change ${stock.change >= 0 ? "positive" : "negative"}`}>
          {stock.change >= 0 ? "+" : ""}
          ₹{stock.change} ({stock.changePercent >= 0 ? "+" : ""}
          {stock.changePercent}%)
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="explore-loading">
        <div className="loading-spinner"></div>
        <p>Loading market data...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="explore-container" style={{ paddingTop: "70px" }}>

        <section className="market-summary">
          <div className="summary-card">
            <div className="summary-title">NIFTY 50</div>
            <div className="summary-price">19,674.25</div>
            <div className="summary-change positive">+156.30 (+0.80%)</div>
          </div>
          <div className="summary-card">
            <div className="summary-title">SENSEX</div>
            <div className="summary-price">66,198.75</div>
            <div className="summary-change positive">+445.87 (+0.68%)</div>
          </div>
          <div className="summary-card">
            <div className="summary-title">BANK NIFTY</div>
            <div className="summary-price">45,123.80</div>
            <div className="summary-change negative">-89.45 (-0.20%)</div>
          </div>
        </section>

        <nav className="explore-tabs">
          {["trending", "gainers", "losers", "news"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <main className="explore-content">
          {activeTab === "trending" && (
            <section className="stocks-section">
              <h2>🔥 Trending Stocks</h2>
              <div className="stocks-list">
                {marketData.trending.map(renderStockCard)}
              </div>
            </section>
          )}

          {activeTab === "gainers" && (
            <section className="stocks-section">
              <h2>📈 Top Gainers</h2>
              <div className="stocks-list">
                {marketData.gainers.map(renderStockCard)}
              </div>
            </section>
          )}

          {activeTab === "losers" && (
            <section className="stocks-section">
              <h2>📉 Top Losers</h2>
              <div className="stocks-list">
                {marketData.losers.map(renderStockCard)}
              </div>
            </section>
          )}

          {activeTab === "news" && (
            <section className="news-section">
              <h2>📰 Market News</h2>
              <div className="news-list">
                {marketData.news.map((news, index) => (
                  <div key={index} className="news-card">
                    <div className="news-content">
                      <h3 className="news-title">{news.title}</h3>
                      <div className="news-meta">
                        <span className="news-source">{news.source}</span>
                        <span className="news-time">{news.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="categories-section">
            <div className="section-header">
              <h2>🏭 Sectors</h2>
              <button className="view-all-btn" onClick={() => navigate("/sectors")}>
                View All →
              </button>
            </div>
            <div className="categories-grid">
              {marketData.categories.map((category, index) => (
                <div
                  key={index}
                  className="category-card"
                  onClick={() => navigate(`/sectors/${category.name}`)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{category.stocks} stocks</p>
                    <div
                      className={`category-growth ${
                        category.growth.startsWith("+") ? "positive" : "negative"
                      }`}
                    >
                      {category.growth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}