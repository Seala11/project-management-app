import React from 'react';
import styles from './features.module.scss';
import growth from 'assets/images/growth.png';
import { useTranslation } from 'react-i18next';

const SectionFeatures = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.sectionTwo}>
      <div className={styles.wrapper}>
        <div className={styles.mainContent}>
          <img className={styles.img} src={growth} alt="growth.png" />
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>{t('FEATURES.TITLE')}</h2>
            <div className={styles.subtitle}>{t('FEATURES.SUBTITLE')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionFeatures;
