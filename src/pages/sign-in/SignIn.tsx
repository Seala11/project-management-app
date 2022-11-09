import React, { useEffect } from 'react';
import styles from './signin.module.scss';
import { RootState } from 'store';
import * as api from '../../api/api';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { thunkSignIn } from 'store/authSlice';

const SignIn = () => {
  const dispatch: AppDispatch = useDispatch();
  const { login, password } = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    // const res = api
    //   .fetchSignIn({ login: 'petyako', password: '123456' })
    //   .then((res) => res.json())
    //   .then((res) => console.log(res))
    //   .catch((e) => console.log(e));
    dispatch(thunkSignIn({ login, password }));
  }, []);

  return (
    <div>
      <h1 className={styles.title}>Sign-In</h1>
    </div>
  );
};

export default SignIn;
