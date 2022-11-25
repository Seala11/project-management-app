import React, { useEffect, useRef, useState } from 'react';
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

  const [descrCurrVal, setDescrCurrVal] = useState(task?.description.description);
  const [descrUpdatedVal, setDescrUpdatedVal] = useState(task?.description.description);
  const [descrInputDisabled, setDescrInputDisabled] = useState(true);
  const descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);
  const DESCR_MAX_LENGTH = 150;

  const [cancelPressed, setCancelPressed] = useState(false);
  const [preventBlur, setPreventBlur] = useState(false);

  const changeDescrValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescrUpdatedVal(e.target.value);
  };

  const updateDescriptionVal = () => {
    if (preventBlur) {
      setCancelPressed(false);
      setPreventBlur(false);
      return;
    }

    if (descrUpdatedVal && task && descrUpdatedVal !== descrCurrVal && !cancelPressed) {
      setPreventBlur(true);
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
        .then(() => {
          toast.success('task descr updated');
          setDescrCurrVal(descrUpdatedVal);
        })
        .catch(() => {
          toast.error('update descr error');
          setDescrUpdatedVal(descrCurrVal);
        })
        .finally(() => {
          setDescrInputDisabled(true);
          setPreventBlur(false);
        });
    } else {
      setDescrInputDisabled(true);
      setDescrUpdatedVal(descrCurrVal);
    }
  };

  const updateDescrValByEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && descriptionInputRef && descriptionInputRef.current) {
      descriptionInputRef.current.blur();
    }
  };

  const cancelUpdate = () => {
    setCancelPressed(true);
    setPreventBlur(true);
    setDescrInputDisabled(true);
    setDescrUpdatedVal(descrCurrVal);
  };

  useEffect(() => {
    if (!descrInputDisabled && descriptionInputRef && descriptionInputRef.current) {
      descriptionInputRef.current.select();
    }
  }, [descrInputDisabled]);

  return (
    <div className={styles.taskInfo}>
      <div className={styles.changeWrapper}>
        <h3 className={styles.description}>{t('MODAL.DESCRIPTION')}</h3>
        {descrInputDisabled ? (
          <button className={styles.changeBtn} onClick={() => setDescrInputDisabled(false)}>
            <Icon color="#0047FF" size={16} icon="pen-change" />
          </button>
        ) : (
          <div>
            <button className={styles.changeBtn} onMouseDown={updateDescriptionVal}>
              <Icon color="#0047FF" size={20} icon="done" />
            </button>
            <button
              className={`${styles.changeBtn} ${styles.changeBtnCancel}`}
              onMouseDown={cancelUpdate}
            >
              <Icon color="#cc0707" size={20} icon="cancel" />
            </button>
          </div>
        )}
      </div>

      <div className={styles.textareaWrapper}>
        {descrInputDisabled ? (
          <p
            onClick={() => {
              setDescrInputDisabled(false);
            }}
            className={styles.textDescription}
          >
            {descrCurrVal}
          </p>
        ) : (
          <textarea
            maxLength={150}
            ref={descriptionInputRef}
            className={styles.textarea}
            value={descrUpdatedVal}
            onBlur={updateDescriptionVal}
            onChange={(e) => changeDescrValue(e)}
            onKeyDown={updateDescrValByEnter}
          />
        )}

        {!descrInputDisabled && (
          <div
            className={`${styles.counter} ${
              descrUpdatedVal && descrUpdatedVal.length > 140 ? styles.counterLim : ''
            }`}
          >
            <span>{(descrUpdatedVal && descrUpdatedVal.length) || 0}</span>
            <span>/</span>
            <span>{DESCR_MAX_LENGTH}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDescription;
