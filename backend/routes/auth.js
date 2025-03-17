//backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendWelcomeEmail } = require("../email");

const JWT_SECRET = process.env.JWT_SECRET;

// Sign Up Endpoint
router.post("/signup", async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, deviceId });
    await newUser.save();

    // Send welcome email after successful signup
    try {
      // Using a simple name derived from the email; adjust if you add a 'name' field to your schema.
      const name = email.split("@")[0];
      await sendWelcomeEmail(email, name);
      console.log("Welcome email sent successfully.");
    } catch (emailErr) {
      console.error("Failed to send welcome email on signup:", emailErr);
      // Decide if you want to fail signup or simply log the error.
    }

    const token = jwt.sign(
      { id: newUser.id, deviceId: newUser.deviceId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { email: newUser.email, deviceId: newUser.deviceId },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Optionally send a login notification email (adjust the template if needed)
    try {
      const name = email.split("@")[0];
      await sendWelcomeEmail(email, name);
      console.log("Login notification email sent successfully.");
    } catch (emailErr) {
      console.error("Failed to send email on login:", emailErr);
    }

    const token = jwt.sign(
      { id: user.id, deviceId: user.deviceId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { email: user.email, deviceId: user.deviceId } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
