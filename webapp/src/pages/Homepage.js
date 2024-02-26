import * as React from 'react';
import { Container, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const Homepage = () => {

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '85vh' }}>
            <CssBaseline />
            <Button variant="contained" href="/game" sx={{ height: "15vh", width: "15vw" }}>
                Jugar
            </Button>
        </Container>
    );
};

export default Homepage;