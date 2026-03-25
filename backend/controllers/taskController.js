const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// GET /api/tasks — get all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch task.' });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, priority, status, dueDate, tags, subtasks, aiGenerated } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      status,
      dueDate,
      tags,
      subtasks,
      aiGenerated: aiGenerated || false,
    });

    res.status(201).json({ message: 'Task created successfully!', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task.' });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task updated successfully!', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task.' });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task.' });
  }
};

// PATCH /api/tasks/:id/subtasks/:subtaskId — toggle subtask completion
const toggleSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) return res.status(404).json({ message: 'Subtask not found.' });

    subtask.completed = !subtask.completed;
    await task.save();

    res.json({ message: 'Subtask updated!', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update subtask.' });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, toggleSubtask };
