import React, { useEffect } from 'react';
import { ColumnType } from 'store/boardSlice';
import styles from './board.module.scss';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { thunkDeleteColumn } from 'store/middleware/columns';
import { userSelector } from 'store/authSlice';
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
import { thunkCreateTasks, thunkGetAllTasks } from 'store/middleware/tasks';

type Props = {
  columnData: ColumnType;
};

const Column = (props: Props) => {
  const { tasks } = useAppSelector((state) => state.board);
  const column = props.columnData;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // MODAL ACTIONS AND HANDLERS
  const modalAction = useAppSelector(modalActionSelector);
  const userInputTitle = useAppSelector(userTitleSelector);
  const userInputDescr = useAppSelector(userDescriptionSelector);
  const user = useAppSelector(userSelector);

  useEffect(() => {
    dispatch(thunkGetAllTasks({ boardId: column.boardId, columnId: column._id }));
  }, [column.boardId, column._id, dispatch]);

  const deleteColumn = (title: string) => {
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

  const openTaskModal = (task: string) => {
    dispatch(setTaskId(task));
    dispatch(setTaskModalOpen());
  };

  useEffect(() => {
    if (modalAction === ModalAction.COLUMN_DELETE) {
      console.log(column._id);
      dispatch(thunkDeleteColumn({ boardId: column.boardId, columnId: column._id }));
      dispatch(resetModal());
    }

    if (modalAction === ModalAction.TASK_CREATE) {
      console.log('dispatch', user, Number(user._id));
      const newDescr = JSON.stringify({ description: userInputDescr, color: '' });
      dispatch(
        thunkCreateTasks({
          boardId: column.boardId,
          columnId: column._id,
          title: userInputTitle,
          description: newDescr,
          order: 0,
          userId: user._id,
        })
      );
      dispatch(resetModal());
    }
  }, [
    modalAction,
    dispatch,
    column._id,
    column.boardId,
    user,
    user._id,
    userInputDescr,
    userInputTitle,
  ]);

  return (
    <>
      <li data-key={column._id} className={styles.columnItem}>
        <div className={styles.columnTitle}>
          {column.title}
          <button className={styles.button} onClick={() => deleteColumn(column.title)}>
            <Icon color="#CC0707" size={100} icon="trash" className={styles.icon} />
          </button>
        </div>
        <hr className={styles.columnLine}></hr>
        <ul className={styles.tasksList}>
          {tasks[column._id] &&
            tasks[column._id].map((task) => (
              <li
                className={styles.taskItem}
                key={task._id}
                onClick={() => openTaskModal(task._id)}
              >
                <div className={styles.taskTitle}>{task.title}</div>
              </li>
            ))}
        </ul>
        <div className={`${styles.taskButton} ${styles.addButton}`} onClick={createTask}>
          {t('BOARD.CREATE_TASK_BUTTON')}
          <Icon color="#0047FF" size={100} icon="add" className={styles.icon} />
        </div>
      </li>
    </>
  );
};

export default Column;
