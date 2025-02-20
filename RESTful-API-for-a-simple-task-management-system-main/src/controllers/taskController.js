const mongoose = require("mongoose");
const Task = require("../models/taskModel");
const { getIO } = require('../socket');

// create a new task
exports.createTask = async (req, res) => {
  const { title, description, completed } = req.body;
  const user = req.user._id;
  try {
    const task = await Task.create({ user, title, description, completed });

    const io = getIO();
    io.emit('taskCreated', task); // Emit 'taskCreated' event
   
    res.status(200).json({ message: "Task created successfully", data: task });

  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const user = req.user._id;
    const task = await Task.find({ user });
    if (task.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    const io = getIO();
    io.emit('taskRetrieved', task);
    res.status(200).json({message:"success",data:task});
    
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

// Get a single workout
exports.getTask = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such task" });
    }
    const task = await Task.findOne({ _id: id, user });
    if (!task) {
      return res.status(404).json({ error: "No such task" });
    }

    const io = getIO();
    io.emit('tasksRetrieved', task);
    res.status(200).json({message:"success", data: task });
  
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

// update a task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such task" });
    }
    const task = await Task.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true } 
    );

    if(!task) {
      return res.status(404).json({error: "Task not found"})
  }

  // Emit 'taskUpdated' event
    const io = getIO();
    io.emit('taskUpdated', task); // Emit 'taskUpdated' event
    res.status(200).json({ message: "Task updated successfully", data:task});
   
  } catch (error) {
    res
      .status(400)
      .json({ message: "Internal server error", error: error.message });
  }
};

// delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such task" });
    }
    const task = await Task.findOneAndDelete({ _id: id, user });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const io = getIO();
    io.emit('taskDeleted', id); // Emit 'taskDeleted' event
    res.status(200).json({ message: "Task deleted successfully", data: task });
   
  } catch (error) {
    res
      .status(400)
      .json({ message: "Internal server error", error: error.message });
  }
};
