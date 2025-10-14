import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Portfolio() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('holdings');
  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalInvested: 0,
    totalPnL: 0,
    todayPnL: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData(token);
    fetchOrders(token);
    fetchHoldings(token);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('https://trading-app-backend-6ibt.onrender.com/api/users/me', {
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

  const fetchOrders = async (token) => {
    try {
      const response = await fetch('https://trading-app-backend-6ibt.onrender.com/api/orders/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Mock data for demo
      setOrders([
        {
          _id: '1',
          symbol: 'RELIANCE',
          quantity: 10,
          orderType: 'BUY',
          priceType: 'MARKET',
          executedPrice: 2450.50,
          status: 'EXECUTED',
          placedAt: new Date().toISOString()
        },
        {
          _id: '2',
          symbol: 'TCS',
          quantity: 5,
          orderType: 'BUY',
          priceType: 'LIMIT',
          price: 3650.00,
          executedPrice: 3650.00,
          status: 'EXECUTED',
          placedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHoldings = async (token) => {
    try {
      const response = await fetch('https://trading-app-backend-6ibt.onrender.com/api/portfolio/holdings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHoldings(data.holdings || []);
        calculatePortfolioStats(data.holdings || []);
      }
    } catch (error) {
      console.error('Error fetching holdings:', error);
      // Mock data for demo
      const mockHoldings = [
        {
          symbol: 'RELIANCE',
          name: 'Reliance Industries',
          quantity: 10,
          avgPrice: 2450.50,
          currentPrice: 2456.75,
          invested: 24505.00,
          currentValue: 24567.50,
          pnl: 62.50,
          pnlPercent: 0.26
        },
        {
          symbol: 'TCS',
          name: 'Tata Consultancy Services',
          quantity: 5,
          avgPrice: 3650.00,
          currentPrice: 3678.90,
          invested: 18250.00,
          currentValue: 18394.50,
          pnl: 144.50,
          pnlPercent: 0.79
        }
      ];
      setHoldings(mockHoldings);
      calculatePortfolioStats(mockHoldings);
    }
  };

  const calculatePortfolioStats = (holdings) => {
    const stats = holdings.reduce((acc, holding) => {
      acc.totalValue += holding.currentValue;
      acc.totalInvested += holding.invested;
      acc.totalPnL += holding.pnl;
      return acc;
    }, { totalValue: 0, totalInvested: 0, totalPnL: 0, todayPnL: 0 });

    stats.todayPnL = stats.totalPnL * 0.1; // Mock today's P&L
    setPortfolioStats(stats);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://trading-app-backend-6ibt.onrender.com/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchOrders(token);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EXECUTED': return 'status-success';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      case 'REJECTED': return 'status-rejected';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="loading-spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Header */}
      <header className="portfolio-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/explore')}>
            ←
          </button>
          <h1>My Portfolio</h1>
        </div>
        <div className="header-right">
          <span className="user-greeting">Welcome, {user?.username}</span>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}>
            Logout
          </button>
        </div>
      </header>

      {/* Portfolio Summary */}
      <section className="portfolio-summary">
        <div className="summary-card-large">
          <div className="summary-label">Total Portfolio Value</div>
          <div className="summary-value-large">₹{portfolioStats.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div className="summary-sub">
            <span className="invested">Invested: ₹{portfolioStats.totalInvested.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total P&L</div>
          <div className={`summary-value ${portfolioStats.totalPnL >= 0 ? 'positive' : 'negative'}`}>
            {portfolioStats.totalPnL >= 0 ? '+' : ''}₹{portfolioStats.totalPnL.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className={`summary-percent ${portfolioStats.totalPnL >= 0 ? 'positive' : 'negative'}`}>
            {((portfolioStats.totalPnL / portfolioStats.totalInvested) * 100).toFixed(2)}%
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Today's P&L</div>
          <div className={`summary-value ${portfolioStats.todayPnL >= 0 ? 'positive' : 'negative'}`}>
            {portfolioStats.todayPnL >= 0 ? '+' : ''}₹{portfolioStats.todayPnL.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="summary-percent small">Since yesterday</div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="portfolio-tabs">
        <button
          className={`tab-btn ${activeTab === 'holdings' ? 'active' : ''}`}
          onClick={() => setActiveTab('holdings')}
        >
          <span className="tab-icon">📊</span>
          Holdings ({holdings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <span className="tab-icon">📋</span>
          Orders ({orders.length})
        </button>
      </nav>

      {/* Content */}
      <main className="portfolio-content">
        {activeTab === 'holdings' && (
          <section className="holdings-section">
            {holdings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📈</div>
                <h3>No Holdings Yet</h3>
                <p>Start investing to build your portfolio</p>
                <button className="explore-btn" onClick={() => navigate('/explore')}>
                  Explore Stocks
                </button>
              </div>
            ) : (
              <div className="holdings-list">
                {holdings.map((holding, index) => (
                  <div key={index} className="holding-card" onClick={() => navigate(`/stock/${holding.symbol}`)}>
                    <div className="holding-header">
                      <div className="holding-info">
                        <div className="holding-symbol">{holding.symbol}</div>
                        <div className="holding-name">{holding.name}</div>
                        <div className="holding-quantity">{holding.quantity} shares</div>
                      </div>
                      <div className="holding-values">
                        <div className="current-value">₹{holding.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                        <div className={`holding-pnl ${holding.pnl >= 0 ? 'positive' : 'negative'}`}>
                          {holding.pnl >= 0 ? '+' : ''}₹{holding.pnl.toFixed(2)} ({holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent}%)
                        </div>
                      </div>
                    </div>
                    <div className="holding-details">
                      <div className="detail-item">
                        <span className="detail-label">Avg. Price</span>
                        <span className="detail-value">₹{holding.avgPrice.toFixed(2)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Current Price</span>
                        <span className="detail-value">₹{holding.currentPrice.toFixed(2)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Invested</span>
                        <span className="detail-value">₹{holding.invested.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="holding-actions">
                      <button className="action-btn buy-btn" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/stock/${holding.symbol}`);
                      }}>
                        + Buy More
                      </button>
                      <button className="action-btn sell-btn" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/stock/${holding.symbol}`);
                      }}>
                        Sell
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="orders-section">
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Orders Yet</h3>
                <p>Your order history will appear here</p>
                <button className="explore-btn" onClick={() => navigate('/explore')}>
                  Start Trading
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <div className="order-symbol">{order.symbol}</div>
                        <div className="order-meta">
                          <span className={`order-type ${order.orderType.toLowerCase()}`}>
                            {order.orderType}
                          </span>
                          <span className="order-price-type">{order.priceType}</span>
                          <span className="order-quantity">{order.quantity} shares</span>
                        </div>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="order-details">
                      <div className="detail-row">
                        <span className="detail-label">Order Price</span>
                        <span className="detail-value">
                          ₹{order.priceType === 'LIMIT' ? order.price?.toFixed(2) : 'Market Price'}
                        </span>
                      </div>
                      {order.executedPrice && (
                        <div className="detail-row">
                          <span className="detail-label">Executed Price</span>
                          <span className="detail-value">₹{order.executedPrice.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Total Value</span>
                        <span className="detail-value">
                          ₹{((order.executedPrice || order.price || 0) * order.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Time</span>
                        <span className="detail-value">
                          {new Date(order.placedAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                    {order.status === 'PENDING' && (
                      <div className="order-actions">
                        <button 
                          className="cancel-order-btn"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
