import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Footer = () => {
    return (
      <AppBar position="static" sx={{ backgroundColor: '#006699', bottom: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <Toolbar>
          <Typography sx={{ margin: 'auto' }}>
            © WIQ_ES04A
          </Typography>
        </Toolbar>
      </AppBar>
    );
};

export default Footer;