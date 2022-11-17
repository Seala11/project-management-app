import React from 'react';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TOASTER from 'utils/constants/TOASTER';
import { modalStatusSelector, setModalClose, taskStatusSelector } from 'store/modalSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import styles from './mainLayout.module.scss';
import Modal from 'layouts/Modal/Modal';
import ConfirmationModal from 'layouts/Modal/ConfirmationModal/ConfirmationModal';
import TaskModal from 'layouts/Modal/TaskModal/TaskModal';
import { singleBoardRequestStatus } from 'store/boardSlice';
import Loader from 'components/loader/Loader';
import { boardsLoadingSelector } from 'store/boardsSlice';

type Props = React.HTMLAttributes<HTMLDivElement>;

const MainLayout = ({ children }: Props) => {
  const modalIsOpen = useAppSelector(modalStatusSelector);
  const taskIsOpen = useAppSelector(taskStatusSelector);
  const boardState = useAppSelector(singleBoardRequestStatus);
  const boardsState = useAppSelector(boardsLoadingSelector);
  const pending = boardState || boardsState;
  const dispatch = useAppDispatch();

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
        <main className={styles.main}>
          <Loader status={pending} />
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
