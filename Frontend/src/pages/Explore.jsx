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
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Error fetching user data");
        setUser({ username: "User" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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
      // Mock data fallback
      setMarketData({
        trending: [
          { symbol: "RELIANCE", name: "Reliance Industries", price: 2456.75, change: 23.40, changePercent: 0.95, volume: "2.1M" },
          { symbol: "TCS", name: "Tata Consultancy Services", price: 3678.90, change: -15.20, changePercent: -0.41, volume: "1.8M" },
          { symbol: "INFY", name: "Infosys Limited", price: 1534.25, change: 12.45, changePercent: 0.82, volume: "3.2M" },
          { symbol: "HDFCBANK", name: "HDFC Bank Limited", price: 1678.30, change: 8.90, changePercent: 0.53, volume: "2.5M" },
          { symbol: "ICICIBANK", name: "ICICI Bank Limited", price: 967.45, change: 15.30, changePercent: 1.61, volume: "4.1M" },
        ],
        gainers: [
          { symbol: "ADANIPORTS", name: "Adani Ports & SEZ", price: 876.45, change: 45.20, changePercent: 5.44, volume: "1.2M" },
          { symbol: "TATASTEEL", name: "Tata Steel Limited", price: 134.75, change: 6.80, changePercent: 5.31, volume: "4.1M" },
        ],
        losers: [
          { symbol: "BHARTIARTL", name: "Bharti Airtel Limited", price: 912.35, change: -34.65, changePercent: -3.66, volume: "2.3M" },
          { symbol: "COAL", name: "Coal India Limited", price: 456.80, change: -18.90, changePercent: -3.98, volume: "3.2M" },
        ],
        news: [
          { title: "Market hits new highs amid strong quarterly results", time: "2 hours ago", source: "Economic Times" },
          { title: "RBI maintains repo rate, signals dovish stance", time: "4 hours ago", source: "Business Standard" },
        ],
        categories: [
          { name: "Technology", stocks: 156, icon: "💻", growth: "+2.1%" },
          { name: "Banking", stocks: 89, icon: "🏦", growth: "+1.4%" },
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

  // REMOVED LOADING SPINNER - Show content immediately if we have cached data
  if (loading && marketData.trending.length === 0) {
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