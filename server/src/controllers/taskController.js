const Task = require('../models/Task');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    let query = {};
    
    // If viewMode is 'personal', only return tasks created by the current user
    if (req.query.viewMode === 'personal') {
      query.createdBy = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email')
      .populate('comments.user', 'username email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });

    await task.save();
    await task.populate('createdBy', 'username email');
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email')
      .populate('comments.user', 'username email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is the creator of the task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    Object.assign(task, req.body);
    await task.save();
    await task.populate('createdBy', 'username email');
    await task.populate('assignedTo', 'username email');

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  // Add initial logging
  console.log('=== Delete Task Operation Started ===');
  console.log('Request params:', req.params);
  console.log('Request user:', req.user ? { _id: req.user._id, username: req.user.username } : 'No user');

  // Check MongoDB connection
  if (mongoose.connection.readyState !== 1) {
    console.error('MongoDB connection is not ready. Current state:', mongoose.connection.readyState);
    return res.status(500).json({ 
      message: 'Database connection error',
      details: 'MongoDB connection is not ready'
    });
  }

  try {
    console.log('Delete task request received for ID:', req.params.id);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.log('User not authenticated:', req.user);
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Convert string ID to ObjectId
    const taskId = new mongoose.Types.ObjectId(req.params.id);
    console.log('Converted ObjectId:', taskId);

    // Find the task with lean() for better performance
    console.log('Finding task with ID:', taskId);
    let task;
    try {
      task = await Task.findById(taskId).lean();
    } catch (findError) {
      console.error('Error finding task:', findError);
      return res.status(500).json({ 
        message: 'Error finding task',
        error: findError.message,
        details: findError.toString()
      });
    }

    if (!task) {
      console.log('Task not found:', taskId);
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task found:', {
      id: task._id,
      title: task.title,
      createdBy: task.createdBy
    });

    // Check if user is the creator of the task
    if (!task.createdBy || task.createdBy.toString() !== req.user._id.toString()) {
      console.log('User not authorized. Task creator:', task.createdBy, 'User:', req.user._id);
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    // Delete the task
    console.log('Attempting to delete task');
    try {
      const result = await Task.deleteOne({ 
        _id: taskId,
        createdBy: req.user._id // Additional safety check
      });
      console.log('Delete result:', result);

      if (result.deletedCount === 0) {
        console.log('Task not found during deletion');
        return res.status(404).json({ message: 'Task not found during deletion' });
      }

      console.log('Task deleted successfully');
      return res.status(200).json({ 
        message: 'Task deleted successfully',
        taskId: req.params.id 
      });
    } catch (deleteError) {
      console.error('Error deleting task:', deleteError);
      return res.status(500).json({ 
        message: 'Error deleting task',
        error: deleteError.message,
        details: deleteError.toString()
      });
    }

  } catch (error) {
    console.error('=== Delete Task Operation Failed ===');
    console.error('Error in delete task controller:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName
    });
    return res.status(500).json({ 
      message: 'Server error while deleting task',
      error: error.message,
      details: error.toString(),
      code: error.code
    });
  }
};

// Add comment to task
exports.addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      user: req.user._id,
      content: req.body.content
    });

    await task.save();
    
    // Populate all necessary fields
    await task.populate('createdBy', 'username email');
    await task.populate('assignedTo', 'username email');
    await task.populate('comments.user', 'username email');

    res.json(task);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = req.body.status;
    await task.save();
    await task.populate('createdBy', 'username email');
    await task.populate('assignedTo', 'username email');

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 