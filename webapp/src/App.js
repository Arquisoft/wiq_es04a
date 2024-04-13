import React from 'react';
import Register from './pages/Register';
import Instructions from './pages/Instructions';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Homepage from './pages/Homepage';
import Game from './pages/Game';
import DiscoveringCitiesGame from './pages/DiscoveringCitiesGame';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Statistics from './pages/Statistics';
import Ranking from './pages/Ranking'
import MultiplayerRoom from './pages/MultiplayerRoom';
import MultiplayerGame from './pages/MultiplayerGame';
import TheChallengeGame from './pages/TheChallengeGame';
import {Route, Routes} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import PrivateRoute from './PrivateRoute';

const theme = createTheme({
  palette: {
    mode: 'light',
    // Azul
    primary: {
      main: '#006699',
    },
    secondary: {
      main: '#FFFFFF',
    },
    success: {
      main: '#339966',
    },
    // Rojo
    error: {
      main: '#990000',
    },
  },
});

function App() {

  React.useEffect(() => {
    document.title = "WIQ - Wikidata Infinite Quest";
  }, []);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <ThemeProvider theme={theme}>
        <NavBar/>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/instructions" element={<PrivateRoute element={Instructions}/>} />
            <Route path="/homepage" element={<PrivateRoute element={Homepage}/>}/>
            <Route path="/game" element={<PrivateRoute element={Game} />} />
            <Route path="/discoveringCitiesGame" element={<PrivateRoute element={DiscoveringCitiesGame}/>}/>
            <Route path="/multiplayerRoom" element={<PrivateRoute element={MultiplayerRoom}/>}/>
            <Route path="/TheChallengeGame" element={<PrivateRoute element={TheChallengeGame}/>}/>
            <Route path="/multiplayerGame" element={<PrivateRoute element={MultiplayerGame}/>}/>
            <Route path="/group/menu" element={<PrivateRoute element={Groups}/>}/>
            <Route path="/group/:groupName" element={<PrivateRoute element={GroupDetails}/>} />
            <Route path="/statistics" element={<PrivateRoute element={Statistics }/>}/>
            <Route path="/ranking" element={<PrivateRoute element={Ranking}/>}/>
          </Routes>
        <Footer/>
      </ThemeProvider>
    </Box>
  );
}

export default App;
