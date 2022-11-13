import React from 'react';
import { authSelector, thunkSignIn } from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { Navigate, NavLink } from 'react-router-dom';
import { Signin } from 'api/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from 'assets/images/login.png';
import { useTranslation } from 'react-i18next';
import ROUTES from 'utils/constants/ROUTES';
import styles from './signin.module.scss';

export interface IFormInputSingIn {
  login: string;
  password: string;
}

const SignIn = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  const { auth } = authSelector(state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Signin>();
  const onSubmit: SubmitHandler<Signin> = (data) => {
    dispatch(thunkSignIn(data));
  };

  if (auth) return <Navigate to={ROUTES.boards} />;

  return (
    <main>
      <div className={styles.wrapper}>
        <div className={styles.signIn}>
          <div className={styles.formBlock}>
            <h1>{t('AUTH.SIGN_IN')}</h1>
            <form className={styles.formSignIn} onSubmit={handleSubmit(onSubmit)}>
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
                  {...register('password', { required: true })}
                  className={errors.password && styles.inputError}
                />
                {errors.password && <span className={styles.fieldError}>{t('AUTH.REQUIRED')}</span>}
              </div>
              <button type="submit">{t('AUTH.SUBMIT')}</button>
            </form>
            <NavLink to="/sign-up">{t('AUTH.HAVENT_ACCOUNT')}</NavLink>
          </div>
          <div className="form-image">
            <img src={signImage} alt="sign in" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
