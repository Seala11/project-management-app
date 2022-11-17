/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TOASTER from 'utils/constants/TOASTER';
import { getTokenFromLS } from 'utils/func/localStorage';
import { thunkGetUserById } from 'store/authSlice';
import { parseJwt } from 'utils/func/parsejwt';
import { useTranslation } from 'react-i18next';
import { toastMessageSelector } from 'store/appSlice';
import { modalStatusSelector, setModalClose, taskStatusSelector } from 'store/modalSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import styles from './mainLayout.module.scss';
import Modal from 'layouts/Modal/Modal';
import ConfirmationModal from 'layouts/Modal/ConfirmationModal/ConfirmationModal';
import TaskModal from 'layouts/Modal/TaskModal/TaskModal';
import Loader from 'components/loader/Loader';

type Props = React.HTMLAttributes<HTMLDivElement>;

const MainLayout = ({ children }: Props) => {
  const modalIsOpen = useAppSelector(modalStatusSelector);
  const taskIsOpen = useAppSelector(taskStatusSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const toastMessage = useAppSelector(toastMessageSelector);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (toastMessage) {
      console.log(toastMessage);

      toast(t(`TOAST.${toastMessage}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastMessage]);

  useEffect(() => {
    if (getTokenFromLS()) {
      const token = getTokenFromLS();
      dispatch(thunkGetUserById({ userId: parseJwt(token).id, token: token })).then(() => {
        setLoading(false);
      });
    } else setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      dispatch(setModalClose());
    }
  };

  return (
    <>
      {modalIsOpen && (
        <Modal onClose={closeModal}>
          {taskIsOpen ? (
            <TaskModal onClose={closeModal} />
          ) : (
            <ConfirmationModal onClose={closeModal} />
          )}
        </Modal>
      )}
      <ToastContainer autoClose={TOASTER.time} />

      <div className={styles.container}>
        <Header />
        {!loading ? <main className={styles.main}>{children}</main> : <Loader />}
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
