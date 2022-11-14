import React from 'react';
import styles from './board.module.scss';
// import { useAppSelector, useAppDispatch } from 'store/hooks';

const Board = () => {
  //  const [isOpenModal, setIsOpenModal] = useState(false);
  //  const { title } = useAppSelector((state) => state.board);
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>board name</h2>
    </section>
  );
};

export default Board;
