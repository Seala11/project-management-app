import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './setupi18n';

const root = ReactDOM.createRoot(document.getElementById('root') ?? document.body);

root.render(<App />);
