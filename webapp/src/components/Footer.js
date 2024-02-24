import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

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