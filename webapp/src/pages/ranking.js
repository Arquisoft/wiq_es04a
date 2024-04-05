import React from 'react';

const Ranking = () => {

    const theme = useTheme();

    const items = ['Item 1', 'Item 2', 'Item 3'] //request to the server to get the ranking of the users;


    return (

        <Container sx={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center", 
            flexGrow: 1, 
            gap: "2em", 
            padding:"6vh"
        }}>

            <Typography variant="h3" align="center" fontWeight="bold">RANKING</Typography>

            <ol>
                {items.map((item, index) => (<li key={index}>{item}</li>))}
            </ol>
        </Container>
    );
};

export default Ranking;