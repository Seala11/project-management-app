import React from 'react';
import {
  BtnColor,
  modalSelector,
  setInputDescr,
  setInputTitle,
  setModalAction,
  setModalClose,
  setTaskModalOpen,
  taskIdSelector,
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
  const dispatch = useAppDispatch();
  const taskId = useAppSelector(taskIdSelector);
  const modal = useAppSelector(modalSelector);
  const { t } = useTranslation();
  const errMessage = useGetModalErrors();

  const {
    register,
    handleSubmit,
    getFieldState,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ModalForm>();

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
          if (value && typeof value === 'string' && value.trim().length > 150)
            setError(UserInput.DESCRIPTION, {
              message: errMessage.descrLim,
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

  const changeHandler = (key: UserInput) => {
    clearErrors(key);
  };

  const backToTaskModal = () => {
    dispatch(setTaskModalOpen());
  };

  return (
    <form className={styles.modal} onSubmit={handleSubmit(onSubmit)}>
      {modal?.title && <p className={styles.title}>{modal.title}</p>}

      {modal?.message && <p>{modal.message}</p>}

      {modal?.inputTitle && (
        <div className={styles.inputWrraper}>
          <label htmlFor={modal.inputTitle}>{modal.inputTitle}</label>
          <input
            id={modal.inputTitle}
            type="text"
            {...register(UserInput.TITLE, { onChange: () => changeHandler(UserInput.TITLE) })}
            className={`${errors.title ? styles.inputError : ''}`}
          />
          {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
        </div>
      )}

      {modal?.inputDescr && (
        <div className={styles.inputWrraper}>
          <label htmlFor={modal.inputDescr}>{modal.inputDescr}</label>
          <textarea
            id={modal.inputDescr}
            {...register(UserInput.DESCRIPTION, {
              onChange: () => changeHandler(UserInput.DESCRIPTION),
            })}
            className={`${errors.description ? styles.inputError : ''}`}
            maxLength={150}
          />
          {errors.description && (
            <span className={styles.fieldError}>{errors.description.message}</span>
          )}
        </div>
      )}

      <div className={styles.wrapper}>
        <button
          type="submit"
          className={`${modal?.color === BtnColor.BLUE ? styles.blue : styles.red}`}
        >
          {modal?.btnText}
        </button>

        {taskId ? (
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
