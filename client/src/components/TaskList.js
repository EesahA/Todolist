import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import useTask from '../hooks/useTask';

const EditTaskDialog = ({ open, handleClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState(task);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave(editedTask);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            value={editedTask.title}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editedTask.description}
            onChange={handleChange}
          />
          <TextField
            name="deadline"
            label="Deadline"
            type="date"
            fullWidth
            value={editedTask.deadline ? format(new Date(editedTask.deadline), 'yyyy-MM-dd') : ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={editedTask.priority}
              onChange={handleChange}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={editedTask.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="Backlog">Backlog</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Blocked">Blocked</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TaskList = () => {
  const { tasks, loading, error, updateTask, deleteTask } = useTask();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  if (loading) {
    return <Typography>Loading tasks...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedTask(null);
  };

  const handleEditSave = async (editedTask) => {
    try {
      await updateTask(editedTask._id, editedTask);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteClick = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'success';
      case 'In Progress':
        return 'info';
      case 'Blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  const statusOrder = ['Blocked', 'Backlog', 'In Progress', 'Complete'];
  const tasksByStatus = statusOrder.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {});

  return (
    <>
      <Grid container spacing={2}>
        {statusOrder.map((status) => (
          <Grid item xs={3} key={status}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.100',
                height: '100%',
                minHeight: '70vh'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  pb: 1, 
                  borderBottom: '2px solid',
                  borderColor: theme => {
                    switch (status) {
                      case 'Blocked': return theme.palette.error.main;
                      case 'In Progress': return theme.palette.info.main;
                      case 'Complete': return theme.palette.success.main;
                      default: return theme.palette.grey[400];
                    }
                  }
                }}
              >
                {status}
                <Chip 
                  label={tasksByStatus[status].length} 
                  size="small" 
                  sx={{ ml: 1 }}
                  color={getStatusColor(status)}
                />
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tasksByStatus[status].map((task) => (
                  <Card key={task._id} sx={{ bgcolor: 'white' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                            {task.title}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditClick(task)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteClick(task._id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <Chip 
                            label={task.priority} 
                            color={getPriorityColor(task.priority)}
                            size="small"
                          />
                        </Box>
                      </Box>
                      
                      {task.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {task.description}
                        </Typography>
                      )}
                      
                      {task.deadline && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          Due: {format(new Date(task.deadline), 'dd/MM/yyyy')}
                        </Typography>
                      )}
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mt: 1, fontSize: '0.75rem' }}
                      >
                        By: {task.createdBy?.username || 'Unknown'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {selectedTask && (
        <EditTaskDialog
          open={editDialogOpen}
          handleClose={handleEditClose}
          task={selectedTask}
          onSave={handleEditSave}
        />
      )}
    </>
  );
};

export default TaskList; 