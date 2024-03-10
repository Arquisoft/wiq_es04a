import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://gatewayservice:8000';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [surname, setSurname] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/user/add`, {
        username,
        password,
        name, 
        surname
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
    <Container component="main" maxWidth="xs" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex:'1'}}>
      <Box sx={{ margin: '2em'}}>
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
            <Divider style={{ marginTop:'3%'}}/>
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
            <Divider style={{ marginTop:'3%'}}/>
            <Button variant="contained" color="primary" onClick={addUser} style={{ width: '100%', marginTop: '5%' }}>
              Sign Up
            </Button>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="User added successfully" />
            {error && (<Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />)}
            <Container style={{ textAlign: 'center', marginTop: '15%' }}>
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
