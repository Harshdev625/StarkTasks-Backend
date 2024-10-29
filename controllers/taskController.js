const Task = require("../models/Task");

exports.getAllTasks = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let tasks;

    if (role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo.user", "username email")
        .sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ "assignedTo.user": userId })
        .populate("assignedTo.user", "username")
        .sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (error) {
    // console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Fetch a task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo.user",
      "username"
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
};

// Mark task as completed
exports.markTaskCompleted = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const assignedUser = task.assignedTo.find(
      (user) => user.user.toString() === req.user.id
    );

    if (!assignedUser) {
      return res
        .status(403)
        .json({ error: "You are not authorized to complete this task" });
    }

    // Mark the user as completed
    assignedUser.completed = true;

    // Check if all users have completed the task
    const allUsersCompleted = task.assignedTo.every((user) => user.completed);

    // Set the task status based on whether all assigned users have completed it
    if (allUsersCompleted) {
      task.status = new Date() > task.dueDate ? "late" : "completed";
    }

    await task.save();

    // Return the updated task, ensuring all assigned users are included
    res.json(task);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(400).json({ error: "Failed to update task status" });
  }
};
