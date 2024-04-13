import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh',  }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: '0 auto' }}>
            <Typography variant="h2" gutterBottom style={{  marginBottom: '20px' }}>
                Página no encontrada
            </Typography>
            <Container
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                padding: '20px',
                height: "30vh",
                backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
                backgroundPosition: 'center',
                backgroundSize: 'cover', 
            }}
            />

            <Button sx={{marginTop: "5em"}} component={RouterLink} to="/" variant="contained" color="primary">
                Ir a la página principal
            </Button>
        </div>      
    </div>
  );
};

export default NotFound;
