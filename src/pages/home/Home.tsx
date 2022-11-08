import React from 'react';
import styles from './home.module.scss';
import teaching from 'assets/images/teaching.jpg';

const Home = () => {
  return (
    <section className={styles.section_one}>
      <div className={styles.wrapper}>
        <div className={styles.buttons_wrapper}>
          <button className={`${styles.btn} ${styles.btn_blue}`}>Sign in</button>
          <button className={`${styles.btn} ${styles.btn_blue}`}>Sign up</button>
        </div>
        <div className={styles.main_content}>
          <div className={styles.title_wrapper}>
            <h1 className={styles.title}>More accomplish together</h1>
            <div className={styles.subtitle}>
              Collaborate, manage projects and reach new Productivity peak.
            </div>
          </div>
          <img src={teaching} alt="teaching.jpg" />
        </div>
      </div>
    </section>
  );
};

export default Home;
