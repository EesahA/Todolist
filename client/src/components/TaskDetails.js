import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton
} from '@mui/material';
import { format } from 'date-fns';
import { Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';
import useTask from '../hooks/useTask';

const TaskDetails = ({ task, open, onClose, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const { addComment } = useTask();

  const getAvatarUrl = (username) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(task._id, newComment.trim());
      console.log('Comment submitted successfully');
      setNewComment('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{task.title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box mb={3}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Avatar 
              src={getAvatarUrl(task.createdBy?.username)} 
              alt={task.createdBy?.username || 'Unknown'}
            />
            <Typography variant="subtitle2" color="textSecondary">
              Created by {task.createdBy?.username || 'Unknown'} on {format(new Date(task.createdAt), 'MMM d, yyyy')}
            </Typography>
          </Box>
          
          <Typography variant="body1" paragraph>
            {task.description || 'No description provided'}
          </Typography>

          {task.deadline && (
            <Typography 
              variant="body2" 
              color={new Date(task.deadline) < new Date() ? 'error' : 'textSecondary'}
            >
              Due: {format(new Date(task.deadline), 'MMM d, yyyy')}
            </Typography>
          )}
        </Box>

        <Divider />

        <Box my={2}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          
          <List>
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment, index) => {
                console.log('Comment data:', {
                  content: comment.content,
                  user: comment.user,
                  createdAt: comment.createdAt
                });
                return (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar 
                        src={getAvatarUrl(comment.user?.username)}
                        alt={comment.user?.username || 'Unknown'}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="subtitle2">
                            {comment.user?.username || 'Unknown'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                          </Typography>
                        </Box>
                      }
                      secondary={comment.content}
                    />
                  </ListItem>
                );
              })
            ) : (
              <Typography color="textSecondary">No comments yet</Typography>
            )}
          </List>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              error={!!error}
            />
            <IconButton 
              type="submit" 
              color="primary" 
              disabled={!newComment.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetails; 