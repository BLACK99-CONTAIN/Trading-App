import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Positions.css";

export default function Positions() {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockPositions = [
    {
      symbol: "NIFTY50",
      name: "NIFTY 50 Index Future",
      type: "LONG",
      qty: 1,
      entryPrice: 19500,
      currentPrice: 19674.25,
      multiplier: 50,
      invested: 975000,
      current: 983712.5,
      change: 8712.5,
      changePercent: 0.89,
      dayChange: 156.30,
      dayChangePercent: 0.80,
      status: "OPEN"
    },
    {
      symbol: "BANKNIFTY",
      name: "BANK NIFTY Index Future",
      type: "SHORT",
      qty: 1,
      entryPrice: 45300,
      currentPrice: 45123.80,
      multiplier: 40,
      invested: 1812000,
      current: 1804952,
      change: -7048,
      changePercent: -0.39,
      dayChange: 417.70,
      dayChangePercent: 0.74,
      status: "OPEN"
    },
    {
      symbol: "RELIANCE",
      name: "Reliance Industries - Call Option",
      type: "LONG",
      qty: 100,
      entryPrice: 45,
      currentPrice: 52.30,
      multiplier: 1,
      invested: 4500,
      current: 5230,
      change: 730,
      changePercent: 16.22,
      dayChange: 2.50,
      dayChangePercent: 5.00,
      status: "OPEN"
    },
    {
      symbol: "TCS",
      name: "TCS - Put Option",
      type: "SHORT",
      qty: 50,
      entryPrice: 120,
      currentPrice: 115.50,
      multiplier: 1,
      invested: 6000,
      current: 5775,
      change: -225,
      changePercent: -3.75,
      dayChange: 1.20,
      dayChangePercent: 1.05,
      status: "OPEN"
    },
  ];

  useEffect(() => {
    setPositions(mockPositions);
    setLoading(false);
  }, []);

  const totalInvested = positions.reduce((sum, p) => sum + p.invested, 0);
  const totalCurrent = positions.reduce((sum, p) => sum + p.current, 0);
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
      <div className="positions-loading">
        <div className="loading-spinner"></div>
        <p>Loading positions...</p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="positions-container" style={{ paddingTop: "70px" }}>
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

      <div className="positions-content">
        {/* Portfolio Summary */}
        <section className="portfolio-summary">
          <div className="summary-box">
            <div className="summary-item">
              <div className="summary-label">Margin Used</div>
              <div className="summary-value">₹{totalInvested.toLocaleString()}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Current Value</div>
              <div className="summary-value">₹{totalCurrent.toLocaleString()}</div>
            </div>
            <div className="summary-item">
              <div className={`summary-label ${totalGain >= 0 ? "positive" : "negative"}`}>Unrealized P&L</div>
              <div className={`summary-value ${totalGain >= 0 ? "positive" : "negative"}`}>
                {totalGain >= 0 ? "+" : ""}₹{Math.abs(totalGain).toLocaleString()} ({totalGainPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </section>

        {/* Positions List */}
        <section className="positions-section">
          <h2 className="section-title">Active Positions ({positions.length})</h2>
          <div className="positions-list">
            {positions.map((position) => {
              const isLong = position.type === "LONG";
              const isProfit = position.change >= 0;
              const isDayPositive = position.dayChange >= 0;
              return (
                <div key={position.symbol} className="position-card">
                  <div className="position-header">
                    <div className="position-left">
                      <div className={`type-badge ${isLong ? "long" : "short"}`}>
                        {isLong ? "LONG" : "SHORT"}
                      </div>
                      <div className="position-info">
                        <div className="position-symbol">{position.symbol}</div>
                        <div className="position-name">{position.name}</div>
                      </div>
                    </div>
                    <div className="position-status">
                      <span className="status-badge">{position.status}</span>
                    </div>
                  </div>

                  <div className="position-stats">
                    <div className="stat">
                      <span className="stat-label">Qty</span>
                      <span className="stat-value">{position.qty}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Entry</span>
                      <span className="stat-value">₹{position.entryPrice.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Current</span>
                      <span className="stat-value">₹{position.currentPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="position-prices">
                    <div className="price-info">
                      <div className="invested-label">Margin</div>
                      <div className="invested-value">₹{position.invested.toLocaleString()}</div>
                    </div>
                    <div className="divider"></div>
                    <div className="current-info">
                      <div className="current-value">₹{position.current.toLocaleString()}</div>
                      <div className={`gain-loss ${isProfit ? "positive" : "negative"}`}>
                        {isProfit ? "+" : ""}₹{Math.abs(position.change).toFixed(2)} ({position.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>

                  <div className="position-footer">
                    <div className={`day-change ${isDayPositive ? "positive" : "negative"}`}>
                      Today: {isDayPositive ? "+" : ""}₹{position.dayChange.toFixed(2)} ({position.dayChangePercent.toFixed(2)}%)
                    </div>
                    <button className="close-btn">Close Position</button>
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