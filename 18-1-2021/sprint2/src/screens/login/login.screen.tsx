import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = (): ReactElement => {
  const navigate = useNavigate();
  const loginHandler = () => {
    navigate('/home');
  };
  return (
    <div>
      <button onClick={loginHandler}>Login</button>
    </div>
  );
};

export default LoginScreen;
