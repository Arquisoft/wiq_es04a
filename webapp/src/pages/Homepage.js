import * as React from 'react';
import { Button, Box, Grid } from '@mui/material';
import data from "../data/gameInfo.json";
import CardComponent from "../components/CardComponent.js";
import useMediaQuery from '@mui/material/useMediaQuery';


const Homepage = () => {
    const xxl = useMediaQuery('(min-width:1920px)');
    const styles = {

        cardButton:{
            width: {
                xs: '9.6rem',
                sm: '11.4rem',
                md: '11rem',
                lg: '12rem',
                xl: '16rem',
            },
            height: {
                xs: '10rem',
                sm: '13rem',
                md: '12rem',
                lg: '15rem',
                xl: '20rem',
            },

            marginTop:'1rem'
        },

        cardButtonMax:{
            width: '20rem',
            height: '25rem',
            margin:'3rem'
        },

        playButton : {
            height: {
                xs: '2.5rem', // Tamaño para dispositivos extra pequeños
                sm: '3rem', // Tamaño para dispositivos pequeños
                md: '3.5rem', // Tamaño para dispositivos medianos
                lg: '4rem', // Tamaño para dispositivos grandes
                xl: '5rem' // Tamaño para dispositivos extra grandes
            },
            width: {
                xs: '10rem',
                sm: '12rem',
                md: '13.5rem',
                lg: '14.5rem',
                xl: '16rem'
            },
            fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1rem',
                lg: '1.1rem',
                xl: '1.2rem'
            },

            marginTop:'3rem',
            marginBottom:'2rem',
            fontFamily: 'Arial Black, sans-serif',

            color: 'rgba(255,255,255,0.8)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: `2px solid ${'black'}`,
            transition: 'background-color 0.3s ease',

            '&:hover': {
              backgroundColor: 'black',
              color: 'white',
            }
        },

        container:{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: 'center',
            flexGrow: 1,
        },

        video:{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex:'-1',
            userSelect:'none',
            pointerEvents: 'none'
        },
    }

    // List of games on this page
    const [games, setGames] = React.useState(null);


    // Whole information about games
    const [info, setInfo] = React.useState(null);

    // Link to each game page
    const [gameLink, setGameLink] = React.useState("/game");

    //Selected index
    const [activeIndex, setActiveIndex] = React.useState(0); // Nuevo estado para el índice activo


    //Update the game information
    React.useEffect(() => {
        setInfo(data);
    }, []);

    //Does the initial loading of the page elements
    React.useEffect(() => {
        // If game information (info) has been loaded and there is no game information currently displayed
        if (info !== null) {
            // Show the information of the first game
            displayGames(info)
        }
    });


    // Update the selected page number, page games and game photo
    const handleButtonClick = (index) => {
        setActiveIndex(index)
        changeGameLink(index);
    };

    //if online mode -> change link to go to online room
    const changeGameLink = (index) => {
        switch (info[index].nombre) {
            case "WISE MEN STACK":
                setGameLink("/game");
                break;
            case "WARM QUESTION":
                setGameLink("/game");
                break;
            case "DISCOVERING CITIES":
                setGameLink("/discoveringCitiesGame");
                break;
            case "THE CHALLENGE":
                setGameLink("/TheChallengeGame");
                break;
            case "ONLINE MODE":
                setGameLink("/multiplayerRoom");
                break;
            default:
                setGameLink("/game");
                break;
        }
    }


    // Responsible for generating the buttons with the names of the games and the pagination element
    const displayGames = (info) => {
        setGames(
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                {info.map((option, index) => (
                    <Grid item xs={6} sm={4} md={2} lg={2} xl={2} key={'game-' + index} sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center',}}>
                        <Button sx={xxl ? styles.cardButtonMax : styles.cardButton} onClick={() => handleButtonClick(index)}>
                            <CardComponent
                                imageUrl={option.cardFoto}
                                title={option.nombre}
                                isActive={index === activeIndex}
                            />
                        </Button>
                    </Grid>
                ))}
            </Grid>
        );
    };

    const videoRef = React.useRef(null);
    React.useEffect(() => {if (videoRef.current) {videoRef.current.playbackRate = 0.85;}}, []);

    return (
        <Box sx={{...styles.container }}>
            {games}
            <Button variant='conteined' href={gameLink} sx={styles.playButton}> PLAY </Button>
            <video data-testid="video" ref={videoRef} autoPlay muted loop style={{ ...styles.video}}>
                <source src="../home/Background-White.webm" type="video/mp4" />
            </video>
        </Box>
    );
};

export default Homepage;