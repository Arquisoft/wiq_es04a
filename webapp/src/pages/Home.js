import * as React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useContext } from 'react';
import { SessionContext } from '../SessionContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const theme = useTheme();

    const { username } = useContext(SessionContext);
    const { t } = useTranslation();

    const styles = {
        // Constant that stores the styles of the play button
        playButton : {
            height: "4rem",
            width: "13rem",
            marginTop:'5vh',
            fontSize:'1.5rem',
            fontFamily: 'Arial Black, sans-serif',

            color: theme.palette.success.main,
            backgroundColor: 'transparent',
            border: `2px solid ${theme.palette.success.main}`,
            transition: 'background-color 0.3s ease',

            '&:hover': {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            }
        },
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'center', flex:'1', marginX:'10%'}}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",justifyContent: 'center', width:'40%',}}>
                <img src="./logo_wiq.png" alt="Logo" style={{ maxWidth: "100%"}}/>
                <Box sx={{ display: "flex", justifyContent: "center", gap: "1em", letterSpacing: "100%" }}>
                    <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.error.main }}> { t("WIQ.w") } </Typography>
                    <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.success.main }}> { t("WIQ.i") } </Typography>
                    <Typography align="center" sx={{fontSize: { xs:'1rem', sm: '1.2rem', md: '1.5rem',}, fontWeight: "bold",  color: theme.palette.primary.main }}> { t("WIQ.q") } </Typography>
                </Box>
                <Button variant='conteined' href={username ? "/homepage" : "/login"} sx={styles.playButton}> {t("Home")} </Button>
            </Box>
        </Box>
    );
};

export default Home;