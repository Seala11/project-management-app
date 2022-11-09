import React from 'react';
import styles from './signin.module.scss';
import * as api from '../../api/api';

const SignIn = async () => {
  const res = await api.fetchSignUp({ name: 'petya', login: 'petya', password: '123456' });

  return (
    <div>
      <h1 className={styles.title}>Sign-In</h1>
    </div>
  );
};

export default SignIn;
