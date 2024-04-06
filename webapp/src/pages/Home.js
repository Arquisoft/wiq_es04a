import * as React from "react";
import {Box, Button, Typography, useTheme} from "@mui/material";

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

            color: '#339966',
            backgroundColor: 'transparent',
            border: '2px solid #339966',
            transition: 'background-color 0.3s ease',

            '&:hover': {
            backgroundColor: '#339966',
            color: '#fff',
            }
        },

    }
    return (
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'center', flex:'1', marginX:'10%'}}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",justifyContent: 'center', width:'40%',}}>
                <img src="./logo_wiq.png" alt="Logo" style={{ maxWidth: "100%"}}/>
                <Box sx={{ display: "flex", justifyContent: "center", gap: "1em", letterSpacing: "100%" }}>
                    <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.error.main }}> WIKIDATA </Typography>
                    <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.secondary.main }}> INFINITE </Typography>
                    <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.primary.main }}> QUEST </Typography>
                </Box>
                <Button variant='conteined' href={"/login"} sx={styles.playButton}> PLAY </Button>
            </Box>
        </Box>
    );
};

export default Home;