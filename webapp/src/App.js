import React, { Fragment } from 'react';
import AddUser from './pages/AddUser';
import Instructions from './pages/Instructions';
import GameInstruction from './pages/GameInstuction';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import {Route, Routes} from 'react-router-dom';

function App() {

  return (
    <Fragment>
      <NavBar/>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<AddUser />}/>
          <Route path="/instructions" element={<Instructions />}/>
          <Route path="/instructions/gameinstruction" element={<GameInstruction />}/>
        </Routes>
      <Footer/>
    </Fragment>
  );
}

export default App;
