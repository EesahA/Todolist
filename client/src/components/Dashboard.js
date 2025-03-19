import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CreateTask from './CreateTask';
import TaskList from './TaskList';
import TaskBar from './TaskBar';
import useTask from '../hooks/useTask';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState('Backlog');
  const { fetchTasks } = useTask();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTaskCreated = async (newTask) => {
    console.log('New task created:', newTask);
    await fetchTasks(); // Refresh the tasks list after creating a new task
    setCreateTaskOpen(false);
  };

  const handleCreateTaskClick = (status = 'Backlog') => {
    setInitialStatus(status);
    setCreateTaskOpen(true);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      
      <TaskBar onCreateTask={() => handleCreateTaskClick()} />
      
      <Container maxWidth={false} sx={{ flexGrow: 1, py: 2 }}>
        <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
          <TaskList onCreateTask={handleCreateTaskClick} />
        </Box>
      </Container>

      <CreateTask 
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        onTaskCreated={handleTaskCreated}
        initialStatus={initialStatus}
      />
    </Box>
  );
};

export default Dashboard; 