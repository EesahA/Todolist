import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { format } from 'date-fns';

const TaskCard = ({ task }) => {
  console.log('Task data:', task); // Debug log

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getAvatarUrl = (username) => {
    console.log('Creating avatar for username:', username); // Debug log
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`;
  };

  // Get the creator's username safely
  const creator = task.createdBy || {};
  const creatorUsername = creator.username || 'Unknown';
  console.log('Creator username:', creatorUsername); // Debug log

  return (
    <Card 
      sx={{ 
        bgcolor: 'white',
        '&:hover': {
          boxShadow: 3
        },
        position: 'relative'
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
          {task.title}
        </Typography>
        
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {task.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {task.deadline && (
              <Typography 
                variant="caption"
                sx={{ 
                  color: isOverdue(task.deadline) ? 'error.main' : 'text.secondary',
                  fontWeight: isOverdue(task.deadline) ? 'medium' : 'regular'
                }}
              >
                Due: {format(new Date(task.deadline), 'MMM d')}
                {isOverdue(task.deadline) && ' (Overdue)'}
              </Typography>
            )}
          </Box>
          
          <Avatar
            src={getAvatarUrl(creatorUsername)}
            alt={creatorUsername}
            sx={{ 
              width: 24, 
              height: 24,
              fontSize: '0.75rem',
              bgcolor: 'primary.main'
            }}
          >
            {creatorUsername.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard; 