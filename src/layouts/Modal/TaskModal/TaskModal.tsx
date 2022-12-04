import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import {
  BtnColor,
  ModalAction,
  modalColumnIdSelector,
  setModalOpen,
  setTaskDeleteConfirm,
  setTaskModalClose,
} from 'store/modalSlice';
import { useAppSelector } from 'store/hooks';
import { taskIdSelector } from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import { columnsSelector } from 'store/boardSlice';
import TaskTitle from './TaskTitle/TaskTitle';
import TaskDescription from './TaskDescription/TaskDescription';
import styles from './taskModal.module.scss';
import TaskColor from './TaskColor/TaskColor';
import TaskMembers from './TaskMembers/TaskMembers';

const DEFAULT_COLOR = '#0047ff14';

type Props = {
  onClose: (event: React.MouseEvent) => void;
};

const TaskModal = ({ onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const selectedTask = useAppSelector(taskIdSelector);
  const columnId = useAppSelector(modalColumnIdSelector);
  const columns = useAppSelector(columnsSelector);
  const selectedColumn = columns.find((column) => column._id === columnId);
  const [headerColor, setHeaderColor] = useState<string>(
    selectedTask?.description.color || DEFAULT_COLOR
  );

  const deleteModalOpen = () => {
    dispatch(setTaskModalClose());
    dispatch(setTaskDeleteConfirm(true));
    dispatch(
      setModalOpen({
        message: `${t('MODAL.DELETE_MSG')} task ${selectedTask?.title}?`,
        color: BtnColor.RED,
        btnText: `${t('MODAL.DELETE')}`,
        action: ModalAction.TASK_DELETE,
      })
    );
  };

  return (
    <>
      <div className={styles.heading} style={{ backgroundColor: `${headerColor}` }}>
        <button type="button" className={styles.closeBtn} onClick={onClose} />
      </div>

      <div className={styles.taskWrapper}>
        <div className={styles.taskTitleWrapper}>
          <TaskTitle task={selectedTask} columnId={columnId} />
          <p className={styles.subtitleColumn}>
            {t('MODAL.IN_COLUMN')} {selectedColumn?.title}
          </p>
        </div>

        <TaskDescription task={selectedTask} columnId={columnId} />

        <TaskMembers task={selectedTask} columnId={columnId} />

        <TaskColor task={selectedTask} columnId={columnId} setHeaderColor={setHeaderColor} />

        <button className={styles.button} type="button" onClick={deleteModalOpen}>
          {t('MODAL.DELETE_TASK')}
        </button>
      </div>
    </>
  );
};

export default TaskModal;
