import React from 'react';
import { NavLink } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';
import styles from './notfound.module.scss';
import image404 from 'assets/images/404.png';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.wrapper}>
      <div className={styles.mainContent}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>{t('NOTFOUND.TITLE')}</h2>
          <div className={styles.buttonsWrapper}>
            <NavLink to={ROUTES.home} title="go home">
              <button className={styles.btn}>{t('NOTFOUND.HOMELINK')}</button>
            </NavLink>
          </div>
        </div>
        <img className={styles.img} src={image404} alt="404.png" />
      </div>
    </section>
  );
};

export default NotFound;
