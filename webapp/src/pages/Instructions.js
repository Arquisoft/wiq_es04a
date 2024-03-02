import * as React from "react";
import { Container } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Typography, Grid } from "@mui/material";
import data from "../data/gameInfo.json";


const Instructions = () => {
    const [info, setInfo] = React.useState(null);
    const [gameInfo, setGameInfo] = React.useState(null);

    React.useEffect(() => {
        setInfo(data);
    }, []);

    const newGameInfo = (index) => {
        setGameInfo(
            <Grid container spacing={2} columns={4} >
                <Grid item xs={2}>
                    <img src={info[index].foto} alt="Foto del minijuego" style={{ maxWidth: "100%", border: "2px solid #006699", borderRadius: "5px"}}/>
                </Grid>
                
                <Grid item xs={2} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                    <Typography variant="h3" align="center" > {info[index].nombre} </Typography>
                    <Typography  component="body" variant="body1" align="center" sx={{ textAlign: "justify", background: "none" }}> {info[index].descripcion} </Typography>
                </Grid>
            </Grid>
        );
    };

    if (!info) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los info
    }

    return (
        <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1, gap: "2em" }}>
            <CssBaseline />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h3" align="center">GAMEPLAY & MODES:</Typography>
                </Grid>
                {info.map((option, index) => (
                    <Grid item xs={3} key={option.nombre} >
                        <Button width="100%" color="primary" size="large" variant="outlined" sx={{ width: "100%", height: "100px"  }} onClick={() => newGameInfo([index])}>
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