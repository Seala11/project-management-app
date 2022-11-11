import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';
//import { useAppSelector, useAppDispatch } from '../../store/store';
//import { updateSearch } from '../../store/apiPageReducer';
import styles from './header.module.scss';
import SwitchButton from './switchButton/switchButton';
import logoIcon from 'assets/images/trello-mark-blue.svg';

import UserDropDown from './userDropDown/UserDropDown';

const Header = () => {
  const [isLogged] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  // const state = useAppSelector((state) => state.apiPage);
  // const dispatch = useAppDispatch();

  /*  const handleChange = (e: React.SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(updateSearch(value));
  };
*/

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
          {isLogged && (
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
