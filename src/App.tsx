import React, { useEffect } from 'react';
import { setConfiguration } from 'react-grid-system';
import { Provider } from 'react-redux';
import AppContainer from './components/container';
import ReduxStore from './redux';
import AppSocket from './socket';

const App = () => {
  useEffect(() => {
    setConfiguration({ gridColumns: 24, gutterWidth: 10 });
    AppSocket.connect();
  }, []);
  return (
    <Provider store={ReduxStore}>
      <AppContainer />
    </Provider>
  );
};

export default App;
