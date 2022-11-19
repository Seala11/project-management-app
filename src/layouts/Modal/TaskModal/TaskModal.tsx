import React from 'react';
import { useAppDispatch } from 'store/hooks';
import { BtnColor, ModalAction, setModalOpen, setTaskModalClose } from 'store/modalSlice';
import { useAppSelector } from 'store/hooks';
import { taskIdSelector } from 'store/modalSlice';
import COLORS from 'utils/constants/COLORS';
import styles from './taskModal.module.scss';
import { useTranslation } from 'react-i18next';

const FAKE_USERS = ['user1', 'user2', 'user3'];

type Props = {
  onClose: (event: React.MouseEvent) => void;
};

const TaskModal = ({ onClose }: Props) => {
  const taskId = useAppSelector(taskIdSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const deleteModalOpen = () => {
    dispatch(setTaskModalClose());
    dispatch(
      setModalOpen({
        message: `${t('MODAL.DELETE_MSG')} ${taskId}?`,
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
          <h3 className={styles.title}>Task Title</h3>
          <p className={styles.subtitle}>{t('MODAL.IN_COLUMN')} ColumnName</p>
        </div>

        <div className={styles.taskInfo}>
          <h3 className={styles.title}>{t('MODAL.DESCRIPTION')}</h3>
          <p className={styles.subtitle}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industrys standard dummy text ever since the 1500
          </p>
        </div>

        <div className={styles.taskInfo}>
          <h3 className={styles.title}>{t('MODAL.MEMBERS')}</h3>
          <p className={styles.member}>User1</p>
          <select className={styles.select}>
            {FAKE_USERS.map((user) => (
              <option key={user} value={user}>
                {user}
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
