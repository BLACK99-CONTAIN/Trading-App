const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// === Setup Gmail transporter ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// === Helper: Generate 6-digit OTP ===
function generateOTP() {
  const n = crypto.randomInt(0, 1000000);
  return String(n).padStart(6, '0');
}

// === Helper: Send OTP Email ===
async function sendOtpEmail(toEmail, username, otp) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>MoneyTrading</h2>
      <p>Hi <b>${username}</b>,</p>
      <p>Your OTP code is:</p>
      <h1 style="letter-spacing: 5px; color: #2c7be5;">${otp}</h1>
      <p>This code is valid for <b>10 minutes</b>. Please don’t share it with anyone.</p>
    </div>
  `;
  return transporter.sendMail({
    from: `"MoneyTrading" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Your OTP Code — MoneyTrading',
    html,
  });
}

// === REGISTER ===
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      // User exists, redirect to login
      return res.status(200).json({ message: 'User already exists. Please login.', redirectToLogin: true });
    }
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    const user = new User({ username, email, password, otp, otpExpires });
    await user.save();
    await sendOtpEmail(email, username, otp);
    res.status(201).json({ message: 'User registered. OTP sent to email.', userId: user._id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// === VERIFY REGISTRATION OTP ===
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(403).json({ message: 'Invalid or expired OTP' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// === LOGIN ===
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ message: 'Email not verified. Please verify your email.' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    // Generate OTP for login
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendOtpEmail(user.email, user.username, otp);
    res.status(200).json({ message: 'OTP sent to email', userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// === VERIFY LOGIN OTP ===
exports.verifyLoginOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(403).json({ message: 'Invalid or expired OTP' });
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// === RESEND OTP ===
exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendOtpEmail(user.email, user.username, otp);
    res.status(200).json({ message: 'OTP resent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// === ME ===
exports.me = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "No token" });
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("username email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
