import * as React from "react";
import { Button, Typography, Grid, Box ,CssBaseline } from "@mui/material";
import data from "../data/gameInfo.json";


const Instructions = () => {

    const styles = {

        button:{
            color: 'black',
            backgroundColor:'transparent',
            width: "100%",
            height: "100px",
            border: '2px solid black',
            borderRadius: '5px',
        },

        selectedButton:{

            color: 'black',
            backgroundColor:'rgba(255,255,255,0.6)',
            width: "100%",
            height: "100px",
            border: '2px solid black',
            borderRadius: '5px'
        },

        fullScreen: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: 'center',
            flex: 1,
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,

        },

        game:{
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
        },

        video:{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex:'-1',
            userSelect:'none',
            pointerEvents: 'none',
            top:'0',
            left:'0',
            opacity:'0.5',

        },
    };

    // Whole information about games
    const [info, setInfo] = React.useState(null);

    // Game to show info about and the comp with the info
    const [gameDisplayedIndex, setGameDisplayed] = React.useState(null);
    const [gameInfo, setGameInfo] = React.useState(null);

    const videoRef = React.useRef(null);

    React.useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.75;
        }
    }, []);

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
                <Box sx={{...styles.game, flexDirection:'row',gap:'2rem', paddingTop:'2rem'}}>
                    <img src={info[index].foto} alt="Foto del minijuego" style={{ width: "25%", border: `2px solid black`, borderRadius: "5px", marginTop:'2rem'}}/>
                    <Box sx={{...styles.game, flexDirection: "column", width:'50%'}}>
                        <Typography variant="h3" align="center" fontWeight="bold"> {info[index].nombre} </Typography>
                        <Typography  variant="body1" align="center" sx={{ textAlign: "justify", background: "none", paddingTop:'2rem', width:'80%'}}> {info[index].descripcion} </Typography>
                    </Box>
                </Box>
            );
            setGameDisplayed(index);
        }
    };

    if (!info) {
        return <div>Loading...</div>; // Shows a loading message while the information is being obtained
    }

    return (
        <Box sx={{...styles.fullScreen}}>
            <video ref={videoRef} autoPlay muted loop style={{ ...styles.video}}>
                <source src="../instructions/background.mp4" type="video/mp4" />
            </video>
            <CssBaseline />

            <Box sx={{...styles.fullScreen, width:'80%', margin:'1rem'}}>
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 2, sm: 3, md: 3, lg: 5, xl:5 }}>
                    <Grid item xs={2} sm={3} md={5}>
                        <Typography variant="h3" align="center" fontWeight="bold" sx={{paddingTop:'2rem'}}>GAME MODES</Typography>
                    </Grid>
                    {info.map((option, index) => (
                        <Grid item xs={1} key={option.nombre} >
                            <Button width="100%"  size="large" variant="outlined" sx={ (gameDisplayedIndex === index)  ? styles.selectedButton : styles.button } onClick={() => displayGameInfo(index)} >
                                {option.nombre}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                {gameInfo}
            </Box>

        </Box>
    )
};

export default Instructions;