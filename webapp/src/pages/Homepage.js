import * as React from 'react';
import { Container, Button, Card, CardActionArea, CardMedia, Box, Pagination} from '@mui/material';
import data from "../data/gameInfo.json";



// Constante que almacena los estilos del boton en estado normal
const buttonClickedStyles = {
    width: "70%",
    height: "50px",
    backgroundColor: '#990000',
    color: '#fff',
    transition: 'width 0.1s ease-in-out, height 0.1s ease-in-out', // Transición suave para el cambio de tamaño
    '&:hover': { backgroundColor: '#990000',},
};

// Constante que almacena los estilos del boton cuando esta clicado
const buttonNormalStyles = {
    width: "60%",
    height: "50px",
};

const Homepage = () => {

    //Listado de jusgos de esta pagina
    const [games, setGames] = React.useState(null);

    // Se encarga de generar los botones con los nombres de los juegos y el elemento de paginacion
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

    // Actualizar el número de página seleccionada, juegos de la pagina y foto del juego
    const handlePageChange = (event, page) => {
        displayGames(info, page, (page-1)*4, (page*4),0);
        displayGamePhoto((page-1)*4);
    };

    // Actualizar el número de página seleccionada, juegos de la pagina y foto del juego
    const handleButtonClick = (index, first, page) => {
        displayGames(info, page, (page-1)*4, (page*4), index);
        displayGamePhoto(index+first);
    };

    // Game to show info about and the comp with the info
    const [gamePhoto, setGamePhoto] = React.useState(null);

    //Actializar componente que tiene la foto del jeugo seleccionado
    const displayGamePhoto = (index) => {
        if (info !== null) {
            setGamePhoto(
                <Box sx={{display:{xs:'none', md:'flex'}, flexDirection: "row", justifyContent: "center", alignItems:'center', width:'50%', flexGrow:1}}>
                    <Card sx={{ width: '80%', height:'20rem' }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="400rem"
                                image={info[index].foto}
                                alt="Foto del juego"
                            />
                         </CardActionArea>
                    </Card>
                </Box>
            );
        }
    };

    // Whole information about games
    const [info, setInfo] = React.useState(null);

    //Actualiza la informacion del juego
    React.useEffect(() => {
        setInfo(data);
    }, []);

    //Hace la carga inicial de los elementos de la pagina
    React.useEffect(() => {
        // Si se ha cargado la información de los juegos (info) y no hay información de juego mostrada actualmente
        if (info !== null && gamePhoto === null) {
            // Mostrar la información del primer juego
            displayGames(info, 1,0,4,0)
            displayGamePhoto(0);
        }
    }, [info, gamePhoto]);

    // Muestra un mensaje de carga mientras se obtienen los info
    if (!info) {return <div>Cargando...</div>; }

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