import React, { useRef, useState } from 'react';
import { thunkUpdateTaskInfo } from 'store/middleware/tasks';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'store/hooks';
import { TaskParsedType } from 'store/boardSlice';
import styles from './taskTitle.module.scss';

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

  const updateTitleVal = () => {
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
        .then((originalPromiseResult) => {
          console.log(originalPromiseResult);
          toast.success('task title updated');
          setTitleCurrVal(titleUpdatedVal);
        })
        .catch((rejectedValue) => {
          console.log(rejectedValue);
          toast.error('update title error');
          setTitleUpdatedVal(titleCurrVal);
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
