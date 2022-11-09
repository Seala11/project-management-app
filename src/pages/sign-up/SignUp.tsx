import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
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

  return (
    <div className="wrapper">
      <div className="container">
        <div className="sign-up">
          <div className="form-block">
            <h1>Sing up</h1>
            <form className="form-sign-up">
              <label>
                Name
                <input type="text" />
              </label>
              <label>
                Login
                <input type="text" />
              </label>
              <label>
                Password
                <input type="text" />
              </label>
              <button type="submit">Submit</button>
            </form>
            <NavLink to="/sign-in">I already have an account</NavLink>
          </div>
          <div className="form-image">
            <img src={process.env.PUBLIC_URL + '/images/login.png'} alt="sign up" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
