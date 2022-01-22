import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../hoc/private.hoc';
import {
  ClaimScreen,
  DamageScreen,
  FigureScreen,
  HomeScreen,
  LoginScreen,
  TermScreen,
  ValidityScreen,
} from '../screens';

const isAuth = 5 > 1;
const AppRoutes = (): ReactElement => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/infringements" element={<PrivateRoute isAuthenticated={isAuth} component={ClaimScreen} />} />
        <Route path="/validities" element={<PrivateRoute isAuthenticated={isAuth} component={ValidityScreen} />} />
        <Route path="/figures" element={<PrivateRoute isAuthenticated={isAuth} component={FigureScreen} />} />
        <Route path="/terms" element={<PrivateRoute isAuthenticated={isAuth} component={TermScreen} />} />
        <Route path="/damages" element={<PrivateRoute isAuthenticated={isAuth} component={DamageScreen} />} />
        <Route path="/home" element={<PrivateRoute hideNav={true} isAuthenticated={isAuth} component={HomeScreen} />} />
        <Route path="/" element={<Navigate replace to="/home" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
