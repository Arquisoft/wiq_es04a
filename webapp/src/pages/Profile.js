import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { Button, Container, Typography, Divider, Snackbar } from '@mui/material';
import { SessionContext } from '../SessionContext';
import { getHugo, getAlberto, getWiffo, getAndina, getSamu, getBarrero, getTeresa } from '../data/icons';
import { useTranslation } from 'react-i18next';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Profile = () => {
    const { t } = useTranslation();

    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [currentSelectedAvatar, setCurrentSelectedAvatar] = useState('defalt_user.jpg');
    const { username, updateAvatar } = useContext(SessionContext);

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await axios.get(`${apiEndpoint}/profile`, { params: { username: username } });
            setUserInfo(response.data);
        } catch (error) {
            setError('Error fetching user information');
        }
    }, [username]);

    const handleAvatarSelect = (name) => {
        setCurrentSelectedAvatar(name);
        setSelectedAvatar(name);
      };

    const handleAvatarChange = async () => {
        try {
            await axios.put(`${apiEndpoint}/profile/${username}`, { imageUrl: currentSelectedAvatar });
            updateAvatar(selectedAvatar);
            setSnackbarMessage('Avatar changed successfully');
            setOpenSnackbar(true);
            fetchUserInfo();
        } catch (error) {
            setError('Error updating user information');
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (error || !userInfo) {
        return (
            <Container sx={{ margin: '0 auto auto' }}>
                <Typography variant="h5" sx={{ textAlign:'center' }}>{error}</Typography>
            </Container>
        )
    }

    return (
        <Container sx={{ margin: '0 auto auto', display:'flex', flexDirection:'column' }}>
            <Typography variant="h2" align="center" fontWeight="bold" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontSize:'3rem' }}>{userInfo.username}</Typography>
            <Container sx={{ display:'flex' }}>
                <Container sx={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
                    <Typography variant="h4"><b>{t("Profile.name")}</b> {userInfo.name}</Typography>
                    <Typography variant="h4"><b>{t("Profile.surname")}</b> {userInfo.surname}</Typography>
                    <Typography variant="h4"><b>{t("Profile.created_in")}</b> {new Date(userInfo.createdAt).toLocaleDateString()}</Typography>
                </Container>    
                <img src={userInfo.imageUrl} alt="Profile pic" style={{ flex: 1, maxWidth:'20%', borderRadius:'50%' }} />
            </Container>

            <Divider style={{ margin:'1em 0'}}/>

            <Typography variant="h5" sx={{ textAlign:'center', fontWeight:'bold'  }}>{t("Profile.choose_your_avatar")}</Typography>
            <Container sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button sx={{ display:'flex', flexDirection:'column', borderBottom: selectedAvatar === getHugo() ? '2px solid #006699' : 'none' }} onClick={() => handleAvatarSelect(getHugo())} data-testid="hugo-button">
                    <img src={getHugo()} style={{ flex: 1, maxWidth: '50%', borderRadius:'50%', margin:'1em' }} alt="Icon1" />
                    <Typography sx={{color: '#000000', fontWeight:'bold'  }}>HUGH</Typography>
                </Button>          
                <Button sx={{ display:'flex', flexDirection:'column', borderBottom: selectedAvatar === getAlberto() ? '2px solid #006699' : 'none' }} onClick={() => handleAvatarSelect(getAlberto())} data-testid="alberto-button">
                    <img src={getAlberto()} style={{ flex: 1, maxWidth: '50%', borderRadius:'50%', margin:'1em' }} alt="Icon2" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>ALBERT</Typography>
                </Button>
                <Button sx={{ display:'flex', flexDirection:'column', borderBottom: selectedAvatar === getWiffo() ? '2px solid #006699' : 'none' }} onClick={() => handleAvatarSelect(getWiffo())} data-testid="wiffo-button">
                    <img src={getWiffo()} style={{ flex: 1, maxWidth: '50%', borderRadius:'50%', margin:'1em' }} alt="Icon3" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>PAUL</Typography>
                </Button>      
                <Button sx={{ display:'flex', flexDirection:'column', borderBottom: selectedAvatar === getAndina() ? '2px solid #006699' : 'none' }} onClick={() => handleAvatarSelect(getAndina())} data-testid="andina-button">
                    <img src={getAndina()} style={{ flex: 1, maxWidth: '50%', borderRadius:'50%', margin:'1em' }} alt="Icon4" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>DAN</Typography>
                </Button>
                <Button sx={{ display:'flex', flexDirection:'column', borderBottom: selectedAvatar === getSamu() ? '2px solid #006699' : 'none' }} onClick={() => handleAvatarSelect(getSamu())} data-testid="samu-button">
                    <img src={getSamu()} style={{ flex: 1, maxWidth: '50%', borderRadius:'50%', margin:'1em' }} alt="Icon5" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>SAM </Typography>
                </Button>
                <Button sx={{ display:'flex', flexDirection:'column', borderBottom: selectedAvatar === getBarrero() ? '2px solid #006699' : 'none' }}  onClick={() => handleAvatarSelect(getBarrero())} data-testid="barrero-button">
                    <img src={getBarrero()} style={{ flex: 1, maxWidth: '50%', borderRadius:'50%', margin:'1em' }} alt="Icon6" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>PEIBOL</Typography>
                </Button>
                <Button sx={{ display:'flex', flexDirection:'column', borderBottom: selectedAvatar === getTeresa() ? '2px solid #006699' : 'none' }} onClick={() => handleAvatarSelect(getTeresa())} data-testid="teresa-button">
                    <img src={getTeresa()} style={{ flex: 1, maxWidth: '50%', borderRadius:'50%', margin:'1em' }} alt="Icon7" />
                    <Typography sx={{color: '#000000', fontWeight:'bold' }}>THERESA</Typography>
                </Button>   
            </Container>
            <Container sx={{ display:'flex', justifyContent:'center', marginTop:'2em' }}>
                    <Button variant="contained" onClick={handleAvatarChange} data-testid="confirm-button">{t("Profile.confirm_changes")}</Button>
            </Container>
            <Snackbar open={openSnackbar} autoHideDuration={4500} onClose={handleCloseSnackbar} message={snackbarMessage} />
            {error && (<Snackbar open={!!error} autoHideDuration={4500} onClose={() => setError('')} message={`Error: ${error}`} />)}
        </Container>
    );
}

export default Profile;