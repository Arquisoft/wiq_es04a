import * as React from 'react';
import { Container, Button, Box, Pagination, useTheme } from '@mui/material';
import data from "../data/gameInfo.json";

const Homepage = () => {
    const theme = useTheme();
    const styles = {
        // Object that stores the button styles in normal state
        buttonNormal : {
            width: "60%",
            height: "3rem",
            margin: '0.7vh',
            '&:hover': { backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main,},
        },
    
        // Constant that stores the styles of the button when it is clicked
        buttonClicked : {
            width: "70%",
            height: "3rem",
            margin: '0.5vh',
            backgroundColor: theme.palette.success.main,
            color: theme.palette.secondary.main,
            transition: 'width 0.1s ease-in-out, height 0.1s ease-in-out',
            borderColor:theme.palette.success.main,
            '&:hover': { backgroundColor: theme.palette.success.main, borderColor:theme.palette.success.main,},
        },
    
        // Constant that stores the styles of the images
        img : {
            boxShadow: `-50px -50px 0 -30px ${theme.palette.error.main}, 50px 50px 0 -30px ${theme.palette.primary.main}`,
            border:' 4px solid black',
            width: '50%',
        },
    
        // Constant that stores the styles of the play button
        playButton : {
            height: "4rem",
            width: "10rem",
            marginTop:'7vh',
            fontSize:'1.5rem',
            fontFamily: 'Arial Black, sans-serif',
    
            color: theme.palette.success.main,
            backgroundColor: 'transparent',
            border: `2px solid ${theme.palette.success.main}`,
            transition: 'background-color 0.3s ease',
    
            '&:hover': {
              backgroundColor: theme.palette.success.main,
              color: theme.palette.secondary.main,
            }
        },
    
    }

    // List of games on this page
    const [games, setGames] = React.useState(null);

    // Game to show info about and the comp with the info
    const [gamePhoto, setGamePhoto] = React.useState(null);

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
        if (info !== null && gamePhoto === null) {
            // Show the information of the first game
            displayGames(info, 1,0,4,0)
            displayGamePhoto(0);
        }
    });

    // Update the selected page number, page games and game photo
    const handlePageChange = (event, page) => {
        displayGames(info, page, (page-1)*4, (page*4),0);
        displayGamePhoto((page-1)*4);
        changeGameLink((page-1)*4)
    };

    // Update the selected page number, page games and game photo
    const handleButtonClick = (index, first, page) => {
        displayGames(info, page, (page-1)*4, (page*4), index);
        displayGamePhoto(index+first);
        changeGameLink(index+first);
    };

    //if online mode -> change link to go to online room
    const changeGameLink = (index) => {
        if(info[index].nombre === "ONLINE MODE") {
            setGameLink("/multiplayerRoom")
        } else {
            setGameLink("/game")
        }
    }


    // Responsible for generating the buttons with the names of the games and the pagination element
    const displayGames = (info, page, first, last, activeIndex) => {
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
        <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', flexGrow: 1, paddingTop: "4vh", marginTop:'3vh', paddingBottom: "4vh", marginBottom:'2vh'}}>
            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: 'center', width: '100%'}}>
                {games}
                {gamePhoto}
            </Box>
            <Button variant='conteined' href={gameLink} sx={styles.playButton}> PLAY </Button>
        </Container>
    );
};

export default Homepage;