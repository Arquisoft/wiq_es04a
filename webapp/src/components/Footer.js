import * as React from 'react';
import { BottomNavigation, Toolbar, Typography, useTheme } from '@mui/material';

const Footer = () => {
    const theme = useTheme();

    return (
      <BottomNavigation position="static" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, bottom: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <Toolbar>
          <Typography sx={{ margin: 'auto' }}>
            © WIQ_ES04A
          </Typography>
        </Toolbar>
      </BottomNavigation>
    );
};

export default Footer;