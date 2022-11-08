import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import Routing from 'pages/Routing';
import styles from './app.module.scss';

const App = () => (
  <BrowserRouter>
    <div className={styles.app}>
      <Header />
      <Routing />
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;
