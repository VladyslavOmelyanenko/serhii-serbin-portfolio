import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from 'jwt-decode'

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const tokenIsValid = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      if (decodedToken.secretKey === 'serbin') {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null && tokenIsValid(token);
  };
  console.log(isAuthenticated());
  if (!isAuthenticated()) {
    return <Navigate to="/panel" />;
  }
  return <Element {...rest} />;
};

export default ProtectedRoute;