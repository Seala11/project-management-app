import Icon from 'components/Icon/Icon';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'store';
import { TaskParsedType } from 'store/boardSlice';
import { useAppDispatch } from 'store/hooks';
import { thunkUpdateTaskInfo } from 'store/middleware/tasks';
import { UserType } from 'store/middleware/users';
import { addUserAssigned, removeUserAssigned, selectUserIsAssigned } from 'store/modalSlice';
import styles from './memberListItem.module.scss';

type Props1 = {
  user: UserType;
  task: TaskParsedType | null;
  boardId: string;
  columnId: string;
  isOpen: boolean;
};

// TODO: do not dispatch when list is closed
// add memo

const MemberListItem = React.memo(({ user, task, boardId, columnId, isOpen }: Props1) => {
  const dispatch = useAppDispatch();
  const userIsAssigned = useSelector((state: RootState) => selectUserIsAssigned(state, user._id));
  const [disabled, setDisabled] = useState(false);

  console.log(userIsAssigned);

  const memberHandler = () => {
    if (!task || !isOpen || disabled) return;
    console.log(disabled);
    setDisabled(true);

    let newMembersList: string[];
    if (userIsAssigned) {
      newMembersList = task.users.filter((id) => id !== user._id);
    } else {
      newMembersList = [...task.users, user._id];
    }

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
        users: newMembersList,
      })
    )
      .unwrap()
      .then(() => {
        if (userIsAssigned) {
          dispatch(removeUserAssigned(user._id));
        } else {
          dispatch(addUserAssigned(user._id));
        }
        toast.success('update member');
      })
      .catch(() => {
        toast.error('update member error');
      })
      .finally(() => {
        setDisabled(false);
      });
  };

  return (
    <div
      key={user._id}
      className={`${styles.memberWrapper} ${disabled ? styles.disabled : ''}`}
      onClick={memberHandler}
    >
      <li key={user._id} value={user._id} className={styles.listItem}>
        {user.name} ({user.login})
      </li>
      {userIsAssigned && <Icon color="#0047FF" size={20} icon="done" className={styles.icon} />}
    </div>
  );
});

export default MemberListItem;
