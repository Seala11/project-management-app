/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { authSelector, thunkSignIn } from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getTokenFromLS } from 'api/localStorage';
import { Navigate, NavLink } from 'react-router-dom';
import { Signin } from 'api/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from 'assets/images/login.png';
import { useTranslation } from 'react-i18next';

import styles from './signin.module.scss';
import ROUTES from 'utils/constants/ROUTES';

export interface IFormInputSingIn {
  login: string;
  password: string;
}

const SignIn = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  // const { login, password } = useAppSelector((state) => state.auth.user);
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
    <div className="wrapper">
      <div className="container">
        <div className="sign-in">
          <div className="form-block">
            <h1>{t('AUTH.SIGN_IN')}</h1>
            <form className="form-sign-in" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-item">
                <label>
                  {t('AUTH.LOGIN')}
                  <input {...register('login', { required: true })} />
                  {errors.login && <span>{t('AUTH.REQUIRED')}</span>}
                </label>
              </div>
              <div className="form-item">
                <label>
                  {t('AUTH.PASSWORD')}
                  <input {...register('password', { required: true })} />
                  {errors.password && <span>{t('AUTH.REQUIRED')}</span>}
                </label>
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
    </div>
  );
};

export default SignIn;
