import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { useAppSelector, useAppDispatch } from '../../store/store';
// import { updateSearchBar } from '../../store/apiPageReducer';
import styles from './dropdown.module.scss';
import Icon from 'components/Icon/Icon';
import ROUTES from 'utils/constants/ROUTES';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserDropDown = () => {
  const { t } = useTranslation();

  const menuListData = [
    {
      name: `${t('MENU.NEW_BOARD')}`,
      icon: 'plus',
      route: ROUTES.boards,
    },
    {
      name: `${t('MENU.MY_BOARDS')}`,
      icon: 'boards',
      route: ROUTES.boards,
    },
    {
      name: `${t('MENU.EDIT')}`,
      icon: 'pen-menu',
      route: ROUTES.boards,
    },
    {
      name: `${t('MENU.SIGN_OUT')}`,
      icon: 'log-out',
      route: ROUTES.boards,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  // const state = useAppSelector((state) => state.apiPage);
  // const dispatch = useAppDispatch();
  // const { UserName, CurrPage } = state;

  const menuList = useRef<HTMLUListElement>(null);
  const menuHeader = useRef<HTMLDivElement>(null);

  const toggling = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        !isOpen ||
        !menuList.current ||
        !menuHeader.current ||
        menuHeader.current.contains(e.target as HTMLElement)
      )
        return;
      if (!menuList.current.contains(e.target as HTMLElement)) {
        toggling();
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [isOpen, toggling]);

  const currPage = 'homepage';
  const userName = 'User Name';

  const onOptionClicked = (value: string) => () => {
    if (currPage === value) return;
    //dispatch(updateSearchBar({ [name]: value }));
    toggling();
  };

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.dropdownHeader} onClick={toggling} ref={menuHeader}>
        <Icon color="#4D4D4D" size={36} icon="user" />
        <span className={styles.name}>{userName}</span>
        <Icon color="" size={14} icon="arrow-down" />
      </div>
      {isOpen && (
        <ul className={styles.dropdownList} ref={menuList}>
          {menuListData.map((option) => (
            <NavLink to={option.route} title={option.name} key={option.name}>
              <li className={styles.dropdownListItem} onClick={onOptionClicked(option.name)}>
                <Icon color="#4D4D4D" size={20} icon={option.icon} /> {option.name}
              </li>
            </NavLink>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDropDown;
