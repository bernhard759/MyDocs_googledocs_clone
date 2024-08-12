import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { saveUserToFirestore } from '../firebaseUtils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle register
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(userCredential.user); // Save the new user to Firestore
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  // Markup
  return (
    <Box
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" gutterBottom>
        {isRegister ? 'Register' : 'Login'}
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={isRegister ? handleRegister : handleLogin}>
        {isRegister ? 'Register' : 'Login'}
      </Button>
      <Button variant="text" color="secondary" onClick={() => setIsRegister(!isRegister)} style={{ marginTop: '10px' }}>
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </Button>
      </Container>
      </Box>
  );
};

export default Login;
