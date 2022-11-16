/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TOASTER from 'utils/constants/TOASTER';
import { getTokenFromLS } from 'utils/func/localStorage';
import { thunkGetUserById } from 'store/authSlice';
import { parseJwt } from 'utils/func/parsejwt';
// import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import ROUTES from 'utils/constants/ROUTES';
import { useTranslation } from 'react-i18next';
import { setToastMessage, toastMessageSelector } from 'store/appSlice';
import { modalStatusSelector, setModalClose } from 'store/modalSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import styles from './mainLayout.module.scss';
import Modal from 'layouts/Modal/Modal';
import ConfirmationModal from 'layouts/Modal/ConfirmationModal/ConfirmationModal';

type Props = React.HTMLAttributes<HTMLDivElement>;

const MainLayout = ({ children }: Props) => {
  const modalIsOpen = useAppSelector(modalStatusSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  // const navigate = useNavigate();
  // const location = useLocation();
  const toastMessage = useAppSelector(toastMessageSelector);
  // const { isLogged } = useAppSelector(authSelector);

  useEffect(() => {
    if (toastMessage) {
      toast(t(`TOAST.${toastMessage}`));
      setToastMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastMessage]);

  useEffect(() => {
    if (getTokenFromLS()) {
      const token = getTokenFromLS();
      dispatch(thunkGetUserById({ userId: parseJwt(token).id, token: token }));
    }
  }, [dispatch]);

  const closeModal = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      dispatch(setModalClose());
    }
  };

  return (
    <>
      {modalIsOpen && (
        <Modal onClose={closeModal}>
          <ConfirmationModal onClose={closeModal} />
        </Modal>
      )}
      <ToastContainer autoClose={TOASTER.time} />

      <div className={styles.container}>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
