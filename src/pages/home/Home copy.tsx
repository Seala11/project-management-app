import React from 'react';
import styles from './home.module.scss';

const Home = () => {
  return (
    <section className={styles.section_one}>
      <div className={styles.main_content}>
        <div className={styles.title_wrapper}>
          <h1 className={styles.title}>More accomplish together</h1>
          <div className={styles.subtitle}>
            Collaborate, manage projects and reach new Productivity peak.
          </div>
        </div>
        <img src="../../assets/" alt="" />
      </div>
    </section>
  );
};

export default Home;
