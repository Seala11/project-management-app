import React, { useEffect } from 'react';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './mainLayout.module.scss';
import TOASTER from 'utils/constants/TOASTER';
import { getTokenFromLS } from 'api/localStorage';
import { useAppDispatch } from 'store/hooks';
import { thunkGetUserById } from 'store/authSlice';
import { parseJwt } from 'utils/func/parsejwt';

type Props = React.HTMLAttributes<HTMLDivElement>;

const MainLayout = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  // const { isLogged } = useAppSelector(authSelector);

  useEffect(() => {
    if (getTokenFromLS()) {
      const token = getTokenFromLS();
      dispatch(thunkGetUserById({ userId: parseJwt(token).id, token: token }));
    }
  }, [dispatch]);
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
