import * as React from 'react';
import { Container, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const Homepage = () => {

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex:'1', marginTop: '5em', marginBottom: '5em'}}>
            <CssBaseline />
            <Button variant="contained" href="/game" sx={{ height: "15vh", width: "15vw" }}>
                Play
            </Button>
        </Container>
    );
};

export default Homepage;