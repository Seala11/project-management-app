import React, { useState } from 'react';
// import { useAppSelector, useAppDispatch } from '../../store/store';
// import { updateSearchBar } from '../../store/apiPageReducer';
import styles from './dropdown.module.scss';
import Icon from 'components/Icon/Icon';
import { DROP_DOWN_DATA } from 'utils/constants/constants';

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
            <li
              className={styles.dropdownListItem}
              onClick={onOptionClicked(option.name)}
              key={option.name}
            >
              <Icon color="#4D4D4D" size={20} icon={option.icon} /> {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDropDown;
