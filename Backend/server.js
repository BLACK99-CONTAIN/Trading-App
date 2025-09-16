require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const userRoutes = require("./routes/user.router");
const marketRoutes = require("./routes/market.router"); // Add this line

const app = express();

// === Middleware ===
app.use(express.json());

// ✅ Allow all origins (for development)
// If you deploy, replace "*" with your frontend URL(s)
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

// ✅ Global rate limiting (100 requests / 15 min per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(globalLimiter);

// ✅ OTP-specific limiter (5 requests / 10 min per IP)
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5,
  message: "Too many OTP requests, please try again later.",
});

// === Routes ===
app.use("/api/users", userRoutes(otpLimiter));
app.use("/api/market", marketRoutes); // Add this line

// === Connect MongoDB ===
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// === Start server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));