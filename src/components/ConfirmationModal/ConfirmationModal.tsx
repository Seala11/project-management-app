import React, { useState } from 'react';
import {
  BtnColor,
  modalSelector,
  setInputTitle,
  setModalAction,
  setModalClose,
} from 'store/modalSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useTranslation } from 'react-i18next';
import styles from './confirmationModal.module.scss';

const ConfirmationModal = () => {
  const [title, setTitle] = useState('');

  const dispatch = useAppDispatch();
  const modal = useAppSelector(modalSelector);
  const { t } = useTranslation();

  const closeModal = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(setModalClose());
  };

  const actionHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(setInputTitle(title));
    dispatch(setModalAction(modal?.action));
    dispatch(setModalClose());
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <>
      <div className={styles.overlay} onClick={closeModal} />
      <form className={styles.modal}>
        {modal?.title && <p className={styles.title}>{modal.title}</p>}
        {modal?.message && <p>{modal.message}</p>}
        {modal?.inputTitle && (
          <>
            <label htmlFor={modal.inputTitle}>{modal.inputTitle}</label>
            <input id={modal.inputTitle} type="text" onChange={(e) => inputHandler(e)} />
          </>
        )}
        {modal?.inputDescr && (
          <>
            <label htmlFor={modal.inputDescr}>{modal.inputDescr}</label>
            <input id={modal.inputDescr} type="text" />
          </>
        )}
        <div className={styles.wrapper}>
          <button
            type="submit"
            onClick={(e) => actionHandler(e)}
            className={`${styles.button} ${
              modal?.color === BtnColor.BLUE ? styles.blue : styles.red
            }`}
          >
            {modal?.btnText}
          </button>
          <button
            type="button"
            onClick={(e) => closeModal(e)}
            className={`${styles.button} ${styles.gray}`}
          >
            {t('MODAL.CANCEL')}
          </button>
        </div>
      </form>
    </>
  );
};

export default ConfirmationModal;
