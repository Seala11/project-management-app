import React from 'react';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import 'react-toastify/dist/ReactToastify.css';
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
import { appSelector } from 'store/appSlice';
import { singleBoardRequestStatus } from 'store/boardSlice';

type Props = React.HTMLAttributes<HTMLDivElement>;

const MainLayout = ({ children }: Props) => {
  const modalIsOpen = useAppSelector(modalStatusSelector);
  const taskIsOpen = useAppSelector(taskStatusSelector);
  const boardState = useAppSelector(singleBoardRequestStatus);
  const { isPending } = useAppSelector(appSelector);
  const pending = boardState || isPending;
  const dispatch = useAppDispatch();
  const taskDeleteConfirmMessage = useAppSelector(taskDeleteConfirmSelector);
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
