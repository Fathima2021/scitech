import React, { ReactElement,useEffect } from 'react';
import './App.css';
import Layout from './hoc/layout.hoc';
import AppRoutes from './routes';
import { ClaimScreen } from './screens';
const createHost = require('cross-domain-storage/host');

const App = (): ReactElement => {
  useEffect(()=>{ 
    createHost([
      {
          origin: 'http://localhost:3001',
          allowedMethods: ['get', 'set', 'remove'],
      },
      {
          origin: 'http://localhost:3000',
          allowedMethods: ['get', 'set', 'remove'],
      },
    ]);
  },[]);
  return (
    <div className="App">
      <AppRoutes />
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header> */}
    </div>
  );
};

export default App;
