import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './modal.module.scss';

const modalRootElement = document.getElementById('modal');

type Props = {
  children: JSX.Element;
  onClose: (event: React.MouseEvent) => void;
};

const Modal = ({ children, onClose }: Props) => {
  const element = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    modalRootElement?.appendChild(element);

    return () => {
      modalRootElement?.removeChild(element);
    };
  }, [element]);

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal}>{children}</div>
    </div>,
    element
  );
};

export default Modal;
