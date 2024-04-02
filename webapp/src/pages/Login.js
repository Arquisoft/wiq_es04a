import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box, Divider } from '@mui/material';
import { Link,useNavigate } from 'react-router-dom';
import { SessionContext } from '../SessionContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const navigate = useNavigate();

  const { createSession } = useContext(SessionContext);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/login`, { username, password });


      setOpenSnackbar(true);
      createSession(username);
      navigate('/homepage');
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex:'1', marginTop: '2em', marginBottom: '2em'}}>
      <Box sx={{margin: '2em'}}>
        <div>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Divider style={{ marginTop:'3%'}}/>
          <Button variant="contained" color="primary" onClick={loginUser} style={{ width: '100%', marginTop: '5%' }}>
            Log In
          </Button>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
          {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
          )}
          <Container style={{textAlign: 'center', marginTop:'15%'}}>
            <Link name="gotoregister" component="button" variant="body2" to="/register">
            Don't have an account? Register here.
            </Link>
          </Container>
        </div>
      </Box>
    </Container>
  );
};

export default Login;
