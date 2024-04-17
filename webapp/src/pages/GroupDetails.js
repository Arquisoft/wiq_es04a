import React, { useEffect, useState, useCallback,useContext } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { SessionContext } from '../SessionContext';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const GroupDetails = () => {

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

    if (error || !groupInfo) {
        return (
            <Container sx={{ margin: '0 auto auto' }}>
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
            <Typography variant="h3" sx={{ textAlign:'center', fontWeight:'bold' }}>{groupInfo.name}</Typography>
            <Typography variant="h4"><b>Creator:</b> {groupInfo.creator}</Typography>
            <Divider sx={{ marginBottom: '2em' }}/>
            <Typography variant="h4"><b>Created in:</b> {new Date(groupInfo.createdAt).toLocaleDateString()}</Typography>
            <Divider sx={{ marginBottom: '2em' }}/>
            <Typography variant="h4"><b>Members &#40;{`${totalMembers}/${expectedMembers}`}&#41;:</b></Typography>
            <List sx={{ margin:'0', width: '100%' }}>
                <Divider/>
                {groupInfo.users.map(user => (
                    <Container key={user+"_container"}>
                        <ListItem key={user} sx={{ display:'flex', alignContent:'space-between', alignItems:'center' }}>
                            <ListItemText primary={user} />
                            {groupInfo.show && (
                                <Button variant="contained" color="primary" onClick={() => seeStatistics(user)}>
                                    See Statistics
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