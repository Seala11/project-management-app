import React from 'react';
import { authSelector, thunkSignIn } from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { Navigate, NavLink } from 'react-router-dom';
import { Signin } from 'api/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from 'assets/images/login.png';
import { useTranslation } from 'react-i18next';
import ROUTES from 'utils/constants/ROUTES';
import styles from '../registration.module.scss';

export interface IFormInputSingIn {
  login: string;
  password: string;
}

const SignIn = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLogged } = useAppSelector(authSelector);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Signin>();

  const onSubmit: SubmitHandler<Signin> = (data) => {
    dispatch(thunkSignIn(data));
  };

  if (isLogged) return <Navigate to={ROUTES.boards} />;

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
                {...register('login', { required: true })}
                className={errors.login && styles.inputError}
              />
              {errors.login && <span className={styles.fieldError}>{t('AUTH.REQUIRED')}</span>}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="password">{t('AUTH.PASSWORD')}</label>
              <input
                id="password"
                type={'password'}
                {...register('password', { required: true })}
                className={errors.password && styles.inputError}
              />
              {errors.password && <span className={styles.fieldError}>{t('AUTH.REQUIRED')}</span>}
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
