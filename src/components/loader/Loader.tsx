import React from 'react';
import style from './loader.module.scss';

type Props = {
  status?: string | boolean;
};

function Loader({ status }: Props) {
  if (!status) return null;
  return (
    <div className={`${style.loader} ${status === 'full' ? style.full : ''}`}>
      <div className={style.ldsRipple}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
