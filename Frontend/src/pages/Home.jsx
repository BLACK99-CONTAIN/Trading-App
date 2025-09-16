import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-logo">
          <span className="logo-icon">🟩</span>
          <span className="logo-text">Black99 </span>
        </div>
        <div className="landing-nav-links">
          <button
            className="nav-link"
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
            onClick={() => navigate("/login")}
          >
            Login/Signup
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="landing-main">
        <div className="landing-content">
          <div className="landing-badge">🚀 Trading Bots</div>
          <h1 className="landing-title">
            The Fastest and Secure<br />AI Trading Assistant.
          </h1>
          <p className="landing-desc">
            Trade faster and smarter with our secure AI bots. Maximize your investments with real-time insights and automation.
          </p>
          <a href="#" className="landing-cta">Try Free Trial <span>→</span></a>
        </div>
        <ChartBackground />
        <div className="landing-bottom-nav">
          <a href="#" className="bottom-nav-btn active">Bots</a>
          <a href="#" className="bottom-nav-btn">Markets</a>
          <a href="#" className="bottom-nav-btn">Trade</a>
          <a href="#" className="bottom-nav-btn">Token</a>
          <a href="#" className="bottom-nav-btn">AI Assistant</a>
          <a href="#" className="bottom-nav-arrow">→</a>
        </div>
      </main>
    </div>
  );
}

// Simple SVG chart background
function ChartBackground() {
  return (
    <svg className="chart-bg" viewBox="0 0 1200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline
        points="0,250 100,200 200,220 300,120 400,180 500,80 600,200 700,160 800,220 900,100 1000,180 1100,120 1200,200"
        stroke="#00ffb3"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
        filter="url(#glow)"
      />
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
