import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const UserMenu = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate('/settings');
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!currentUser?.displayName) return '?';
    return currentUser.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box>
      <IconButton
        onClick={handleMenuOpen}
        sx={{ 
          p: 0,
          '&:hover': { opacity: 0.8 }
        }}
      >
        {currentUser?.photoURL ? (
          <Avatar 
            src={currentUser.photoURL} 
            alt={currentUser.displayName || 'User'}
            sx={{ 
              width: 36, 
              height: 36,
              border: '2px solid rgba(255,255,255,0.7)'
            }}
          />
        ) : (
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: 'secondary.main',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.7)'
            }}
          >
            {getInitials()}
          </Avatar>
        )}
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            overflow: 'visible',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {currentUser?.displayName || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
            {currentUser?.email}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
          <AccountCircleIcon sx={{ mr: 2, color: 'text.secondary' }} fontSize="small" />
          <Typography variant="body2">My Profile</Typography>
        </MenuItem>
        
        <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
          <SettingsIcon sx={{ mr: 2, color: 'text.secondary' }} fontSize="small" />
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleSignOut} sx={{ py: 1.5 }}>
          <ExitToAppIcon sx={{ mr: 2, color: 'text.secondary' }} fontSize="small" />
          <Typography variant="body2">Sign Out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu; 