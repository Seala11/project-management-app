import React from 'react';
import { Navigate } from 'react-router-dom';
import { authSelector } from 'store/authSlice';
import { useAppSelector } from 'store/hooks';
import ROUTES from 'utils/constants/ROUTES';
import styles from './board.module.scss';

const Board = () => {
  const { isLogged } = useAppSelector(authSelector);
  if (!isLogged) return <Navigate to={ROUTES.signIn} />;
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>board name</h2>
    </section>
  );
};

export default Board;
