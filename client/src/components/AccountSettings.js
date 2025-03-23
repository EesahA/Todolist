import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const AccountSettings = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        <Typography>
          Username: {user?.username}
        </Typography>
        <Typography>
          Email: {user?.email}
        </Typography>
      </Paper>
    </Box>
  );
};

export default AccountSettings; 