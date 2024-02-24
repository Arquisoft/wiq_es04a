import * as React from 'react';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {Button, Typography, Box, Grid } from '@mui/material';
import {Link} from 'react-router-dom';

const Instructions = () => {
    return (


        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'top', minHeight: '70vh' }}>
            <CssBaseline />
            <Typography component="h1" variant="h3" align="center" sx={{ marginTop: 10, marginBotton: 10, fontWeight: 'bold'}}>
                GAMEPLAY & MODES:
            </Typography>

            <Typography  component="body" variant="body1" align="center" sx={{ textAlign: 'center', marginTop: 6}}>
                <span style={{ fontWeight: 'bold' }}>
                    <span style={{ color: '#990000' }}>Wikidata </span>
                    <span style={{ color: '#339966' }}>Infinite </span>
                    <span style={{ color: '#006699' }}>Quest </span>
                </span>
                is a game inspired by the popular TV show <span style={{ fontWeight: 'bold' }}>"Saber y ganar"</span> where you'll have to face a series of general knowledge questions to obtain the coveted prize.
                Additionally, for the more daring, we have prepared alternative game modes to the original so they can further hone their skills.
            </Typography>

            <Box width="100%">
                <Box display="flex" width="100%" justifyContent="center">
                    <Grid  container spacing={2} sx={{ width: '80%', marginTop: 3 }}>

                        <Grid item xs={6} sm={3} key={"Sages"} sx={{ marginTop: 3}}>
                            <Box textAlign="center">
                                <Button width="100%" component={Link} to="/GameInstruction" color="primary" disabled={false} size="large" variant="outlined" sx={{ width: '100%', height: '100px'  }} >
                                    Wise Men Stack
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={6} sm={3} key={"Discarding"} sx={{ marginTop: 3}}>
                            <Box textAlign="center">
                                <Button width="100%" component={Link} to="/GameInstruction" color="primary" disabled={false} size="large" variant="outlined" sx={{ width: '100%', height: '100px'  }}>
                                    Discarding
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={6} sm={3} key={"HotQuestion"} sx={{ marginTop: 3}}>
                            <Box textAlign="center">
                                <Button width="100%" component={Link} to="/GameInstruction" color="primary" disabled={false} size="large" variant="outlined" sx={{ width: '100%', height: '100px'  }}>
                                     Warm Question
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={6} sm={3} key={"Cities"} sx={{ marginTop: 3}}>
                            <Box textAlign="center">
                                <Button width="100%" component={Link} to="/GameInstruction" color="primary" disabled={false} size="large" variant="outlined" sx={{ width: '100%', height: '100px'  }}>
                                    Discovering Cities
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>


                <Box display="flex" width="100%" justifyContent="center">
                    <Grid  container spacing={2} style={{ width: '80%' }} >

                        <Grid item xs={6} sm={3} key={"LastCall"} sx={{ marginTop: 3}}>
                            <Box textAlign="center">
                                <Button  width="100%" component={Link} to="/GameInstruction" color="primary" disabled={false} size="large" variant="outlined" sx={{ width: '100%', height: '100px'  }}>
                                    Last call
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={6} sm={3} key={"Calculator"} sx={{ marginTop: 3}}>
                            <Box textAlign="center">
                                <Button width="100%" component={Link} to="/GameInstruction" color="primary" disabled={false} size="large" variant="outlined" sx={{ width: '100%', height: '100px'  }}>
                                    The human calculator
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={6} sm={3} key={"POH"} sx={{ marginTop: 3}}>
                            <Box textAlign="center">
                                <Button width="100%" component={Link} to="/GameInstruction" color="primary" disabled={false} size="large" variant="outlined" sx={{ width: '100%' , height: '100px' }}>
                                    The part <br/>for the whole
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={6} sm={3} key={"Challenge"} sx={{ marginTop: 3}}>
                            <Box textAlign="center">
                                <Button width="100%" component={Link} to="/GameInstruction" color="primary" disabled={false} size="large" variant="outlined" sx={{ width: '100%' , height: '100px' }}>
                                    The challenge
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Instructions;