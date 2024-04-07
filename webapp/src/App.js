import React from 'react';
import AddUser from './pages/AddUser';
import Instructions from './pages/Instructions';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Homepage from './pages/Homepage';
import Game from './pages/Game';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Statistics from './pages/Statistics';
import Ranking from './pages/Ranking'
import MultiplayerRoom from './pages/MultiplayerRoom';
import MultiplayerGame from './pages/MultiplayerGame';
import {Route, Routes} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';

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
            <Route path="/register" element={<AddUser />}/>
            <Route path="/instructions" element={<Instructions />}/>
            <Route path="/homepage" element={<Homepage />}/>
            <Route path="/game" element={<Game />}/>
            <Route path="/multiplayerRoom" element={<MultiplayerRoom />}/>
            <Route path="/multiplayerGame" element={<MultiplayerGame />}/>
            <Route path="/group/menu" element={<Groups />}/>
            <Route path="/group/:groupName" element={<GroupDetails />} />
            <Route path="/statistics" element={<Statistics />}/>
            <Route path="/ranking" element={<Ranking/>}/>
          </Routes>
        <Footer/>
      </ThemeProvider>
    </Box>
  );
}

export default App;
