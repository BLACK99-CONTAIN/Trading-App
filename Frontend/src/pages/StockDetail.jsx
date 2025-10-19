import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import { TrendingUp, TrendingDown, ArrowLeft, Activity, Plus, Search, Code, Save, X } from "lucide-react";

export default function StockTerminal() {
  const [stock] = useState({
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: 2456.75,
    change: 23.40,
    changePercent: 0.95,
    volume: "2.1M",
    open: 2433.35,
    high: 2467.80,
    low: 2425.50,
    prevClose: 2433.35,
    marketCap: "16.62 Lac Cr",
    pe: 28.45,
    high52w: 2856.15,
    low52w: 2220.30
  });

  const [chartData, setChartData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState("1D");
  const [chartType, setChartType] = useState("area");
  const [indicators, setIndicators] = useState([]);
  const [showIndicators, setShowIndicators] = useState(false);
  const [showPineEditor, setShowPineEditor] = useState(false);
  const [showCustomIndicator, setShowCustomIndicator] = useState(false);
  const [pineScript, setPineScript] = useState("");
  const [searchIndicator, setSearchIndicator] = useState("");
  const [customIndicators, setCustomIndicators] = useState([]);
  const [orderType, setOrderType] = useState("BUY");
  const [quantity, setQuantity] = useState(1);
  const [priceType, setPriceType] = useState("MARKET");
  const [limitPrice, setLimitPrice] = useState("");

  // Comprehensive list of indicators
  const allIndicators = [
    // Moving Averages
    { id: "sma", name: "SMA (Simple Moving Average)", category: "Moving Averages", color: "#fbbf24" },
    { id: "ema", name: "EMA (Exponential Moving Average)", category: "Moving Averages", color: "#60a5fa" },
    { id: "wma", name: "WMA (Weighted Moving Average)", category: "Moving Averages", color: "#fb923c" },
    { id: "dema", name: "DEMA (Double Exponential MA)", category: "Moving Averages", color: "#a78bfa" },
    { id: "tema", name: "TEMA (Triple Exponential MA)", category: "Moving Averages", color: "#ec4899" },
    { id: "vwma", name: "VWMA (Volume Weighted MA)", category: "Moving Averages", color: "#14b8a6" },
    
    // Oscillators
    { id: "rsi", name: "RSI (Relative Strength Index)", category: "Oscillators", color: "#f472b6" },
    { id: "macd", name: "MACD (Moving Average Convergence Divergence)", category: "Oscillators", color: "#34d399" },
    { id: "stochastic", name: "Stochastic Oscillator", category: "Oscillators", color: "#8b5cf6" },
    { id: "cci", name: "CCI (Commodity Channel Index)", category: "Oscillators", color: "#f59e0b" },
    { id: "williams", name: "Williams %R", category: "Oscillators", color: "#10b981" },
    { id: "momentum", name: "Momentum", category: "Oscillators", color: "#06b6d4" },
    { id: "roc", name: "ROC (Rate of Change)", category: "Oscillators", color: "#84cc16" },
    
    // Volatility
    { id: "bb", name: "Bollinger Bands", category: "Volatility", color: "#a78bfa" },
    { id: "atr", name: "ATR (Average True Range)", category: "Volatility", color: "#f97316" },
    { id: "keltner", name: "Keltner Channels", category: "Volatility", color: "#06b6d4" },
    { id: "donchian", name: "Donchian Channels", category: "Volatility", color: "#8b5cf6" },
    
    // Volume
    { id: "volume", name: "Volume", category: "Volume", color: "#94a3b8" },
    { id: "obv", name: "OBV (On Balance Volume)", category: "Volume", color: "#14b8a6" },
    { id: "vwap", name: "VWAP (Volume Weighted Average Price)", category: "Volume", color: "#f59e0b" },
    { id: "mfi", name: "MFI (Money Flow Index)", category: "Volume", color: "#ec4899" },
    
    // Trend
    { id: "adx", name: "ADX (Average Directional Index)", category: "Trend", color: "#10b981" },
    { id: "ichimoku", name: "Ichimoku Cloud", category: "Trend", color: "#6366f1" },
    { id: "parabolic", name: "Parabolic SAR", category: "Trend", color: "#f43f5e" },
    { id: "supertrend", name: "SuperTrend", category: "Trend", color: "#22c55e" },
    
    // Support/Resistance
    { id: "pivot", name: "Pivot Points", category: "Support/Resistance", color: "#eab308" },
    { id: "fibonacci", name: "Fibonacci Retracement", category: "Support/Resistance", color: "#a855f7" },
    
    // Others
    { id: "zigzag", name: "ZigZag", category: "Others", color: "#06b6d4" },
    { id: "elder", name: "Elder Ray Index", category: "Others", color: "#84cc16" },
  ];

  const availableIndicators = [...allIndicators, ...customIndicators];

  useEffect(() => {
    generateChartData("1D");
  }, []);

  const generateChartData = (period) => {
    const periods = {
      "1D": 78,
      "5D": 390,
      "1M": 22,
      "3M": 66,
      "6M": 132,
      "1Y": 252,
      "5Y": 1260
    };

    const points = periods[period] || 78;
    const basePrice = 2400;
    const data = [];
    const volData = [];
    let price = basePrice;

    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.48) * 20;
      price = Math.max(2200, Math.min(2700, price + change));
      
      const high = price + Math.random() * 15;
      const low = price - Math.random() * 15;
      const open = i === 0 ? basePrice : data[i - 1].close;
      const close = price;

      let timeLabel;
      if (period === "1D") {
        const hour = 9 + Math.floor((i / points) * 7);
        const minute = (i % 4) * 15;
        timeLabel = `${hour}:${minute.toString().padStart(2, '0')}`;
      } else if (period === "5D") {
        const day = Math.floor(i / 78);
        timeLabel = `Day ${day + 1}`;
      } else {
        const date = new Date();
        date.setDate(date.getDate() - (points - i));
        timeLabel = `${date.getDate()}/${date.getMonth() + 1}`;
      }

      data.push({
        time: timeLabel,
        price: parseFloat(price.toFixed(2)),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2))
      });

      volData.push({
        time: timeLabel,
        volume: Math.floor(Math.random() * 500000 + 100000)
      });
    }

    if (indicators.includes("sma")) {
      const sma20 = calculateSMA(data, 20);
      data.forEach((point, i) => point.sma = sma20[i]);
    }

    if (indicators.includes("ema")) {
      const ema12 = calculateEMA(data, 12);
      data.forEach((point, i) => point.ema = ema12[i]);
    }

    if (indicators.includes("bb")) {
      const bb = calculateBollingerBands(data, 20);
      data.forEach((point, i) => {
        point.bbUpper = bb.upper[i];
        point.bbMiddle = bb.middle[i];
        point.bbLower = bb.lower[i];
      });
    }

    if (indicators.includes("rsi")) {
      const rsi = calculateRSI(data, 14);
      data.forEach((point, i) => point.rsi = rsi[i]);
    }

    setChartData(data);
    setVolumeData(volData);
  };

  const calculateSMA = (data, period) => {
    const sma = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(null);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
        sma.push(parseFloat((sum / period).toFixed(2)));
      }
    }
    return sma;
  };

  const calculateEMA = (data, period) => {
    const ema = [];
    const multiplier = 2 / (period + 1);
    let prevEma = data[0].close;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        ema.push(prevEma);
      } else {
        const currentEma = (data[i].close - prevEma) * multiplier + prevEma;
        ema.push(parseFloat(currentEma.toFixed(2)));
        prevEma = currentEma;
      }
    }
    return ema;
  };

  const calculateBollingerBands = (data, period) => {
    const sma = calculateSMA(data, period);
    const upper = [], middle = [], lower = [];

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        upper.push(null);
        middle.push(null);
        lower.push(null);
      } else {
        const slice = data.slice(i - period + 1, i + 1);
        const mean = sma[i];
        const variance = slice.reduce((acc, val) => acc + Math.pow(val.close - mean, 2), 0) / period;
        const stdDev = Math.sqrt(variance);
        
        upper.push(parseFloat((mean + 2 * stdDev).toFixed(2)));
        middle.push(mean);
        lower.push(parseFloat((mean - 2 * stdDev).toFixed(2)));
      }
    }
    return { upper, middle, lower };
  };

  const calculateRSI = (data, period) => {
    const rsi = [];
    let gains = 0, losses = 0;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        rsi.push(50);
        continue;
      }

      const change = data[i].close - data[i - 1].close;
      if (change > 0) gains += change;
      else losses += Math.abs(change);

      if (i < period) {
        rsi.push(50);
      } else {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        const rsiValue = 100 - (100 / (1 + rs));
        rsi.push(parseFloat(rsiValue.toFixed(2)));
      }
    }
    return rsi;
  };

  const toggleIndicator = (indicatorId) => {
    setIndicators(prev => {
      const newIndicators = prev.includes(indicatorId)
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId];
      return newIndicators;
    });
    setTimeout(() => generateChartData(chartPeriod), 10);
  };

  const handlePeriodChange = (period) => {
    setChartPeriod(period);
    generateChartData(period);
  };

  const savePineScript = () => {
    if (pineScript.trim()) {
      const newIndicator = {
        id: `custom_${Date.now()}`,
        name: `Custom Indicator ${customIndicators.length + 1}`,
        category: "Custom",
        color: "#" + Math.floor(Math.random()*16777215).toString(16),
        pineScript: pineScript
      };
      setCustomIndicators([...customIndicators, newIndicator]);
      setPineScript("");
      setShowPineEditor(false);
      alert("Custom indicator saved successfully!");
    }
  };

  const handlePlaceOrder = () => {
    const orderData = {
      symbol: stock.symbol,
      quantity: quantity,
      orderType: orderType,
      priceType: priceType,
      price: priceType === "LIMIT" ? parseFloat(limitPrice) : stock.price
    };
    alert(`Order Placed:\n${orderType} ${quantity} shares of ${stock.symbol}\nPrice: ₹${orderData.price}`);
  };

  const filteredIndicators = availableIndicators.filter(ind => 
    ind.name.toLowerCase().includes(searchIndicator.toLowerCase()) ||
    ind.category.toLowerCase().includes(searchIndicator.toLowerCase())
  );

  const groupedIndicators = filteredIndicators.reduce((acc, ind) => {
    if (!acc[ind.category]) acc[ind.category] = [];
    acc[ind.category].push(ind);
    return acc;
  }, {});

  const isPositive = stock.change >= 0;

  return (
    <div style={{ background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(0, 0, 0, 0.3)", padding: "1rem 2rem", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1800px", margin: "0 auto", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button style={{ background: "none", border: "none", color: "#00ffb3", fontSize: "1.5rem", cursor: "pointer", display: "flex", alignItems: "center", padding: "0.5rem" }}>
              <ArrowLeft size={24} />
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{stock.symbol}</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#00ffb3" }}>₹{stock.price.toFixed(2)}</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: isPositive ? "#00ffb3" : "#ff4757", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  {isPositive ? "+" : ""}₹{Math.abs(stock.change).toFixed(2)} ({isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                </div>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#a0a9b8", marginTop: "0.25rem" }}>{stock.name}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              style={{
                padding: "0.6rem 1.2rem",
                background: showIndicators ? "rgba(0, 255, 179, 0.2)" : "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${showIndicators ? "#00ffb3" : "rgba(255, 255, 255, 0.1)"}`,
                borderRadius: "6px",
                color: showIndicators ? "#00ffb3" : "#a0a9b8",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s"
              }}
            >
              <Activity size={18} />
              Indicators
            </button>
            <button
              onClick={() => setShowPineEditor(!showPineEditor)}
              style={{
                padding: "0.6rem 1.2rem",
                background: showPineEditor ? "rgba(138, 43, 226, 0.2)" : "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${showPineEditor ? "#8a2be2" : "rgba(255, 255, 255, 0.1)"}`,
                borderRadius: "6px",
                color: showPineEditor ? "#a78bfa" : "#a0a9b8",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s"
              }}
            >
              <Code size={18} />
              Pine Editor
            </button>
          </div>
        </div>
      </div>

      {/* Indicators Panel */}
      {showIndicators && (
        <div style={{ background: "rgba(0, 0, 0, 0.5)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", padding: "1.5rem 2rem", maxHeight: "70vh", overflowY: "auto" }}>
          <div style={{ maxWidth: "1800px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ fontSize: "1.1rem", color: "#fff", fontWeight: "700" }}>Technical Indicators Library</div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
                  <Search size={18} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#a0a9b8" }} />
                  <input
                    type="text"
                    placeholder="Search indicators..."
                    value={searchIndicator}
                    onChange={(e) => setSearchIndicator(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem 0.6rem 2.5rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      color: "#fff",
                      fontSize: "0.9rem"
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowCustomIndicator(true)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    background: "linear-gradient(135deg, #00ffb3 0%, #00d4aa 100%)",
                    border: "none",
                    borderRadius: "6px",
                    color: "#0a0e27",
                    cursor: "pointer",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.9rem"
                  }}
                >
                  <Plus size={18} />
                  Add Custom
                </button>
              </div>
            </div>

            {Object.entries(groupedIndicators).map(([category, inds]) => (
              <div key={category} style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.85rem", color: "#00ffb3", marginBottom: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {category} ({inds.length})
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  {inds.map(indicator => (
                    <button
                      key={indicator.id}
                      onClick={() => toggleIndicator(indicator.id)}
                      style={{
                        padding: "0.6rem 1rem",
                        background: indicators.includes(indicator.id) ? `${indicator.color}30` : "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${indicators.includes(indicator.id) ? indicator.color : "rgba(255, 255, 255, 0.1)"}`,
                        borderRadius: "6px",
                        color: indicators.includes(indicator.id) ? indicator.color : "#a0a9b8",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        transition: "all 0.3s",
                        position: "relative"
                      }}
                    >
                      {indicator.name}
                      {indicator.pineScript && (
                        <Code size={14} style={{ marginLeft: "0.5rem", display: "inline" }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pine Script Editor */}
      {showPineEditor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ background: "linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%)", borderRadius: "12px", width: "100%", maxWidth: "900px", maxHeight: "80vh", overflow: "hidden", border: "1px solid rgba(0, 255, 179, 0.2)" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Code size={24} style={{ color: "#a78bfa" }} />
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>Pine Script Editor</div>
                  <div style={{ fontSize: "0.85rem", color: "#a0a9b8" }}>Create your custom indicator</div>
                </div>
              </div>
              <button onClick={() => setShowPineEditor(false)} style={{ background: "none", border: "none", color: "#a0a9b8", cursor: "pointer", padding: "0.5rem" }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.9rem", color: "#a0a9b8", marginBottom: "0.5rem" }}>Pine Script Code:</div>
                <textarea
                  value={pineScript}
                  onChange={(e) => setPineScript(e.target.value)}
                  placeholder={`//@version=5
indicator("My Custom Indicator", overlay=true)

// Example: Simple Moving Average
length = input.int(20, "Length")
sma_value = ta.sma(close, length)

plot(sma_value, color=color.blue, linewidth=2)

// Add your custom logic here...`}
                  style={{
                    width: "100%",
                    height: "300px",
                    padding: "1rem",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "0.9rem",
                    resize: "vertical"
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowPineEditor(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                    color: "#a0a9b8",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={savePineScript}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <Save size={18} />
                  Save Indicator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: "1800px", margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem" }}>
        {/* Left: Chart Section */}
        <div>
          {/* Stats Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Open", value: `₹${stock.open.toFixed(2)}` },
              { label: "High", value: `₹${stock.high.toFixed(2)}`, color: "#00ffb3" },
              { label: "Low", value: `₹${stock.low.toFixed(2)}`, color: "#ff4757" },
              { label: "Prev Close", value: `₹${stock.prevClose.toFixed(2)}` },
              { label: "Volume", value: stock.volume },
              { label: "Market Cap", value: stock.marketCap },
              { label: "P/E Ratio", value: stock.pe },
              { label: "52W High", value: `₹${stock.high52w.toFixed(2)}` },
              { label: "52W Low", value: `₹${stock.low52w.toFixed(2)}` }
            ].map((stat, i) => (
              <div key={i} style={{ background: "rgba(255, 255, 255, 0.05)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <div style={{ fontSize: "0.7rem", color: "#a0a9b8", marginBottom: "0.25rem" }}>{stat.label}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "600", color: stat.color || "#fff" }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Chart Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'].map(p => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: chartPeriod === p ? "linear-gradient(135deg, #00ffb3 0%, #00d4aa 100%)" : "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${chartPeriod === p ? "transparent" : "rgba(255, 255, 255, 0.1)"}`,
                    borderRadius: "6px",
                    color: chartPeriod === p ? "#0a0e27" : "#a0a9b8",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    transition: "all 0.3s"
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                { id: "line", name: "Line", icon: "📈" },
                { id: "area", name: "Area", icon: "📊" },
                { id: "candlestick", name: "Candle", icon: "🕯️" }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: chartType === type.id ? "rgba(0, 255, 179, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${chartType === type.id ? "#00ffb3" : "rgba(255, 255, 255, 0.1)"}`,
                    borderRadius: "6px",
                    color: chartType === type.id ? "#00ffb3" : "#a0a9b8",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    transition: "all 0.3s"
                  }}
                >
                  {type.icon} {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Chart */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
            <ResponsiveContainer width="100%" height={500}>
              {chartType === "area" ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ffb3" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00ffb3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: "#a0a9b8", fontSize: 11 }}
                    interval={Math.floor(chartData.length / 10)}
                  />
                  <YAxis 
                    domain={['dataMin - 10', 'dataMax + 10']}
                    tick={{ fill: "#a0a9b8", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ background: "#1a1f3a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                    labelStyle={{ color: "#a0a9b8" }}
                  />
                  <Area type="monotone" dataKey="close" stroke="#00ffb3" strokeWidth={2} fill="url(#colorPrice)" />
                  {indicators.includes("sma") && <Area type="monotone" dataKey="sma" stroke="#fbbf24" strokeWidth={2} fill="none" dot={false} />}
                  {indicators.includes("ema") && <Area type="monotone" dataKey="ema" stroke="#60a5fa" strokeWidth={2} fill="none" dot={false} />}
                  {indicators.includes("bb") && (
                    <>
                      <Area type="monotone" dataKey="bbUpper" stroke="#a78bfa" strokeWidth={1} fill="none" strokeDasharray="3 3" dot={false} />
                      <Area type="monotone" dataKey="bbMiddle" stroke="#a78bfa" strokeWidth={1.5} fill="none" dot={false} />
                      <Area type="monotone" dataKey="bbLower" stroke="#a78bfa" strokeWidth={1} fill="none" strokeDasharray="3 3" dot={false} />
                    </>
                  )}
                </AreaChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: "#a0a9b8", fontSize: 11 }}
                    interval={Math.floor(chartData.length / 10)}
                  />
                  <YAxis 
                    domain={['dataMin - 10', 'dataMax + 10']}
                    tick={{ fill: "#a0a9b8", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ background: "#1a1f3a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                    labelStyle={{ color: "#a0a9b8" }}
                  />
                  <Line type="monotone" dataKey="close" stroke="#00ffb3" strokeWidth={2} dot={false} />
                  {indicators.includes("sma") && <Line type="monotone" dataKey="sma" stroke="#fbbf24" strokeWidth={2} dot={false} />}
                  {indicators.includes("ema") && <Line type="monotone" dataKey="ema" stroke="#60a5fa" strokeWidth={2} dot={false} />}
                  {indicators.includes("bb") && (
                    <>
                      <Line type="monotone" dataKey="bbUpper" stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                      <Line type="monotone" dataKey="bbMiddle" stroke="#a78bfa" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="bbLower" stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                    </>
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Volume Chart */}
          {indicators.includes("volume") && (
            <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.9rem", color: "#a0a9b8", marginBottom: "1rem", fontWeight: "600" }}>Volume</div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: "#a0a9b8", fontSize: 10 }}
                    interval={Math.floor(volumeData.length / 10)}
                  />
                  <YAxis tick={{ fill: "#a0a9b8", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: "#1a1f3a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                  />
                  <Bar dataKey="volume" fill="#94a3b8" opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* RSI Chart */}
          {indicators.includes("rsi") && (
            <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ fontSize: "0.9rem", color: "#a0a9b8", marginBottom: "1rem", fontWeight: "600" }}>RSI (Relative Strength Index)</div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fill: "#a0a9b8", fontSize: 10 }}
                    interval={Math.floor(chartData.length / 10)}
                  />
                  <YAxis domain={[0, 100]} tick={{ fill: "#a0a9b8", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: "#1a1f3a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                  />
                  <Line type="monotone" dataKey="rsi" stroke="#f472b6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.75rem", color: "#a0a9b8" }}>
                <span>Oversold (&lt;30)</span>
                <span>Neutral (30-70)</span>
                <span>Overbought (&gt;70)</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Trading Panel */}
        <div>
          {/* Order Tabs */}
          <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              {['BUY', 'SELL'].map(type => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  style={{
                    padding: "1rem",
                    background: orderType === type ? (type === 'BUY' ? "rgba(0, 255, 179, 0.2)" : "rgba(255, 71, 87, 0.2)") : "transparent",
                    border: "none",
                    color: orderType === type ? (type === 'BUY' ? "#00ffb3" : "#ff4757") : "#a0a9b8",
                    cursor: "pointer",
                    fontWeight: "700",
                    transition: "all 0.3s",
                    fontSize: "1rem"
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
                <label style={{ fontSize: "0.85rem", color: "#a0a9b8", marginBottom: "0.5rem", display: "block", fontWeight: "600" }}>Quantity</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: "rgba(255, 255, 255, 0.1)", 
                      border: "1px solid rgba(255, 255, 255, 0.2)", 
                      borderRadius: "6px", 
                      color: "#00ffb3", 
                      cursor: "pointer", 
                      fontWeight: "700",
                      fontSize: "1.2rem"
                    }}
                  >
                    −
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                    style={{ 
                      flex: 1, 
                      background: "rgba(255, 255, 255, 0.1)", 
                      border: "1px solid rgba(255, 255, 255, 0.2)", 
                      borderRadius: "6px", 
                      color: "#fff", 
                      textAlign: "center", 
                      fontWeight: "600",
                      padding: "0.5rem",
                      fontSize: "1rem"
                    }} 
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: "rgba(255, 255, 255, 0.1)", 
                      border: "1px solid rgba(255, 255, 255, 0.2)", 
                      borderRadius: "6px", 
                      color: "#00ffb3", 
                      cursor: "pointer", 
                      fontWeight: "700",
                      fontSize: "1.2rem"
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Type */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "0.85rem", color: "#a0a9b8", marginBottom: "0.5rem", display: "block", fontWeight: "600" }}>Order Type</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {['MARKET', 'LIMIT'].map(type => (
                    <button
                      key={type}
                      onClick={() => setPriceType(type)}
                      style={{
                        padding: "0.75rem",
                        background: priceType === type ? "rgba(0, 255, 179, 0.2)" : "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${priceType === type ? "#00ffb3" : "rgba(255, 255, 255, 0.1)"}`,
                        borderRadius: "6px",
                        color: priceType === type ? "#00ffb3" : "#a0a9b8",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        transition: "all 0.3s"
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
                  <label style={{ fontSize: "0.85rem", color: "#a0a9b8", marginBottom: "0.5rem", display: "block", fontWeight: "600" }}>Limit Price (₹)</label>
                  <input 
                    type="number" 
                    value={limitPrice} 
                    onChange={(e) => setLimitPrice(e.target.value)} 
                    placeholder={stock.price.toFixed(2)}
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem", 
                      background: "rgba(255, 255, 255, 0.1)", 
                      border: "1px solid rgba(255, 255, 255, 0.2)", 
                      borderRadius: "6px", 
                      color: "#fff", 
                      fontWeight: "600",
                      fontSize: "1rem"
                    }} 
                  />
                </div>
              )}

              {/* Summary */}
              <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1rem", borderRadius: "8px", marginBottom: "1.25rem", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                  <span style={{ color: "#a0a9b8" }}>Quantity</span>
                  <span style={{ fontWeight: "600" }}>{quantity}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                  <span style={{ color: "#a0a9b8" }}>Price</span>
                  <span style={{ fontWeight: "600" }}>₹{(priceType === 'MARKET' ? stock.price : parseFloat(limitPrice || 0)).toFixed(2)}</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: "700", color: "#00ffb3" }}>
                    <span>Total</span>
                    <span>₹{(quantity * (priceType === 'MARKET' ? stock.price : parseFloat(limitPrice || 0))).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: orderType === 'BUY' ? "linear-gradient(135deg, #00ffb3 0%, #00d4aa 100%)" : "linear-gradient(135deg, #ff4757 0%, #ff3838 100%)",
                  border: "none",
                  borderRadius: "8px",
                  color: orderType === 'BUY' ? "#0a0e27" : "#fff",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: `0 4px 20px ${orderType === 'BUY' ? "rgba(0, 255, 179, 0.3)" : "rgba(255, 71, 87, 0.3)"}`
                }}
              >
                {orderType} {stock.symbol}
              </button>
            </div>
          </div>

          {/* Market Depth */}
          <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "1.5rem" }}>
            <div style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", color: "#fff" }}>Market Depth</div>
            <div style={{ fontSize: "0.75rem", color: "#a0a9b8", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between" }}>
              <span>BID</span>
              <span>ASK</span>
            </div>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                <div style={{ flex: 1, textAlign: "left", color: "#00ffb3" }}>
                  ₹{(stock.price - (i + 1) * 0.5).toFixed(2)}
                </div>
                <div style={{ flex: 1, textAlign: "center", color: "#a0a9b8" }}>
                  {Math.floor(Math.random() * 500 + 100)}
                </div>
                <div style={{ flex: 1, textAlign: "center", color: "#a0a9b8" }}>
                  {Math.floor(Math.random() * 500 + 100)}
                </div>
                <div style={{ flex: 1, textAlign: "right", color: "#ff4757" }}>
                  ₹{(stock.price + (i + 1) * 0.5).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}