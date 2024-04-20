import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Container, Typography, useTheme, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Ranking = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    const [rows, setRows] = useState([]);
    const [rankingType, setRankingType] = useState('user');

    const fetchUserRanking = async () => {
        try {
            const response = await axios.get(`${apiEndpoint}/user/ranking`);
            setRows(response.data.rank);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGroupsRanking = async () => {
        try {
            const response = await axios.get(`${apiEndpoint}/user/group/ranking`);
            setRows(response.data.rank);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (rankingType === 'user') {
            fetchUserRanking();
        } else {
            fetchGroupsRanking();
        }
    }, [rankingType]);

    const columns = [
        { field: 'id', headerName: 'NAME', flex: 1, align: 'center', headerAlign: 'center'},
        { field: 'totalMoney', headerName: 'TOTAL MONEY', flex: 1, align: 'center', headerAlign: 'center'  },
        { field: 'totalCorrectAnswers', headerName: 'CORRECT ANSWERS', flex: 1, align: 'center', headerAlign: 'center'  },
        { field: 'totalIncorrectAnswers',headerName: 'INCORRECT ANSWERS', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'totalGamesPlayed', headerName: 'TOTAL GAMES', flex: 1, align: 'center', headerAlign: 'center'  }
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

            <Container style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h3" align="center" fontWeight="bold">
                    Ranking
                </Typography>
                <Container style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5em', gap:'2em' }}>
                    <Button onClick={() => setRankingType('user')} variant="contained" sx={{ backgroundColor: rankingType === 'user' ? 'white' : theme.palette.primary.main, color: rankingType === 'user' ? theme.palette.primary.main : 'white', borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }} data-testid="users-button">
                        {t("Ranking.users")}
                    </Button>
                    <Button onClick={() => setRankingType('group')} variant="contained" sx={{ backgroundColor: rankingType === 'group' ? 'white' : theme.palette.primary.main, color: rankingType === 'group' ? theme.palette.primary.main : 'white', borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }} data-testid="groups-button">
                        {t("Ranking.groups")}
                    </Button>
                </Container>
            </Container>

            <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
            }} 
            pageSizeOptions={[5, 10, 20]}
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
