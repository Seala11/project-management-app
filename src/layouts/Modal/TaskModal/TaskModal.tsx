import React from 'react';
import COLORS from 'utils/constants/COLORS';
import styles from './taskModal.module.scss';

const FAKE_USERS = ['user1', 'user2', 'user3'];

type Props = {
  onClose: (event: React.MouseEvent) => void;
};

const TaskModal = ({ onClose }: Props) => {
  return (
    <>
      <div className={styles.heading}>
        <button type="button" className={styles.closeBtn} onClick={onClose} />
      </div>
      <div className={styles.taskWrapper}>
        <div className={styles.taskInfo}>
          <h3 className={styles.title}>Task Title</h3>
          <p className={styles.subtitle}>In column ColumnName</p>
        </div>

        <div className={styles.taskInfo}>
          <h3 className={styles.title}>Description</h3>
          <p className={styles.subtitle}>task description</p>
        </div>

        <div className={styles.taskInfo}>
          <h3 className={styles.title}>Members</h3>
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
          <h3 className={styles.title}>Choose a cover for this task:</h3>
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
        <button className={styles.button} type="button">
          Delete task
        </button>
      </div>
    </>
  );
};

export default TaskModal;
