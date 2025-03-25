# TaskFlow: Simple solution for task management

## Overview
TaskFlow is a full-stack web application that allows for optimal team task management. It's a real-time collaborative platform where team members can create, organise, and track tasks together. It has a range of intuitive features, including a drag-and-drop interface, real-time updates, and a clean, modern design.

## Project Aim & Objectives

### Main Goal
To create a straightforward, yet powerful task management system that enhances team collaboration whilst maintaining the simplicity of a personal to-do list.

### Key Objectives
1. **Real-Time Collaboration**
   Built with Socket.IO to ensure all team members see updates instantly, making remote work feel more connected.

2. **Intuitive Task Organisation**
   Implemented a drag-and-drop interface that makes reorganising tasks very natural.

3. **Robust Security & Authentication**
   Developed a secure JWT-based authentication system to protect team data whilst maintaining a seamless user experience.

4. **Smart Task Management**
   Created an intelligent system for task prioritisation, deadline tracking, and status updates that keeps all team members in the loop.

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

## Enterprise Considerations

### Performance
I've implemented several strategies to keep TaskFlow running smoothly:
- **Optimised API Responses**: The backend carefully selects and returns only necessary data fields, reducing payload sizes and network latency.
- **Efficient State Management**: I used React's Context API to prevent unnecessary re-renders and maintain smooth UI performance.
- **Smart Loading**: I implemented loading states and skeleton screens to enhance perceived performance whilst data is being fetched.

### Scalability
- **Modular Architecture**: The application is structured into independent modules, making it easy to maintain and scale specific components.
- **Efficient Data Handling**: Added pagination to task lists to handle large amounts of data more efficiently.
- **Real-time Updates**: Socket.IO implementation is designed to handle numerous concurrent connections efficiently.

### Robustness
- **Comprehensive Error Handling**: Both the frontend and backend implement thorough error catching and messages.
- **Data Validation**: Robust input validation on both client and server sides to prevent inconsistencies in data.
- **Automated Recovery**: Implemented automatic reconnection for WebSocket connections and API retry mechanisms.

### Security
- **Authentication**: 
  - JWT-based authentication with token expiration
  - Secure password hashing using bcrypt
  - Automatic token refresh mechanism
- **Data Protection**:
  - Input sanitisation to prevent XSS attacks
  - MongoDB injection protection
  - CORS configuration for API security
- **Access Control**:
  - Role-based access control for team resources
  - Middleware validation for all protected routes
  - Secure file upload handling

### Deployment
TaskFlow is deployed using modern cloud infrastructure:
- **Frontend**: Hosted using render: https://todolist-frontend-rao2.onrender.com
- **Backend**: Hosted using render: https://todolist-backend-3qah.onrender.com
- **Database**: MongoDB Atlas for reliable, scalable data storage


## Installation & Usage Instructions

### Prerequisites
Before you begin, make sure you have the following installed on your machine:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB (v4.0.0 or higher)
- Git

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/username/taskflow.git
   cd todolist
   ```

2. **Set Up the Backend**
   ```bash
   # Navigate to the server directory
   cd server

   # Install dependencies
   npm install

   # Create your environment variables file
   cp .env.example .env
   ```

   Now, open the `.env` file and configure your environment variables:
   ```
   PORT=5003
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   ```

3. **Set Up the Frontend**
   ```bash
   # Navigate to the client directory
   cd ../client

   # Install dependencies
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   # In the server directory
   npm run dev
   ```
   The server will start on http://localhost:5003

2. **Start the Frontend Development Server**
   ```bash
   # In the client directory
   npm start
   ```
   The application will open in your browser at http://localhost:3000

### Testing
- **Running Backend Tests**
  ```bash
  # In the server directory
  npm test
  ```

- **Running Frontend Tests**
  ```bash
  # In the client directory
  npm test
  ```

 **Port Conflicts**
   - If port 5003 is in use, modify the PORT in your `.env` file
   - If port 3000 is in use, React will automatically suggest an alternative port

---

## Feature Overview

### 1. User Authentication System
**Purpose**: Secure user authentication with registration, login, and account management.

**Key Components**:
- Frontend: 
  - `client/src/components/Login.js` - Login form and authentication logic
  - `client/src/components/Register.js` - User registration interface
  - `client/src/components/AccountSettings.js` - User profile management
  - `client/src/context/AuthContext.js` - Authentication state management

- Backend:
  - `server/src/routes/userRoutes.js` - Authentication endpoints
  - `server/src/controllers/userController.js` - User management logic
  - `server/src/middleware/auth.js` - JWT authentication middleware

**Key Endpoints**:
- POST `/api/users/register` - New user registration
- POST `/api/users/login` - User authentication
- PUT `/api/users/me` - Update user profile

### 2. Task Management
**Purpose**: Comprehensive task creation, organisation, and tracking system.

**Key Components**:
- Frontend:
  - `client/src/components/TaskList.js` - Main task management interface
  - `client/src/components/CreateTask.js` - Task creation form
  - `client/src/components/TaskCard.js` - Individual task display
  - `client/src/components/TaskDetails.js` - Detailed task view
  - `client/src/context/TaskContext.js` - Task state management

- Backend:
  - `server/src/routes/taskRoutes.js` - Task-related endpoints
  - `server/src/controllers/taskController.js` - Task management logic
  - `server/src/models/Task.js` - Task data model

**Key Endpoints**:
- GET `/api/tasks` - Retrieve tasks (with filtering options)
- POST `/api/tasks` - Create new task
- PUT `/api/tasks/:id` - Update task details
- DELETE `/api/tasks/:id` - Remove task

### 3. Real-Time Collaboration
**Purpose**: Enable instant updates and real-time collaboration between team members.

**Key Components**:
- Frontend:
  - `client/src/components/TaskList.js` - Real-time task updates
  - `client/src/services/socket.js` - Socket.IO client configuration

- Backend:
  - `server/src/index.js` - Socket.IO server setup
  - `server/src/services/socketManager.js` - Real-time event handling

**Features**:
- Live task status updates
- Real-time task assignment notifications
- Instant comment updates

### 4. Drag-and-Drop Interface
**Purpose**: Task organisation and status changing.

**Key Components**:
- Frontend:
  - `client/src/components/TaskList.js` - Drag-and-drop container
  - `client/src/components/TaskCard.js` - Draggable task items
  - `client/src/components/TaskBar.js` - Status columns

**Implementation**:
- Uses React Beautiful DnD for smooth drag-and-drop
- Automatic status updates on drop

### 5. Task Details & Comments
**Purpose**: Task commenting and team communication.

**Key Components**:
- Frontend:
  - `client/src/components/TaskDetails.js` - Detailed task view
  - `client/src/components/CreateTask.js` - Task creation/editing

- Backend:
  - `server/src/models/Comment.js` - Comment data model
  - `server/src/controllers/commentController.js` - Comment management


### 6. Team Management
**Purpose**: Handle team-based access and collaboration.

**Key Components**:
- Frontend:
  - `client/src/components/Dashboard.js` - Team overview
  - `client/src/context/AuthContext.js` - Team role management

- Backend:
  - `server/src/middleware/roleAuth.js` - Role-based access control
  - `server/src/models/Team.js` - Team data model



---

## Known Issues & Future Enhancements

### Current Limitation
- **Concurrent Task Updates**: The current real-time synchronisation system may experience race conditions when multiple users simultaneously update the same task's status. While the last-write-wins approach is implemented, it doesn't account for potential conflicts in task state transitions or partial updates to nested task properties.

### Future Enhancements

1. **AI-Powered Task Intelligence System**
   - Develop a machine learning model to analyse task completion patterns and team performance metrics
   - Add natural language processing for automatic task categorisation and priority assessment

2. **Advanced Analytics & Data Visualisation**
   - Implement interactive graphs to visualise task dependencies and team collaboration patterns
   - Develop customisable dashboards showing team activity patterns and productivity metrics

---

## References

During the development of my system, I utilised a few resources:

- **Generative AI**: Used Claude AI for assistance with README.md formatting and documentation structure. Also leveraged it for researching best practices in database schema design and middleware implementation patterns.

- **MongoDB Documentation**: Referenced for database optimisation and schema design.

- **Socket.IO Documentation**: Consulted for implementing real-time features.

---


