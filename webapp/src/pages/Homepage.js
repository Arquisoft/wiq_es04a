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
                sm: '10..4rem',
                md: '9.6rem',
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

            color: 'rgba(0,0,0,0.8)',
            backgroundColor: 'rgba(255,255,255,0.5)',
            border: `2px solid ${'white'}`,
            transition: 'background-color 0.3s ease',

            '&:hover': {
              backgroundColor: 'white',
              color: 'black',
            }
        },

        container:{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: 'center',
            flexGrow: 1,
            backgroundImage: 'url(\'.//BackgroundApagado.jpg\')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',

        },
    }

    // List of games on this page
    const [games, setGames] = React.useState(null);


    // Whole information about games
    const [info, setInfo] = React.useState(null);

    // Link to each game page
    const [gameLink, setGameLink] = React.useState("");

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
            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: 'center', width: '50%', flexGrow: 1,}}>
                {info.slice(first, last).map((option, index) => (
                    <Button key={'game'+index} variant="outlined" sx={activeIndex === index ? styles.buttonClicked : styles.buttonNormal} onClick={() => handleButtonClick(index, first,page)}>
                        {option.nombre}
                    </Button>
                ))}
                <Pagination count={info ? Math.ceil(info.length / 4) : 1} color="primary" size='medium' page={page} onChange={handlePageChange}  sx={{marginTop:'20px',}}/>
            </Box>
        );
    };

    //Update component that has the photo of the selected game
    const displayGamePhoto = (index) => {
        if (info !== null) {
            setGamePhoto(
                <Box sx={{display:{xs:'none', md:'flex'}, flexGrow:1, flexDirection: "row", justifyContent: "center", alignItems:'center', width:'50%',}}>
                    <img
                        style={styles.img}
                        src={info[index].foto}
                        alt="Foto del juego"
                    />

                </Box>
            );
        }
    };

    return (
        <Box sx={{...styles.container }}>
            {games}
            <Button variant='conteined' href={gameLink} sx={styles.playButton}> PLAY </Button>
        </Box>
    );
};

export default Homepage;