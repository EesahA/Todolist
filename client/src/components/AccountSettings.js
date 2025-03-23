import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/api';

const AccountSettings = () => {
  const { user, updateUserInfo } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await authService.updateUser({ username });
      if (result.success) {
        updateUserInfo(result.data);
        setSuccess('Username updated successfully!');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const result = await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (result.success) {
        setSuccess('Password changed successfully!');
        setPasswordDialogOpen(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>

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
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        <Box component="form" onSubmit={handleUsernameChange}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Update Username
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPasswordDialogOpen(true)}
        >
          Change Password
        </Button>
      </Paper>

      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={handlePasswordChange}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordFormChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordFormChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordFormChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Update Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AccountSettings; 