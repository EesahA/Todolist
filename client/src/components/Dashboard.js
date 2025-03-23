import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import CreateTask from './CreateTask';
import TaskList from './TaskList';
import TaskBar from './TaskBar';
import useTask from '../hooks/useTask';

const Dashboard = () => {
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState('Backlog');
  const { fetchTasks } = useTask();

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