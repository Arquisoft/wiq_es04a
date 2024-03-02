import * as React from "react";
import ImageSlider from "../components/ImageSlider";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import data from "../data/sliderData.json";

const Home = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, flexWrap: "nowrap", alignItems: { xs: "center" }, margin: "auto 3em", gap: "3em" }} >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2em" }}>
                <img src="./logo_wiq.png" alt="Logo" style={{ width: "30vw" }}/>
                <Box sx={{ display: "flex", justifyContent: "center", gap: "1em" }}>
                    <Typography align="center" variant="h5" sx={{ fontWeight: "bold",  color: theme.palette.error.main }}> WIKIDATA </Typography>
                    <Typography align="center" variant="h5" sx={{ fontWeight: "bold",  color: theme.palette.secondary.main }}> INFINITE </Typography>
                    <Typography align="center" variant="h5" sx={{ fontWeight: "bold",  color: theme.palette.primary.main }}> QUEST </Typography>
                </Box>
                <Typography variant="body1" align="center" fontWeight="bold" >
                    Welcome to WIQ, also known as Wikidata Infinite Quest. On this page, a vast array of challenges awaits you, which will help you become the most knowledgeable person in the world. <br/><br/>
                    To achieve this, you"ll need to complete various mini-games. But don"t worry, thanks to our dynamic question system, you can play as many times as you want since the questions are infinite.<br/><br/>
                    From here, HappySoftware in collaboration with RTVE wishes you luck and hopes to see you at the top of the leaderboard.
                </Typography>
            </Box>
            <Paper sx={{ userSelect: "none", backgroundColor:"transparent", borderRadius: "20%" }}>
                <ImageSlider slides={data.slides} />
            </Paper>
        </Box>
    );
};

export default Home;