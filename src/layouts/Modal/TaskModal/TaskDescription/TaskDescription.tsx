import React, { useRef, useState } from 'react';
import { thunkUpdateTaskInfo } from 'store/middleware/tasks';
import { toast } from 'react-toastify';
import Icon from 'components/Icon/Icon';
import { useAppDispatch } from 'store/hooks';
import { useTranslation } from 'react-i18next';
import { TaskParsedType } from 'store/boardSlice';
import styles from './taskDescription.module.scss';

type Props = {
  task: TaskParsedType | null;
  boardId: string;
  columnId: string;
};

const TaskDescription = ({ task, boardId, columnId }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [descrCurrVal, setDescrCurrVal] = useState(task?.title);
  const [descrUpdatedVal, setDescrUpdatedVal] = useState(task?.title);
  const [descrInputDisabled, setDescrInputDisabled] = useState(true);
  const descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);

  const changeTitleValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescrUpdatedVal(e.target.value);
  };

  const updateTitleVal = () => {
    if (descrUpdatedVal && task && descrUpdatedVal !== descrCurrVal) {
      dispatch(
        thunkUpdateTaskInfo({
          _id: task?._id,
          boardId: boardId,
          columnId: columnId,
          userId: task.userId,
          title: task.title,
          description: JSON.stringify({
            description: descrUpdatedVal,
            color: task.description.color,
          }),
          order: task.order,
          users: task.users,
        })
      )
        .unwrap()
        .then((originalPromiseResult) => {
          console.log(originalPromiseResult);
          toast.success('task descr updated');
          setDescrCurrVal(descrUpdatedVal);
        })
        .catch((rejectedValue) => {
          console.log(rejectedValue);
          toast.error('update descr error');
          setDescrUpdatedVal(descrCurrVal);
        })
        .finally(() => {
          setDescrInputDisabled(true);
        });
    } else {
      setDescrInputDisabled(true);
      setDescrUpdatedVal(descrCurrVal);
    }
  };

  const updateTitleValByEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && descriptionInputRef && descriptionInputRef.current) {
      descriptionInputRef.current.blur();
    }
  };

  return (
    <div className={styles.taskInfo}>
      <div className={styles.changeWrapper}>
        <h3 className={styles.description}>{t('MODAL.DESCRIPTION')}</h3>
        <button className={styles.changeBtn}>
          <Icon color="#0047FF" size={16} icon="pen-change" className={styles.icon} />
        </button>
      </div>

      <textarea
        maxLength={150}
        ref={descriptionInputRef}
        className={`${styles.textarea} ${descrInputDisabled ? styles.disabled : styles.abled}`}
        value={descrInputDisabled ? descrCurrVal : descrUpdatedVal}
        onClick={() => setDescrInputDisabled(false)}
        onBlur={updateTitleVal}
        onChange={(e) => changeTitleValue(e)}
        onKeyDown={updateTitleValByEnter}
      >
        {task?.description.description}
      </textarea>
    </div>
  );
};

export default TaskDescription;
