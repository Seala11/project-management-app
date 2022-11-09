import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { thunkSignIn, thunkSignUp } from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';

const SignUp = () => {
  const dispatch = useAppDispatch();
  const { login, password } = useAppSelector((state) => state.auth.user);
  const state = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(thunkSignUp({ name: 'petya', login: 'vaassgsss', password: '123456' }));
  }, []);

  return <div>SignUp</div>;
};

export default SignUp;
