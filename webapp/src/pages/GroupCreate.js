import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box, Divider } from '@mui/material';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddGroup = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addGroup = async () => {
    try {
      console.log("hola");
      await axios.post(`${apiEndpoint}/group/add`, {
        name
        // Need also the logged user
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
              Create a Group
            </Typography>
            <TextField
              name="name"
              margin="normal"
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Divider style={{ marginTop:'3%'}}/>
            <Button variant="contained" color="primary" onClick={addGroup} style={{ width: '100%', marginTop: '5%' }}>
              Create
            </Button>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Group created successfully" />
            {error && (<Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />)}
        </Box>
      </Box>
    </Container>
  );
};

export default AddGroup;