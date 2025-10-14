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
  AreaChart,
  Area
} from "recharts";

export default function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState("1D");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("BUY");
  const [priceType, setPriceType] = useState("MARKET");
  const [limitPrice, setLimitPrice] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else {
      fetchStockData();
      fetchChartData("1D");
    }
  }, [symbol]);

  const fetchStockData = async () => {
    try {
      const response = await fetch(`https://trading-app-backend-6ibt.onrender.com/api/market/stock/${symbol}`);
      const data = await response.json();
      setStock(data);
      setLimitPrice(data.price.toFixed(2));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (period) => {
    try {
      const response = await fetch(`https://trading-app-backend-6ibt.onrender.com/api/market/chart/${symbol}/${period}`);
      const data = await response.json();
      setChartData(data.chartData || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        symbol: stock.symbol,
        quantity: parseInt(quantity),
        orderType,
        priceType,
        price: priceType === "LIMIT" ? parseFloat(limitPrice) : stock.price
      };

      const response = await fetch("https://trading-app-backend-6ibt.onrender.com/api/orders/place", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert("Order placed successfully!");
        setQuantity(1);
        setPriceType("MARKET");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)" }}>
        <div style={{ textAlign: "center", color: "#a0a9b8" }}>
          <div style={{ width: "50px", height: "50px", border: "4px solid rgba(0, 255, 179, 0.1)", borderLeft: "4px solid #00ffb3", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!stock) return null;

  return (
    <div style={{ background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)", minHeight: "100vh", color: "#fff" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(0, 0, 0, 0.3)", padding: "1rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => navigate("/explore")} style={{ background: "none", border: "none", color: "#00ffb3", fontSize: "1.5rem", cursor: "pointer" }}>←</button>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{stock.symbol}</div>
              <div style={{ fontSize: "0.9rem", color: "#a0a9b8" }}>{stock.name}</div>
            </div>
          </div>
          <button onClick={() => navigate("/portfolio")} style={{ padding: "0.6rem 1.2rem", background: "rgba(0, 255, 179, 0.1)", border: "1px solid #00ffb3", borderRadius: "6px", color: "#00ffb3", cursor: "pointer", fontWeight: "600" }}>Portfolio</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem" }}>
          {/* Left Column - Chart & Info */}
          <div>
            {/* Price Overview */}
            <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "2rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#00ffb3", marginBottom: "0.5rem" }}>₹{stock.price.toFixed(2)}</div>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: stock.change >= 0 ? "#00ffb3" : "#ff4757" }}>
                    {stock.change >= 0 ? "▲" : "▼"} ₹{Math.abs(stock.change).toFixed(2)} ({stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", color: "#a0a9b8", marginBottom: "0.5rem" }}>Market Status</div>
                  <div style={{ fontSize: "0.9rem", color: "#00ffb3", fontWeight: "600" }}>Open</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#a0a9b8", marginBottom: "0.5rem" }}>Day High</div>
                  <div style={{ fontSize: "1rem", fontWeight: "600" }}>₹{(stock.price * 1.02).toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#a0a9b8", marginBottom: "0.5rem" }}>Day Low</div>
                  <div style={{ fontSize: "1rem", fontWeight: "600" }}>₹{(stock.price * 0.98).toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#a0a9b8", marginBottom: "0.5rem" }}>Volume</div>
                  <div style={{ fontSize: "1rem", fontWeight: "600" }}>{stock.volume}</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>Price Chart</div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {['1D', '1W', '1M', '3M', '6M', '1Y'].map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        setChartPeriod(p);
                        fetchChartData(p);
                      }}
                      style={{
                        padding: "0.4rem 0.8rem",
                        background: chartPeriod === p ? "linear-gradient(135deg, #00ffb3 0%, #00d4aa 100%)" : "rgba(255, 255, 255, 0.1)",
                        border: "1px solid " + (chartPeriod === p ? "transparent" : "rgba(255, 255, 255, 0.2)"),
                        borderRadius: "4px",
                        color: chartPeriod === p ? "#0a0e27" : "#a0a9b8",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        transition: "all 0.3s"
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ffb3" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00ffb3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" tick={{ fill: "#a0a9b8", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#a0a9b8", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "#1a1f3a", border: "1px solid #333", borderRadius: "6px" }} />
                  <Area type="monotone" dataKey="price" stroke="#00ffb3" strokeWidth={2} fill="url(#grad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Fundamentals */}
            <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.5rem" }}>Key Metrics</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                {[
                  { label: "Market Cap", value: stock.marketCap },
                  { label: "P/E Ratio", value: stock.pe },
                  { label: "52W High", value: "₹" + (stock.price * 1.25).toFixed(2) },
                  { label: "52W Low", value: "₹" + (stock.price * 0.75).toFixed(2) },
                  { label: "Dividend Yield", value: "1.2%" },
                  { label: "EPS", value: "₹" + (stock.price / stock.pe).toFixed(2) }
                ].map((metric, i) => (
                  <div key={i} style={{ borderRight: i % 3 !== 2 ? "1px solid rgba(255, 255, 255, 0.1)" : "none", paddingRight: i % 3 !== 2 ? "1rem" : "0" }}>
                    <div style={{ fontSize: "0.8rem", color: "#a0a9b8", marginBottom: "0.5rem" }}>{metric.label}</div>
                    <div style={{ fontSize: "1rem", fontWeight: "600" }}>{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Trading Panel */}
          <div>
            {/* Trade Tabs */}
            <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                {['BUY', 'SELL'].map(type => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    style={{
                      padding: "1rem",
                      background: orderType === type ? type === 'BUY' ? "rgba(0, 255, 179, 0.2)" : "rgba(255, 71, 87, 0.2)" : "transparent",
                      border: "none",
                      color: orderType === type ? (type === 'BUY' ? "#00ffb3" : "#ff4757") : "#a0a9b8",
                      cursor: "pointer",
                      fontWeight: "700",
                      transition: "all 0.3s"
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Order Form */}
              <div style={{ padding: "1.5rem" }}>
                {/* Quantity */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ fontSize: "0.8rem", color: "#a0a9b8", marginBottom: "0.5rem", display: "block" }}>Qty</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: "40px", height: "40px", background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "4px", color: "#00ffb3", cursor: "pointer", fontWeight: "700" }}>−</button>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} style={{ flex: 1, background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "4px", color: "#fff", textAlign: "center", fontWeight: "600" }} />
                    <button onClick={() => setQuantity(quantity + 1)} style={{ width: "40px", height: "40px", background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "4px", color: "#00ffb3", cursor: "pointer", fontWeight: "700" }}>+</button>
                  </div>
                </div>

                {/* Price Type */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ fontSize: "0.8rem", color: "#a0a9b8", marginBottom: "0.5rem", display: "block" }}>Price</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    {['MARKET', 'LIMIT'].map(type => (
                      <button
                        key={type}
                        onClick={() => setPriceType(type)}
                        style={{
                          padding: "0.6rem",
                          background: priceType === type ? "rgba(0, 255, 179, 0.2)" : "rgba(255, 255, 255, 0.1)",
                          border: "1px solid " + (priceType === type ? "#00ffb3" : "rgba(255, 255, 255, 0.2)"),
                          borderRadius: "4px",
                          color: priceType === type ? "#00ffb3" : "#a0a9b8",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.85rem"
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limit Price */}
                {priceType === 'LIMIT' && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "#a0a9b8", marginBottom: "0.5rem", display: "block" }}>Price (₹)</label>
                    <input type="number" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} style={{ width: "100%", padding: "0.6rem", background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "4px", color: "#fff", fontWeight: "600" }} />
                  </div>
                )}

                {/* Summary */}
                <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1rem", borderRadius: "6px", marginBottom: "1.25rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                    <span style={{ color: "#a0a9b8" }}>Qty</span>
                    <span style={{ fontWeight: "600" }}>{quantity}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: "700", color: "#00ffb3" }}>
                    <span>Total</span>
                    <span>₹{(quantity * (priceType === 'MARKET' ? stock.price : parseFloat(limitPrice || 0))).toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    background: orderType === 'BUY' ? "linear-gradient(135deg, #00ffb3 0%, #00d4aa 100%)" : "linear-gradient(135deg, #ff4757 0%, #ff3838 100%)",
                    border: "none",
                    borderRadius: "6px",
                    color: orderType === 'BUY' ? "#0a0e27" : "#fff",
                    fontWeight: "700",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  {orderType} {stock.symbol}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
