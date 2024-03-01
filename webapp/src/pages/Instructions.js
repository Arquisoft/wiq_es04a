import * as React from 'react';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Typography, Box, Grid } from '@mui/material';
import data from '../data/gameInfo.json';


const Instructions = () => {
    const [info, setInfo] = React.useState(null);
    const [gameInfo, setGameInfo] = React.useState(null);

    React.useEffect(() => {
        setInfo(data);
    }, []);

    const newGameInfo = (index) => {
        setGameInfo(
            <Box sx={{  marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width:'100%'}}>
                <Box sx={{width: '30%', display: 'flex', flexDirection: 'column', marginTop: '10'}}>
                    <img src={info[index].foto} alt="Foto del minijuego" style={{ maxWidth: '100%', height: 'auto', border: '2px solid #006699', borderRadius: '5px'}}/>
                </Box>
                <Box sx={{width: '40%', display: 'flex', flexDirection: 'column', marginLeft: 10}}>
                    <Typography component="h1" variant="h3" align="center" sx={{marginBotton: 10, fontWeight: 'bold'}}> {info[index].nombre} </Typography>
                    <Typography  component="body" variant="body1" align="center" sx={{ textAlign: 'justify', marginTop: 6}}> {info[index].descripcion} </Typography>
                </Box>
            </Box>
        );
    };

    if (!info) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los info
    }

    return (
        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: '90vh' }}>
            <CssBaseline />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h3" align="center">GAMEPLAY & MODES:</Typography>
                </Grid>
                {info.map((option, index) => (
                    <Grid item xs={3} key={option.nombre} >
                        <Button width="100%" color="primary" size="large" variant="outlined" sx={{ width: '100%', height: '100px'  }} onClick={() => newGameInfo([index])}>
                            {option.nombre}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            {gameInfo}
        </Container>
    )
};

export default Instructions;