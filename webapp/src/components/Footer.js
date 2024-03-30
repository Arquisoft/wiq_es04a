import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Footer = () => {
    return (
      <AppBar component="footer" position="static" sx={{ backgroundColor: "primary", color: "white", bottom: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <Toolbar>
          <Typography sx={{ margin: 'auto' }}>
            © WIQ_ES04A
          </Typography>
        </Toolbar>
      </AppBar>
    );
};

export default Footer;