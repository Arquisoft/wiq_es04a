import * as React from "react";
import {Box, Button, useTheme } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import AndroidIcon from '@mui/icons-material/Android';

const Home = () => {
    const xxl = useMediaQuery('(min-width:1920px)');
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const styles = {
        logo:{
            width: {
                xs: '14em', // Más pequeño para dispositivos extra pequeños
                sm: '16em', // Mediano para dispositivos pequeños
                md: '18em', // Normal para dispositivos medianos
                lg: '20em', // Grande para dispositivos grandes
                xl: '23em', // Muy grande para dispositivos extra grandes
            },
            marginTop:'3rem',
            userSelect: 'none',
            pointerEvents: 'none'
        },

        maxLogo:{
            width: '35em', // Muy grande para dispositivos extra grandes
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

            marginTop: '1rem',
            marginBottom:'3rem',
            fontFamily: 'Arial Black, sans-serif',
            color: '#006699',
            backgroundColor: 'transparent',
            border: `2px solid #006699`,
            transition: 'background-color 0.3s ease',

            '&:hover': {
                backgroundColor: '#006699',
                color: 'white',
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
    };

    const videoRef = React.useRef(null);

    React.useEffect(() => {if (videoRef.current) {videoRef.current.playbackRate = 0.85;}}, []);

    return (
        <Box sx={styles.fullScreen}>
            <Box data-testid="xxl" sx={xxl ? styles.maxLogo : styles.logo}>
                <img src="./home/HomeLogo.png" alt="Logo" style={{ width: '100%' }} />
            </Box>

            <Button variant='contained' href={"/login"} sx={styles.playButton}> {t("Home")} </Button>

            <video data-testid="video" ref={videoRef} autoPlay muted loop style={{ ...styles.video}}>
                <source src="./home/Background-White.webm" type="video/mp4" />
            </video>
            

            <a
            href="https://mega.nz/file/vNVkhQwT#l3K-nttaNWJ1tjdUVXJlCClmYm9rmpgBS_ULNewASL4"
            target="_blank"
            rel="noopener noreferrer"
            >
            <Button
                variant="contained"
                size={isMobile ? 'small' : 'big'}
                color="primary"
                startIcon={<AndroidIcon style={{ marginRight: '0.2em', color: "3DDC84", fontSize: '2em' }} />}
                style={{ marginTop: '0.8em' }}
                sx={{
                    '&:hover': {
                      border: `2px solid #3DDC84`, 
                      backgroundColor: 'primary.light', 
                    },
                  }}
            >
            {t("Footer.apk_link")}
            </Button>
          </a>

        </Box>
    );
};

export default Home;
