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
      { _id: { $in: assignedTo.map((user) => user.user) } },
      { $push: { tasks: newTask._id } }
    );

    // Populate the newly created task with user details
    const populatedTask = await Task.findById(newTask._id).populate({
      path: "assignedTo.user",
      select: "username email",
    });

    const allUsersCompleted = populatedTask.assignedTo.every(
      (user) => user.completed
    );
    if (allUsersCompleted) {
      populatedTask.status =
        new Date() > populatedTask.dueDate ? "late" : "completed";
    } else {
      populatedTask.status = "pending"; // Set to pending if not all users are completed
    }

    // Save the updated populated task status if it changed
    await populatedTask.save();

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ error: "Failed to create task" });
  }
};

/// Admin: Update task
exports.updateTask = async (req, res) => {
  try {
    const { assignedTo, ...updateData } = req.body; // Destructure assignedTo and the rest

    console.log("Updating task with ID:", req.params.id);
    console.log("Update data:", updateData);
    console.log("Assigned to users:", assignedTo);

    // Fetch the existing task to see the current assigned users and complete status
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) return res.status(404).json({ error: "Task not found" });

    // Determine which users are currently assigned
    const previousAssignments = existingTask.assignedTo.map((assignment) =>
      assignment.user.toString()
    );

    // Users to remove (those who are not in the new list)
    const usersToRemove = previousAssignments.filter(
      (user) => !assignedTo.map((a) => a.user).includes(user)
    );
    if (usersToRemove.length) {
      console.log("Removing task from previous assigned users:", usersToRemove);
      await User.updateMany(
        { _id: { $in: usersToRemove } },
        { $pull: { tasks: existingTask._id } }
      );
    }

    // Create a map for quick look-up of assigned users
    const assignedUserIds = new Set(assignedTo.map((a) => a.user));

    // Update or add tasks to newly assigned users
    for (const userId of assignedUserIds) {
      // If the user is not in previous assignments, add the task
      if (!previousAssignments.includes(userId)) {
        console.log("Adding task to newly assigned user:", userId);
        await User.updateOne(
          { _id: userId },
          { $addToSet: { tasks: existingTask._id } } // Only add if not already assigned
        );
      }
    }

    // Update the task fields with the new data, but retain the existing complete status
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // Ensure the assignedTo array is updated correctly
    updatedTask.assignedTo = assignedTo;

    // Check if all users have completed their tasks to update the task status
    const allUsersCompleted = updatedTask.assignedTo.every(
      (user) => user.completed
    );
    if (allUsersCompleted) {
      updatedTask.status =
        new Date() > updatedTask.dueDate ? "late" : "completed";
    } else {
      updatedTask.status = "pending"; // Set to pending if not all users are completed
    }

    // Save the updated task
    const finalUpdatedTask = await updatedTask.save();

    // Populate the assigned users for the response
    await finalUpdatedTask.populate({
      path: "assignedTo.user",
      select: "username email", // Only select the necessary fields
    });

    console.log("Final updated task:", finalUpdatedTask);
    res.json(finalUpdatedTask);
  } catch (error) {
    // console.error("Error updating task:", error);
    res.status(400).json({ error: "Failed to update task" });
  }
};

// Admin: Delete task
exports.deleteTask = async (req, res) => {
  try {
    // Find the task by ID
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Remove task reference from assigned users
    await User.updateMany(
      { _id: { $in: task.assignedTo.map((user) => user.user) } },
      { $pull: { tasks: task._id } }
    );

    // Delete the task using findByIdAndDelete
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    // console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Admin: Fetch all users with role "user"
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "username email name role"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
