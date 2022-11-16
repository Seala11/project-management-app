import React from 'react';
import { NavLink } from 'react-router-dom';
import { thunkSignUp } from 'store/authSlice';
import { useAppDispatch } from 'store/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from 'assets/images/login.png';
import { Signup } from 'api/types';
import { useTranslation } from 'react-i18next';
import styles from '../registration.module.scss';

const SignUp = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const { isLogged } = useAppSelector(authSelector);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Signup>();

  const onSubmit: SubmitHandler<Signup> = (data) => {
    dispatch(thunkSignUp(data));
  };

  // if (isLogged) return <Navigate to={ROUTES.boards} />;

  return (
    <section className={styles.wrapper}>
      <div className={styles.sign}>
        <div className={styles.formBlock}>
          <h1>{t('AUTH.SIGN_UP')}</h1>
          <form className={styles.formSign} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formItem}>
              <label htmlFor="name">{t('AUTH.NAME')}</label>
              <input
                id="name"
                {...register('name', { required: true, pattern: /^[A-Za-z]+$/i })}
                className={errors.name && styles.inputError}
              />
              {errors.name && <span className={styles.fieldError}>{t('AUTH.REQUIRED')}</span>}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="login">{t('AUTH.LOGIN')}</label>
              <input
                id="login"
                {...register('login', { required: true })}
                className={errors.login && styles.inputError}
              />
              {errors.login && <span className={styles.fieldError}>{t('AUTH.REQUIRED')}</span>}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="password">{t('AUTH.PASSWORD')}</label>
              <input
                id="passeword"
                type={'password'}
                {...register('password', { required: true })}
                className={errors.password && styles.inputError}
              />
              {errors.password && <span className={styles.fieldError}>{t('AUTH.REQUIRED')}</span>}
            </div>
            <button type="submit">{t('AUTH.SUBMIT')}</button>
          </form>
          <NavLink to="/sign-in">{t('AUTH.HAVE_ACCOUNT')}</NavLink>
        </div>
        <div className={styles.imageBlock}>
          <img className={styles.img} src={signImage} alt="sign up" />
        </div>
      </div>
    </section>
  );
};

export default SignUp;
