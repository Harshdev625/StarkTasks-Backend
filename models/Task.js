const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "late"],
      default: "pending",
    },
    dueDate: { type: Date },
    assignedTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
