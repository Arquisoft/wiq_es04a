import React from 'react';
import { AppBar, Toolbar, Button, IconButton, Typography, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

//Link carga solo partes del DOM, mejora la eficiencia respecto a usar href

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size='large' edge='start' color='inherit' component={Link} to="/" >
            <HomeIcon/>
        </IconButton>
        <Typography variant='h6' component='div' sx={{flexGrow: 1}} style={{ fontFamily: 'inherit' }}>
            APP Ejemplo
        </Typography>
        <Stack direction='row' spacing={2}>
            <Button color="inherit" component={Link} to="/">
            Home
            </Button>
            <Button color="inherit" component={Link} to="/clock">
            Clock
            </Button>
            <Button color="inherit" component={Link} to="/eieqwd">
            Ver página de error
            </Button>
            <Button color="inherit" component={Link} to="/game">
            Juego
            </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
