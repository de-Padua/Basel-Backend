const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  teamId: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  comments: [], // Embed comments using the defined comment schema
  admins: { type: Array },
  createdBy: {
    name: { type: String },
    _id: { type: String },
    time: { type: Date, default: Date.now },
  },
  feed: [],
});

// Create a Mongoose model for the task schema
const Task = mongoose.model("task", taskSchema);

module.exports = Task;
