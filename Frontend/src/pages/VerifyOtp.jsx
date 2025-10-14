import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, fromSignup } = location.state || {};

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("https://trading-app-backend-6ibt.onrender.com/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp })
      });
      const data = await res.json();

      if (res.status === 200) {
        // If coming from signup, go directly to explore
        navigate("/explore");
      } else {
        setError(data.message || "OTP verification failed.");
      }
    } catch {
      setError("Network error.");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Verify Email OTP</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
}
