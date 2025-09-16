const express = require("express");
const {
  register,
  verifyOtp,
  login,
  verifyLoginOtp,
  resendOtp,
  me,
} = require("../controller/user.controller");

module.exports = (otpLimiter) => {
  const router = express.Router();

  // Auth routes
  router.post("/register", otpLimiter, register);
  router.post("/verify-otp", verifyOtp);
  router.post("/login", login);
  router.post("/verify-login-otp", verifyLoginOtp);

  // Resend OTP (also rate-limited)
  router.post("/resend-otp", otpLimiter, resendOtp);

  // User info
  router.get("/me", me);

  return router;
};
