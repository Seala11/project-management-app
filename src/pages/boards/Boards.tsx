import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { boardsSelector } from 'store/boardsSlice';
import Icon from 'components/Icon/Icon';
import pencil from 'assets/images/pencil.png';
import styles from './boards.module.scss';
import { BtnColor, setModalOpen } from 'store/modalSlice';

import ConfirmationModal from 'components/ConfirmationModal/ConfirmationModal';
import { modalStatusSelector } from 'store/modalSlice';

const Boards = () => {
  const boards = useAppSelector(boardsSelector);
  // const modalAction = useAppSelector(modalActionSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const modalIsOpen = useAppSelector(modalStatusSelector);

  const navigateToBoardPage = (id: string) => {
    navigate(`/boards/${id}`);
  };

  const createBoard = () => {
    dispatch(
      setModalOpen({
        title: `Create new board`,
        input1: 'title',
        color: BtnColor.BLUE,
        btnText: 'Create',
      })
    );
  };

  const deleteBoard = (event: React.MouseEvent, board: string) => {
    event.stopPropagation();
    dispatch(
      setModalOpen({
        message: `Are you sure you want to delete ${board}?`,
        color: BtnColor.RED,
        btnText: 'Delete',
      })
    );
  };

  return (
    <section className={styles.wrapper}>
      {modalIsOpen && <ConfirmationModal />}
      <h2 className={styles.title}>My Boards</h2>
      <ul className={styles.list}>
        <li className={`${styles.card} ${styles.cardCreate}`} onClick={createBoard}>
          <h3 className={`${styles.cardName} ${styles.cardCreateName}`}>Create new board</h3>
          <img src={pencil} alt="yellow pencil" className={styles.image} />
        </li>
        {boards.map((board) => (
          <li
            key={board.title}
            className={styles.card}
            onClick={() => navigateToBoardPage(board._id)}
          >
            <div className={styles.titleWrapper}>
              <h3 className={styles.cardName}>{board.title}</h3>
              <button className={styles.button} onClick={(e) => deleteBoard(e, board.title)}>
                <Icon color="#CC0707" size={100} icon="trash" className={styles.icon} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Boards;
