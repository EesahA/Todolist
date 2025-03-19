import React from 'react';
import { Container, Typography, Button, Box, Divider } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CreateTask from './CreateTask';
import TaskList from './TaskList';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTaskCreated = (newTask) => {
    console.log('New task created:', newTask);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Task Management
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        
        <Box sx={{ maxWidth: 'md', mx: 'auto', mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create New Task
          </Typography>
          <CreateTask onTaskCreated={handleTaskCreated} />
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
          <TaskList />
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 