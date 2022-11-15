import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSingleBoard } from 'store/boardSlice';
import styles from './board.module.scss';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import Loader from 'components/loader/Loader';
import ROUTES from 'utils/constants/ROUTES';
import { getAllColumns } from 'store/middleware/columns';
import { setAuth } from 'store/authSlice';
import Icon from 'components/Icon/Icon';
import {
  BtnColor,
  ModalAction,
  modalActionSelector,
  resetModal,
  setModalOpen,
  setTaskId,
  setTaskModalOpen,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';

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
      dispatch(getSingleBoard(id));
      dispatch(getAllColumns(id));
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

  const deleteColumn = (event: React.MouseEvent, title: string) => {
    event.stopPropagation();
    dispatch(
      setModalOpen({
        message: `${t('MODAL.DELETE_MSG')} ${title}?`,
        color: BtnColor.RED,
        btnText: `${t('MODAL.DELETE')}`,
        action: ModalAction.COLUMN_DELETE,
      })
    );
  };

  const createTask = () => {
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

  const openTaskModal = (task: string) => {
    // todo: set task id instead of name;
    dispatch(setTaskId(task));
    dispatch(setTaskModalOpen());
  };

  useEffect(() => {
    if (modalAction === ModalAction.COLUMN_DELETE) {
      console.log('delete column dispatch');
      dispatch(resetModal());
    }

    if (modalAction === ModalAction.TASK_CREATE) {
      console.log('create task dispatch');
      dispatch(resetModal());
    }

    if (modalAction === ModalAction.COLUMN_CREATE) {
      console.log('create column dispatch');
      dispatch(resetModal());
    }
  }, [dispatch, modalAction]);

  return (
    <section className={styles.wrapper}>
      {pending && <Loader />}
      {!pending && (
        <div className={styles.mainContent}>
          <h2 className={styles.title}>{title}</h2>
          <ul className={styles.columnsList}>
            {[...columns]
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <li key={column._id} className={styles.columnItem}>
                  <div className={styles.columnTitle}>
                    {column.title}
                    <button
                      className={styles.button}
                      onClick={(e) => deleteColumn(e, column.title)}
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
                  <div className={`${styles.taskButton} ${styles.addButton}`} onClick={createTask}>
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
