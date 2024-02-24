import React, { Fragment } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import {Route, Routes} from 'react-router-dom';

function App() {

  return (
    <Fragment>
      <NavBar/>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<AddUser />}/>
        </Routes>
      <Footer/>
    </Fragment>
  );
}

export default App;
