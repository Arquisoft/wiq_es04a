import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { Button, Container, Typography } from '@mui/material';
import { SessionContext } from '../SessionContext';
import styles from '../Profile.css';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Profile = () => {

    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const { username } = useContext(SessionContext);

    const fetchUserInfo = useCallback(async () => {
        try {
            // const response = await axios.get(`${apiEndpoint}/user/profile`, { params: { username: username } });
            // setUserInfo(response.data);
            setUserInfo(
                {
                    username: 'and1na',
                    name: 'Daniel',
                    surname: 'Andina Pailos',
                    createdAt: 'createdAt',
                    imageUrl: '/wiffoIcon.jpg'
                }
            );
        } catch (error) {
            setError('Error fetching user information');
        }
    }, [username]);

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    if (error || !userInfo) {
        return (
            <Container sx={{ margin: '0 auto auto' }}>
                <Typography variant="h5" sx={{ textAlign:'center' }}>{error}</Typography>
            </Container>
        )
    }

    return (
        
        <Container sx={{ margin: '0 auto auto', display:'flex',flexDirection:'column', justifyContent:'space-between', alignContent:'space-between' }}>
            <Typography variant="h2" sx={{ textAlign:'center', fontWeight:'bold' }}>{userInfo.username}</Typography>
            <Container sx={{ display:'flex' }}>
                <Container sx={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
                    <Typography variant="h4"><b>Name:</b> {userInfo.name}</Typography>
                    <Typography variant="h4"><b>Surname:</b> {userInfo.surname}</Typography>
                    <Typography variant="h4"><b>Created in:</b> {new Date(userInfo.createdAt).toLocaleDateString()}</Typography>
                </Container>    
                <img src={userInfo.imageUrl} alt="ActualPhoto" style={{ flex: 1, maxWidth:'50%', borderRadius:'50%' }} />
            </Container>

            <Typography variant="h4" sx={{ textAlign:'center', marginTop:'5em', fontWeight:'bold'  }}>Choose your avatar</Typography>

            <Container sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={'hugoIcon.jpg'} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} alt="Icon1" />
                    <Typography sx={{color: '#000000', fontWeight:'bold'  }}>HUGH</Typography>
                </Button>          
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={'bertinIcon.jpg'} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} alt="Icon2" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>ALBERT</Typography>
                </Button>      
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={'wiffoIcon.jpg'} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} alt="Icon3" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>PAUL</Typography>
                </Button>      
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={'and1naIcon.jpg'} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} alt="Icon4" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>DAN</Typography>
                </Button>
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={'samuIcon.jpg'} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} alt="Icon5" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>SAM </Typography>
                </Button>
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={'barreroIcon.jpg'} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} alt="Icon6" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>PEIBOL</Typography>
                </Button>
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={'teresaIcon.jpg'} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} alt="Icon7" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>THERESA</Typography>
                </Button>   
            </Container>
        </Container>
    );
}

export default Profile;