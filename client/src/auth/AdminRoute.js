import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../actions/auth';

const AdminRoute = ({ ...rest }) => {
  const user = isAuthenticated().user;

  return isAuthenticated() && user.role === 'admin' ? (
    <Route {...rest} />
  ) : (
    <Redirect to='/user/dashboard' />
  );
};

export default AdminRoute;
