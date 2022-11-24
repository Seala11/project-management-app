import React from 'react';
import { TaskParsedType } from 'store/boardSlice';
import styles from './task.module.scss';
import { useAppDispatch } from 'store/hooks';
import { setModalColumnId, setTaskId, setTaskModalOpen } from 'store/modalSlice';
import { Draggable } from 'react-beautiful-dnd';

type Props = {
  taskData: TaskParsedType;
  columnId: string;
  index: number;
};

const Task = (props: Props) => {
  const { taskData, columnId, index } = props;
  const dispatch = useAppDispatch();

  const openTaskModal = (task: TaskParsedType, columnId: string) => {
    dispatch(setTaskId(task));
    dispatch(setModalColumnId(columnId));
    dispatch(setTaskModalOpen());
  };

  return (
    <Draggable draggableId={taskData._id} index={index}>
      {(providedTask) => (
        <li
          className={styles.taskItem}
          onClick={() => openTaskModal(taskData, columnId)}
          ref={providedTask.innerRef}
          {...providedTask.draggableProps}
        >
          <div className={styles.taskTitle} {...providedTask.dragHandleProps}>
            {taskData.title}
            {taskData.order}
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default Task;
