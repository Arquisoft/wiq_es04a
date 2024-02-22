import React, { Fragment } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
import NavBar from './components/fragments/NavBar';
import Footer from './components/fragments/Footer';
import Home from './components/fragments/Home';
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
