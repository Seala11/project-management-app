import React, { useEffect, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { UserType } from 'store/middleware/users';
import { addUserAssigned, removeUserAssigned } from 'store/modalSlice';
import styles from './memberListItem.module.scss';

type Props = {
  user: UserType;
  assignedMembers: (UserType | undefined)[];
  userHandler: (id: string, state: string) => void;
  isOpen: boolean;
};

export enum UserAction {
  ADD = 'add',
  REMOVE = 'remove',
}

const MemberListItem = React.memo(({ user, assignedMembers, userHandler, isOpen }: Props) => {
  const [assigned, setAssigned] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const assigned = assignedMembers.find((member) => member?._id === user._id);
    setAssigned(!!assigned);
  }, [assignedMembers, user._id]);

  const clickHandler = (e: React.ChangeEvent<HTMLElement> | React.MouseEvent) => {
    if (!isOpen || e.currentTarget !== e.target) return;

    setAssigned(!assigned);

    if (assigned) {
      dispatch(removeUserAssigned(user._id));
      userHandler(user._id, UserAction.REMOVE);
    } else {
      dispatch(addUserAssigned(user._id));
      userHandler(user._id, UserAction.ADD);
    }
  };

  return (
    <li
      className={`${styles.listItem} ${assigned ? styles.assigned : ''} ${
        !isOpen ? styles.closed : ''
      }`}
      data-member="true"
      onClick={(e) => clickHandler(e)}
    >
      {user.name} ({user.login})
    </li>
  );
});

export default MemberListItem;
