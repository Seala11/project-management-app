/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { MouseEventHandler, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { thunkSignUp } from 'store/authSlice';
import { useAppDispatch } from 'store/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from 'assets/images/login.png';
import { Signup } from 'api/types';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon/Icon';
import settingsImage from 'assets/images/settings.png';
import styles from './settings.module.scss';

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const passwordField = useRef<HTMLInputElement | null>(null);
  const [isShowText, setIsShowText] = useState(false);
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<Signup>({ reValidateMode: 'onSubmit' });

  const onSubmit: SubmitHandler<Signup> = (data) => {
    console.log(data);
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
          <form className={styles.formSettings} onSubmit={handleSubmit(onSubmit)}>
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
            <button>save changes</button>
            <button>delete profile</button>
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
