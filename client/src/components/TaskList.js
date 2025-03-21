import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
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
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { format, isPast, startOfDay } from 'date-fns';
import useTask from '../hooks/useTask';
import TaskDetails from './TaskDetails';
import TaskCard from './TaskCard';
import { useAuth } from '../hooks/useAuth';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

const EditTaskDialog = ({ open, handleClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    status: 'Backlog',
    deadline: null,
    ...task
  });

  // Update editedTask when task prop changes
  React.useEffect(() => {
    if (task) {
      setEditedTask({
        title: '',
        description: '',
        status: 'Backlog',
        deadline: null,
        ...task
      });
    }
  }, [task]);

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

  // Don't render the dialog if there's no task
  if (!open) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            value={editedTask.title || ''}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editedTask.description || ''}
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
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={editedTask.status || 'Backlog'}
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

const TaskList = ({ onCreateTask }) => {
  const { tasks, loading, error, updateTask, deleteTask, fetchTasks, viewMode, updateViewMode } = useTask();
  const { user } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update selectedTask when tasks change
  useEffect(() => {
    if (selectedTask) {
      const updatedTask = tasks.find(task => task._id === selectedTask._id);
      if (updatedTask) {
        setSelectedTask(updatedTask);
      }
    }
  }, [tasks]);

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      updateViewMode(newMode);
    }
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    const today = startOfDay(new Date());
    const taskDeadline = startOfDay(new Date(deadline));
    return isPast(taskDeadline) && taskDeadline < today;
  };

  // Group tasks by status in specific order
  const statusOrder = ['Backlog', 'Blocked', 'In Progress', 'Complete'];
  const tasksByStatus = statusOrder.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {});

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
      await fetchTasks();
      handleEditClose();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteClick = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        console.log('Attempting to delete task:', taskId);
        await deleteTask(taskId);
        console.log('Task deleted successfully');
        await fetchTasks();
      } catch (err) {
        console.error('Failed to delete task:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        // Show error to user
        alert(`Failed to delete task: ${err.response?.data?.message || err.message}`);
      }
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

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task._id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const taskToUpdate = tasks.find(task => task._id === taskId);
    
    if (taskToUpdate && taskToUpdate.status !== newStatus) {
      try {
        await updateTask(taskId, { ...taskToUpdate, status: newStatus });
        fetchTasks(); // Refresh the task list
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  const handleCreateTask = (status) => {
    // If onCreateTask is provided, call it with the status and current user
    if (onCreateTask) {
      onCreateTask(status);
    }
  };

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="board view mode"
        >
          <ToggleButton value="team" aria-label="team board">
            <GroupIcon sx={{ mr: 1 }} />
            Team Board
          </ToggleButton>
          <ToggleButton value="personal" aria-label="personal board">
            <PersonIcon sx={{ mr: 1 }} />
            My Board
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={2}>
        {statusOrder.map((status) => (
          <Grid item xs={3} key={status}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.100',
                height: '100%', 
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column'
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
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
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                flexGrow: 1,
                minHeight: 0,
                overflow: 'auto'
              }}>
                {tasksByStatus[status].map((task) => (
                  <Card
                    key={task._id}
                    sx={{
                      bgcolor: 'white',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 3
                      }
                    }}
                    onClick={() => handleTaskClick(task)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                            {task.title}
                          </Typography>
                          {task.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {task.description}
                            </Typography>
                          )}
                          {task.deadline && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mt: 1,
                                color: isOverdue(task.deadline) ? 'error.main' : 'text.secondary',
                                fontWeight: isOverdue(task.deadline) ? 'medium' : 'regular'
                              }}
                            >
                              Due: {format(new Date(task.deadline), 'MMM d, yyyy')}
                              {isOverdue(task.deadline) && ' (Overdue)'}
                            </Typography>
                          )}
                        </Box>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            gap: 1 
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent card click when clicking buttons
                        >
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditClick(task)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteClick(task._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                {onCreateTask && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleCreateTask(status)}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Add Task
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <EditTaskDialog
        open={editDialogOpen}
        handleClose={handleEditClose}
        task={selectedTask}
        onSave={handleEditSave}
      />

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          onCommentAdded={fetchTasks}
        />
      )}
    </>
  );
};

export default TaskList; 