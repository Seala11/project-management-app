import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from '../pages/Routing';
import styles from './app.module.scss';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from 'components/ConfirmationModal/ConfirmationModal';
import { useAppSelector } from 'store/hooks';
import { modalStatusSelector } from 'store/modalSlice';

const App = () => {
  const modalIsOpen = useAppSelector(modalStatusSelector);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        {modalIsOpen && <ConfirmationModal />}
        <ToastContainer autoClose={8000} />
        <Header />
        <Routing />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
