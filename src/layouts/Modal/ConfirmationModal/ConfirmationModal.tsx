import React, { useState, useEffect } from 'react';
import {
  BtnColor,
  modalSelector,
  selectChangeBoard,
  setInputDescr,
  setInputTitle,
  setModalAction,
  setModalClose,
  setTaskModalOpen,
  taskDeleteConfirmSelector,
} from 'store/modalSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useTranslation } from 'react-i18next';
import styles from './confirmationModal.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useGetModalErrors } from 'utils/hooks/useGetModalErrors';

type ModalForm = {
  title: string;
  description: string;
};

enum UserInput {
  TITLE = 'title',
  DESCRIPTION = 'description',
}

type Props = {
  onClose: (event: React.MouseEvent) => void;
};

const ConfirmationModal = ({ onClose }: Props) => {
  const [descrValue, setDescrValue] = useState(0);
  const DESCR_MAX_LENGTH = 150;

  const dispatch = useAppDispatch();
  const modal = useAppSelector(modalSelector);
  const taskDeleteConfirmMessage = useAppSelector(taskDeleteConfirmSelector);
  const { t } = useTranslation();
  const errMessage = useGetModalErrors();
  const isChangeBoard = useAppSelector(selectChangeBoard);

  const {
    register,
    handleSubmit,
    getFieldState,
    setError,
    setValue,
    setFocus,
    clearErrors,
    formState: { errors },
  } = useForm<ModalForm>();

  useEffect(() => {
    if (isChangeBoard) {
      setValue('title', `${modal?.defaultVals?.title ? modal?.defaultVals?.title : ''}`);
      setValue(
        'description',
        `${modal?.defaultVals?.description ? modal?.defaultVals?.description : ''}`
      );
      setDescrValue(
        modal?.defaultVals?.description.length ? modal?.defaultVals?.description.length : 0
      );
    }
  }, [isChangeBoard, modal?.defaultVals?.description, modal?.defaultVals?.title, setValue]);

  const onSubmit: SubmitHandler<ModalForm> = (data) => {
    const dataIsValid: boolean = validateData(data);

    if (dataIsValid) {
      if (modal?.inputTitle && data.title) {
        dispatch(setInputTitle(data.title.trim()));
      }

      if (modal?.inputDescr && data.description) {
        dispatch(setInputDescr(data.description.trim()));
      }

      dispatch(setModalAction(modal?.action));
      dispatch(setModalClose());
    }
  };

  const validateData = (data: Partial<ModalForm>) => {
    for (const [key, value] of Object.entries(data)) {
      switch (key) {
        case UserInput.TITLE: {
          if (!value)
            setError(UserInput.TITLE, {
              message: errMessage.required,
            });
          if (value && typeof value === 'string' && value.trim().length > 20)
            setError(UserInput.TITLE, {
              message: errMessage.titleLim,
            });
          break;
        }
        case UserInput.DESCRIPTION: {
          if (!value)
            setError(UserInput.DESCRIPTION, {
              message: errMessage.required,
            });
          break;
        }
      }
    }

    const formIsInvalid = Object.keys(data).some(
      (input) => getFieldState(input as keyof ModalForm).error
    );

    return !formIsInvalid;
  };

  const changeHandler = (key: UserInput, e: React.ChangeEvent<HTMLInputElement>) => {
    clearErrors(key);

    if (key === UserInput.DESCRIPTION) {
      setDescrValue(e.target.value.length);
    }
  };

  const backToTaskModal = () => {
    dispatch(setTaskModalOpen());
  };

  useEffect(() => {
    setTimeout(() => setFocus(UserInput.TITLE), 0);
  }, [setFocus]);

  return (
    <form className={styles.modal} onSubmit={handleSubmit(onSubmit)}>
      {modal?.title && <p className={styles.title}>{modal.title}</p>}

      {modal?.message && <p className={styles.message}>{modal.message}</p>}

      {modal?.inputTitle && (
        <div className={styles.inputWrraper}>
          <label htmlFor={modal.inputTitle}>{modal.inputTitle}*</label>
          <input
            id={modal.inputTitle}
            type="text"
            {...register(UserInput.TITLE, { onChange: (e) => changeHandler(UserInput.TITLE, e) })}
            className={`${errors.title ? styles.inputError : ''}`}
          />
          {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
        </div>
      )}

      {modal?.inputDescr && (
        <div className={styles.inputWrraper}>
          <label htmlFor={modal.inputDescr}>{modal.inputDescr}*</label>
          <textarea
            id={modal.inputDescr}
            {...register(UserInput.DESCRIPTION, {
              onChange: (e) => changeHandler(UserInput.DESCRIPTION, e),
            })}
            className={`${errors.description ? styles.inputError : ''}`}
            maxLength={DESCR_MAX_LENGTH}
          />
          <div className={`${styles.counter} ${descrValue > 140 ? styles.counterLim : ''}`}>
            <span>{descrValue}</span>
            <span>/</span>
            <span>{DESCR_MAX_LENGTH}</span>
          </div>

          {errors.description && (
            <span className={styles.fieldError}>{errors.description.message}</span>
          )}
        </div>
      )}

      <div className={styles.wrapper}>
        <button
          type="submit"
          className={`${modal?.color === BtnColor.BLUE ? styles.blue : styles.red}`}
          onClick={handleSubmit(onSubmit)}
        >
          {modal?.btnText}
        </button>

        {taskDeleteConfirmMessage ? (
          <button type="button" onClick={backToTaskModal} className={styles.gray}>
            {t('MODAL.CANCEL')}
          </button>
        ) : (
          <button type="button" onClick={(e) => onClose(e)} className={styles.gray}>
            {t('MODAL.CANCEL')}
          </button>
        )}
      </div>
    </form>
  );
};

export default ConfirmationModal;
