import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from '../pages/Routing';
import styles from './app.module.scss';
import { store } from 'store';
import { Provider } from 'react-redux';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className={styles.app}>
        <Header />
        <Routing />
        <Footer />
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;
