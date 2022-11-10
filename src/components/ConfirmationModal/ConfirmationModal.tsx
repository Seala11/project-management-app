import React from 'react';
import { BtnColor, modalSelector, setModalAction, setModalClose } from 'store/modalSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import styles from './confirmationModal.module.scss';

const ConfirmationModal = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector(modalSelector);

  const closeModal = () => {
    dispatch(setModalClose());
  };

  const actionHandler = () => {
    dispatch(setModalAction());
  };

  return (
    <>
      <div className={styles.overlay} onClick={closeModal} />
      <form className={styles.modal}>
        {modal?.title && <p className={styles.title}>{modal.title}</p>}
        {modal?.message && <p>{modal.message}</p>}
        {modal?.input1 && (
          <>
            <label htmlFor={modal.input1}>{modal.input1}</label>
            <input id={modal.input1} type="text" />
          </>
        )}
        {modal?.input2 && (
          <>
            <label htmlFor={modal.input2}>{modal.input2}</label>
            <input id={modal.input2} type="text" />
          </>
        )}
        <div className={styles.wrapper}>
          <button
            type="submit"
            onClick={actionHandler}
            className={`${styles.button} ${
              modal?.color === BtnColor.BLUE ? styles.blue : styles.red
            }`}
          >
            {modal?.btnText}
          </button>
          <button type="button" onClick={closeModal} className={`${styles.button} ${styles.gray}`}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default ConfirmationModal;
