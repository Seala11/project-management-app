import React from 'react';
import styles from './features.module.scss';
import growth from 'assets/images/growth.png';

const SectionFeatures = () => {
  return (
    <section className={styles.section_two}>
      <div className={styles.wrapper}>
        <div className={styles.main_content}>
          <img src={growth} alt="growth.png" />
          <div className={styles.title_wrapper}>
            <h2 className={styles.title}>Features to help your team succeed</h2>
            <div className={styles.subtitle}>
              RS Trello is the visual tool that empowers your team to manage any type of project,
              workflow, or task tracking. Create your user, add co-workers and you are in!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionFeatures;
