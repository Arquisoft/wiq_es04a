import * as React from "react";
import { Button, Typography, Grid, Container, CssBaseline, useTheme } from "@mui/material";
import data from "../data/gameInfo.json";


const Instructions = () => {
    const theme = useTheme();

    // Whole information about games
    const [info, setInfo] = React.useState(null);

    // Game to show info about and the comp with the info
    const [gameDisplayedIndex, setGameDisplayed] = React.useState(null);
    const [gameInfo, setGameInfo] = React.useState(null);

    React.useEffect(() => {
        setInfo(data);
    }, []);

    const displayGameInfo = (index) => {
        // If game being displayed is selected, hides the info panel
        if (gameDisplayedIndex === index) {
            setGameInfo(null);
            setGameDisplayed(null);
            console.log(gameDisplayedIndex);
        }
        else {
            setGameInfo(
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 2, md: 4 }} >
                    <Grid item xs={2}>
                        <img src={info[index].foto} alt="Foto del minijuego" style={{ maxWidth: "100%", border: `2px solid ${theme.palette.primary.main}`, borderRadius: "5px"}}/>
                    </Grid>
                    <Grid item xs={2} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                        <Typography variant="h3" align="center" fontWeight="bold"> {info[index].nombre} </Typography>
                        <Typography  variant="body1" align="center" sx={{ textAlign: "justify", background: "none" }}> {info[index].descripcion} </Typography>
                    </Grid>
                </Grid>
            );
            setGameDisplayed(index);
        }
    };

    if (!info) {
        return <div>Loading...</div>; // Shows a loading message while the information is being obtained
    }

    return (
        <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1, gap: "2em", padding:"6vh"}}>
            <CssBaseline />
            <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 2, sm: 3, md: 4 }} >
                <Grid item xs={2} sm={3} md={4}>
                    <Typography variant="h3" align="center" fontWeight="bold">GAME MODES</Typography>
                </Grid>
                {info.map((option, index) => (
                    <Grid item xs={1} key={option.nombre} >
                        <Button width="100%" color={ gameDisplayedIndex === index ? "secondary" : "primary"} size="large" variant="outlined" sx={{ width: "100%", height: "100px"  }} onClick={() => displayGameInfo(index)} >
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