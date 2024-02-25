// src/components/AddUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [surname, setSurname] = useState('');
  const [imageUrl, setImageUrl] = useState(''); 
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/adduser`, {
        username,
        password,
        name, 
        surname, 
        imageUrl,
      });
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '85vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        <Box>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <TextField
              name="username"
              margin="normal"
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              name="password"
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              name="name"
              margin="normal"
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              name="surname"
              margin="normal"
              fullWidth
              label="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <TextField
              name="imageUrl"
              margin="normal"
              fullWidth
              label="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={addUser}>
              Sign Up
            </Button>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="User added successfully" />
            {error && (
              <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
            )}
            <Container style={{ textAlign: 'center', marginTop: '10%' }}>
              <Link name="gotologin" component="button" variant="body2" to="/login">
                Already have an account? Login here.
              </Link>
            </Container>
        </Box>
      </Box>
    </Container>
  );
};

export default AddUser;