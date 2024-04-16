import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element }) => {
  const sessionId = localStorage.getItem('sessionId');

  return (
    sessionId ? <Element /> : <Navigate to="/login" />
  );
};

export default PrivateRoute;
