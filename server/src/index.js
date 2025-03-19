require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Print MongoDB connection string (with password masked)
const mongoUriForLogging = process.env.MONGODB_URI ? 
  process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 
  'No MongoDB URI provided';
console.log('Connecting to MongoDB:', mongoUriForLogging);

// Database connection with improved options and error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management', {
  serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
  socketTimeoutMS: 45000,         // Increase socket timeout
})
.then(() => console.log('✅ Connected to MongoDB successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.error('Connection details:', {
    errorName: err.name,
    errorCode: err.code,
    errorMessage: err.message
  });
  // Exit process on connection failure to force restart
  process.exit(1);
});

// Add connection event listeners
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error after initial connection:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task Management System API' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join task room
  socket.on('join-task', (taskId) => {
    socket.join(`task-${taskId}`);
  });

  // Leave task room
  socket.on('leave-task', (taskId) => {
    socket.leave(`task-${taskId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});