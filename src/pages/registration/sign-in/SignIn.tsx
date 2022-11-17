/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { thunkSignIn } from 'store/authSlice';
import { useAppDispatch } from 'store/hooks';
import { NavLink } from 'react-router-dom';
import { Signin } from 'api/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from 'assets/images/login.png';
import { useTranslation } from 'react-i18next';
import styles from '../registration.module.scss';

export interface IFormInputSingIn {
  login: string;
  password: string;
}

const SignIn = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setError,
    clearErrors,
  } = useForm<Signin>();

  const onSubmit: SubmitHandler<Signin> = (data) => {
    // dispatch(thunkSignIn(data));
    if (isValid && checkFields(data)) {
      console.log('success');
      console.log(data);
    }
    console.log('мимо');
  };

  function checkFields(data: IFormInputSingIn & { [key: string]: string }) {
    let isValid = true;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (!value.match(/^\S[a-zA-Z0-9_]+$/i)) {
          setError(key as 'login' | 'password', { type: 'value', message: 'PATTERN' });
          isValid = false;
        }

        if (value.length < 6) {
          setError(key as 'login' | 'password', { type: 'minLength', message: 'LENGTH' });
          isValid = false;
        }
      }
    }

    return isValid;
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.sign}>
        <div className={styles.formBlock}>
          <h1>{t('AUTH.SIGN_IN')}</h1>
          <form className={styles.formSign} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formItem}>
              <label htmlFor="login">{t('AUTH.LOGIN')}</label>
              <input
                id="login"
                {...register('login')}
                className={errors.login?.message && styles.inputError}
                autoComplete="off"
              />
              {errors.login && (
                <span className={styles.fieldError}>{t(`AUTH.${errors.login.message}`)}</span>
              )}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="password">{t('AUTH.PASSWORD')}</label>
              <input
                id="password"
                type={'password'}
                {...register('password')}
                className={errors.password && styles.inputError}
                autoComplete="off"
              />
              {errors.password && (
                <span className={styles.fieldError}>{t(`AUTH.${errors.password.message}`)}</span>
              )}
            </div>
            <button type="submit">{t('AUTH.SUBMIT')}</button>
          </form>
          <NavLink to="/sign-up">{t('AUTH.HAVENT_ACCOUNT')}</NavLink>
        </div>

        <div className={styles.imageBlock}>
          <img className={styles.img} src={signImage} alt="sign in" />
        </div>
      </div>
    </section>
  );
};

export default SignIn;
