import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function LoginOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/users/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: state.userId, otp })
      });
      const data = await res.json();
      if (res.status === 200) {
        localStorage.setItem("token", data.token);
        navigate("/explore");
      } else if (res.status === 403) {
        setError("Invalid or expired OTP.");
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
        <h2 className="auth-title">Login OTP Verification</h2>
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
          <button className="auth-btn" type="submit">Verify & Login</button>
        </form>
      </div>
    </div>
  );
}
