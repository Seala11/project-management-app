import React, { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import {
  BtnColor,
  ModalAction,
  modalColumnIdSelector,
  setModalOpen,
  setTaskModalClose,
  usersSelector,
} from 'store/modalSlice';
import { useAppSelector } from 'store/hooks';
import { taskIdSelector } from 'store/modalSlice';
import COLORS from 'utils/constants/COLORS';
import styles from './taskModal.module.scss';
import { useTranslation } from 'react-i18next';
import { columnsSelector } from 'store/boardSlice';
import { thunkGetAllUsers } from 'store/middleware/users';

type Props = {
  onClose: (event: React.MouseEvent) => void;
};

const TaskModal = ({ onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const selectedTask = useAppSelector(taskIdSelector);
  const allUsers = useAppSelector(usersSelector);
  const columnId = useAppSelector(modalColumnIdSelector);
  const columns = useAppSelector(columnsSelector);
  const selectedColumn = columns.find((column) => column._id === columnId);

  console.log(selectedTask);
  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(thunkGetAllUsers());
    }
  }, [allUsers, dispatch]);

  const deleteModalOpen = () => {
    dispatch(setTaskModalClose());
    dispatch(
      setModalOpen({
        message: `${t('MODAL.DELETE_MSG')} ${selectedTask}?`,
        color: BtnColor.RED,
        btnText: `${t('MODAL.DELETE')}`,
        action: ModalAction.TASK_DELETE,
      })
    );
  };

  return (
    <>
      <div className={styles.heading}>
        <button type="button" className={styles.closeBtn} onClick={onClose} />
      </div>
      <div className={styles.taskWrapper}>
        <div className={styles.taskInfo}>
          <h3 className={styles.title}>{selectedTask?.title}</h3>
          <p className={styles.subtitle}>
            {t('MODAL.IN_COLUMN')} {selectedColumn?.title}
          </p>
        </div>

        <div className={styles.taskInfo}>
          <h3 className={styles.title}>{t('MODAL.DESCRIPTION')}</h3>
          <p className={styles.subtitle}>{selectedTask?.description.description}</p>
        </div>

        <div className={styles.taskInfo}>
          <h3 className={styles.title}>{t('MODAL.MEMBERS')}</h3>
          {selectedTask?.users.map((id) => {
            const userAssigned = allUsers.find((user) => user._id === id);
            return (
              <p key={userAssigned?._id} className={styles.member}>
                {userAssigned?.login}
              </p>
            );
          })}
          <select className={styles.select}>
            {allUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.login}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.taskInfo}>
          <h3 className={styles.title}>{t('MODAL.LABEL')}</h3>
          <ul className={styles.list}>
            {COLORS.map((color) => (
              <li
                key={color.id}
                style={{ backgroundColor: `${color.color}` }}
                className={styles.label}
              />
            ))}
          </ul>
        </div>
        <button className={styles.button} type="button" onClick={deleteModalOpen}>
          {t('MODAL.DELETE_TASK')}
        </button>
      </div>
    </>
  );
};

export default TaskModal;
