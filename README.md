# Task Management System

A modern task management system similar to Trello, built with React, Node.js, and MongoDB.

## Features

- User Authentication (Registration and Login)
- Team-based task management
- Drag and drop task organization
- Multiple task statuses (Backlog, In Progress, Blocked, Complete)
- Task details with description, deadline, and image uploads
- Task commenting system
- Real-time updates

## Tech Stack

### Frontend
- React
- Material-UI for components
- React DnD for drag and drop
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Socket.IO for real-time updates

## Project Structure

```
task-management/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # React context providers
│   │   └── utils/        # Utility functions
│   └── public/           # Static files
└── server/               # Backend Node.js application
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/       # MongoDB models
    │   ├── routes/       # API routes
    │   ├── middleware/   # Custom middleware
    │   ├── services/     # Business logic
    │   └── utils/        # Utility functions
    └── config/           # Configuration files
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both client and server directories
   - Copy the example environment variables and update as needed

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm start
   ```

## API Documentation

The API documentation will be available at `/api-docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request