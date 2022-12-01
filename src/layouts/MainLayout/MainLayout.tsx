import React, { useEffect } from 'react';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTokenFromLS } from 'utils/func/localStorage';
import { thunkGetUserById } from 'store/authSlice';
import { parseJwt } from 'utils/func/parsejwt';
import { useTranslation } from 'react-i18next';
import {
  modalStatusSelector,
  setModalClose,
  setTaskModalOpen,
  taskDeleteConfirmSelector,
  taskStatusSelector,
} from 'store/modalSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import styles from './mainLayout.module.scss';
import Modal from 'layouts/Modal/Modal';
import ConfirmationModal from 'layouts/Modal/ConfirmationModal/ConfirmationModal';
import TaskModal from 'layouts/Modal/TaskModal/TaskModal';
import Loader from 'components/loader/Loader';
import { appSelector, setIsPending } from 'store/appSlice';
import { singleBoardRequestStatus } from 'store/boardSlice';
import { getErrorMessage } from 'utils/func/handleError';
import { getMsgError } from 'utils/func/getMsgError';

type Props = React.HTMLAttributes<HTMLDivElement>;

const MainLayout = ({ children }: Props) => {
  const modalIsOpen = useAppSelector(modalStatusSelector);
  const taskIsOpen = useAppSelector(taskStatusSelector);
  const boardState = useAppSelector(singleBoardRequestStatus);
  const { isPending } = useAppSelector(appSelector);
  const pending = boardState || isPending;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const taskDeleteConfirmMessage = useAppSelector(taskDeleteConfirmSelector);

  useEffect(() => {
    if (getTokenFromLS()) {
      const token = getTokenFromLS();
      dispatch(thunkGetUserById({ userId: parseJwt(token).id, token: token }))
        .unwrap()
        .then()
        .catch((err) => {
          const error = getErrorMessage(err);
          toast.error(t(getMsgError(error)));
        })
        .finally(() => dispatch(setIsPending(false)));
    } else {
      dispatch(setIsPending(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      dispatch(setModalClose());
    }

    if (taskDeleteConfirmMessage) {
      dispatch(setTaskModalOpen());
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

      <div className={styles.container}>
        <Loader status={pending} />
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
