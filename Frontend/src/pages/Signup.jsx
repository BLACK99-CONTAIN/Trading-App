import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.status === 201) {
        navigate("/verify-otp", { state: { userId: data.userId, fromSignup: true } });
      } else if (res.status === 200 && data.redirectToLogin) {
        navigate("/explore");
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input className="auth-input" type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} autoComplete="username" />
          <input className="auth-input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} autoComplete="email" />
          <input className="auth-input" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} autoComplete="new-password" />
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" type="submit">Sign Up</button>
        </form>
        <div className="auth-switch">
          Already have an account? <span className="auth-link" onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
    </div>
  );
}
