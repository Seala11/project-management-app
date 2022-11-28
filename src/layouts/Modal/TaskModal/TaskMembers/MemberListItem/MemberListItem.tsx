import Icon from 'components/Icon/Icon';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { TaskParsedType } from 'store/boardSlice';
import { useAppDispatch } from 'store/hooks';
import { thunkUpdateTaskInfo } from 'store/middleware/tasks';
import { UserType } from 'store/middleware/users';
import styles from './memberListItem.module.scss';

type Props1 = {
  user: UserType;
  task: TaskParsedType | null;
  boardId: string;
  columnId: string;
};

// TODO: do not dispatch when list is closed
// add memo

const MemberListItem = ({ user, task, boardId, columnId }: Props1) => {
  const dispatch = useAppDispatch();
  const userIsAssigned = task && task.users.find((id) => id === user._id);
  const [userAssigned, setUserAssigned] = useState(!!userIsAssigned);

  const memberHandler = () => {
    if (!task) return;

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
        toast.success('task member updated');
      })
      .catch(() => {
        toast.error('update member error');
      })
      .finally(() => {
        setUserAssigned(!userAssigned);
      });
  };

  return (
    <div key={user._id} className={styles.memberWrapper} onClick={memberHandler}>
      <li key={user._id} value={user._id} className={styles.listItem}>
        {user.name} ({user.login})
      </li>
      {userAssigned && <Icon color="#0047FF" size={20} icon="done" className={styles.icon} />}
    </div>
  );
};

export default MemberListItem;
