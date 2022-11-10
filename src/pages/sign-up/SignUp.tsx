/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, NavLink } from 'react-router-dom';
import { AppDispatch, RootState } from 'store';
import { thunkSignIn, thunkSignUp } from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from '../../assets/images/login.png';
import { IFormInputSingIn } from 'pages/sign-in/SignIn';
import { Signup } from 'api/types';

interface IFormInputSignUp extends IFormInputSingIn {
  firstName: string;
}
const SignUp = () => {
  const dispatch = useAppDispatch();
  const { login, password } = useAppSelector((state) => state.auth.user);
  const { registered, auth } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Signup>();
  const onSubmit: SubmitHandler<Signup> = (data) => {
    dispatch(thunkSignUp(data));
  };

  useEffect(() => {
    if (registered) {
      console.log(registered);

      console.log({ login, password });
      dispatch(thunkSignIn({ login, password }));
    }
  }, [dispatch, login, password, registered]);

  if (auth) return <Navigate to={'/'} />;

  return (
    <div className="wrapper">
      <div className="container">
        <div className="sign-up">
          <div className="form-block">
            <h1>Sing up</h1>
            <form className="form-sign-up" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-item">
                <label>
                  Name
                  <input {...register('name', { required: true, pattern: /^[A-Za-z]+$/i })} />
                  {errors.name && <span>This field is required</span>}
                </label>
              </div>
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
            <NavLink to="/sign-in">I already have an account</NavLink>
          </div>
          <div className="form-image">
            <img src={signImage} alt="sign up" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
