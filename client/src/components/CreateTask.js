import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const CreateTask = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('Backlog');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const priorities = [
    { value: 'high', label: 'High', color: 'error.main' },
    { value: 'medium', label: 'Medium', color: 'warning.main' },
    { value: 'low', label: 'Low', color: 'success.main' }
  ];

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
      const response = await fetch('http://localhost:5003/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          description,
          deadline: deadline ? deadline.toISOString() : null,
          priority,
          status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task');
      }

      setSuccess('Task created successfully!');
      setTitle('');
      setDescription('');
      setDeadline(null);
      setPriority('medium');
      setStatus('Backlog');
      
      if (onTaskCreated) {
        onTaskCreated(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to create task');
    }
  };

  return (
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
        
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(e) => setPriority(e.target.value)}
          >
            {priorities.map((p) => (
              <MenuItem 
                key={p.value} 
                value={p.value}
                sx={{ color: p.color }}
              >
                {p.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1 }}>
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        fullWidth
      >
        Create Task
      </Button>
    </Box>
  );
};

export default CreateTask; 