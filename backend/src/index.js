require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const weatherRoutes = require("./routes/weather");
const favoritesRoutes = require("./routes/favorites");

const app = express();

// middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/favorites", favoritesRoutes);

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});