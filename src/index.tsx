import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ReduxStore from './redux';
import './helpers/translator';
import './index.scss';
import './app-message.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <Provider store={ReduxStore}>
      <App />
    </Provider>
  </BrowserRouter>
);
