import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const GroupDetails = () => {

    const [groupInfo, setGroupInfo] = useState(null);
    const [error, setError] = useState('');
    const { groupName } = useParams();

    // Function that gets the group information from the system
    const fetchGroupInfo = useCallback(async () => {
        try {
            const response = await axios.get(`${apiEndpoint}/group/${groupName}`);
            setGroupInfo(response.data);
        } catch (error) {
            setError(error.response.data.error || 'Error fetching group information');
        }
    }, [groupName]);

    useEffect(() => {
        fetchGroupInfo();
    }, [fetchGroupInfo]);

    if (error) return <p>Error: {error}</p>;
    if (!groupInfo) return null;

    // Constants indicating the maximum number of users and the actual users of the group
    const totalMembers = groupInfo.users.length;
    const expectedMembers = 20;

    // Returns all group data including the creator, the creation date and the members list
    return (
        <Container sx={{ margin: '0 auto auto' }}>
            <Typography variant="h3" sx={{ textAlign:'center' }}>{groupInfo.name}</Typography>
            <Typography variant="h4">Creator: {groupInfo.creator}</Typography>
            <Divider sx={{ marginBottom: '2em' }}/>
            <Typography variant="h4">Created in: {new Date(groupInfo.createdAt).toLocaleDateString()}</Typography>
            <Divider sx={{ marginBottom: '2em' }}/>
            <Typography variant="h4">Members {`${totalMembers}/${expectedMembers}`}:</Typography>
            <List>
                <Divider />
                {groupInfo.users.map(user => (
                    <div key={user}>
                        <ListItem>
                            <ListItemText primary={user} />
                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>
        </Container>
    );
}

export default GroupDetails;