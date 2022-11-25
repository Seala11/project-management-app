import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import {
  BtnColor,
  ModalAction,
  modalColumnIdSelector,
  setModalOpen,
  setTaskDeleteConfirm,
  setTaskModalClose,
  usersSelector,
} from 'store/modalSlice';
import { useAppSelector } from 'store/hooks';
import { taskIdSelector } from 'store/modalSlice';
import COLORS from 'utils/constants/COLORS';
import styles from './taskModal.module.scss';
import { useTranslation } from 'react-i18next';
import { boardIdSelector, columnsSelector } from 'store/boardSlice';
import { thunkGetAllUsers } from 'store/middleware/users';
import Icon from 'components/Icon/Icon';
import { thunkUpdateTask } from 'store/middleware/tasks';
import { toast } from 'react-toastify';

type Props = {
  onClose: (event: React.MouseEvent) => void;
};

const TaskModal = ({ onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const selectedTask = useAppSelector(taskIdSelector);
  const boardId = useAppSelector(boardIdSelector);
  const allUsers = useAppSelector(usersSelector);
  const columnId = useAppSelector(modalColumnIdSelector);
  const columns = useAppSelector(columnsSelector);
  const selectedColumn = columns.find((column) => column._id === columnId);

  const [titleInputDisabled, setTitleInputDisabled] = useState(true);

  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(thunkGetAllUsers());
    }
  }, [allUsers, dispatch]);

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

  const [titleCurrVal, setTitleCurrVal] = useState(selectedTask?.title);
  const [titleUpdatedVal, setTitleUpdatedVal] = useState(selectedTask?.title);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const changeTitleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleUpdatedVal(e.target.value);
  };

  const updateTitleVal = () => {
    if (titleUpdatedVal && selectedTask && titleUpdatedVal !== titleCurrVal) {
      dispatch(
        thunkUpdateTask({
          taskId: selectedTask?._id,
          boardId: boardId,
          columnId: columnId,
          userId: selectedTask.userId,
          title: titleUpdatedVal,
          description: JSON.stringify({
            description: selectedTask.description.description,
            color: selectedTask.description.color,
          }),
          order: selectedTask.order,
          users: selectedTask.users,
        })
      )
        .unwrap()
        .then((originalPromiseResult) => {
          console.log(originalPromiseResult);
          toast.success('task title updated');
          setTitleCurrVal(titleUpdatedVal);
        })
        .catch((rejectedValue) => {
          console.log(rejectedValue);
          toast.error('update title error');
          setTitleUpdatedVal(titleCurrVal);
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
    <>
      <div className={styles.heading}>
        <button type="button" className={styles.closeBtn} onClick={onClose} />
      </div>
      <div className={styles.taskWrapper}>
        <div className={styles.taskTitleWrapper}>
          <div className={styles.changeWrapper}>
            <input
              maxLength={20}
              ref={titleInputRef}
              className={`${styles.title} ${
                titleInputDisabled ? styles.titleDisabled : styles.titleAbled
              }`}
              value={titleInputDisabled ? titleCurrVal : titleUpdatedVal}
              onClick={() => setTitleInputDisabled(false)}
              onBlur={updateTitleVal}
              onChange={(e) => changeTitleValue(e)}
              onKeyDown={updateTitleValByEnter}
            />
          </div>
          <p className={styles.subtitleColumn}>
            {t('MODAL.IN_COLUMN')} {selectedColumn?.title}
          </p>
        </div>

        <div className={styles.taskInfo}>
          <div className={styles.changeWrapper}>
            <h3 className={styles.description}>{t('MODAL.DESCRIPTION')}</h3>
            <button className={styles.changeBtn}>
              <Icon color="#0047FF" size={18} icon="pen-change" className={styles.icon} />
            </button>
          </div>
          <p className={styles.subtitle}>{selectedTask?.description.description}</p>
        </div>

        <div className={styles.taskInfo}>
          <h3 className={styles.members}>{t('MODAL.MEMBERS')}</h3>
          {selectedTask?.users.map((id) => {
            const userAssigned = allUsers.find((user) => user._id === id);
            return (
              <p key={id} className={styles.member}>
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
        <button className={styles.button} type="button" onClick={deleteModalOpen}>
          {t('MODAL.DELETE_TASK')}
        </button>
      </div>
    </>
  );
};

export default TaskModal;
