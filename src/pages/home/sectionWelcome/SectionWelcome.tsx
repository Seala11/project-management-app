import React from 'react';
import { NavLink } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';
import styles from './welcome.module.scss';
import teaching from 'assets/images/teaching.png';
import { useTranslation } from 'react-i18next';

const SectionWelcome = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.section_one}>
      <div className={styles.wrapper}>
        <div className={styles.buttons_wrapper}>
          <NavLink to={ROUTES.signIn} title="signIn">
            <button className={`${styles.btn} ${styles.btn_blue}`}>{t('AUTH.SIGN_IN')}</button>
          </NavLink>
          <NavLink to={ROUTES.signUp} title="signUp">
            <button className={`${styles.btn} ${styles.btn_blue}`}>{t('AUTH.SIGN_UP')}</button>
          </NavLink>
        </div>
        <div className={styles.main_content}>
          <div className={styles.title_wrapper}>
            <h1 className={styles.title}>{t('WELCOME.TITLE')}</h1>
            <div className={styles.subtitle}>{t('WELCOME.SUBTITLE')}</div>
          </div>
          <img src={teaching} alt="teaching.png" />
        </div>
      </div>
    </section>
  );
};

export default SectionWelcome;
