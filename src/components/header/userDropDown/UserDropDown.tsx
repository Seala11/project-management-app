import React, { useState } from 'react';
// import { useAppSelector, useAppDispatch } from '../../store/store';
// import { updateSearchBar } from '../../store/apiPageReducer';
import styles from './dropdown.module.scss';
import Icon from 'components/Icon/Icon';
import ROUTES from 'utils/constants/ROUTES';
import { NavLink } from 'react-router-dom';

export const DROP_DOWN_DATA = [
  {
    name: 'New Board',
    icon: 'plus',
    route: ROUTES.boards,
  },
  {
    name: 'My Boards',
    icon: 'boards',
    route: ROUTES.boards,
  },
  {
    name: 'Edit Profile',
    icon: 'pen-menu',
    route: ROUTES.boards,
  },
  {
    name: 'Sign Out',
    icon: 'log-out',
    route: ROUTES.boards,
  },
];

const UserDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const state = useAppSelector((state) => state.apiPage);
  // const dispatch = useAppDispatch();
  // const { UserName, CurrPage } = state;
  const currPage = 'homepage';
  const userName = 'User Name';

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value: string) => () => {
    if (currPage === value) return;
    //dispatch(updateSearchBar({ [name]: value }));
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.dropdownHeader} onClick={toggling}>
        <Icon color="#4D4D4D" size={36} icon="user" />
        <span className={styles.name}>{userName}</span>
        <Icon color="" size={14} icon="arrow-down" />
      </div>
      {isOpen && (
        <ul className={styles.dropdownList}>
          {DROP_DOWN_DATA.map((option) => (
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
