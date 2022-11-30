import React, { useRef, useState } from 'react';
import { thunkGetUserById, thunkSignIn } from 'store/authSlice';
import { useAppDispatch } from 'store/hooks';
import { NavLink } from 'react-router-dom';
import { Signin } from 'api/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from 'assets/images/login.png';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon/Icon';
import { toast } from 'react-toastify';
import { setIsPending } from 'store/appSlice';
import { getErrorMessage } from 'utils/func/handleError';
import { getMsgError } from 'utils/func/getMsgError';
import styles from '../registration.module.scss';

const SignIn = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const passwordField = useRef<HTMLInputElement | null>(null);
  const [isShowText, setIsShowText] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<Signin>({ reValidateMode: 'onSubmit' });

  const { ref, ...rest } = register('password', {
    required: { value: true, message: 'PASSWORD_LENGTH' },
    pattern: { value: /^\S[a-zA-Z0-9_]+$/i, message: 'PATTERN' },
    minLength: { value: 6, message: 'PASSWORD_LENGTH' },
    onChange: (e) => clearErrors(e.target.name),
  });

  const onSubmit: SubmitHandler<Signin> = async (data) => {
    dispatch(setIsPending(true));
    try {
      const res = await dispatch(thunkSignIn(data)).unwrap();
      const userData = await dispatch(thunkGetUserById(res)).unwrap();
      toast.success(t('AUTH.200_USER') + `${userData.name}`);
    } catch (err) {
      const error = getErrorMessage(err);
      toast.error(t(getMsgError(error)));
    } finally {
      dispatch(setIsPending(false));
    }
  };

  function showPassword(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
                {...register('login', {
                  required: { value: true, message: 'LENGTH' },
                  pattern: { value: /^\S[a-zA-Z0-9_]+$/i, message: 'PATTERN' },
                  minLength: { value: 4, message: 'LENGTH' },
                  onChange: (e) => clearErrors(e.target.name),
                })}
                className={errors.login && styles.inputError}
                autoComplete="off"
                placeholder="Vasya323"
              />
              {errors.login && (
                <span className={styles.fieldError}>{t(`AUTH.${errors.login.message}`)}</span>
              )}
            </div>
            <div className={styles.formItem}>
              <label htmlFor={styles.password}>{t('AUTH.PASSWORD')}</label>
              <div className={styles.wrapperEye}>
                <input
                  id={styles.password}
                  type={'password'}
                  {...rest}
                  name="password"
                  ref={(e) => {
                    ref(e);
                    passwordField.current = e;
                  }}
                  className={errors.password && styles.inputError}
                  autoComplete="off"
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
            <button type="submit">{t('AUTH.SUBMIT')}</button>
          </form>
          <NavLink to="/sign-up">{t('AUTH.HAVENT_ACCOUNT')}</NavLink>
        </div>

        <div className={styles.imageBlock}>
          <img src={signImage} alt="sign in" />
        </div>
      </div>
    </section>
  );
};

export default SignIn;
