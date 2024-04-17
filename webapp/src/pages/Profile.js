import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { Button, Container, Typography } from '@mui/material';
import { SessionContext } from '../SessionContext';
import styles from '../Profile.css';
import { getHugo, getAlberto, getWiffo, getAndina, getSamu, getBarrero, getMaite } from '../data/icons';


const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Profile = () => {

    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const { username } = useContext(SessionContext);
    const [currentSelectedAvatar, setCurrentSelectedAvatar] = useState('defalt_user.jpg');

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await axios.get(`${apiEndpoint}/user/profile`, { params: { username: username } });
            setUserInfo(response.data);
        } catch (error) {
            setError('Error fetching user information');
        }
    }, [username]);

    const handleAvatarChange = async () => {
        try {
            console.log(currentSelectedAvatar);
            await axios.post(`${apiEndpoint}/user/profile/${username}`, { imageUrl: currentSelectedAvatar });
            fetchUserInfo();
        } catch (error) {
            setError('Error updating user information');
        }
    }

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
        
        <Container sx={{ margin: '0 auto auto', display:'flex', flexDirection:'column' }}>
            <Typography variant="h2" sx={{ textAlign:'center', fontWeight:'bold', marginTop:'0.7em' }}>{userInfo.username}</Typography>
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
                   
                    <img src={getHugo()} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} onClick={() => setCurrentSelectedAvatar(getHugo())} alt="Icon1" />
                    <Typography sx={{color: '#000000', fontWeight:'bold'  }}>HUGH</Typography>
                </Button>          
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={getAlberto()} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} onClick={() => setCurrentSelectedAvatar(getAlberto())} alt="Icon2" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>ALBERT</Typography>
                </Button>      
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={getWiffo()} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} onClick={() => setCurrentSelectedAvatar(getWiffo())} alt="Icon3" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>PAUL</Typography>
                </Button>      
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={getAndina()} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} onClick={() => setCurrentSelectedAvatar(getAndina())} alt="Icon4" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>DAN</Typography>
                </Button>
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={getSamu()} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} onClick={() => setCurrentSelectedAvatar(getSamu())} alt="Icon5" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>SAM </Typography>
                </Button>
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={getBarrero()} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} onClick={() => setCurrentSelectedAvatar(getBarrero())} alt="Icon6" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>PEIBOL</Typography>
                </Button>
                <Button sx={{ borderRadius:'50%', display:'flex', flexDirection:'column' }}>
                    <img src={getMaite()} style={{ flex: 1, maxWidth: '100%', borderRadius:'50%' }} onClick={() => setCurrentSelectedAvatar(getMaite())} alt="Icon7" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>THERESA</Typography>
                </Button>   
            </Container>
            <Container sx={{ display:'flex', justifyContent:'center', marginTop:'2em' }}>
                <Button variant="contained" onClick={handleAvatarChange}>Confirm change</Button>
            </Container>
        </Container>
    );
}

export default Profile;