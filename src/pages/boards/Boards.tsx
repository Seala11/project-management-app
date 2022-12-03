import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  boardsSelector,
  thunkGetUserBoards,
  thunkCreateBoard,
  BoardType,
  thunkDeleteBoard,
  thunkUpdateBoard,
} from 'store/boardsSlice';
import {
  BtnColor,
  ModalAction,
  modalActionSelector,
  resetModal,
  setChangeBoard,
  setModalOpen,
  userDescriptionSelector,
  userTitleSelector,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon/Icon';
import pencil from 'assets/images/pencil.png';
import styles from './boards.module.scss';
import { userSelector } from 'store/authSlice';
import { getTokenFromLS } from 'utils/func/localStorage';
import Search from 'components/search/search';
import { setIsPending } from 'store/appSlice';
import { ErrosType, useGetBoardsErrors } from 'utils/hooks/useGetBoardsErrors';
import { toast } from 'react-toastify';

const Boards = () => {
  const [selectedBoard, setSelectedBoard] = useState<string>();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const modalAction = useAppSelector(modalActionSelector);
  const userInputTitle = useAppSelector(userTitleSelector);
  const userInputDescr = useAppSelector(userDescriptionSelector);

  const user = useAppSelector(userSelector);
  const userRef = useRef(user._id);

  const boards = useAppSelector(boardsSelector);
  const [newBoards, setNewBoards] = useState<BoardType[]>(boards);
  const initialRenderBoardsRef = useRef(boards.length);

  const messageErr = useGetBoardsErrors();
  const messageErrRef = useRef(messageErr);

  useEffect(() => {
    const messages = messageErrRef.current;
    const getBoards = async () => {
      if (initialRenderBoardsRef.current === 0) {
        dispatch(setIsPending(true));
        try {
          await dispatch(thunkGetUserBoards(getTokenFromLS())).unwrap();
        } catch (err) {
          const error = err as keyof ErrosType;
          const message = messages[error] ? messages[error] : messages.DEFAULT;
          toast.error(message);
        } finally {
          dispatch(setIsPending(false));
        }
      }
    };

    getBoards();
  }, [dispatch]);

  useEffect(() => {
    setNewBoards(boards);
  }, [boards]);
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
    dispatch(
      setModalOpen({
        message: `${t('MODAL.DELETE_MSG')} ${board.title.title}?`,
        color: BtnColor.RED,
        btnText: `${t('MODAL.DELETE')}`,
        action: ModalAction.BOARD_DELETE,
      })
    );
    setSelectedBoard(board._id);
  };

  const changeBoardHandler = (event: React.MouseEvent, board: BoardType) => {
    event.stopPropagation();
    dispatch(setChangeBoard(true));
    dispatch(
      setModalOpen({
        title: `${t('BOARDS.CHANGE')}`,
        inputTitle: `${t('MODAL.TITLE')}`,
        inputDescr: `${t('MODAL.DESCRIPTION')}`,
        color: BtnColor.BLUE,
        btnText: `${t('MODAL.CHANGE')}`,
        action: ModalAction.BOARD_CHANGE,
        defaultVals: {
          title: board.title.title,
          description: board.title.descr,
        },
      })
    );
    setSelectedBoard(board._id);
  };

  const deleteBoard = useCallback(async () => {
    if (typeof selectedBoard !== 'string') return;
    dispatch(setIsPending(true));
    dispatch(thunkDeleteBoard({ boardId: selectedBoard, token: getTokenFromLS() }))
      .unwrap()
      .catch((err) => {
        const error = err as keyof ErrosType;
        const message = messageErr[error] ? messageErr[error] : messageErr.DEFAULT;
        toast.error(message);
      })
      .finally(() => {
        dispatch(setIsPending(false));
      });
  }, [dispatch, messageErr, selectedBoard]);

  const changeBoard = useCallback(async () => {
    if (typeof selectedBoard !== 'string') return;
    const info = JSON.stringify({
      title: userInputTitle,
      descr: userInputDescr,
    });
    dispatch(setIsPending(true));
    dispatch(
      thunkUpdateBoard({
        owner: userRef.current,
        title: info,
        users: [],
        token: getTokenFromLS(),
        boardId: selectedBoard,
      })
    )
      .unwrap()
      .catch((err) => {
        const error = err as keyof ErrosType;
        const message = messageErr[error] ? messageErr[error] : messageErr.DEFAULT;
        toast.error(message);
      })
      .finally(() => {
        dispatch(setIsPending(false));
      });
  }, [dispatch, messageErr, selectedBoard, userInputDescr, userInputTitle]);

  const createBoard = useCallback(async () => {
    dispatch(setIsPending(true));
    const info = JSON.stringify({
      title: userInputTitle,
      descr: userInputDescr,
    });
    await dispatch(
      thunkCreateBoard({
        owner: userRef.current,
        title: info,
        users: [],
        token: getTokenFromLS(),
      })
    )
      .unwrap()
      .catch((err) => {
        const error = err as keyof ErrosType;
        const message = messageErr[error] ? messageErr[error] : messageErr.DEFAULT;
        toast.error(message);
      })
      .finally(() => {
        dispatch(setIsPending(false));
      });
  }, [dispatch, messageErr, userInputDescr, userInputTitle]);

  useEffect(() => {
    if (modalAction === ModalAction.BOARD_CREATE) {
      dispatch(resetModal());
      createBoard();
    }

    if (modalAction === ModalAction.BOARD_DELETE) {
      dispatch(resetModal());
      deleteBoard();
    }

    if (modalAction === ModalAction.BOARD_CHANGE) {
      dispatch(resetModal());
      changeBoard();
    }
  }, [changeBoard, createBoard, deleteBoard, dispatch, modalAction]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.wrapperTop}>
        <h2 className={styles.title}>{t('BOARDS.TITLE')}</h2>
        <Search boards={boards} setNewBoards={setNewBoards} />
      </div>
      <ul className={styles.list}>
        <li className={`${styles.card} ${styles.cardCreate}`} onClick={createBoardHandler}>
          <h3 className={`${styles.cardName} ${styles.cardCreateName}`}>{t('BOARDS.CREATE')}</h3>
          <img src={pencil} alt="yellow pencil" className={styles.image} />
        </li>
        {newBoards.map((board) => (
          <li
            key={board._id}
            className={styles.card}
            onClick={() => navigateToBoardPage(board._id)}
          >
            <div className={styles.titleWrapper}>
              <h3 className={styles.cardName}>{board.title.title}</h3>
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.buttonChange}
                  onClick={(e) => changeBoardHandler(e, board)}
                >
                  <Icon
                    color="#0047ff"
                    size={100}
                    icon="pen-change"
                    className={styles.iconChange}
                  />
                </button>
                <button className={styles.button} onClick={(e) => deleteBoardHandler(e, board)}>
                  <Icon color="#CC0707" size={100} icon="trash" className={styles.icon} />
                </button>
              </div>
            </div>
            <p className={styles.description}>{board.title.descr}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Boards;
