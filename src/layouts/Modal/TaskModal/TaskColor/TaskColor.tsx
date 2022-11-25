import React from 'react';
import COLORS from 'utils/constants/COLORS';
import { useTranslation } from 'react-i18next';
import styles from './taskColor.module.scss';

const TaskColor = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.taskInfo}>
      <h3 className={styles.labelTitle}>{t('MODAL.LABEL')}</h3>
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
  );
};

export default TaskColor;
