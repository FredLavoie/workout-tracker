import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../services/authentication';



export function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={(props) => {
      if (isAuthenticated() === true) {
        return <Component {...props} />;
      }
      return <Redirect to='/login' />;
    }} />
  );
}
