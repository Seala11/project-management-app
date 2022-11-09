import React from 'react';
import { NavLink } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';
import styles from './welcome.module.scss';
import teaching from 'assets/images/teaching.png';

const SectionWelcome = () => {
  return (
    <section className={styles.section_one}>
      <div className={styles.wrapper}>
        <div className={styles.buttons_wrapper}>
          <NavLink to={ROUTES.signIn} title="signIn">
            <button className={`${styles.btn} ${styles.btn_blue}`}>Sign in</button>
          </NavLink>
          <NavLink to={ROUTES.signUp} title="signUp">
            <button className={`${styles.btn} ${styles.btn_blue}`}>Sign up</button>
          </NavLink>
        </div>
        <div className={styles.main_content}>
          <div className={styles.title_wrapper}>
            <h1 className={styles.title}>More accomplish together</h1>
            <div className={styles.subtitle}>
              Collaborate, manage projects and reach new Productivity peak.
            </div>
          </div>
          <img src={teaching} alt="teaching.png" />
        </div>
      </div>
    </section>
  );
};

export default SectionWelcome;
