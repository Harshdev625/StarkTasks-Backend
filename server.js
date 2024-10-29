const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./utils/errorHandler");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// API Routes
app.use("/api/tasks", taskRoutes); // User task routes
app.use("/api/admin", adminRoutes); // Admin-specific task routes
app.use("/api/auth", userRoutes); // Authentication routes

// Define the path to the dist folder
const distPath = path.join(__dirname, "dist");
console.log("Serving static files from:", distPath); // Log the path to the console

// Serve static files from the dist folder
app.use(express.static(distPath));

// Handle all other routes by sending the index.html from dist
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
