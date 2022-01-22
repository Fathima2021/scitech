import React, { PropsWithChildren, ReactElement } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { LoginScreen } from '../screens';
import Layout from './layout.hoc';
const PrivateRoute = (props: PropsWithChildren<any>): ReactElement => {
  return props.isAuthenticated ? (
    <Layout hideNav={props.hideNav}>
      <props.component {...props} />
    </Layout>
  ) : (
    <LoginScreen />
  );
};

export default PrivateRoute;
