import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { TaskParsedType } from 'store/boardSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { thunkUpdateTaskInfo } from 'store/middleware/tasks';
import { thunkGetAllUsers } from 'store/middleware/users';
import { selectAssignedUsers, setUsersAssigned, usersSelector } from 'store/modalSlice';
import useDebounce from 'utils/hooks/useDebounce';
import MemberListItem from './MemberListItem/MemberListItem';
import MembersAssigned from './MembersAssigned.tsx/MemberAssigned';
import styles from './taskMembers.module.scss';

type Props = {
  task: TaskParsedType | null;
  boardId: string;
  columnId: string;
};

const TaskMembers = ({ task, boardId, columnId }: Props) => {
  const allUsers = useAppSelector(usersSelector);
  const assignedMembers = useAppSelector(selectAssignedUsers);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const menuOpen = useRef(false);

  const [membersArr, setMembersArr] = useState<string[]>([]);
  const debouncedValue = useDebounce<string[]>(membersArr);

  const taskRef = useRef(task);
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

  useEffect(() => {
    const list = listRef.current;

    const clickHandler = ({ target }: MouseEvent) => {
      const listEl = !!(target as HTMLElement).getAttribute('data-member');
      if (!listEl) {
        setIsOpen(false);
        menuOpen.current = false;
        list?.scrollTo(0, 0);
      }
    };

    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  useEffect(() => {
    if (!taskRef.current || !menuOpen.current) return;
    const task = taskRef.current;
    console.log(debouncedValue);

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
        users: debouncedValue,
      })
    )
      .unwrap()
      .then(() => {
        toast.success('update members');
      })
      .catch(() => {
        toast.error('update member error');
      });
  }, [boardId, columnId, dispatch, debouncedValue]);

  const addMembers = useCallback(() => {
    if (!menuOpen.current) return;
    const items = listRef.current?.children;
    const userChecked = [];

    if (items) {
      for (let i = 0; i < items?.length; i++) {
        if ((items[i].children[0] as HTMLInputElement).checked) {
          userChecked.push(items[i].children[0].id);
        }
      }
    }

    setMembersArr(userChecked);
  }, []);

  const openMenutOptions = () => {
    setIsOpen(true);
    menuOpen.current = true;
  };

  return (
    <div className={styles.taskInfo}>
      <h3 className={styles.members}>{t('MODAL.MEMBERS')}</h3>
      <div className={styles.membersWrapper}>
        {assignedMembers.length > 0 ? (
          <MembersAssigned members={assignedMembers} />
        ) : (
          <p className={styles.err}>{t('MODAL.MEMBERS_ERR')}</p>
        )}
      </div>
      <div
        className={`${styles.list} ${isOpen ? styles.open : styles.close}`}
        onClick={openMenutOptions}
        ref={listRef}
        data-member="true"
      >
        {allUsers.length > 0 &&
          allUsers.map((user) => (
            <MemberListItem
              user={user}
              key={user._id}
              userHandler={addMembers}
              assignedMembers={assignedMembers}
              isOpen={isOpen}
            />
          ))}
      </div>
    </div>
  );
};

export default TaskMembers;
