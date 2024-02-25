import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Footer = () => {

    return (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 1000 }}>
          <AppBar position="static" sx={{ backgroundColor: '#006699' }}>
            <Toolbar>
              <Typography sx={{ margin: 'auto' }}>
                © WIQ_ES04A
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
    );
};

export default Footer;