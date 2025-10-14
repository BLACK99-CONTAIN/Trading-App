import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

export default function Sectors() {
  const navigate = useNavigate();
  const { sector } = useParams();
  const [selectedSector, setSelectedSector] = useState(sector || 'Technology');
  const [sectorStocks, setSectorStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectors = [
    { 
      name: "Technology", 
      icon: "💻", 
      color: "#00d4ff",
      stocks: ['TCS', 'INFY', 'WIPRO', 'TECHM', 'HCLTECH']
    },
    { 
      name: "Banking", 
      icon: "🏦", 
      color: "#ff6b6b",
      stocks: ['HDFCBANK', 'ICICIBANK', 'KOTAKBANK', 'AXISBANK', 'SBIN']
    },
    { 
      name: "Healthcare", 
      icon: "🏥", 
      color: "#51cf66",
      stocks: ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIVISLAB', 'APOLLOHOSP']
    },
    { 
      name: "Energy", 
      icon: "⚡", 
      color: "#ffd43b",
      stocks: ['RELIANCE', 'ONGC', 'BPCL', 'IOC', 'NTPC']
    },
    { 
      name: "Automotive", 
      icon: "🚗", 
      color: "#ff922b",
      stocks: ['MARUTI', 'TATAMOTORS', 'M&M', 'BAJAJ-AUTO', 'EICHERMOT']
    },
    { 
      name: "FMCG", 
      icon: "🛒", 
      color: "#845ef7",
      stocks: ['HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA', 'DABUR']
    },
    { 
      name: "Metals", 
      icon: "🏭", 
      color: "#868e96",
      stocks: ['TATASTEEL', 'HINDALCO', 'JSWSTEEL', 'COALINDIA', 'VEDL']
    },
    { 
      name: "Real Estate", 
      icon: "🏢", 
      color: "#20c997",
      stocks: ['DLF', 'GODREJPROP', 'OBEROIRLTY', 'PRESTIGE', 'BRIGADE']
    }
  ];

  useEffect(() => {
    fetchSectorStocks(selectedSector);
  }, [selectedSector]);

  const fetchSectorStocks = async (sector) => {
    setLoading(true);
    try {
      const response = await fetch(`https://trading-app-backend-6ibt.onrender.com/api/market/sector/${sector}`);
      const data = await response.json();
      setSectorStocks(data.stocks || []);
    } catch (error) {
      console.error('Error fetching sector stocks:', error);
      // Mock data
      generateMockSectorStocks(sector);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSectorStocks = (sectorName) => {
    const sectorData = sectors.find(s => s.name === sectorName);
    if (!sectorData) return;

    const mockStocks = sectorData.stocks.map((symbol, index) => ({
      symbol,
      name: `${symbol} Limited`,
      price: Math.random() * 3000 + 500,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 5,
      volume: `${(Math.random() * 5 + 0.5).toFixed(1)}M`,
      marketCap: `${(Math.random() * 10 + 1).toFixed(1)}L Cr`,
      pe: (15 + Math.random() * 30).toFixed(1)
    }));

    setSectorStocks(mockStocks);
  };

  const handleSectorChange = (sector) => {
    setSelectedSector(sector);
    navigate(`/sectors/${sector}`);
  };

  const currentSectorData = sectors.find(s => s.name === selectedSector);

  return (
    <div className="sectors-container">
      {/* Header */}
      <header className="sectors-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/explore')}>
            ←
          </button>
          <h1>Sectors</h1>
        </div>
        <button className="home-btn" onClick={() => navigate('/explore')}>
          Home
        </button>
      </header>

      {/* Sector Grid */}
      <section className="sector-selector">
        <h2>Choose a Sector</h2>
        <div className="sectors-grid">
          {sectors.map((sector) => (
            <button
              key={sector.name}
              className={`sector-btn ${selectedSector === sector.name ? 'active' : ''}`}
              onClick={() => handleSectorChange(sector.name)}
              style={{ '--sector-color': sector.color }}
            >
              <div className="sector-icon">{sector.icon}</div>
              <div className="sector-name">{sector.name}</div>
              <div className="sector-count">{sector.stocks.length} stocks</div>
            </button>
          ))}
        </div>
      </section>

      {/* Sector Header */}
      {currentSectorData && (
        <section className="sector-header-section">
          <div className="sector-title">
            <span className="sector-icon-large">{currentSectorData.icon}</span>
            <div>
              <h2>{currentSectorData.name}</h2>
              <p>{sectorStocks.length} stocks available</p>
            </div>
          </div>
        </section>
      )}

      {/* Stocks List */}
      <section className="sector-stocks">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading stocks...</p>
          </div>
        ) : sectorStocks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No stocks available</h3>
            <p>Try selecting a different sector</p>
          </div>
        ) : (
          <div className="stocks-grid">
            {sectorStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="sector-stock-card"
                onClick={() => navigate(`/stock/${stock.symbol}`)}
              >
                <div className="stock-card-header">
                  <div className="stock-logo-circle">{stock.symbol.charAt(0)}</div>
                  <div className="stock-basic-info">
                    <div className="stock-symbol">{stock.symbol}</div>
                    <div className="stock-name">{stock.name}</div>
                  </div>
                </div>

                <div className="stock-price-section">
                  <div className="stock-price">₹{stock.price.toFixed(2)}</div>
                  <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    <span className="change-arrow">{stock.change >= 0 ? '▲' : '▼'}</span>
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </div>
                </div>

                <div className="stock-stats">
                  <div className="stat">
                    <span className="stat-label">Volume</span>
                    <span className="stat-value">{stock.volume}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">P/E</span>
                    <span className="stat-value">{stock.pe}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Mkt Cap</span>
                    <span className="stat-value">{stock.marketCap}</span>
                  </div>
                </div>

                <div className="stock-card-footer">
                  <button className="quick-buy-btn">Quick Buy</button>
                  <button className="view-details-btn">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
