import React from 'react';
import styles from './boards.module.scss';
import pencil from 'assets/images/pencil.png';

const Boards = () => {
  return (
    <main className={styles.main}>
      <h2 className={styles.title}>My Boards </h2>
      <ul className={styles.list}>
        <li className={`${styles.card} ${styles.cardCreate}`}>
          <h3 className={styles.cardName}>Create new board</h3>
          <img src={pencil} alt="yellow pencil" className={styles.image} />
        </li>
      </ul>
    </main>
  );
};

export default Boards;
