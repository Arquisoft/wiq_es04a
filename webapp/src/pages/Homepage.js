import * as React from 'react';
import { Container, Button, Box, Pagination} from '@mui/material';
import data from "../data/gameInfo.json";

// Constant that stores the button styles in normal state
const buttonClickedStyles = {
    width: "70%",
    height: "50px",
    backgroundColor: '#990000',
    color: '#fff',
    transition: 'width 0.1s ease-in-out, height 0.1s ease-in-out',
    '&:hover': { backgroundColor: '#990000',},
};

// Constant that stores the styles of the button when it is clicked
const buttonNormalStyles = {
    width: "60%",
    height: "50px",
};

const Homepage = () => {

    //List of games on this page
    const [games, setGames] = React.useState(null);

    // Responsible for generating the buttons with the names of the games and the pagination element
    const displayGames = (info, page, first, last, activeIndex) => {
        setGames(
            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: 'center', width: '50%', flexGrow: 1,}}>
                    <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: 'center', width: '100%' }}>
                        {info.slice(first, last).map((option, index) => (
                            <Box key={option.nombre} sx={{width:'100%', display:'flex', flexDirection: "row", justifyContent: "center", alignItems:'center', margin:'1vh' , flexGrow:1}}>
                                <Button width="100%" size="large" variant="outlined"     sx={activeIndex === index ? buttonClickedStyles : buttonNormalStyles} onClick={() => handleButtonClick(index, first,page)}>
                                    {option.nombre}
                                </Button>
                            </Box>
                        ))}
                        <Pagination count={info ? Math.ceil(info.length / 4) : 1} color="primary" size='medium' page={page} onChange={handlePageChange}  sx={{marginTop:'20px',}}/>
                    </Box>
            </Box>
        );
    };

    // Update the selected page number, page games and game photo
    const handlePageChange = (event, page) => {
        displayGames(info, page, (page-1)*4, (page*4),0);
        displayGamePhoto((page-1)*4);
    };

    // Update the selected page number, page games and game photo
    const handleButtonClick = (index, first, page) => {
        displayGames(info, page, (page-1)*4, (page*4), index);
        displayGamePhoto(index+first);
    };

    // Game to show info about and the comp with the info
    const [gamePhoto, setGamePhoto] = React.useState(null);

    //Update component that has the photo of the selected game
    const displayGamePhoto = (index) => {
        if (info !== null) {
            setGamePhoto(
                <Box sx={{display:{xs:'none', md:'flex'}, flexDirection: "row", justifyContent: "center", alignItems:'center', width:'50%', flexGrow:1}}>
                    <Box sx={{ width: '55%'}}>
                        <img
                            style={{ objectFit: 'contain', width: '100%'}}
                            src={info[index].foto}
                            alt="Foto del juego"
                        />
                    </Box>
                </Box>
            );
        }
    };

    // Whole information about games
    const [info, setInfo] = React.useState(null);

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

    // Displays a loading message while the info is being obtained
    if (!info) {return <div>Loading...</div>; }

    return (
        <Container sx={{ display: "flex", flexDirection: "column", flexGrow: 1, paddingTop: "4vh" }}>
            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: 'center', width: '100%', flexGrow: 1 }}>
                {games}
                {gamePhoto}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: 'center', height:'15vh', paddingBottom:'3vh', padding:{xs:'10vh', md:'3vh'}}}>
                <Button variant="contained" href="/game" sx={{ height: "4rem", width: "10rem", '&:hover': { backgroundColor: '#339966'}}}> PLAY </Button>
            </Box>
        </Container>
    );
};

export default Homepage;