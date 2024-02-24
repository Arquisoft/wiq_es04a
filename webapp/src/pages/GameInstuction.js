import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const GameInstruction = () => {

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
            <CssBaseline />
            <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
                Welcome to the 2024 edition of the Software Architecture course.<br/>
                Login to start playing!
            </Typography>

            <Typography component="keynueva" variant="h5" align="center" sx={{ marginTop: 2 }}>
                Welcome to the 2024 edition of the Software Architecture course.<br/>
                Login to start playing!
            </Typography>
        </Container>
    );
};

export default GameInstruction;