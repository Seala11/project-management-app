import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { boardsSelector } from 'store/boardsSlice';
import { BtnColor, setModalOpen } from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon/Icon';
import pencil from 'assets/images/pencil.png';
import styles from './boards.module.scss';

const Boards = () => {
  const boards = useAppSelector(boardsSelector);
  // const modalAction = useAppSelector(modalActionSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateToBoardPage = (id: string) => {
    navigate(`/boards/${id}`);
  };

  const createBoard = () => {
    dispatch(
      setModalOpen({
        title: `${t('BOARDS.CREATE')}`,
        input1: `${t('MODAL.TITLE')}`,
        color: BtnColor.BLUE,
        btnText: `${t('MODAL.CREATE')}`,
      })
    );
  };

  const deleteBoard = (event: React.MouseEvent, board: string) => {
    event.stopPropagation();
    dispatch(
      setModalOpen({
        message: `${t('MODAL.DELETE_MSG')} ${board}?`,
        color: BtnColor.RED,
        btnText: `${t('MODAL.DELETE')}`,
      })
    );
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t('BOARDS.TITLE')}</h2>
      <ul className={styles.list}>
        <li className={`${styles.card} ${styles.cardCreate}`} onClick={createBoard}>
          <h3 className={`${styles.cardName} ${styles.cardCreateName}`}>{t('BOARDS.CREATE')}</h3>
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
