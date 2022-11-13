import React from 'react';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './mainLayout.module.scss';
import TOASTER from 'utils/constants/TOASTER';

type Props = React.HTMLAttributes<HTMLDivElement>;

const MainLayout = ({ children }: Props) => {
  return (
    <div className={styles.app}>
      <ToastContainer autoClose={TOASTER.time} />
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
