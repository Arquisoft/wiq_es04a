import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Container, Typography, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { SessionContext } from '../SessionContext';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const GroupDetails = () => {
    const { t } = useTranslation();

    const [groupInfo, setGroupInfo] = useState(null);
    const [error, setError] = useState('');
    const { groupName } = useParams();
    const { username } = useContext(SessionContext);

    // Function that gets the group information from the system
    const fetchGroupInfo = useCallback(async () => {
        try {
            const response = await axios.get(`${apiEndpoint}/group/${groupName}`, { params: { username: username } });
            setGroupInfo(response.data);
        } catch (error) {
            setError('Error fetching group information');
        }
    }, [groupName, username]);

    useEffect(() => {
        fetchGroupInfo();
    }, [fetchGroupInfo]);

    const navigate = useNavigate();

    const seeStatistics = (name) => {
        navigate(`/statistics/${name}`);
    };

    //Video settings
    const styles = {
        video: {
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
            zIndex: '-1',
            userSelect: 'none',
            pointerEvents: 'none'
        },
    };

    const videoRef = React.useRef(null);
    React.useEffect(() => {if (videoRef.current) {videoRef.current.playbackRate = 0.85;}}, []);

    if (error || !groupInfo) {
        return (
            <Container sx={{ margin: '0 auto auto' }}>
                <video data-testid="video" ref={videoRef} autoPlay muted loop style={{ ...styles.video}}>
                    <source src="../home/Background-White.webm" type="video/mp4" />
                </video>
                <Typography variant="h5" sx={{ textAlign:'center' }}>{error}</Typography>
            </Container>
        )
    }

    // Constants indicating the maximum number of users and the actual users of the group
    const totalMembers = groupInfo.users.length;
    const expectedMembers = 20;

    // Returns all group data including the creator, the creation date and the members list
    return (
        <Container sx={{ margin: '0 auto auto' }}>
            <video data-testid="video" ref={videoRef} autoPlay muted loop style={{ ...styles.video}}>
                <source src="../home/Background-White.webm" type="video/mp4" />
            </video>
            <Typography variant="h2" align="center" fontWeight="bold" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontSize:'3rem' }}>
                <b>{groupInfo.name}</b>
            </Typography>
            <Typography variant="h4">
                <b>{t("Groups.Details.creator")}:</b> {groupInfo.creator}
            </Typography>
            <Divider sx={{ marginBottom: '2em' }}/>
            <Typography variant="h4">
                <b>{t("Groups.Details.date")}:</b> {new Date(groupInfo.createdAt).toLocaleDateString()}
            </Typography>
            <Divider sx={{ marginBottom: '2em' }}/>
            <Typography variant="h4">
                <b>{t("Groups.Details.members")}:</b> {totalMembers}/{expectedMembers}
            </Typography>
            <List  sx={{ margin:'0', width: '100%' }}>
                <Divider />
                {groupInfo.users.map(user => (
                    <Container key={user+"_container"}>
                        <ListItem key={user} sx={{ display:'flex', alignContent:'space-between', alignItems:'center' }}>
                            <ListItemText primary={user} />
                            {groupInfo.show && (
                                <Button variant="contained" color="primary" onClick={() => seeStatistics(user)}>
                                    { t("Groups.Details.statistics") }
                                </Button>
                            )}
                        </ListItem>
                        <Divider/>
                    </Container>
                ))}
            </List>
        </Container>
    );
}

export default GroupDetails;