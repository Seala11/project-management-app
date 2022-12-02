import React, { useRef, useState } from 'react';
import { thunkUpdateTaskInfo } from 'store/middleware/tasks';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { TaskParsedType } from 'store/boardSlice';
import styles from './taskTitle.module.scss';
import { setModalClose, setTaskId, setTaskModalClose, taskIdSelector } from 'store/modalSlice';

type Props = {
  task: TaskParsedType | null;
  boardId: string;
  columnId: string;
};

const TaskTitle = ({ task, boardId, columnId }: Props) => {
  const dispatch = useAppDispatch();
  const [titleCurrVal, setTitleCurrVal] = useState(task?.title);
  const [titleUpdatedVal, setTitleUpdatedVal] = useState(task?.title);
  const [titleInputDisabled, setTitleInputDisabled] = useState(true);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const changeTitleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleUpdatedVal(e.target.value);
  };

  const selectedTask = useAppSelector(taskIdSelector);

  const updateTitleVal = () => {
    const task = selectedTask;
    console.log('s', selectedTask);
    if (titleUpdatedVal && task && titleUpdatedVal !== titleCurrVal) {
      dispatch(
        thunkUpdateTaskInfo({
          _id: task?._id,
          boardId: boardId,
          columnId: columnId,
          userId: task.userId,
          title: titleUpdatedVal,
          description: JSON.stringify({
            description: task.description.description,
            color: task.description.color,
          }),
          order: task.order,
          users: task.users,
        })
      )
        .unwrap()
        .then(() => {
          setTitleCurrVal(titleUpdatedVal);
          dispatch(
            setTaskId({
              _id: task?._id,
              boardId: boardId,
              userId: task.userId,
              title: titleUpdatedVal,
              description: {
                description: task.description.description,
                color: task.description.color,
              },
              order: task.order,
              users: task.users,
            })
          );
        })
        .catch((err) => {
          const [code] = err.split('/');
          if (code === '404') {
            dispatch(setTaskModalClose());
            dispatch(setModalClose());
          }
        })
        .finally(() => {
          setTitleInputDisabled(true);
        });
    } else {
      setTitleInputDisabled(true);
      setTitleUpdatedVal(titleCurrVal);
    }
  };

  const updateTitleValByEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && titleInputRef && titleInputRef.current) {
      titleInputRef.current.blur();
    }
  };

  return (
    <input
      maxLength={20}
      ref={titleInputRef}
      className={`${styles.title} ${titleInputDisabled ? styles.titleDisabled : styles.titleAbled}`}
      value={titleInputDisabled ? titleCurrVal : titleUpdatedVal}
      onClick={() => setTitleInputDisabled(false)}
      onBlur={updateTitleVal}
      onChange={(e) => changeTitleValue(e)}
      onKeyDown={updateTitleValByEnter}
    />
  );
};

export default TaskTitle;
