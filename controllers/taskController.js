const Task = require("../models/Task");

exports.getAllTasks = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let tasks;

    if (role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo.user", "username")
        .sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ "assignedTo.user": userId })
        .populate("assignedTo.user", "username")
        .sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (error) {
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

    // Set the task status based on the due date
    task.status = new Date() > task.dueDate ? "late" : "completed";
    assignedUser.completed = true;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: "Failed to update task status" });
  }
};
