import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CircularProgress, Box } from '@mui/material';
import { auth } from '../../firebaseConfig';

const PrivateRoute = ({ children }) => {
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

  // Return the child props when user is authenticated, else go to login
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
