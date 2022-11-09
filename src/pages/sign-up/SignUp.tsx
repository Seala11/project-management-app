import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { thunkSignUp } from 'store/authSlice';

const SignUp = () => {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(thunkSignUp({ name: 'petya', login: 'vasssss', password: '123456' }));
  }, []);

  return <div>SignUp</div>;
};

export default SignUp;
