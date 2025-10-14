import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Explore", path: "/explore" },
    { name: "Holdings", path: "/holdings" },
    { name: "Positions", path: "/positions" },
    { name: "Watchlist", path: "/watchlist" }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo and Brand */}
      <div className="navbar-left">
        <div className="navbar-logo">
          <span className="logo-icon">🟩</span>
          <span className="logo-text">Black99</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="navbar-center">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`nav-tab ${isActive(tab.path) ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Right Section: Search, Bell, Terminal, Profile */}
      <div className="navbar-right">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search Groww..."
            className="search-input"
          />
        </div>

        <button className="icon-btn" title="Notifications">
          🔔
        </button>

        <button className="terminal-btn">
          ⚙️ Terminal
        </button>

        <button className="trade-btn">
          915.trade ↗
        </button>

        <button className="profile-btn" onClick={handleLogout} title="Logout">
          👤
        </button>
      </div>
    </nav>
  );
}