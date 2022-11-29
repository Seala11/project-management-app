import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { TaskParsedType } from 'store/boardSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { thunkUpdateTaskInfo } from 'store/middleware/tasks';
import { thunkGetAllUsers } from 'store/middleware/users';
import { selectAssignedUsers, setUsersAssigned, usersSelector } from 'store/modalSlice';
import MemberListItem from './MemberListItem/MemberListItem';
import MemberAssigned from './MembersAssigned.tsx/MemberAssigned';
import styles from './taskMembers.module.scss';

type Props = {
  task: TaskParsedType | null;
  boardId: string;
  columnId: string;
};

const TaskMembers = ({ task, boardId, columnId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const allUsers = useAppSelector(usersSelector);
  const assignedMembers = useAppSelector(selectAssignedUsers);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const listRef = useRef<HTMLDivElement | null>(null);

  if (window !== undefined && allUsers.length === 0) {
    dispatch(thunkGetAllUsers());
  }

  useEffect(() => {
    if (allUsers.length === 0) return;
    const getUserFullInfo = (id: string) => allUsers.find((user) => user._id === id);
    const assignedUsers = task?.users.map((user) => getUserFullInfo(user));
    dispatch(setUsersAssigned(assignedUsers ? assignedUsers : []));
  }, [allUsers, dispatch, task?.users]);

  const disableRef = useRef(false);

  useEffect(() => {
    const list = listRef.current;
    const disabledFetch = disableRef.current;

    const clickHandler = ({ target }: MouseEvent) => {
      if (disabledFetch) return;

      const listEl = !!(target as HTMLElement).getAttribute('data-member');
      if (!listEl) {
        setIsOpen(false);
        list?.scrollTo(0, 0);
      }
    };

    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  const memberHandler = useCallback(
    (users: string[]) => {
      if (!task || !isOpen || disableRef.current) return;
      disableRef.current = true;

      dispatch(
        thunkUpdateTaskInfo({
          _id: task?._id,
          boardId: boardId,
          columnId: columnId,
          userId: task.userId,
          title: task.title,
          description: JSON.stringify({
            description: task.description.description,
            color: task.description.color,
          }),
          order: task.order,
          users: users,
        })
      )
        .unwrap()
        .then(() => {
          toast.success('update member');
        })
        .catch(() => {
          toast.error('update member error');
        })
        .finally(() => {
          disableRef.current = false;
        });
    },
    [boardId, columnId, dispatch, isOpen, task]
  );

  const setSelected = useCallback(() => {
    const options = listRef.current?.children;
    const userChecked = [];

    if (options) {
      for (let i = 0; i < options?.length; i++) {
        if ((options[i].children[0] as HTMLInputElement).checked) {
          userChecked.push(options[i].children[0].id);
        }
      }
    }

    memberHandler(userChecked);
  }, [memberHandler]);

  return (
    <div className={styles.taskInfo}>
      <h3 className={styles.members}>{t('MODAL.MEMBERS')}</h3>
      <div className={styles.membersWrapper}>
        {assignedMembers.length > 0 &&
          assignedMembers.map((member) => <MemberAssigned key={member?._id} member={member} />)}
      </div>
      <div
        className={`${styles.list} ${isOpen ? styles.open : styles.close}`}
        onClick={() => setIsOpen(true)}
        ref={listRef}
        data-member="true"
      >
        {allUsers.length > 0 &&
          allUsers.map((user) => (
            <MemberListItem
              user={user}
              key={user._id}
              userHandler={setSelected}
              assignedMembers={assignedMembers}
              isOpen={isOpen}
            />
          ))}
      </div>
    </div>
  );
};

export default TaskMembers;
