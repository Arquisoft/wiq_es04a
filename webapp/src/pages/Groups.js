import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button, Divider, Snackbar, TextField, Grid, Pagination, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import { useTranslation } from 'react-i18next';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Groups = () => {
    const theme = useTheme();

    const [name, setName] = useState('');
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5);

    const { t } = useTranslation();

    // Pagination managing function
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const indexOfLastItem = page * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = groups.slice(indexOfFirstItem, indexOfLastItem);

    const { username } = useContext(SessionContext);

    const fetchData = useCallback(async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/user/group`, { params: { username: username } });
        setGroups(response.data.groups);
      } catch (error) {
        setError('Unsuccesful data fetching');
      }
    }, [username]);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);

    // Function that creates a group and shows the posible errors
    const addGroup = async () => {
      try {
        await axios.post(`${apiEndpoint}/group`, {
          name:name,
          username:username
        });
        setSnackbarMessage('Group created successfully');
        setOpenSnackbar(true);
        fetchData();
      } catch (error) {
        setError(error.response.data.error);
      }
    };

    const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
    };

    // Function that makes the user join a group and shows the possible errors when making this
    const addToGroup = async (name) => {
      try {
        await axios.put(`${apiEndpoint}/group/`+name, { username });
        setSnackbarMessage('Joined the group successfully');
        setOpenSnackbar(true);
        fetchData();
      } catch (error) {
        setError(error.response.data.error);
      }
    };

    
    // Function that makes a member of a group leave it.
    const exitFromGroup = async (name) => {
      try {
        await axios.put(`${apiEndpoint}/group/`+name+`/exit`, { username });
        setSnackbarMessage('Left the group successfully');
        setOpenSnackbar(true);
        fetchData();
      } catch (error) {
        setError(error.response.data.error);
      }
    };

    const navigate = useNavigate();

    // Function that changes the page to the group details one
    const seeMembers = (groupName) => {
      navigate(`/group/${groupName}`);
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

    return (
    <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <video data-testid="video" ref={videoRef} autoPlay muted loop style={{ ...styles.video}}>
        <source src="../home/Background-White.webm" type="video/mp4" />
      </video>

      <Typography variant="h2" align="center" fontWeight="bold" sx={{ width: '100%', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontSize:'3rem' }}>
        { t("Groups.title") }
      </Typography>

      {/* Container showing the group creation field and button */}
      <Container>
        <Typography component="h1" variant="h5">
        { t("Groups.create") }
        </Typography>
        <Divider style={{ marginBottom:'0.5em'}}/>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <TextField name="name" value={name} label={ t("Groups.name") } fullWidth onChange={(e) => setName(e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" color="primary" onClick={() => addGroup()} sx={{ padding:'1.1em' }} fullWidth>
              { t("Groups.create_button") }
            </Button>
          </Grid>
        </Grid>
      </Container> 

      {/* Container showing the paginated groups list and its items */}
      <Container sx={{ marginTop:'2em' }}>
        <Typography component="h1" variant="h5">
          { t("Groups.list") }
        </Typography>  
        <Divider style={{ marginBottom:'0.5em'}}/>
        <List sx={{ margin:'0', width: '100%' }}>
          {currentItems.map((group) => (
            <Container key={group.name+"_container"}>
              <ListItem key={group.name} sx={{ display:'flex', alignContent:'space-between', alignItems:'center' }}>
                <ListItemText primary={group.name} />
                
                {group.isMember ? (
                  group.isCreator ? (
                    <Button variant="contained" onClick={() => exitFromGroup(group.name)} sx={{ backgroundColor: '#FFFFFF', color: theme.palette.error.main, borderColor: theme.palette.error.main, '&:hover': { backgroundColor: theme.palette.secondary.main } }}>
                      {t("Groups.delete")}
                    </Button>
                  ):(
                    <Button variant="contained" onClick={() => exitFromGroup(group.name)} sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main } }}>
                      {t("Groups.exit")}
                    </Button>
                    )
                ) : group.isFull ? (
                  <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, color:'#FFFFFF' , borderColor: theme.palette.error.main, '&:hover': { backgroundColor: theme.palette.secondary.main } }}>
                    { t("Groups.filled") }
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={() => addToGroup(group.name)}>
                    { t("Groups.join") }
                  </Button>
                )}
                <Button variant="contained" color="primary" sx={{ marginLeft: '2em' }} onClick={() => seeMembers(group.name)}>
                  { t("Groups.see_members") }
                </Button>
                <Snackbar open={openSnackbar} autoHideDuration={4500} onClose={handleCloseSnackbar} message={snackbarMessage} />
                {error && (<Snackbar open={!!error} autoHideDuration={4500} onClose={() => setError('')} message={`Error: ${error}`} />)}
              </ListItem>
              <Divider/>
            </Container>
          ))}
        </List>
        <Pagination
          count={Math.ceil(groups.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          boundaryCount={1}
          siblingCount={1}
          sx={{ '& ul': { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5em' }}}
        />
      </Container>
    </Container>
    );
}

export default Groups;