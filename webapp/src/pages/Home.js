import * as React from 'react';
import ImageSlider from '../components/ImageSlider';
import {Container, Box, Typography, Paper} from '@mui/material';
import data from "../data/sliderData.json";

const Home = () => {

const estiloImagenDeFondo = {
    backgroundImage: `url(FondoSimetrico.png)`,
    backgroundPosition: 'center',
    minWidth: '100%',
    minHeight: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'

};

    return (
        <Container sx={{ display: 'flex', flex:'1' , ...estiloImagenDeFondo}}>

                <Box className="contidoPrincipal" width="100vw" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems:'center' }}>


                    <Box className="texto" sx={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom:'5vh'}}>
                                <img style={{height: '15vw'}}  key='foto' src={'./logo_wiq.png'} alt='Foto sobre el dato correcto' />

                                <Box sx={{width:'70%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Typography align="center" sx={{fontWeight: 'bold',  fontSize: '2vw', color:'#990000', marginRight:'0.4em'}}> WIKIDATA </Typography>
                                    <Typography align="center" sx={{fontWeight: 'bold',  fontSize: '2vw', color:'#339966', marginRight:'0.4em'}}> INFINITE </Typography>
                                    <Typography align="center" sx={{fontWeight: 'bold',  fontSize: '2vw', color:'#006699',marginRight:'0.4em'}}> QUEST </Typography>
                                </Box>
                            </Box>

                            <Typography variant="body1" align="center" sx={{fontWeight: 'bold', width:'70%', fontSize: '1vw'}}>
                                Welcome to WIQ, also known as Wikidata Infinite Quest. On this page, a vast array of challenges awaits you, which will help you become the most knowledgeable person in the world. <br/><br/>
                                To achieve this, you'll need to complete various mini-games. But don't worry, thanks to our dynamic question system, you can play as many times as you want since the questions are infinite.<br/><br/>
                                From here, HappySoftware in collaboration with RTVE wishes you luck and hopes to see you at the top of the leaderboard.
                            </Typography>


                    </Box>


                    <Box className="slider" sx={{ width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>


                        <Paper sx={{ userSelect: 'none', backgroundColor:'transparent', marginLeft:'10vw', marginRight:'2vw'}}>
                            <ImageSlider slides={data.slides} />
                        </Paper>


                    </Box>


                </Box>

        </Container>
    );
};

export default Home;