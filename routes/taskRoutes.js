const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// Protect routes with authentication
router.use(authMiddleware);

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.patch("/:id/complete", taskController.markTaskCompleted);

module.exports = router;
