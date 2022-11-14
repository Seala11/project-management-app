import React, { useState } from 'react';
import {
  BtnColor,
  modalSelector,
  setInputDescr,
  setInputTitle,
  setModalAction,
  setModalClose,
} from 'store/modalSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useTranslation } from 'react-i18next';
import styles from './confirmationModal.module.scss';

type InputValType = {
  title: string;
  descr: string;
};

type Props = {
  onClose: (event: React.MouseEvent) => void;
};

const ConfirmationModal = ({ onClose }: Props) => {
  const [inputValues, setInputValues] = useState<InputValType>({
    title: '',
    descr: '',
  });

  const dispatch = useAppDispatch();
  const modal = useAppSelector(modalSelector);
  const { t } = useTranslation();

  const actionHandler = (event: React.MouseEvent) => {
    event.preventDefault();

    if (modal?.inputTitle) {
      dispatch(setInputTitle(inputValues.title));
    }

    if (modal?.inputDescr) {
      dispatch(setInputDescr(inputValues.descr));
    }

    dispatch(setModalAction(modal?.action));
    dispatch(setModalClose());
  };

  return (
    <>
      {modal?.title && <p className={styles.title}>{modal.title}</p>}

      {modal?.message && <p>{modal.message}</p>}

      {modal?.inputTitle && (
        <div className={styles.inputWrraper}>
          <label htmlFor={modal.inputTitle}>{modal.inputTitle}</label>
          <input
            id={modal.inputTitle}
            type="text"
            onChange={(e) => setInputValues({ ...inputValues, title: e.target.value })}
          />
          {/* {error.title && <span className={styles.inputError}>{t('MODAL.REQUIRED')}</span>} */}
        </div>
      )}

      {modal?.inputDescr && (
        <div className={styles.inputWrraper}>
          <label htmlFor={modal.inputDescr}>{modal.inputDescr}</label>
          <input
            id={modal.inputDescr}
            type="text"
            onChange={(e) => setInputValues({ ...inputValues, descr: e.target.value })}
          />
          {/* {error.descr && <span className={styles.inputError}>{t('MODAL.REQUIRED')}</span>} */}
        </div>
      )}

      <div className={styles.wrapper}>
        <button
          type="button"
          onClick={(e) => actionHandler(e)}
          className={`${modal?.color === BtnColor.BLUE ? styles.blue : styles.red}`}
        >
          {modal?.btnText}
        </button>
        <button type="button" onClick={(e) => onClose(e)} className={styles.gray}>
          {t('MODAL.CANCEL')}
        </button>
      </div>
    </>
  );
};

export default ConfirmationModal;
