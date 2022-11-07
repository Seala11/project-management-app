import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from '../pages/Routing';
import styles from './app.module.scss';

const App = () => (
  <BrowserRouter>
    <div className={styles.app}>
      <Routing />
    </div>
  </BrowserRouter>
);

export default App;
