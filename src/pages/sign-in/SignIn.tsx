/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { thunkSignIn } from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getTokenFromLS } from 'api/localStorage';
import { NavLink } from 'react-router-dom';
import { Signin } from 'api/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from '../../assets/images/login.png';

import styles from './signin.module.scss';

export interface IFormInputSingIn {
  login: string;
  password: string;
}

const SignIn = () => {
  const dispatch = useAppDispatch();
  const { login, password } = useAppSelector((state) => state.auth.user);
  const state = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Signin>();
  const onSubmit: SubmitHandler<Signin> = (data) => {
    dispatch(thunkSignIn(data));
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="sign-in">
          <div className="form-block">
            <h1>Sing in</h1>
            <form className="form-sign-in" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-item">
                <label>
                  Login
                  <input {...register('login', { required: true })} />
                  {errors.login && <span>This field is required</span>}
                </label>
              </div>
              <div className="form-item">
                <label>
                  Password
                  <input {...register('password', { required: true })} />
                  {errors.password && <span>This field is required</span>}
                </label>
              </div>
              <button type="submit">Submit</button>
            </form>
            <NavLink to="/sign-up">I dont`t have an account</NavLink>
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
