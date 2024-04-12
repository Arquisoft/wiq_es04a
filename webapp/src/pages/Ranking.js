import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Container, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Ranking = () => {

    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchRanking = async () => {
            axios.get(`${apiEndpoint}/user/ranking`)
            .then((response) => {
              setRows(response.data.rank);
            })
            .catch((error) => {
              console.error(error);
            });
        };

        fetchRanking();
    }, []);

    
    const columns = [
        { field: 'id', headerName: 'Username' },
        { field: 'totalMoney', headerName: 'Total Money' },
        { field: 'totalCorrectAnswers', headerName: 'Correct Answers' },
        { field: 'totalIncorrectAnswers',headerName: 'Incorrect Answers' }
    ];

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
            
            <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
            }}
            pageSizeOptions={[5, 10]}
        />
        </Container>
    );
};

export default Ranking;
