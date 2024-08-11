import React from 'react';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import Docs from './components/Docs';
import EditDocs from './components/EditDocs';
import { database } from './firebaseConfig';

function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
            Google Docs Clone
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<Docs database={database} />} />
          <Route path="/editDocs/:id" element={<EditDocs database={database} />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
