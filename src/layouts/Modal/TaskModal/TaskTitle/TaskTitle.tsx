import React, { useRef, useState } from 'react';
import { TaskDataKeys, thunkUpdateTaskInfo } from 'store/middleware/tasks';
import { useAppDispatch } from 'store/hooks';
import { TaskParsedType } from 'store/boardSlice';
import styles from './taskTitle.module.scss';
import { setModalClose, setTaskModalClose } from 'store/modalSlice';

type Props = {
  task: TaskParsedType | null;
  columnId: string;
};

const TaskTitle = ({ task, columnId }: Props) => {
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
          columnId: columnId,
          newData: { key: TaskDataKeys.TITLE, value: titleUpdatedVal },
        })
      )
        .unwrap()
        .then(() => {
          setTitleCurrVal(titleUpdatedVal);
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
