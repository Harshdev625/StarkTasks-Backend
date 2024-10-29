const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
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
app.use("/api/tasks", taskRoutes); // User task routes
app.use("/api/admin", adminRoutes); // Admin-specific task routes
app.use("/api/auth", userRoutes); // Authentication routes

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
