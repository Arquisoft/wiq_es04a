import * as React from "react";
import {Box, Button, Grid, Typography, useTheme} from "@mui/material";

const Home = () => {
    const theme = useTheme();

    const styles = {
        // Constant that stores the styles of the play button
        playButton : {
            height: "4rem",
            width: "13rem",
            marginTop:'5vh',
            fontSize:'1.5rem',
            fontFamily: 'Arial Black, sans-serif',

            color: '#990000',
            backgroundColor: 'transparent',
            border: '2px solid #990000',
            transition: 'background-color 0.3s ease',

            '&:hover': {
              backgroundColor: '#990000',
              color: '#fff',
            }
        },

        // Constant that stores the styles of the play button
        background : {
            backgroundImage: 'url("./FondoR.png")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            zIndex: '1',
            border: '2px solid #006699',
        },
    }
    return (
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'center', flex:'1', }}>
            <Box sx={{ ...styles.background,display: "flex", flexDirection: "column", alignItems: "center",justifyContent: 'center', maxWidth:'50%',flex:'1', minHeight:'565px'}}>
                {/* <img src={"./FondoR.png"} alt="Foto del minijuego" style={{ maxWidth:'100%' ,border: "2px solid #006699", borderRadius: "5px"}}/> */}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",justifyContent: 'center', width:'50%'}}>
                <img src="./logo_wiq.png" alt="Logo" style={{ maxWidth: "60%"}}/>
                <Box sx={{ display: "flex", justifyContent: "center", gap: "1em", letterSpacing: "100%" }}>
                    <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.error.main }}> WIKIDATA </Typography>
                    <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.secondary.main }}> INFINITE </Typography>
                    <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.primary.main }}> QUEST </Typography>
                </Box>
                {/* <Button variant='conteined' href={"/login"} sx={styles.playButton}> PLAY </Button> */}
            </Box>
        </Box>
    );
};

export default Home;