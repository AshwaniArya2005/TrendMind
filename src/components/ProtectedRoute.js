import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (requireAuth && !currentUser) {
    // User is not authenticated but the route requires authentication
    return <Navigate to="/login" />;
  }

  if (!requireAuth && currentUser) {
    // User is authenticated but the route doesn't allow authenticated users (like login/register)
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 