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

            // setRows( [
            //     { id: "alberto"             , totalGames: 5, totalMoney: 1, totalCorrectAnswers:1, totalIncorrectAnswers:6},
            //     { id: "momazos piolu"       , totalGames: 4, totalMoney: 2, totalCorrectAnswers:2, totalIncorrectAnswers:5},
            //     { id: "de la uz"            , totalGames: 3, totalMoney: 3, totalCorrectAnswers:15, totalIncorrectAnswers:4},
            //     { id: "de la cal"           , totalGames: 2, totalMoney: 4, totalCorrectAnswers:6, totalIncorrectAnswers:3},
            //     { id: "muerte a los moros"  , totalGames: 1, totalMoney: 5, totalCorrectAnswers:7, totalIncorrectAnswers:2},
            //     { id: "mohamed muerete", totalGames: 0, totalMoney: 6, totalCorrectAnswers:3, totalIncorrectAnswers:1}
            // ]);

            })
            .catch((error) => {
              console.error(error);
            });
        };

        fetchRanking();
    }, []);

    
    const columns = [
        { field: 'id', headerName: 'USERNAME', flex: 1, align: 'center', headerAlign: 'center'},
        { field: 'id', headerName: 'USERNAME', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'totalGames', headerName: 'TOTAL GAMES', flex: 1, align: 'center', headerAlign: 'center'  },
        { field: 'totalMoney', headerName: 'TOTAL MONEY', flex: 1, align: 'center', headerAlign: 'center'  },
        { field: 'totalCorrectAnswers', headerName: 'CORRECT ANSWERS', flex: 1, align: 'center', headerAlign: 'center'  },
        { field: 'totalIncorrectAnswers',headerName: 'INCORRECT ANSWERS', flex: 1, align: 'center', headerAlign: 'center'  }
    ];

    return (
        <Container sx={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center", 
            paddingBottom: "2em",
            gap: "1.5em",
            flexGrow: 1
        }}>
            <Typography variant="h3" align="center" fontWeight="bold">RANKING</Typography>
            
            <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                },
            }} 
            pageSizeOptions={[10, 20]}
            sx={{ 
                width: '100%',
                backgroundColor: 'rgba(84,95,95,0.3)',
                borderRadius: '10px',
            }}
        />
        </Container>
    );
};

export default Ranking;
