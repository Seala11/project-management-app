import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TaskParsedType } from 'store/boardSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { thunkGetAllUsers } from 'store/middleware/users';
import { usersSelector } from 'store/modalSlice';
import MemberListItem from './MemberListItem/MemberListItem';
import styles from './taskMembers.module.scss';

type Props = {
  task: TaskParsedType | null;
  boardId: string;
  columnId: string;
};

const TaskMembers = ({ task, boardId, columnId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const allUsers = useAppSelector(usersSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const listRef = useRef<HTMLUListElement | null>(null);

  if (typeof window !== undefined && allUsers.length === 0) {
    dispatch(thunkGetAllUsers());
  }

  useEffect(() => {
    const list = listRef.current;
    const listItems = listRef.current?.children;

    const clickHandler = ({ target }: MouseEvent) => {
      let close = true;
      if (listItems) {
        for (const child of listItems) {
          if (child === target) close = false;
        }
      }

      if ((target === list && !close) || (target !== list && close)) {
        setIsOpen(false);
        list?.scrollTo(0, 0);
      }
    };

    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  return (
    <div className={styles.taskInfo}>
      <h3 className={styles.members}>{t('MODAL.MEMBERS')}</h3>
      {task?.users.map((id) => {
        const userAssigned = allUsers.find((user) => user._id === id);
        return (
          <p key={id} className={styles.member}>
            {userAssigned?.login}
          </p>
        );
      })}
      <ul
        ref={listRef}
        className={`${styles.list} ${isOpen ? styles.open : styles.close}`}
        onClick={() => setIsOpen(true)}
      >
        {allUsers.map((user) => (
          <MemberListItem
            user={user}
            key={user._id}
            task={task}
            boardId={boardId}
            columnId={columnId}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskMembers;
