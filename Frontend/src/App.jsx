// App.jsx - Updated with new routes
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import LoginOtp from "./pages/LoginOtp";
import Explore from "./pages/Explore";
import Holdings from "./pages/Holdings";
import Positions from "./pages/Positions";
import Watchlist from "./pages/Watchlist";
import StockDetail from "./pages/StockDetail";
import Portfolio from "./pages/Portfolio";
import Sectors from "./pages/Sectors";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login-otp" element={<LoginOtp />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/holdings" element={<Holdings />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/sectors" element={<Sectors />} />
        <Route path="/sectors/:sector" element={<Sectors />} />
      </Routes>
    </Router>
  );
}