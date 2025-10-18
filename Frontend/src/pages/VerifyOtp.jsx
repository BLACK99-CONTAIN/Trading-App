import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, fromSignup } = location.state || {};

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP.");
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch("https://trading-app-backend-6ibt.onrender.com/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp })
      });
      const data = await res.json();

      console.log("OTP verification response:", res.status, data); // Debug log

      if (res.status === 200) {
        // Store token if provided (to stay logged in)
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        // Success message
        setError("✅ Verified! Redirecting...");
        setTimeout(() => {
          navigate("/explore");
        }, 1000);
      } else {
        setError(data.message || "❌ Invalid OTP. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "48px" }}>📧</span>
        </div>
        <h2 className="auth-title">Verify Email</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: "20px", fontSize: "14px" }}>
          We've sent a verification code to your email. Please enter it below.
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            maxLength="6"
            required
            style={{ textAlign: "center", fontSize: "18px", letterSpacing: "5px" }}
          />
          {error && (
            <div 
              className="auth-error" 
              style={{ 
                color: error.includes("✅") ? "#00ffb3" : "#ff4444"
              }}
            >
              {error}
            </div>
          )}
          <button 
            className="auth-btn" 
            type="submit"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <span style={{ color: "#888", fontSize: "13px" }}>
            Didn't receive code? Check spam folder
          </span>
        </div>
      </div>
    </div>
  );
}