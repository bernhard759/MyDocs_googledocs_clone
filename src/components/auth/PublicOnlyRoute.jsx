import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CircularProgress, Box } from '@mui/material';
import { auth } from '../../firebaseConfig';

const PublicOnlyRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  // If loading, display a loading spinner or some placeholder
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user is logged in, redirect to the homepage
  return user ? <Navigate to="/" /> : children;
};

export default PublicOnlyRoute;
