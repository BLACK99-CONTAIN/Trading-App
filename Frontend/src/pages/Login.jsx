import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }
    try {
      const res = await fetch("https://trading-app-backend-6ibt.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.status === 200) {
        navigate("/login-otp", { state: { userId: data.userId } });
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("Network error.");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <button
          className="auth-logo"
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "inherit",
            padding: 0
          }}
        >
          🟩 Black99
        </button>
        <h2 className="auth-title">Sign In</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" type="submit">Login</button>
        </form>
        <div className="auth-switch">
          Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
