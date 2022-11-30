import React, { useEffect, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { UserType } from 'store/middleware/users';
import { addUserAssigned, removeUserAssigned } from 'store/modalSlice';
import styles from './memberListItem.module.scss';

type Props = {
  user: UserType;
  assignedMembers: (UserType | undefined)[];
  userHandler: () => void;
  isOpen: boolean;
};

const MemberListItem = React.memo(({ user, assignedMembers, userHandler, isOpen }: Props) => {
  const [assigned, setAssigned] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const assigned = assignedMembers.find((member) => member?._id === user._id);
    setAssigned(!!assigned);
  }, [assignedMembers, user._id]);

  const clickHandler = () => {
    if (!isOpen) return;

    setAssigned(!assigned);
    userHandler();

    if (assigned) {
      dispatch(removeUserAssigned(user._id));
    } else {
      dispatch(addUserAssigned(user._id));
    }
  };

  return (
    <div className={styles.wrapper} data-member="true">
      <input
        className={`${styles.input} ${isOpen ? styles.open : styles.close}`}
        type="checkbox"
        id={user._id}
        checked={assigned}
        data-member="true"
        onClick={clickHandler}
      />
      <label
        htmlFor={user._id}
        data-member="true"
        className={`${styles.label} ${isOpen ? styles.open : styles.close}`}
      >
        {user.name} ({user.login})
      </label>
    </div>
  );
});

export default MemberListItem;
