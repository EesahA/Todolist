import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
          <Switch defaultChecked />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          <ListItemText 
            primary="Theme" 
            secondary={isDarkMode ? "Dark Mode" : "Light Mode"} 
          />
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            color="primary"
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default Settings; 