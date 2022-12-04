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

  const openTaskModal = () => {
    dispatch(setTaskId(taskData));
    dispatch(setModalColumnId(columnId));
    dispatch(setTaskModalOpen());
  };

  return (
    <Draggable draggableId={taskData._id} index={index}>
      {(providedTask, snapshot) => {
        // extending the DraggableStyle with our own inline styles
        const style = {
          boxShadow: snapshot.isDragging ? '0 0.3rem 1.6rem 0.1rem var(--card-hover)' : 'none',
          background: snapshot.isDragging ? '#ffffffd1' : 'white',
          ...providedTask.draggableProps.style,
        };
        return (
          <li
            className={styles.taskItem}
            onClick={openTaskModal}
            ref={providedTask.innerRef}
            {...providedTask.draggableProps}
            style={style}
          >
            <div className={styles.taskTitle} {...providedTask.dragHandleProps}>
              <div
                className={styles.colorBadge}
                style={{ background: taskData.description.color }}
              ></div>
              <div className={styles.taskText}>{taskData.title}</div>
            </div>
          </li>
        );
      }}
    </Draggable>
  );
};

export default Task;
