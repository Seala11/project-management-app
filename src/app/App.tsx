import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from '../pages/Routing';
import MainLayout from 'layouts/MainLayout/MainLayout';
import './app.module.scss';
import { store } from 'store';
import { Provider } from 'react-redux';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <MainLayout>
        <Routing />
      </MainLayout>
    </BrowserRouter>
  </Provider>
);

export default App;
