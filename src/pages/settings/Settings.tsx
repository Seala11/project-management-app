import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import {
  authSelector,
  thunkDeleteUser,
  thunkGetUserById,
  thunkSignIn,
  thunkUpdateUser,
} from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useForm } from 'react-hook-form';
import { Signup } from 'api/types';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon/Icon';
import settingsImage from 'assets/images/settings.png';
import { parseJwt } from 'utils/func/parsejwt';
import { getTokenFromLS } from 'utils/func/localStorage';
import {
  BtnColor,
  ModalAction,
  resetModal,
  setModalOpen,
  stateModalSelector,
} from 'store/modalSlice';
import { toast } from 'react-toastify';
import { setIsPending } from 'store/appSlice';
import { getErrorMessage } from 'utils/func/handleError';
import { getMsgError } from 'utils/func/getMsgError';
import styles from './settings.module.scss';

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(authSelector);
  const passwordField = useRef<HTMLInputElement | null>(null);
  const [isShowText, setIsShowText] = useState(false);
  const { modalAction } = useAppSelector(stateModalSelector);
  const [userEdit, setUserEdit] = useState(false);

  const {
    register,
    getValues,
    trigger,
    clearErrors,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Signup>({
    reValidateMode: 'onSubmit',
    defaultValues: { name: '', login: '', password: '' },
  });

  useEffect(() => {
    setValue('name', user.name);
    setValue('login', user.login);
  }, [user.name, user.login, setValue]);

  const handleSaveNewProfile: React.MouseEventHandler<HTMLButtonElement> = async () => {
    if (!userEdit) {
      dispatch(
        setModalOpen({
          message: t('SETTINGS.EDIT_MODAL_TEXT'),
          color: BtnColor.BLUE,
          btnText: t('MODAL.OK'),
          action: ModalAction.EDIT_USER_PROFILE,
        })
      );
    } else {
      const res = await trigger();
      if (res) {
        dispatch(
          setModalOpen({
            message: t('SETTINGS.SAVE_MODAL_TEXT'),
            color: BtnColor.BLUE,
            btnText: t('MODAL.SAVE'),
            action: ModalAction.SAVE_USER_PROFILE,
          })
        );
      }
    }
  };

  useEffect(() => {
    const token = getTokenFromLS();
    const { id } = parseJwt(token);
    switch (modalAction) {
      case ModalAction.EDIT_USER_PROFILE:
        setUserEdit(true);
        dispatch(resetModal());
        break;

      case ModalAction.SAVE_USER_PROFILE:
        dispatch(resetModal());
        const userData = getValues();
        const user = Object.assign(userData, { _id: id });
        dispatch(setIsPending(true));
        async function update() {
          try {
            const res = await dispatch(thunkUpdateUser({ user, token })).unwrap();
            setUserEdit(false);
            const data = await dispatch(thunkSignIn(res)).unwrap();
            await dispatch(thunkGetUserById(data)).unwrap();
            toast.success(t('AUTH.200_USER_UPDATE'));
          } catch (err) {
            const error = getErrorMessage(err);
            toast.error(t(getMsgError(error)));
          } finally {
            dispatch(setIsPending(false));
          }
        }
        update();
        break;

      case ModalAction.DELETE_USER_PROFILE:
        setUserEdit(false);
        dispatch(resetModal());
        async function deleteUser() {
          try {
            await dispatch(thunkDeleteUser({ id, token })).unwrap();
            toast.success(t('AUTH.200_USER_DELETE'));
          } catch (err) {
            const error = getErrorMessage(err);
            toast.error(t(getMsgError(error)));
          } finally {
            dispatch(setIsPending(false));
          }
        }
        deleteUser();
        break;

      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, modalAction]);

  const handleDeleteProfile = () => {
    dispatch(
      setModalOpen({
        message: `${t('MODAL.DELETE_MSG')} ${t('MODAL.PROFILE')}`,
        color: BtnColor.RED,
        btnText: t('MODAL.DELETE'),
        action: ModalAction.DELETE_USER_PROFILE,
      })
    );
  };

  const handlerCancelSave: React.MouseEventHandler<HTMLButtonElement> = () => {
    setUserEdit(false);
    reset();
    setValue('name', user.name);
    setValue('login', user.login);
  };

  const { ref, ...rest } = register('password', {
    required: { value: true, message: 'PASSWORD_LENGTH' },
    pattern: { value: /^\S[a-zA-Z0-9_]+$/i, message: 'PATTERN' },
    minLength: { value: 6, message: 'PASSWORD_LENGTH' },
    onChange: (e) => clearErrors(e.target.name),
  });

  const showPassword: MouseEventHandler<HTMLButtonElement> = () => {
    if (passwordField?.current) {
      if (passwordField?.current.getAttribute('type') === 'text') {
        setIsShowText(false);
        (passwordField?.current as HTMLInputElement).setAttribute('type', 'password');
      } else {
        setIsShowText(true);
        (passwordField?.current as HTMLInputElement).setAttribute('type', 'text');
      }
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.settings}>
        <div className={styles.leftBlock}>
          <h1>{t('AUTH.USER_SETTINGS')}</h1>
          <form className={styles.formSettings}>
            <div className={styles.formItem}>
              <label htmlFor="name">{t('AUTH.NAME')}</label>
              <input
                id="name"
                {...register('name', {
                  required: { value: true, message: 'LENGTH' },
                  pattern: { value: /^\S[a-zA-Z0-9_]+$/i, message: 'PATTERN' },
                  minLength: { value: 4, message: 'LENGTH' },
                  onChange: (e) => clearErrors(e.target.name),
                })}
                className={errors.name && styles.inputError}
                autoComplete="off"
                disabled={!userEdit}
              />
              {errors.name && (
                <span className={styles.fieldError}>{t(`AUTH.${errors.name.message}`)}</span>
              )}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="login">{t('AUTH.LOGIN')}</label>
              <input
                id="login"
                {...register('login', {
                  required: { value: true, message: 'LENGTH' },
                  pattern: { value: /^\S[a-zA-Z0-9_]+$/i, message: 'PATTERN' },
                  minLength: { value: 4, message: 'LENGTH' },
                  onChange: (e) => clearErrors(e.target.name),
                })}
                className={errors.login && styles.inputError}
                autoComplete="off"
                disabled={!userEdit}
              />
              {errors.login && (
                <span className={styles.fieldError}>{t(`AUTH.${errors.login.message}`)}</span>
              )}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="password">{t('AUTH.PASSWORD')}</label>
              <div className={styles.wrapperEye}>
                <input
                  id="password"
                  type={'password'}
                  {...rest}
                  name="password"
                  ref={(e) => {
                    ref(e);
                    passwordField.current = e;
                  }}
                  className={errors.password && styles.inputError}
                  autoComplete="off"
                  disabled={!userEdit}
                  placeholder="******"
                />
                {isShowText ? (
                  <button type="button" className={styles.button} onClick={(e) => showPassword(e)}>
                    <Icon icon="eye-slashed" size="24" color="#9a9a9a" />
                  </button>
                ) : (
                  <button type="button" className={styles.button} onClick={(e) => showPassword(e)}>
                    <Icon icon="eye-open" size="24" color="#9a9a9a" />
                  </button>
                )}
              </div>
              {errors.password && (
                <span className={styles.fieldError}>{t(`AUTH.${errors.password.message}`)}</span>
              )}
            </div>
          </form>
          <div className={styles.buttonBlock}>
            <button className={styles.btnSave} onClick={handleSaveNewProfile}>
              {userEdit ? t('SETTINGS.SAVE_CHANGES') : t('SETTINGS.EDIT')}
            </button>
            {userEdit ? (
              <button className={styles.btnCancelSave} onClick={handlerCancelSave}>
                {t('MODAL.CANCEL')}
              </button>
            ) : null}
          </div>
        </div>
        <div className={styles.rightBlock}>
          <div className={styles.buttonBlockRight}>
            <button className={styles.btnDelete} onClick={handleDeleteProfile}>
              {t('SETTINGS.DELETE_ACCOUNT')}
            </button>
          </div>
          <div className={styles.imageBlock}>
            <img src={settingsImage} alt="space discovery" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
