import React from 'react';
import ConfirmationModal from 'components/ConfirmationModal/ConfirmationModal';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TOASTER from 'utils/constants/TOASTER';
import { modalStatusSelector } from 'store/modalSlice';
import { useAppSelector } from 'store/hooks';
import styles from './mainLayout.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

const MainLayout = ({ children }: Props) => {
  const modalIsOpen = useAppSelector(modalStatusSelector);

  return (
    <div className={styles.app}>
      {modalIsOpen && <ConfirmationModal />}
      <ToastContainer autoClose={TOASTER.time} />
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
