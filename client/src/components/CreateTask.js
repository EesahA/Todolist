import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { createTask } from '../services/api';
import useTask from '../hooks/useTask';

const CreateTask = ({ open, onClose, onTaskCreated, initialStatus = 'Backlog' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const { fetchTasks } = useTask();

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const statuses = ['Backlog', 'In Progress', 'Blocked', 'Complete'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        status
      };

      // Only add deadline if it's set
      if (deadline) {
        taskData.deadline = deadline.toISOString();
      }

      console.log('Creating task with data:', taskData);
      const response = await createTask(taskData);
      console.log('Task created:', response.data);

      setSuccess('Task created successfully!');
      setTitle('');
      setDescription('');
      setDeadline(null);
      setStatus(initialStatus);
      
      // Fetch updated tasks list
      await fetchTasks();
      
      if (onTaskCreated) {
        onTaskCreated(response.data);
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create task');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deadline"
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                format="dd/MM/yyyy"
                slotProps={{ textField: { fullWidth: true } }}
                sx={{ flex: 1 }}
              />
            </LocalizationProvider>

            <FormControl sx={{ flex: 1 }} required>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTask; 