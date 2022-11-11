/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, NavLink } from 'react-router-dom';
import { AppDispatch, RootState } from 'store';
import { authSelector, thunkSignIn, thunkSignUp, userSelector } from 'store/authSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from '../../assets/images/login.png';
import { IFormInputSingIn } from 'pages/sign-in/SignIn';
import { Signup } from 'api/types';
import { useTranslation } from 'react-i18next';
import ROUTES from 'utils/constants/ROUTES';

// interface IFormInputSignUp extends IFormInputSingIn {
//   firstName: string;
// }
const SignUp = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  const { login, password } = userSelector(state);
  const { registered, auth } = authSelector(state);

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

  if (auth) return <Navigate to={ROUTES.boards} />;

  return (
    <div className="wrapper">
      <div className="container">
        <div className="sign-up">
          <div className="form-block">
            <h1>{t('AUTH.SIGN_UP')}</h1>
            <form className="form-sign-up" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-item">
                <label>
                  {t('AUTH.NAME')}
                  <input {...register('name', { required: true, pattern: /^[A-Za-z]+$/i })} />
                  {errors.name && <span>{t('AUTH.REQUIRED')}</span>}
                </label>
              </div>
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
            <NavLink to="/sign-in">{t('AUTH.HAVE_ACCOUNT')}</NavLink>
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
