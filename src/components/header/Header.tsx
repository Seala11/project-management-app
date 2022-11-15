import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';
//import { useAppSelector } from 'store/hooks';
import styles from './header.module.scss';
import SwitchButton from './switchButton/switchButton';
import logoIcon from 'assets/images/trello-mark-blue.svg';

import UserDropDown from './userDropDown/UserDropDown';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  // const state = useAppSelector((state) => state.auth);
  // const { auth } = state;
  const auth = true;

  const setStickyHeader = () => {
    if (window.scrollY > 80) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.document.addEventListener('scroll', setStickyHeader);
    return () => {
      window.document.removeEventListener('scroll', setStickyHeader);
    };
  }, []);

  return (
    <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
      <div className={styles.headerWrapper}>
        <NavLink to={ROUTES.home} className={styles.home} title="home">
          <div className={styles.logo}>
            <img src={logoIcon} alt="logoIcon" /> RS Trello
          </div>
        </NavLink>
        <div className={styles.menuWrapper}>
          {auth && (
            <div className={styles.menuList}>
              <UserDropDown />
            </div>
          )}
          <SwitchButton />
        </div>
        <div className={styles.hamburger} id="hamburger-1">
          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
