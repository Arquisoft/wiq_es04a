import * as React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ParticlesComponent from '../components/ParticleBg';

const Home = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex:'1' }}>
            <ParticlesComponent/>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom:'3rem'}}>
                 {/* <img src="./JordiCartoon.png" alt="Logo" style={{ width: "12%", transform: 'scaleX(-1)' }}/> */}
                 <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth:'40%'}}>
                    <img src="./logo_wiq.png" alt="Logo" style={{ width: "80%"}}/>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: "1em", letterSpacing: "100%" }}>
                        <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.error.main }}> WIKIDATA </Typography>
                        <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.secondary.main }}> INFINITE </Typography>
                        <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.primary.main }}> QUEST </Typography>
                    </Box>
                </Box>
                {/* <img src="./JordiCartoon.png" alt="Logo" style={{ width: "12%"}}/> */}
            </Box>

            <Typography
                variant="body1"
                textAlign="center"
                fontWeight="700"
                sx={{
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                    fontSize: '1.1rem',
                    width: '85%',
                    display: 'block',
                }}
            >
                    WELCOME TO WIQ, WHERE INFINITE KNOWLEDGE AWAITS POWERED BY WIKIDATA.<br/>
                    PLAY MINI-GAMES BASED ON 'SABER Y GANAR' TO BECOME THE ULTIMATE CHAMPION.
            </Typography>
        </Box>
    );
};

export default Home;