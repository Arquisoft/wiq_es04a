import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

//Link carga solo partes del DOM, mejora la eficiencia respecto a usar href

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography color="inherit" variant="h6" component={Link} to="/">
          Aplicacion de ejemplo
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/test">
          test
        </Button>
        <Button color="inherit" component={Link} to="/eieqwd">
          Ver página de error
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
