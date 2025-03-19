import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TaskBar = ({ onCreateTask }) => {
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => onCreateTask()}
        >
          Create Task
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TaskBar; 