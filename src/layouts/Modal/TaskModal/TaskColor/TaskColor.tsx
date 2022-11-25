import React from 'react';
import COLORS from 'utils/constants/COLORS';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'store/hooks';
import { thunkUpdateTaskInfo } from 'store/middleware/tasks';
import { toast } from 'react-toastify';
import { TaskParsedType } from 'store/boardSlice';
import styles from './taskColor.module.scss';

type Props = {
  task: TaskParsedType | null;
  boardId: string;
  columnId: string;
  setHeaderColor: React.Dispatch<React.SetStateAction<string>>;
};

const TaskColor = ({ task, boardId, columnId, setHeaderColor }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const updateTaskColor = (newColor: string) => {
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
          toast.success('task color updated');
        })
        .catch(() => {
          toast.error('update color error');
        });
    }
  };

  return (
    <div className={styles.taskInfo}>
      <h3 className={styles.labelTitle}>{t('MODAL.LABEL')}</h3>
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
