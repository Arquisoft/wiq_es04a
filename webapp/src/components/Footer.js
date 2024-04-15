import * as React from 'react';
import { AppBar, Toolbar, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
      <AppBar component="footer" position="static" sx={{ backgroundColor: "black", color: "white", bottom: 0, left: 0, width: '100%', zIndex: 1000}}>
        <Toolbar>
          <Typography sx={{ margin: 'auto' }}>
            <Link href='https://app.swaggerhub.com/apis-docs/UO288347_1/questions-api/1.0.0' target="_blank" color="inherit">QUESTIONS API DOC</Link>
          </Typography>
          <Typography sx={{ margin: 'auto' }}>
            <Link href="https://github.com/Arquisoft/wiq_es04a" target="_blank" rel="noopener" color="inherit">© WIQ-ES04A</Link>
          </Typography>
          <Typography sx={{ margin: 'auto' }}>
            <Link href='https://app.swaggerhub.com/apis-docs/UO289689_1/users-api/1.0.0' target="_blank" color="inherit">USERS API DOC</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    );
};

export default Footer;