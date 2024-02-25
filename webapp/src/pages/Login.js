// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      // Extract data from the response
      const { createdAt: userCreatedAt } = response.data;

      setCreatedAt(userCreatedAt);
      setLoginSuccess(true);

      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{justifyContent: 'center', alignItems: 'center', height: '80vh', marginBottom:10}}>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
        {loginSuccess ? (
          <div>
            <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
              Hello {username}!
            </Typography>
            <Typography component="p" variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
              Your account was created on {new Date(createdAt).toLocaleDateString()}.
            </Typography>
          </div>
        ) : (
          <div>
            <Typography component="h1" variant="h5">
              Log In
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={loginUser}>
              Log In
            </Button>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
            {error && (
              <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
            )}
            <Container style={{textAlign: 'center', marginTop:'10%'}}>
              <Link name="gotoregister" component="button" variant="body2" to="/register">
              Don't have an account? Register here.
              </Link>
            </Container>
          </div>
        )}
      </Box>
    </Container>
  );
};

export default Login;
