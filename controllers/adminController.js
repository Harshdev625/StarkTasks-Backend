const Task = require("../models/Task");
const User = require("../models/User");

// Admin: Create and assign a task to specific users
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;
    const newTask = new Task({ title, description, dueDate, assignedTo });

    // Save the new task
    await newTask.save();

    // Add task reference to assigned users
    await User.updateMany(
      { _id: { $in: assignedTo.map(user => user.user) } },
      { $push: { tasks: newTask._id } }
    );    

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: "Failed to create task" });
  }
};

// Admin: Update task
exports.updateTask = async (req, res) => {
  try {
    const { assignedTo, ...updateData } = req.body;

    // Update task fields
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });

    // Update user assignments if assignedTo is provided
    if (assignedTo) {
      // Remove task from previous assigned users
      await User.updateMany(
        { tasks: updatedTask._id },
        { $pull: { tasks: updatedTask._id } }
      );

      // Add task to newly assigned users
      await User.updateMany(
        { _id: { $in: assignedTo.map(user => user.user) } },
        { $push: { tasks: updatedTask._id } }
      );
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: "Failed to update task" });
  }
};

// Admin: Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Remove task reference from assigned users
    await User.updateMany(
      { _id: { $in: task.assignedTo.map(user => user.user) } },
      { $pull: { tasks: task._id } }
    );

    // Delete the task
    await task.remove();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Admin: Fetch all users with role "user"
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("username email name role"); // Select only necessary fields
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
