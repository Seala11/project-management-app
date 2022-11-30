import React from 'react';
import { UserType } from 'store/middleware/users';
import styles from './memberAssigned.module.scss';

type Props = {
  members: (UserType | undefined)[];
};

const MembersAssigned = ({ members }: Props) => {
  const AVATARS_DISPLAY = 8;
  const avatars = members.slice(0, AVATARS_DISPLAY);
  const total = members.length;

  return (
    <>
      {avatars.map((member) => (
        <p key={member?._id} className={styles.member}>
          {member?.name.slice(0, 1).toUpperCase()}
        </p>
      ))}
      {total > AVATARS_DISPLAY && (
        <p className={`${styles.member} ${styles.total}`}>+{total - AVATARS_DISPLAY}</p>
      )}
    </>
  );
};

export default MembersAssigned;
