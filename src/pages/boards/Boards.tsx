import React from 'react';
import styles from './boards.module.scss';
import pencil from 'assets/images/pencil.png';
import { useAppSelector } from 'store/hooks';
import { boardsSelector } from 'store/boardsSlice';
import { toast } from 'react-toastify';
import Icon from 'components/Icon/Icon';

const Boards = () => {
  const boards = useAppSelector(boardsSelector);

  const createBoard = () => {
    toast.success(`успешный успех`);
  };

  const navigateToBoardPage = () => {
    toast.error(`error message`);
  };

  const deleteBoard = (event: React.MouseEvent) => {
    event.stopPropagation();
    toast.error(`delete board`);
  };

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>My Boards</h2>
      <ul className={styles.list}>
        <li className={`${styles.card} ${styles.cardCreate}`} onClick={createBoard}>
          <h3 className={`${styles.cardName} ${styles.cardCreateName}`}>Create new board</h3>
          <img src={pencil} alt="yellow pencil" className={styles.image} />
        </li>
        {boards.map((board) => (
          <li key={board.title} className={styles.card} onClick={navigateToBoardPage}>
            <div className={styles.wrapper}>
              <h3 className={styles.cardName}>{board.title}</h3>
              <button className={styles.button} onClick={(e) => deleteBoard(e)}>
                <Icon color="#CC0707" size={100} icon="trash" className={styles.icon} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Boards;
