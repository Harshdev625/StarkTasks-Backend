const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Protect all routes with authentication and admin check
router.use(authMiddleware, adminMiddleware);

// Task management routes
router.post("/tasks", adminController.createTask);
router.put("/tasks/:id", adminController.updateTask);
router.delete("/tasks/:id", adminController.deleteTask);
router.get("/fetchallusers", adminController.getAllUsers);


module.exports = router;
