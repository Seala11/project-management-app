/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import styles from './signin.module.scss';
import { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { thunkSignIn } from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getTokenFromLS } from 'api/localStorage';
import { NavLink } from 'react-router-dom';
import signImage from '../../assets/images/login.png';

const SignIn = () => {
  const dispatch = useAppDispatch();
  const { login, password } = useAppSelector((state) => state.auth.user);
  const state = useAppSelector((state) => state.auth);
  // useEffect(() => {
  //   console.log('signIn mounted');
  //   // dispatch(thunkSignIn({ login: 'vaassgsss', password: '123456' }));
  //   api
  //     .getAllUsers(getTokenFromLS())
  //     .then((res) => res && res.json())
  //     .then((res) => console.log(res));
  // }, []);

  return (
    <div className="wrapper">
      <div className="container">
        <div className="sign-in">
          <div className="form-block">
            <h1>Sing in</h1>
            <form className="form-sign-in">
              <div className="form-item">
                <label>
                  Name
                  <input type="text" />
                </label>
              </div>
              <div className="form-item">
                <label>
                  Password
                  <input type="text" />
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
