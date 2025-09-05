const express = require("express");
const dotenv = require("dotenv");
const { connectDB, sequelize } = require("./config/db");
require("./models/association");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/booking");
const staffRoutes = require("./routes/staff");
const cors = require("cors");
const path = require("path");
const serverless = require("serverless-http");

// Load environment variables
dotenv.config();

// Connect to PostgreSQL
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static assets
app.use("/assets", express.static(path.join(__dirname, "..", "public/assets")));

// Static HTML routes
app.get("/shespace", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/index.html"));
});
app.get("/create-account", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/create-account.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/post-login.html"));
});
app.get("/edit-profile", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/edit-profile.html"));
});
app.get("/staff-login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/staff-login.html"));
});
app.get("/userviewbookings", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/view-bookings.html"));
});
app.get("/staff-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/staff-post-login.html"));
});
app.get("", (req, res) => {
  res.redirect("/shespace");
});

// API Routes
app.use("/api", authRoutes, bookingRoutes, staffRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// Sync Sequelize (runs on first invocation)
sequelize
  .sync({ force: false })
  .then(() => console.log("Database & tables synced"))
  .catch((err) => console.error("Error syncing database:", err));

// ❌ REMOVE app.listen — serverless functions don’t need it
module.exports = serverless(app);
