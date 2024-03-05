import * as React from "react";
import ImageSlider from "../components/ImageSlider";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import data from "../data/sliderData.json";

const Home = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1.6em 5em auto" }}>
            <img src="./logo_wiq.png" alt="Logo" style={{ width: "35vw", marginLeft: "1.8em" }}/>
            <Box sx={{ display: "flex", justifyContent: "center", gap: "1em", letterSpacing: "100%" }}>
                <Typography align="center" variant="h5" sx={{ fontWeight: "bold",  color: theme.palette.error.main }}> WIKIDATA </Typography>
                <Typography align="center" variant="h5" sx={{ fontWeight: "bold",  color: theme.palette.secondary.main }}> INFINITE </Typography>
                <Typography align="center" variant="h5" sx={{ fontWeight: "bold",  color: theme.palette.primary.main }}> QUEST </Typography>
            </Box>
            <Typography variant="body1" textAlign="center" fontWeight="700" marginTop="4em" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', fontSize: '150%' }}>
            WELCOME TO WIQ, WHERE INFINITE KNOWLEDGE AWAITS POWERED BY WIKIDATA.<br/>PLAY MINI-GAMES BASED ON 'SABER Y GANAR' TO BECOME THE ULTIMATE CHAMPION.<br/><br/>HAPPYSOFTWARE WISHES YOU LUCK ON YOUR QUEST TO THE TOP!
            </Typography>
        </Box>
    );
};

export default Home;