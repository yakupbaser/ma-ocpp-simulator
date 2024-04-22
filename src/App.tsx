import React, { useEffect } from 'react';
import { setConfiguration } from 'react-grid-system';
import AppContainer from './components/container';
import AppSocket from './socket';

const App = () => {
  useEffect(() => {
    setConfiguration({ gridColumns: 24, gutterWidth: 10 });
    AppSocket.connect();
  }, []);
  return <AppContainer />;
};

export default App;
