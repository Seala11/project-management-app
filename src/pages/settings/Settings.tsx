/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { authSelector, thunkSignUp, thunkUpdateUser } from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from 'assets/images/login.png';
import { Signup } from 'api/types';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon/Icon';
import settingsImage from 'assets/images/settings.png';
import styles from './settings.module.scss';
import { parseJwt } from 'utils/func/parsejwt';
import { getTokenFromLS } from 'utils/func/localStorage';
import {
  BtnColor,
  ModalAction,
  resetModal,
  setModalAction,
  setModalOpen,
  // setUserEdit,
  stateModalSelector,
} from 'store/modalSlice';

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(authSelector);
  const passwordField = useRef<HTMLInputElement | null>(null);
  const [isShowText, setIsShowText] = useState(false);
  // const [isFormDisabled, setFormDisabled] = useState(true);
  const { modalAction } = useAppSelector(stateModalSelector);
  const [userEdit, setUserEdit] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<Signup>({
    reValidateMode: 'onSubmit',
    defaultValues: { name: '', login: '', password: '' },
  });

  useEffect(() => {
    setValue('name', user.name);
    setValue('login', user.login);
  }, [user.name, user.login, setValue]);

  const handleSaveNewProfile: React.MouseEventHandler<HTMLButtonElement> = async (data) => {
    if (!userEdit) {
      console.log('modal cofirmation on change');
      dispatch(
        setModalOpen({
          message: `Would you like to edit your profile? You will need enter your password`,
          color: BtnColor.RED,
          btnText: `Edit`,
          action: ModalAction.EDIT_USER_PROFILE,
        })
      );
    } else {
      console.log('modal cofirmation on save changes');
      const res = await trigger();
      if (res) {
        console.log('data is saved');
        dispatch(
          setModalOpen({
            message: `Would you like to save your profile?`,
            color: BtnColor.RED,
            btnText: `Edit`,
            action: ModalAction.SAVE_USER_PROFILE,
          })
        );
      }
    }
  };

  useEffect(() => {
    switch (modalAction) {
      case ModalAction.EDIT_USER_PROFILE:
        setUserEdit(true);
        dispatch(resetModal());
        break;

      case ModalAction.SAVE_USER_PROFILE:
        dispatch(resetModal());
        const userData = getValues();
        const token = getTokenFromLS();
        const { id } = parseJwt(token);
        const user = Object.assign(userData, { _id: id });
        dispatch(thunkUpdateUser({ user, token })).then(() => setUserEdit(false));
        break;

      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, modalAction]);

  const handleDeleteProfile = () => {
    console.log('deleteUser');
  };

  const { ref, ...rest } = register('password', {
    required: { value: true, message: 'PASSWORD_LENGTH' },
    pattern: { value: /^\S[a-zA-Z0-9_]+$/i, message: 'PATTERN' },
    minLength: { value: 6, message: 'PASSWORD_LENGTH' },
    onChange: (e) => clearErrors(e.target.name),
  });

  const showPassword: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
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
          <h1>User Settings</h1>
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
                  <button className={styles.button} onClick={(e) => showPassword(e)}>
                    <Icon icon="eye-slashed" size="24" color="#9a9a9a" />
                  </button>
                ) : (
                  <button className={styles.button} onClick={(e) => showPassword(e)}>
                    <Icon icon="eye-open" size="24" color="#9a9a9a" />
                  </button>
                )}
              </div>
              {errors.password && (
                <span className={styles.fieldError}>{t(`AUTH.${errors.password.message}`)}</span>
              )}
            </div>
          </form>
        </div>
        <div className={styles.rightBlock}>
          <div className={styles.buttonBlock}>
            <button className={styles.btnSave} onClick={handleSaveNewProfile}>
              {userEdit ? 'Save change' : 'Edit'}
            </button>
            <button className={styles.btnDelete} onClick={handleDeleteProfile}>
              delete profile
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
