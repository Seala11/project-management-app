import React, { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { thunkGetSingleBoard } from 'store/boardSlice';
import styles from './board.module.scss';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import Loader from 'components/loader/Loader';
import ROUTES from 'utils/constants/ROUTES';
import { thunkGetAllColumns, thunkCreateColumn, thunkDeleteColumn } from 'store/middleware/columns';
import { setAuth, userSelector } from 'store/authSlice';
import Icon from 'components/Icon/Icon';
import {
  BtnColor,
  ModalAction,
  modalActionSelector,
  resetModal,
  setModalOpen,
  setTaskId,
  setTaskModalOpen,
  userDescriptionSelector,
  userTitleSelector,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import { thunkCreateTasks } from 'store/middleware/tasks';

/* ToDo
- оттестировать ошибки errors
- logOut() ??
- column component
- task component
*/

const Board = () => {
  const { title, pending, error, columns } = useAppSelector((state) => state.board);
  const tasks = new Array(10).fill('Task');
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const update = useCallback(() => {
    if (id) {
      dispatch(thunkGetSingleBoard(id));
      dispatch(thunkGetAllColumns(id));
      console.log('useEffect');
    }
  }, [id, dispatch]);

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    if (error) {
      const [code] = error.split('/');
      if (code) {
        if (+code === 401) {
          dispatch(setAuth(false));
          navigate(ROUTES.signIn, { replace: true });
        } else {
          navigate(ROUTES.notFound, { replace: true });
        }
      }
    }
  }, [error, dispatch, navigate]);

  // MODAL ACTIONS AND HANDLERS
  const modalAction = useAppSelector(modalActionSelector);
  const [columnId, setColumnId] = useState('');
  const userInputTitle = useAppSelector(userTitleSelector);
  const userInputDescr = useAppSelector(userDescriptionSelector);
  const user = useAppSelector(userSelector);

  const deleteColumn = (title: string, columnId: string) => {
    setColumnId(columnId);
    dispatch(
      setModalOpen({
        message: `${t('MODAL.DELETE_MSG')} ${title}?`,
        color: BtnColor.RED,
        btnText: `${t('MODAL.DELETE')}`,
        action: ModalAction.COLUMN_DELETE,
      })
    );
  };

  const createColumn = () => {
    dispatch(
      setModalOpen({
        title: `${t('BOARD.CREATE_COLUMN_TITLE')}`,
        inputTitle: `${t('MODAL.TITLE')}`,
        color: BtnColor.BLUE,
        btnText: `${t('MODAL.CREATE')}`,
        action: ModalAction.COLUMN_CREATE,
      })
    );
  };

  const createTask = (columnId: string) => {
    setColumnId(columnId);
    dispatch(
      setModalOpen({
        title: `${t('BOARD.CREATE_TASK_TITLE')}`,
        inputTitle: `${t('MODAL.TITLE')}`,
        inputDescr: `${t('MODAL.DESCRIPTION')}`,
        color: BtnColor.BLUE,
        btnText: `${t('MODAL.CREATE')}`,
        action: ModalAction.TASK_CREATE,
      })
    );
  };

  const openTaskModal = (task: string) => {
    // todo: set task id instead of name;
    dispatch(setTaskId(task));
    dispatch(setTaskModalOpen());
  };

  useEffect(() => {
    if (modalAction === ModalAction.COLUMN_DELETE) {
      console.log(columnId);
      dispatch(thunkDeleteColumn({ boardId: `${id}`, columnId: columnId }));
      //  dispatch(thunkGetAllColumns(`${id}`));
      dispatch(resetModal());
    }

    if (modalAction === ModalAction.COLUMN_CREATE) {
      dispatch(
        thunkCreateColumn({
          boardId: `${id}`,
          title: userInputTitle,
          order: columns[columns.length - 1].order + 1,
        })
      );

      dispatch(resetModal());
    }

    if (modalAction === ModalAction.TASK_CREATE) {
      console.log('dispatch', user, Number(user._id));
      const newDescr = JSON.stringify({ description: userInputDescr, color: '' });
      dispatch(
        thunkCreateTasks({
          boardId: `${id}`,
          columnId: columnId,
          title: userInputTitle,
          description: newDescr,
          order: 0,
          userId: user._id,
        })
      );
      dispatch(resetModal());
    }

    // после того как ты разнесешь на компоненты - зависисмоти почищу, можно рефами вынести
  }, [
    columns,
    columnId,
    dispatch,
    id,
    modalAction,
    user,
    user._id,
    userInputDescr,
    userInputTitle,
  ]);

  return (
    <section className={styles.wrapper}>
      {pending && <Loader />}
      {!pending && (
        <div className={styles.mainContent}>
          <h2 className={styles.title}>
            {title.title} <span className={styles.description}>({title.descr})</span>
          </h2>
          <ul className={styles.columnsList}>
            {[...columns]
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <li key={column._id} className={styles.columnItem}>
                  <div className={styles.columnTitle}>
                    {column.title}
                    <button
                      className={styles.button}
                      onClick={() => deleteColumn(column.title, column._id)}
                    >
                      <Icon color="#CC0707" size={100} icon="trash" className={styles.icon} />
                    </button>
                  </div>
                  <hr className={styles.columnLine}></hr>
                  <ul className={styles.tasksList}>
                    {tasks.map((task, i) => (
                      <li className={styles.taskItem} key={i} onClick={() => openTaskModal(task)}>
                        <div className={styles.taskTitle}>
                          {task}
                          {i}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div
                    className={`${styles.taskButton} ${styles.addButton}`}
                    onClick={() => createTask(column._id)}
                  >
                    {'New Task'}
                    <Icon color="#0047FF" size={100} icon="add" className={styles.icon} />
                  </div>
                </li>
              ))}
            <li className={`${styles.columnButton} ${styles.addButton}`} onClick={createColumn}>
              {'New Column'}
              <Icon color="#0047FF" size={100} icon="add" className={styles.icon} />
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default Board;
