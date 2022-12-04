import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { thunkSignUp, thunkSignIn, thunkGetUserById } from 'store/authSlice';
import { useAppDispatch } from 'store/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from 'assets/images/login.png';
import { Signup } from 'api/types';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon/Icon';
import { toast } from 'react-toastify';
import { setIsPending } from 'store/appSlice';
import { getErrorMessage } from 'utils/func/handleError';
import { getMsgError } from 'utils/func/getMsgError';
import styles from '../registration.module.scss';

const SignUp = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const passwordField = useRef<HTMLInputElement | null>(null);
  const [isShowText, setIsShowText] = useState(false);
  const {
    register,
    handleSubmit,
    setFocus,
    clearErrors,
    formState: { errors },
  } = useForm<Signup>({ reValidateMode: 'onSubmit' });

  const { ref, ...rest } = register('password', {
    required: { value: true, message: 'PASSWORD_LENGTH' },
    pattern: { value: /^\S[a-zA-Z0-9_]+$/i, message: 'PATTERN' },
    minLength: { value: 6, message: 'PASSWORD_LENGTH' },
    onChange: (e) => clearErrors(e.target.name),
  });

  useEffect(() => {
    setFocus('name');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<Signup> = async (data) => {
    dispatch(setIsPending(true));
    try {
      const res = await dispatch(thunkSignUp(data)).unwrap();
      const dataForUser = await dispatch(thunkSignIn(res)).unwrap();
      const user = await dispatch(thunkGetUserById(dataForUser)).unwrap();
      toast.success(t('AUTH.200_USER') + `${user.name}`);
    } catch (err) {
      const error = getErrorMessage(err);
      toast.error(t(getMsgError(error)));
    } finally {
      dispatch(setIsPending(false));
    }
  };

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
      <div className={styles.sign}>
        <div className={styles.formBlock}>
          <h1>{t('AUTH.SIGN_UP')}</h1>
          <form className={styles.formSign} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formItem}>
              <label htmlFor="name">{t('AUTH.NAME')}</label>
              <input
                id="name"
                {...register('name', {
                  required: { value: true, message: 'LENGTH' },
                  pattern: { value: /^\S[a-zA-Z0-9_]+$/i, message: 'PATTERN' },
                  minLength: { value: 4, message: 'LENGTH' },
                  maxLength: { value: 15, message: 'MAXLENGTH' },
                  onChange: (e) => clearErrors(e.target.name),
                })}
                className={errors.name && styles.inputError}
                autoComplete="off"
                placeholder="Konstantyn"
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
                  placeholder="Must be at least 6 chars"
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
          <NavLink to="/sign-in">{t('AUTH.HAVE_ACCOUNT')}</NavLink>
        </div>
        <div className={styles.imageBlock}>
          <img src={signImage} alt="sign up" />
        </div>
      </div>
    </section>
  );
};

export default SignUp;
