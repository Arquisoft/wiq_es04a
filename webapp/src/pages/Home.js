import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const Home = () => {

    return (
        <Container 
            sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center',marginTop: 'auto',marginBottom: 'auto'}}>
            <CssBaseline />
            <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
                Welcome to the 2024 edition of the Software Architecture course.<br/>
                Login to start playing!
            </Typography>
        </Container>
    );
};

export default Home;