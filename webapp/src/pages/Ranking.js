import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Container, Typography } from '@mui/material';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Ranking = () => {

    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        const fetchRanking = async () => {
            axios.get(`${apiEndpoint}/user/ranking`)
            .then((response) => {
              const resp = response.data;
              setRanking(resp.rank);
            })
            .catch((error) => {
              console.error(error);
            });
        };

        fetchRanking();
    }, []);

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
                <strong>
                {ranking.slice(0,10).map((user, index) => ( // Show only the top 10 users
                    <li key={index}>
                        {user.username.toUpperCase()}: {user.totalScore}
                    </li>
                ))}
                </strong>
            </ol>
        </Container>
    );
};

export default Ranking;