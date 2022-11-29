import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from '../pages/Routing';
import MainLayout from 'layouts/MainLayout/MainLayout';
import './app.module.scss';
import { store } from 'store';
import { Provider } from 'react-redux';
import ErrorBoundary from 'layouts/Error/Error';
import { ToastContainer } from 'react-toastify';
import TOASTER from 'utils/constants/TOASTER';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <ToastContainer autoClose={TOASTER.time} />
        <MainLayout>
          <Routing />
        </MainLayout>
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);

export default App;
