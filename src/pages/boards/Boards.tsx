import React from 'react';
import styles from './boards.module.scss';
import pencil from 'assets/images/pencil.png';
import { useAppSelector } from 'store/hooks';
import { boardsSelector } from 'store/boardsSlice';

const Boards = () => {
  const boards = useAppSelector(boardsSelector);

  const createBoard = () => {
    console.log('show confirmation modal');
  };

  const navigateToBoardPage = () => {
    console.log('navigate to board page');
  };

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>My Boards</h2>
      <ul className={styles.list}>
        <li className={`${styles.card} ${styles.cardCreate}`} onClick={createBoard}>
          <h3 className={styles.cardName}>Create new board</h3>
          <img src={pencil} alt="yellow pencil" className={styles.image} />
        </li>
        {boards.map((board) => (
          <li key={board.title} className={styles.card} onClick={navigateToBoardPage}>
            <h3 className={styles.cardName}>{board.title}</h3>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Boards;
