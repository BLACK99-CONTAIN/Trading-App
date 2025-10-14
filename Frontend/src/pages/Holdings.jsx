import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Holdings.css";

export default function Holdings() {
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockHoldings = [
    { symbol: "RELIANCE", name: "Reliance Industries", qty: 10, avgPrice: 2400, currentPrice: 2456.75, invested: 24000, current: 24567.5, dayChange: 23.40, dayChangePercent: 0.95, change: 567.5, changePercent: 2.36 },
    { symbol: "TCS", name: "Tata Consultancy", qty: 5, avgPrice: 3700, currentPrice: 3678.90, invested: 18500, current: 18394.5, dayChange: -15.20, dayChangePercent: -0.41, change: -105.5, changePercent: -0.57 },
    { symbol: "INFY", name: "Infosys Limited", qty: 8, avgPrice: 1520, currentPrice: 1534.25, invested: 12160, current: 12274, dayChange: 12.45, dayChangePercent: 0.82, change: 114.25, changePercent: 0.94 },
    { symbol: "HDFCBANK", name: "HDFC Bank", qty: 12, avgPrice: 1650, currentPrice: 1678.30, invested: 19800, current: 20139.6, dayChange: 8.90, dayChangePercent: 0.53, change: 337.6, changePercent: 1.72 },
    { symbol: "ICICIBANK", name: "ICICI Bank", qty: 15, avgPrice: 950, currentPrice: 967.45, invested: 14250, current: 14511.75, dayChange: 15.30, dayChangePercent: 1.61, change: 260.75, changePercent: 1.83 },
    { symbol: "WIPRO", name: "Wipro Limited", qty: 20, avgPrice: 480, currentPrice: 498.50, invested: 9600, current: 9970, dayChange: 5.20, dayChangePercent: 1.05, change: 370, changePercent: 3.85 },
  ];

  useEffect(() => {
    setHoldings(mockHoldings);
    setLoading(false);
  }, []);

  const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.current, 0);
  const totalGain = totalCurrent - totalInvested;
  const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  const indices = [
    { name: "NIFTY 50", value: 25285.35, change: 103.55, changePercent: 0.41 },
    { name: "SENSEX", value: 82500.82, change: 328.72, changePercent: 0.40 },
    { name: "BANKNIFTY", value: 56609.75, change: 417.70, changePercent: 0.74 },
    { name: "MIDCPNIFTY", value: 13149.55, change: 115.00, changePercent: 0.88 },
  ];

  if (loading) {
    return (
      <div className="holdings-loading">
        <div className="loading-spinner"></div>
        <p>Loading holdings...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="holdings-container" style={{ paddingTop: "70px" }}>
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

        <div className="holdings-content">
          {/* Portfolio Summary */}
          <section className="portfolio-summary">
            <div className="summary-box">
              <div className="summary-item">
                <div className="summary-label">Invested</div>
                <div className="summary-value">₹{totalInvested.toLocaleString()}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Current Value</div>
                <div className="summary-value">₹{totalCurrent.toLocaleString()}</div>
              </div>
              <div className="summary-item">
                <div className={`summary-label ${totalGain >= 0 ? "positive" : "negative"}`}>Total Gain/Loss</div>
                <div className={`summary-value ${totalGain >= 0 ? "positive" : "negative"}`}>
                  {totalGain >= 0 ? "+" : ""}₹{Math.abs(totalGain).toLocaleString()} ({totalGainPercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </section>

          {/* Holdings List */}
          <section className="holdings-section">
            <h2 className="section-title">Your Holdings ({holdings.length})</h2>
            <div className="holdings-list">
              {holdings.map((stock) => {
                const isProfit = stock.change >= 0;
                const isDayPositive = stock.dayChange >= 0;
                return (
                  <div key={stock.symbol} className="holding-card">
                    <div className="holding-header">
                      <div className="holding-left">
                        <div className="symbol-badge">{stock.symbol.charAt(0)}</div>
                        <div className="holding-info">
                          <div className="holding-symbol">{stock.symbol}</div>
                          <div className="holding-name">{stock.name}</div>
                        </div>
                      </div>
                      <button className="view-btn" onClick={() => navigate(`/stock/${stock.symbol}`)}>
                        View →
                      </button>
                    </div>

                    <div className="holding-stats">
                      <div className="stat">
                        <span className="stat-label">Qty</span>
                        <span className="stat-value">{stock.qty}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Avg Price</span>
                        <span className="stat-value">₹{stock.avgPrice.toLocaleString()}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Current</span>
                        <span className="stat-value">₹{stock.currentPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="holding-prices">
                      <div className="price-info">
                        <div className="invested-label">Invested</div>
                        <div className="invested-value">₹{stock.invested.toLocaleString()}</div>
                      </div>
                      <div className="divider"></div>
                      <div className="current-info">
                        <div className="current-value">₹{stock.current.toLocaleString()}</div>
                        <div className={`gain-loss ${isProfit ? "positive" : "negative"}`}>
                          {isProfit ? "+" : ""}₹{Math.abs(stock.change).toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>

                    <div className={`day-change ${isDayPositive ? "positive" : "negative"}`}>
                      Today: {isDayPositive ? "+" : ""}₹{stock.dayChange.toFixed(2)} ({stock.dayChangePercent.toFixed(2)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}