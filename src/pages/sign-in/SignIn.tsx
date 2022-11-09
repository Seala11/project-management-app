import React, { useEffect } from 'react';
import styles from './signin.module.scss';
import { RootState } from 'store';
import * as api from '../../api/api';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { thunkSignIn } from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';

const SignIn = () => {
  const dispatch = useAppDispatch();
  const { login, password } = useAppSelector((state) => state.auth.user);
  const state = useAppSelector((state) => state.auth);
  useEffect(() => {
    console.log('signIn mounted');
    // dispatch(thunkSignIn({ login: 'vaassgsss', password: '123456' }));
    api
      .getAllUsers()
      .then((res) => res && res.json())
      .then((res) => console.log(res));
  }, []);

  return (
    <div>
      <h1 className={styles.title}>Sign-In</h1>
    </div>
  );
};

export default SignIn;
