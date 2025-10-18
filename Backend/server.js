require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const userRoutes = require("./routes/user.router");
const marketRoutes = require("./routes/market.router");
const orderRoutes = require("./routes/order.router");

const app = express();

// 🟢 REQUIRED FOR RENDER & express-rate-limit
// This fixes the “X-Forwarded-For” warning you saw in the logs
app.set("trust proxy", 1);

// === Middleware ===
app.use(express.json());

// ✅ Allow all origins (you can restrict later if needed)
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

// ✅ Global rate limiting (100 requests / 15 min per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(globalLimiter);

// ✅ OTP-specific limiter (5 requests / 10 min per IP)
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests, please try again later.",
});

// === Routes ===
app.use("/api/users", userRoutes(otpLimiter));
app.use("/api/market", marketRoutes);
app.use("/api/orders", orderRoutes);

// === Connect MongoDB ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// === Health check endpoint (useful for Render) ===
app.get("/", (req, res) => {
  res.send("✅ Trading App Backend is running.");
});

// === Start server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
