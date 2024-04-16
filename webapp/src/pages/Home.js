import * as React from "react";
import {Box, Button} from "@mui/material";
import { useContext } from 'react';
import { SessionContext } from '../SessionContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { username } = useContext(SessionContext);
    const { t } = useTranslation();

    const styles = {
        logo:{
            width: {
                xs: '25em', // Más pequeño para dispositivos extra pequeños
                sm: '30em', // Mediano para dispositivos pequeños
                md: '35em', // Normal para dispositivos medianos
                lg: '40em', // Grande para dispositivos grandes
                xl: '45em' // Muy grande para dispositivos extra grandes
            },
            marginTop:'3rem',
            userSelect: 'none',
            pointerEvents: 'none'
        },

        playButton: {
            height: {
                xs: '3rem', // Tamaño para dispositivos extra pequeños
                sm: '3.5rem', // Tamaño para dispositivos pequeños
                md: '4rem', // Tamaño para dispositivos medianos
                lg: '4.5rem', // Tamaño para dispositivos grandes
                xl: '5rem' // Tamaño para dispositivos extra grandes
            },
            width: {
                xs: '10rem',
                sm: '12rem',
                md: '13.5rem',
                lg: '14.5rem',
                xl: '15rem'
            },
            fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1rem',
                lg: '1.1rem',
                xl: '1.2rem'
            },

            marginTop: '3rem',
            marginBottom:'3rem',
            fontFamily: 'Arial Black, sans-serif',
            color: 'white',
            backgroundColor: 'transparent',
            border: `2px solid white`,
            transition: 'background-color 0.3s ease',

            '&:hover': {
                backgroundColor: 'white',
                color: 'black',
            }
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
        }
    };

    return (
        <Box sx={styles.fullScreen}>
            <video autoPlay muted loop style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", zIndex:'-1', userSelect:'none', pointerEvents: 'none'}}>
                <source src="./home/Background-Blur.mp4" type="video/mp4" />
            </video>

            <Box sx={{ ...styles.logo, userSelect: 'none', pointerEvents: 'none' }}>
                <img src="./home/HomeLogo.png" alt="Logo" style={{ width: '100%' }} />
            </Box>

            <Button variant='contained' href={"/login"} sx={styles.playButton}> PLAY </Button>
        </Box>
    );
};

export default Home;
