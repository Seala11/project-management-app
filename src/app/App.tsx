import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from '../pages/Routing';
import styles from './app.module.scss';
import { store } from 'store';
import { Provider } from 'react-redux';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className={styles.app}>
        <ToastContainer autoClose={8000} />
        <Header />
        <Routing />
        <Footer />
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;
