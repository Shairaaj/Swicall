require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const contactsRoutes = require("./routes/contacts");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors(
    {
      origin: ["http://localhost:5173", "https://swicall.vercel.app"],
      credentials: true,
    }
  )
);

// Connect to MongoDB using the URI from .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
