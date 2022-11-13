import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { boardsSelector, FakeBoard, deleteBoard, createBoard } from 'store/boardsSlice';
import {
  BtnColor,
  ModalAction,
  modalActionSelector,
  resetModalAction,
  setModalOpen,
  userTitleSelector,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon/Icon';
import pencil from 'assets/images/pencil.png';
import styles from './boards.module.scss';

const Boards = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedBoard, setSelectedBoard] = useState<string>();

  const dispatch = useAppDispatch();
  const boards = useAppSelector(boardsSelector);
  const modalAction = useAppSelector(modalActionSelector);
  const userInputTitle = useAppSelector(userTitleSelector);

  const navigateToBoardPage = (id: string) => {
    navigate(`/boards/${id}`);
  };

  const createBoardHandler = () => {
    dispatch(
      setModalOpen({
        title: `${t('BOARDS.CREATE')}`,
        inputTitle: `${t('MODAL.TITLE')}`,
        color: BtnColor.BLUE,
        btnText: `${t('MODAL.CREATE')}`,
        action: ModalAction.BOARD_CREATE,
      })
    );
  };

  const deleteBoardHandler = (event: React.MouseEvent, board: FakeBoard) => {
    event.stopPropagation();
    dispatch(
      setModalOpen({
        message: `${t('MODAL.DELETE_MSG')} ${board.title}?`,
        color: BtnColor.RED,
        btnText: `${t('MODAL.DELETE')}`,
        action: ModalAction.BOARD_DELETE,
      })
    );
    setSelectedBoard(board._id);
  };

  useEffect(() => {
    if (modalAction === ModalAction.BOARD_CREATE) {
      dispatch(createBoard({ title: userInputTitle, _id: userInputTitle }));
      dispatch(resetModalAction());
    }

    if (modalAction === ModalAction.BOARD_DELETE && typeof selectedBoard === 'string') {
      dispatch(deleteBoard(selectedBoard));
      dispatch(resetModalAction());
    }
  }, [modalAction, dispatch, selectedBoard, userInputTitle]);

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t('BOARDS.TITLE')}</h2>
      <ul className={styles.list}>
        <li className={`${styles.card} ${styles.cardCreate}`} onClick={createBoardHandler}>
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
              <button className={styles.button} onClick={(e) => deleteBoardHandler(e, board)}>
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
