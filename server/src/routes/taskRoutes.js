const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Validation middleware
const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status').isIn(['Backlog', 'In Progress', 'Blocked', 'Complete']).withMessage('Invalid status'),
  body('deadline').optional().isISO8601().withMessage('Invalid deadline format')
];

// Routes
router.get('/', auth, taskController.getAllTasks);
router.post('/', auth, taskValidation, taskController.createTask);
router.get('/:id', auth, taskController.getTaskById);
router.put('/:id', auth, taskValidation, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);
router.post('/:id/comments', auth, body('content').trim().notEmpty().withMessage('Comment content is required'), taskController.addComment);
router.patch('/:id/status', auth, body('status').isIn(['Backlog', 'In Progress', 'Blocked', 'Complete']).withMessage('Invalid status'), taskController.updateTaskStatus);

module.exports = router; 