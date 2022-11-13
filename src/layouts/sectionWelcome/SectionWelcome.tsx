import React from 'react';
import { NavLink } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import teaching from 'assets/images/teaching.png';
import { useTranslation } from 'react-i18next';
import styles from './welcome.module.scss';
import { authSelector, setAuth } from 'store/authSlice';

const SectionWelcome = () => {
  // const [isLogged] = useState(true);
  const { isLogged } = useAppSelector(authSelector);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(setAuth(false));
  };

  return (
    <section className={styles.sectionOne}>
      <div className={styles.wrapper}>
        <div className={styles.buttonsWrapper}>
          {!isLogged ? (
            <>
              <NavLink to={ROUTES.signIn} title="signIn">
                <button className={styles.btn}>{t('AUTH.SIGN_IN')}</button>
              </NavLink>
              <NavLink to={ROUTES.signUp} title="signUp">
                <button className={styles.btn}>{t('AUTH.SIGN_UP')}</button>
              </NavLink>
            </>
          ) : (
            <button className={styles.btn} onClick={handleLogout}>
              {t('AUTH.LOGOUT')}
            </button>
          )}
          {isLogged && (
            <NavLink to={ROUTES.boards} title="boards">
              <button className={styles.btn}>{t('WELCOME.BOARDLINK')}</button>
            </NavLink>
          )}
        </div>
        <div className={styles.mainContent}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>{t('WELCOME.TITLE')}</h1>
            <div className={styles.subtitle}>{t('WELCOME.SUBTITLE')}</div>
          </div>
          <img className={styles.img} src={teaching} alt="teaching.png" />
        </div>
      </div>
    </section>
  );
};

export default SectionWelcome;
