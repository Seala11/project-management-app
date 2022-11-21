import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColumnType, TaskParsedType } from 'store/boardSlice';
import styles from './column.module.scss';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import Icon from 'components/Icon/Icon';
import {
  BtnColor,
  ModalAction,
  setModalColumnId,
  setModalOpen,
  setTaskId,
  setTaskModalOpen,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import { thunkGetAllTasks } from 'store/middleware/tasks';
import { thunkUpdateTitleColumn } from 'store/middleware/columns';

type Props = {
  columnData: ColumnType;
};

interface IFormInputs {
  input: string;
}

const Column = (props: Props) => {
  const { tasks } = useAppSelector((state) => state.board);
  const column = props.columnData;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [isEditable, setIsEditable] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>();

  useEffect(() => {
    dispatch(thunkGetAllTasks({ boardId: column.boardId, columnId: column._id }));
  }, [column.boardId, column._id, dispatch]);

  const deleteColumn = (title: string) => {
    dispatch(setModalColumnId(column._id));
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
    dispatch(setModalColumnId(column._id));
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

  const openTaskModal = (task: TaskParsedType, columnId: string) => {
    dispatch(setTaskId(task));
    dispatch(setModalColumnId(columnId));
    dispatch(setTaskModalOpen());
  };

  const onSubmitEdit: SubmitHandler<IFormInputs> = (data) => {
    const newName = data.input;
    console.log(newName);
    dispatch(
      thunkUpdateTitleColumn({
        boardId: column.boardId,
        columnId: column._id,
        order: column.order,
        title: data.input,
      })
    ).then(() => setIsEditable(false));
  };

  return (
    <>
      <li data-key={column._id} className={styles.columnItem}>
        {isEditable ? (
          <form className={styles.form} onSubmit={handleSubmit(onSubmitEdit)}>
            <input
              autoFocus
              type="text"
              {...register('input', {
                value: column.title,
                required: 'cannot be empty',
              })}
              className={`${styles.input} ${errors.input ? styles.error : ''}`}
            />
            <button
              className={`${styles.buttonEdit} ${styles.submit}`}
              type="submit"
              disabled={!(Object.keys(errors).length === 0)}
            >
              <Icon color="#0047FF" size={100} icon="done" className={styles.icon} />
            </button>
            <button
              className={styles.buttonEdit}
              onClick={() => {
                reset();
                setIsEditable(false);
              }}
            >
              <Icon color="#CC0707" size={100} icon="cancel" className={styles.icon} />
            </button>
            <span className={styles.formError}>{errors.input && errors.input.message}</span>
          </form>
        ) : (
          <div className={styles.columnTitle}>
            <div className={styles.titleName} onClick={() => setIsEditable(true)}>
              {column.title}
            </div>
            <button className={styles.button} onClick={() => deleteColumn(column.title)}>
              <Icon color="#CC0707" size={100} icon="trash" className={styles.icon} />
            </button>
          </div>
        )}
        <hr className={styles.columnLine}></hr>
        <ul className={styles.tasksList}>
          {tasks[column._id] &&
            tasks[column._id].map((task) => (
              <li
                className={styles.taskItem}
                key={task._id}
                onClick={() => openTaskModal(task, column._id)}
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
