import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const PrivateRoute = ({ children, role }) => {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to={role === 'user' ? '/user-login' : '/'} />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
