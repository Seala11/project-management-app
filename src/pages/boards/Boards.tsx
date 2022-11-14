import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  boardsSelector,
  deleteBoard,
  boardsLoadingSelector,
  thunkGetUserBoards,
  thunkCreateBoards,
  BoardType,
} from 'store/boardsSlice';
import {
  BtnColor,
  ModalAction,
  modalActionSelector,
  resetModal,
  setModalOpen,
  userDescriptionSelector,
  userTitleSelector,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon/Icon';
import pencil from 'assets/images/pencil.png';
import styles from './boards.module.scss';
import { userSelector } from 'store/authSlice';
import { getTokenFromLS } from 'api/localStorage';

const Boards = () => {
  const [selectedBoard, setSelectedBoard] = useState<string>();

  const dispatch = useAppDispatch();
  const boards = useAppSelector(boardsSelector);
  const loading = useAppSelector(boardsLoadingSelector);
  const modalAction = useAppSelector(modalActionSelector);
  const userInputTitle = useAppSelector(userTitleSelector);
  const userInputDescr = useAppSelector(userDescriptionSelector);
  const user = useAppSelector(userSelector);

  useEffect(() => {
    dispatch(thunkGetUserBoards({ userId: user._id, token: getTokenFromLS() }));
  }, [dispatch, user._id]);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateToBoardPage = (id: string) => {
    navigate(`/boards/${id}`);
  };

  const createBoardHandler = () => {
    dispatch(
      setModalOpen({
        title: `${t('BOARDS.CREATE')}`,
        inputTitle: `${t('MODAL.TITLE')}`,
        inputDescr: `${t('MODAL.DESCRIPTION')}`,
        color: BtnColor.BLUE,
        btnText: `${t('MODAL.CREATE')}`,
        action: ModalAction.BOARD_CREATE,
      })
    );
  };

  const deleteBoardHandler = (event: React.MouseEvent, board: BoardType) => {
    event.stopPropagation();
    // dispatch(
    //   setModalOpen({
    //     message: `${t('MODAL.DELETE_MSG')} ${board.title}?`,
    //     color: BtnColor.RED,
    //     btnText: `${t('MODAL.DELETE')}`,
    //     action: ModalAction.BOARD_DELETE,
    //   })
    // );
    setSelectedBoard(board._id);
  };

  useEffect(() => {
    if (modalAction === ModalAction.BOARD_CREATE) {
      const info = JSON.stringify({ title: userInputTitle, descr: userInputDescr });
      dispatch(
        thunkCreateBoards({
          owner: user._id,
          title: info,
          users: [user._id],
          token: getTokenFromLS(),
        })
      );
      dispatch(resetModal());
    }

    if (modalAction === ModalAction.BOARD_DELETE && typeof selectedBoard === 'string') {
      dispatch(deleteBoard(selectedBoard));
      dispatch(resetModal());
    }
  }, [modalAction, dispatch, selectedBoard, userInputTitle, userInputDescr, user._id]);

  console.log(boards);

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t('BOARDS.TITLE')}</h2>
      <ul className={styles.list}>
        <li className={`${styles.card} ${styles.cardCreate}`} onClick={createBoardHandler}>
          <h3 className={`${styles.cardName} ${styles.cardCreateName}`}>{t('BOARDS.CREATE')}</h3>
          <img src={pencil} alt="yellow pencil" className={styles.image} />
        </li>
        {loading && <p>Loading...</p>}
        {!loading &&
          boards.map((board) => (
            <li
              key={board._id}
              className={styles.card}
              onClick={() => navigateToBoardPage(board._id)}
            >
              <div className={styles.titleWrapper}>
                <h3 className={styles.cardName}>{board.title.title}</h3>
                <p>{board.title.descr}</p>
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
