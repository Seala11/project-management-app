import React, { useRef, useState } from 'react';
import { thunkSignIn } from 'store/authSlice';
import { useAppDispatch } from 'store/hooks';
import { NavLink } from 'react-router-dom';
import { Signin } from 'api/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import signImage from 'assets/images/login.png';
import { useTranslation } from 'react-i18next';
import { ReactComponent as OpenedEye } from 'assets/images/show.svg';
import { ReactComponent as ClosedEye } from 'assets/images/hide.svg';
import styles from '../registration.module.scss';

const SignIn = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const passwordField = useRef<HTMLInputElement | null>(null);
  const [isShowText, setIsShowText] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<Signin>({ reValidateMode: 'onSubmit' });

  const { ref, ...rest } = register('password', {
    required: { value: true, message: 'LENGTH' },
    pattern: { value: /^\S[a-zA-Z0-9_]+$/i, message: 'PATTERN' },
    minLength: { value: 4, message: 'LENGTH' },
    onChange: (e) => clearErrors(e.target.name),
  });

  const onSubmit: SubmitHandler<Signin> = (data) => {
    dispatch(thunkSignIn(data));
  };

  const showPassword: React.MouseEventHandler<SVGSVGElement> = () => {
    if (passwordField?.current) {
      if (passwordField?.current.getAttribute('type') === 'text') {
        setIsShowText(false);
        (passwordField?.current as HTMLInputElement).setAttribute('type', 'password');
      } else {
        setIsShowText(true);
        (passwordField?.current as HTMLInputElement).setAttribute('type', 'text');
      }
    }
  };
  // function checkFields(data: Signin & { [key: string]: string }) {
  //   let isValid = true;

  //   for (const key in data) {
  //     if (Object.prototype.hasOwnProperty.call(data, key)) {
  //       const value = data[key];

  //       if (!value.match(/^\S[a-zA-Z0-9_]+$/i)) {
  //         setError(key as keyof Signin, { type: 'value', message: 'PATTERN' });
  //         isValid = false;
  //       }

  //       if (value.length < 4) {
  //         setError(key as keyof Signin, { type: 'minLength', message: 'LENGTH' });
  //         isValid = false;
  //       }
  //     }
  //   }

  //   return isValid;
  // }

  return (
    <section className={styles.wrapper}>
      <div className={styles.sign}>
        <div className={styles.formBlock}>
          <h1>{t('AUTH.SIGN_IN')}</h1>
          <form className={styles.formSign} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formItem}>
              <label htmlFor="login">{t('AUTH.LOGIN')}</label>
              <input
                id="login"
                {...register('login', {
                  required: { value: true, message: 'LENGTH' },
                  pattern: { value: /^\S[a-zA-Z0-9_]+$/i, message: 'PATTERN' },
                  minLength: { value: 4, message: 'LENGTH' },
                  onChange: (e) => clearErrors(e.target.name),
                })}
                className={errors.login && styles.inputError}
                autoComplete="off"
                placeholder="Vasya323"
              />
              {errors.login && (
                <span className={styles.fieldError}>{t(`AUTH.${errors.login.message}`)}</span>
              )}
            </div>
            <div className={styles.formItem}>
              <label htmlFor="password">{t('AUTH.PASSWORD')}</label>
              <div className={styles.wrapperEye}>
                <input
                  id="password"
                  type={'password'}
                  {...rest}
                  name="password"
                  ref={(e) => {
                    ref(e);
                    passwordField.current = e;
                  }}
                  className={errors.password && styles.inputError}
                  autoComplete="off"
                  placeholder="****"
                />
                {isShowText ? (
                  <OpenedEye className={styles.eye} onClick={showPassword} />
                ) : (
                  <ClosedEye className={styles.eye} onClick={showPassword} />
                )}
              </div>
              {errors.password && (
                <span className={styles.fieldError}>{t(`AUTH.${errors.password.message}`)}</span>
              )}
            </div>
            <button type="submit">{t('AUTH.SUBMIT')}</button>
          </form>
          <NavLink to="/sign-up">{t('AUTH.HAVENT_ACCOUNT')}</NavLink>
        </div>

        <div className={styles.imageBlock}>
          <img className={styles.img} src={signImage} alt="sign in" />
        </div>
      </div>
    </section>
  );
};

export default SignIn;
