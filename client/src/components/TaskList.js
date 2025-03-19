import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  Grid,
  Paper
} from '@mui/material';
import { format } from 'date-fns';
import useTask from '../hooks/useTask';

const TaskList = () => {
  const { tasks, loading, error } = useTask();

  if (loading) {
    return <Typography>Loading tasks...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

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
                      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                        {task.title}
                      </Typography>
                      <Chip 
                        label={task.priority} 
                        color={getPriorityColor(task.priority)}
                        size="small"
                      />
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
  );
};

export default TaskList; 