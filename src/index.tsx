import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.scss';
import './app-message.scss';
import './helpers/translator';
// eslint-disable-next-line max-len,prettier/prettier
const root = ReactDOM.createRoot( document.getElementById('root') as HTMLElement );
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
