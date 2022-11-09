import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';
//import { useAppSelector, useAppDispatch } from '../../store/store';
//import { updateSearch } from '../../store/apiPageReducer';
import styles from './header.module.scss';
import navStyles from './nav.module.scss';

const Header = () => {
  const [isLogged] = useState(true);

  // const state = useAppSelector((state) => state.apiPage);
  // const dispatch = useAppDispatch();

  /*  const handleChange = (e: React.SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(updateSearch(value));
  };
*/

  return (
    <header className={styles.header}>
      <div className={`${styles.wrapper} ${styles.header__wrapper}`}>
        <NavLink
          to={ROUTES.home}
          className={`${navStyles.nav__link} ${navStyles.home}`}
          title="home"
        >
          <div className={styles.logo}>RS Trello</div>
        </NavLink>
        <div className={styles.menu__wrapper}>
          {isLogged && <div className={styles.menu__list}>User name</div>}
          <div className={styles.menu__language}>EN / RU</div>
        </div>
        <div className={navStyles.hamburger} id="hamburger-1">
          <span className={navStyles.line}></span>
          <span className={navStyles.line}></span>
          <span className={navStyles.line}></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
