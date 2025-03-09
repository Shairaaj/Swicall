require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const contactsRoutes = require("./routes/contacts");
const privacyPolicy = require("./routes/privacyPolicy");

const app = express();

// CORS Headers Middleware (Place this before any routes or CORS setup)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://swicall.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-device-id"
  ); // Include x-device-id
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


// CORS Middleware (Keep this after manual headers)
app.use(
  cors({
    origin: "https://swicall.vercel.app", // Allow only your frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-device-id"], // Add x-device-id
  })
);


// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
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
