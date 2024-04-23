import * as React from 'react';
import { Button, Box, Grid, Typography } from '@mui/material';
import data from "../data/gameInfo.json";
import CardComponent from "../components/CardComponent.js";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';


const Homepage = () => {
    const xxl = useMediaQuery('(min-width:1920px)');
    const { t } = useTranslation();

    const styles = React.useMemo(() => ({
        cardButton:{
            width: {
                xs: '8rem',
                sm: '11.4rem',
                md: '11rem',
                lg: '12rem',
                xl: '15rem',
            },
            height: {
                xs: '8rem',
                sm: '13rem',
                md: '12rem',
                lg: '15rem',
                xl: '18rem',
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
            fontFamily: 'Arial #006699, sans-serif',

            color: 'rgba(255,255,255,1)',
            backgroundColor: 'rgba(0,102,153,0.5)',
            border: `2px solid ${'#006699'}`,
            transition: 'background-color 0.3s ease',

            '&:hover': {
              backgroundColor: '#006699',
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
    }), []);
    // List of games on this page
    const [games, setGames] = React.useState(null);


    // Whole information about games
    const [info, setInfo] = React.useState(null);

    // Link to each game page
    const [gameLink, setGameLink] = React.useState("/game");

    //Selected index
    const [activeIndex, setActiveIndex] = React.useState(0); // Nuevo estado para el índice activo

    //if online mode -> change link to go to online room
    const changeGameLink = React.useCallback((index) => {
        switch (info[index].nombre) {
            case "Wise Men Stack":
                setGameLink("/wiseMenStackGame");
                break;
            case "Warm Question":
                setGameLink("/warmQuestionGame");
                break;
            case "Discovering Cities":
                setGameLink("/discoveringCitiesGame");
                break;
            case "Challenge":
                setGameLink("/theChallengeGame");
                break;
            case "Multiplayer":
                setGameLink("/multiplayerRoom");
                break;
            default:
                setGameLink("/wiseMenStackGame");
                break;
        }
    }, [info]);

    // Update the selected page number, page games and game photo
    const handleButtonClick = React.useCallback((index) => {
        setActiveIndex(index);
        changeGameLink(index);
    }, [setActiveIndex, changeGameLink]);

    // Responsible for generating the buttons with the names of the games and the pagination element
    const displayGames = React.useCallback((info) => {
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
    }, [xxl, styles.cardButtonMax, styles.cardButton, activeIndex, handleButtonClick]);

    //Update the game information
    React.useEffect(() => {
        setInfo(data);
    }, []);

    // Does the initial loading of the page elements
    React.useEffect(() => {
        // If game information (info) has been loaded and there is no game information currently displayed
        if (info !== null) {
            // Show the information of the first game
            displayGames(info);
        }
    }, [info, displayGames]); // <- Add info to the dependency array

    const videoRef = React.useRef(null);
    React.useEffect(() => {if (videoRef.current) {videoRef.current.playbackRate = 0.85;}}, []);

    return (
        <Box sx={{...styles.container }}>
            <video data-testid="video" ref={videoRef} autoPlay muted loop style={{ ...styles.video}}>
                <source src="../home/Background-White.webm" type="video/mp4" />
            </video>
            <Typography variant="h2" align="center" fontWeight="bold" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontSize:'3rem' }}>{ t("Homepage.title") }</Typography>
            {games}
            <Button variant='conteined' href={gameLink} sx={styles.playButton}> {t("Home")} </Button>
        </Box>
    );
};

export default Homepage;