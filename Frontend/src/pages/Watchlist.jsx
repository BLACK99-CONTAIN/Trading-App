import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/Watchlist.css";

export default function Watchlist() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const mockWatchlist = [
    { symbol: "MARUTI", name: "Maruti Suzuki India", price: 10234.80, change: -287.90, changePercent: -2.74, volume: "567K", pe: 15.8, sector: "Automotive" },
    { symbol: "BHARTIARTL", name: "Bharti Airtel Limited", price: 912.35, change: -34.65, changePercent: -3.66, volume: "2.3M", pe: 24.6, sector: "Telecom" },
    { symbol: "TATASTEEL", name: "Tata Steel Limited", price: 134.75, change: 6.80, changePercent: 5.31, volume: "4.1M", pe: 8.2, sector: "Metals" },
    { symbol: "ADANIPORTS", name: "Adani Ports & SEZ", price: 876.45, change: 45.20, changePercent: 5.44, volume: "1.2M", pe: 21.3, sector: "Infrastructure" },
    { symbol: "POWERGRID", name: "Power Grid Corporation", price: 254.40, change: 9.80, changePercent: 4.01, volume: "2.1M", pe: 18.9, sector: "Energy" },
    { symbol: "ASIANPAINT", name: "Asian Paints Limited", price: 3245.60, change: -65.30, changePercent: -1.97, volume: "720K", pe: 45.2, sector: "FMCG" },
    { symbol: "SUNPHARMA", name: "Sun Pharmaceuticals", price: 1210.50, change: -19.40, changePercent: -1.58, volume: "1.5M", pe: 18.9, sector: "Pharma" },
    { symbol: "HINDALCO", name: "Hindalco Industries", price: 678.90, change: 28.40, changePercent: 4.37, volume: "2.3M", pe: 12.5, sector: "Metals" },
  ];

  useEffect(() => {
    setWatchlist(mockWatchlist);
    setLoading(false);
  }, []);

  const handleAddToWatchlist = () => {
    if (newSymbol.trim()) {
      const newStock = {
        symbol: newSymbol.toUpperCase(),
        name: `${newSymbol.toUpperCase()} Company`,
        price: Math.random() * 1000 + 100,
        change: (Math.random() - 0.5) * 100,
        changePercent: (Math.random() - 0.5) * 10,
        volume: `${Math.random() * 5 + 0.5}M`,
        pe: Math.random() * 30 + 10,
        sector: "Technology"
      };
      setWatchlist([...watchlist, newStock]);
      setNewSymbol("");
      setShowAddForm(false);
    }
  };

  const handleRemoveFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
  };

  const indices = [
    { name: "NIFTY 50", value: 25285.35, change: 103.55, changePercent: 0.41 },
    { name: "SENSEX", value: 82500.82, change: 328.72, changePercent: 0.40 },
    { name: "BANKNIFTY", value: 56609.75, change: 417.70, changePercent: 0.74 },
    { name: "MIDCPNIFTY", value: 13149.55, change: 115.00, changePercent: 0.88 },
  ];

  const gainers = watchlist.filter(s => s.change > 0);
  const losers = watchlist.filter(s => s.change < 0);

  if (loading) {
    return (
      <div className="watchlist-loading">
        <div className="loading-spinner"></div>
        <p>Loading watchlist...</p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="watchlist-container">
      {/* Index Ticker */}
      <section className="index-ticker">
        <div className="ticker-wrapper">
          {indices.map((idx) => (
            <div key={idx.name} className="ticker-item">
              <div className="ticker-name">{idx.name}</div>
              <div className="ticker-value">{idx.value.toLocaleString()}</div>
              <div className={`ticker-change ${idx.change >= 0 ? "positive" : "negative"}`}>
                {idx.change >= 0 ? "+" : ""}₹{idx.change} ({idx.changePercent}%)
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="watchlist-content">
        {/* Watchlist Stats */}
        <section className="watchlist-stats">
          <div className="stats-box">
            <div className="stats-item">
              <div className="stats-label">Total Watchlist</div>
              <div className="stats-value">{watchlist.length}</div>
            </div>
            <div className="stats-item">
              <div className="stats-label">Gainers</div>
              <div className="stats-value positive">{gainers.length}</div>
            </div>
            <div className="stats-item">
              <div className="stats-label">Losers</div>
              <div className="stats-value negative">{losers.length}</div>
            </div>
            <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
              + Add Stock
            </button>
          </div>
        </section>

        {/* Add Stock Form */}
        {showAddForm && (
          <section className="add-stock-form">
            <div className="form-box">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Enter stock symbol (e.g., RELIANCE)"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddToWatchlist()}
                  className="form-input"
                  autoFocus
                />
                <button className="form-btn" onClick={handleAddToWatchlist}>
                  Add
                </button>
                <button className="form-cancel" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Watchlist Items */}
        {watchlist.length > 0 ? (
          <section className="watchlist-section">
            <h2 className="section-title">📌 My Watchlist</h2>
            <div className="watchlist-items">
              {watchlist.map((stock) => {
                const isPositive = stock.change >= 0;
                return (
                  <div key={stock.symbol} className="watchlist-card">
                    <div className="card-header">
                      <div className="card-left">
                        <div className="symbol-circle">{stock.symbol.charAt(0)}</div>
                        <div className="stock-info">
                          <div className="stock-symbol">{stock.symbol}</div>
                          <div className="stock-name">{stock.name}</div>
                        </div>
                      </div>
                      <button
                        className="favorite-btn"
                        onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                        title="Remove from watchlist"
                      >
                        <Heart size={20} fill="#00ffb3" stroke="#00ffb3" />
                      </button>
                    </div>

                    <div className="card-content">
                      <div className="price-section">
                        <div className="current-price">₹{stock.price.toLocaleString()}</div>
                        <div className={`price-change ${isPositive ? "positive" : "negative"}`}>
                          {isPositive ? "▲" : "▼"} {isPositive ? "+" : ""}₹{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                      </div>

                      <div className="card-stats">
                        <div className="stat">
                          <span className="stat-label">Volume</span>
                          <span className="stat-value">{stock.volume}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">P/E</span>
                          <span className="stat-value">{stock.pe.toFixed(1)}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Sector</span>
                          <span className="stat-value">{stock.sector}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <button
                        className="trade-btn"
                        onClick={() => navigate(`/stock/${stock.symbol}`)}
                      >
                        View & Trade →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No stocks in your watchlist</h3>
            <p>Add stocks to keep track of your favorite companies</p>
            <button className="empty-add-btn" onClick={() => setShowAddForm(true)}>
              + Add Stock
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}