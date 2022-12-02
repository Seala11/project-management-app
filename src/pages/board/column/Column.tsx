import React, { useEffect, useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ColumnType } from 'store/boardSlice';
import styles from './column.module.scss';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import Icon from 'components/Icon/Icon';
import {
  BtnColor,
  ModalAction,
  setModalColumnId,
  setModalOpen,
  setTaskOrder,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import { thunkGetAllTasks } from 'store/middleware/tasks';
import { thunkUpdateTitleColumn } from 'store/middleware/columns';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Task from '../task/Task';

type Props = {
  columnData: ColumnType;
  index: number;
};

interface IFormInputs {
  input: string;
}

const Column = (props: Props) => {
  const { tasks } = useAppSelector((state) => state.board);
  const column = props.columnData;
  const columnTasks = tasks[column._id];
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [isEditable, setIsEditable] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({
    mode: 'onChange',
  });

  const formEdit = useRef<HTMLFormElement>(null);
  const columnTitle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(thunkGetAllTasks({ boardId: column.boardId, columnId: column._id }));
  }, [dispatch, column.boardId, column._id]);

  const onSubmitEdit: SubmitHandler<IFormInputs> = (data) => {
    dispatch(
      thunkUpdateTitleColumn({
        boardId: column.boardId,
        columnId: column._id,
        order: column.order,
        title: data.input,
      })
    ).then(() => setIsEditable(false));
  };

  const deleteColumn = () => {
    dispatch(setModalColumnId(column._id));
    dispatch(
      setModalOpen({
        message: `${t('MODAL.DELETE_MSG')} ${column.title}?`,
        color: BtnColor.RED,
        btnText: `${t('MODAL.DELETE')}`,
        action: ModalAction.COLUMN_DELETE,
      })
    );
  };

  const createTask = () => {
    const taskOrder = columnTasks.length ? columnTasks[columnTasks.length - 1].order + 1 : 0;
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
    dispatch(setTaskOrder(taskOrder));
  };

  const CancelTitleEdit = () => {
    reset();
    setIsEditable(false);
  };

  return (
    <Draggable draggableId={column._id} index={props.index}>
      {(provided, snapshot) => {
        // extending the DraggableStyle with our own inline styles
        const style = {
          backgroundColor: snapshot.isDragging ? '#0047ff26' : '#0047ff14',
          ...provided.draggableProps.style,
        };
        return (
          <li
            data-key={column._id}
            className={styles.columnItem}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={style}
          >
            {isEditable ? (
              <form ref={formEdit} className={styles.form} onSubmit={handleSubmit(onSubmitEdit)}>
                <input
                  autoFocus
                  type="text"
                  {...register('input', {
                    value: column.title,
                    required: 'REQ_ER',
                    maxLength: { value: 25, message: 'MAX_ER' },
                  })}
                  className={`${styles.input} ${errors.input ? styles.error : ''}`}
                  onBlur={handleSubmit(onSubmitEdit)}
                />
                <button
                  className={`${styles.buttonEdit} ${styles.submit}`}
                  type="submit"
                  disabled={!(Object.keys(errors).length === 0)}
                >
                  <Icon color="#0047FF" size={100} icon="done" className={styles.icon} />
                </button>
                <button className={styles.buttonEdit} onClick={CancelTitleEdit}>
                  <Icon color="#CC0707" size={100} icon="cancel" className={styles.icon} />
                </button>
                <span className={styles.formError}>
                  {errors.input && t(`COLUMN.${errors.input.message}`)}
                </span>
              </form>
            ) : (
              <div ref={columnTitle} className={styles.columnTitle} {...provided.dragHandleProps}>
                <div className={styles.titleName} onClick={() => setIsEditable(true)}>
                  {column.title}
                </div>
                <button className={styles.button} onClick={deleteColumn}>
                  <Icon color="#CC0707" size={100} icon="trash" className={styles.icon} />
                </button>
              </div>
            )}
            <hr className={styles.columnLine}></hr>
            <Droppable droppableId={column._id} mode={'standard'} type="TASK">
              {(providedColumn) => (
                <ul
                  className={styles.tasksList}
                  {...providedColumn.droppableProps}
                  ref={providedColumn.innerRef}
                >
                  {columnTasks &&
                    columnTasks.map((task, i) => (
                      <Task key={task._id} taskData={task} columnId={column._id} index={i} />
                    ))}
                  {providedColumn.placeholder}
                </ul>
              )}
            </Droppable>
            <div className={`${styles.taskButton} ${styles.addButton}`} onClick={createTask}>
              {t('BOARD.CREATE_TASK_BUTTON')}
              <Icon color="#0047FF" size={100} icon="add" className={styles.icon} />
            </div>
          </li>
        );
      }}
    </Draggable>
  );
};

export default Column;
