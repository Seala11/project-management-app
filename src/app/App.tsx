import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from '../pages/Routing';
import styles from './app.module.scss';
import { store } from 'store';
import { Provider } from 'react-redux';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className={styles.app}>
        <Routing />
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;
