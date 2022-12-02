import React, { useState } from 'react';
import COLORS from 'utils/constants/COLORS';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'store/hooks';
import { thunkUpdateTaskInfo } from 'store/middleware/tasks';
import { TaskParsedType } from 'store/boardSlice';
import styles from './taskColor.module.scss';
import Icon from 'components/Icon/Icon';
import { setModalClose, setTaskId, setTaskModalClose } from 'store/modalSlice';

type Props = {
  task: TaskParsedType | null;
  boardId: string;
  columnId: string;
  setHeaderColor: React.Dispatch<React.SetStateAction<string>>;
};

const TaskColor = ({ task, boardId, columnId, setHeaderColor }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [showRemoveBtn, setDisplayRemoveBtn] = useState(!!task?.description.color);

  const updateTaskColor = (newColor: string) => {
    const prevColor = task?.description.color;
    if (task) {
      dispatch(
        thunkUpdateTaskInfo({
          _id: task?._id,
          boardId: boardId,
          columnId: columnId,
          userId: task.userId,
          title: task.title,
          description: JSON.stringify({
            description: task.description.description,
            color: newColor,
          }),
          order: task.order,
          users: task.users,
        })
      )
        .unwrap()
        .then(() => {
          setHeaderColor(newColor);
          !newColor ? setDisplayRemoveBtn(false) : setDisplayRemoveBtn(true);
          dispatch(
            setTaskId({
              _id: task?._id,
              boardId: boardId,
              userId: task.userId,
              title: task.title,
              description: {
                description: task.description.description,
                color: newColor,
              },
              order: task.order,
              users: task.users,
            })
          );
        })
        .catch((err) => {
          if (prevColor) {
            setHeaderColor(prevColor);
          }
          const [code] = err.split('/');
          if (code === '404') {
            dispatch(setTaskModalClose());
            dispatch(setModalClose());
          }
        });
    }
  };

  return (
    <div className={styles.taskInfo}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.labelTitle}>{t('MODAL.LABEL')}</h3>
        {showRemoveBtn && (
          <button className={styles.removeBtn} onClick={() => updateTaskColor('')}>
            <Icon color="#0047ff" size={20} icon="cancel" />
          </button>
        )}
      </div>

      <ul className={styles.list}>
        {COLORS.map((color) => (
          <li
            key={color.id}
            style={{ backgroundColor: `${color.color}` }}
            className={styles.label}
            onClick={() => updateTaskColor(color.color)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskColor;
