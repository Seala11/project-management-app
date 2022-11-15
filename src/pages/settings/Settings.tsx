import React from 'react';
import styles from './settings.module.scss';

const Settings = () => {
  // const { isLogged } = useAppSelector(authSelector);
  // if (!isLogged) return <Navigate to={ROUTES.signIn} />;
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>User Settings</h2>
    </section>
  );
};

export default Settings;
