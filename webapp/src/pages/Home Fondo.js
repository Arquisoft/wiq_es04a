import * as React from "react";
import {Box, Button, Grid, Typography, useTheme} from "@mui/material";

const Home = () => {
    
    const styles = {
        // Constant that stores the styles of the play button
        background : {
            backgroundImage: 'url("./Fondo.png")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            zIndex: '-1',
        },

    }
    return (
        <Box sx={{ ...styles.background, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'space-between', flex:'1'}}>

        </Box>
    );
};

export default Home;