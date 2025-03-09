//backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const contactsRoutes = require("./routes/contacts");
const privacyPolicy = require("./routes/privacyPolicy");

const app = express();

// Custom CORS Middleware: Place this at the top, before other middleware.
app.use((req, res, next) => {
  // Replace with your deployed frontend URL (or add multiple if needed)
  res.header("Access-Control-Allow-Origin", "https://swicall.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-device-id"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Respond OK to OPTIONS requests
  }
  next();
});

// Alternatively, you can use the cors package with matching configuration:
app.use(
  cors({
    origin: "https://swicall.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-device-id"],
  })
);

app.use(express.json());

// Connect to MongoDB using the URI from .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/privacy", privacyPolicy);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
