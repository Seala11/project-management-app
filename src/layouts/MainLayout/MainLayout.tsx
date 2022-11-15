/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './mainLayout.module.scss';
import TOASTER from 'utils/constants/TOASTER';
import { getTokenFromLS } from 'api/localStorage';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { thunkGetUserById } from 'store/authSlice';
import { parseJwt } from 'utils/func/parsejwt';
// import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import ROUTES from 'utils/constants/ROUTES';
import { useTranslation } from 'react-i18next';
import { toastMessageSelector } from 'store/appSlice';

type Props = React.HTMLAttributes<HTMLDivElement>;

const MainLayout = ({ children }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  // const location = useLocation();
  const toastMessage = useAppSelector(toastMessageSelector);
  // const { isLogged } = useAppSelector(authSelector);

  useEffect(() => {
    console.log('toast');

    if (toastMessage) {
      console.log('in toast');

      toast(t(`TOAST.${toastMessage}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastMessage]);

  useEffect(() => {
    if (getTokenFromLS()) {
      const token = getTokenFromLS();
      dispatch(thunkGetUserById({ userId: parseJwt(token).id, token: token }));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   if (
  //     (!isLogged && location.pathname === ROUTES.boards) ||
  //     (!isLogged && location.pathname === ROUTES.settings)
  //   ) {
  //     navigate(ROUTES.home);
  //   }
  //   if (
  //     (isLogged && location.pathname === ROUTES.signIn) ||
  //     (isLogged && location.pathname === ROUTES.signUp)
  //   ) {
  //     navigate(ROUTES.boards);
  //   }
  // }, [isLogged, location.pathname, navigate]);

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
