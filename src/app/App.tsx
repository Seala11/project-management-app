import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from '../pages/Routing';
import MainLayout from 'layouts/MainLayout/MainLayout';
import './app.module.scss';
import { store } from 'store';
import { Provider } from 'react-redux';
import ErrorBoundary from 'layouts/Error/Error';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <MainLayout>
          <Routing />
        </MainLayout>
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);

export default App;
