import React from 'react';
import { UserType } from 'store/middleware/users';
import styles from './memberAssigned.module.scss';

type Props = {
  member: UserType | undefined;
};

const MemberAssigned = React.memo(({ member }: Props) => {
  const userName = member?.login.slice(0, 1).toUpperCase();

  return <p className={styles.member}>{userName}</p>;
  // return <p className={styles.member}>{member?.login}</p>;
});

export default MemberAssigned;
