import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';  // Import the i18n configuration

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);