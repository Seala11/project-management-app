import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './dropdown.module.scss';
import Icon from 'components/Icon/Icon';
import ROUTES from 'utils/constants/ROUTES';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { authSelector, setAuth } from 'store/authSlice';
import { BtnColor, ModalAction, setModalOpen } from 'store/modalSlice';

const UserDropDown = () => {
  const { t } = useTranslation();
  const { user, isLogged } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
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
      route: ROUTES.settings,
    },
    {
      name: `${t('MENU.SIGN_OUT')}`,
      icon: 'log-out',
      route: ROUTES.home,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const menuList = useRef<HTMLUListElement>(null);
  const menuHeader = useRef<HTMLDivElement>(null);

  const toggling = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  function assertIsNode(e: EventTarget | null): asserts e is Node {
    //from https://stackoverflow.com/questions/71193818/react-onclick-argument-of-type-eventtarget-is-not-assignable-to-parameter-of-t
    if (!e || !('nodeType' in e)) {
      throw new Error(`Node expected`);
    }
  }

  useEffect(() => {
    const onClick = ({ target }: MouseEvent) => {
      assertIsNode(target);
      if (
        !isOpen ||
        !menuList.current ||
        !menuHeader.current ||
        menuHeader.current.contains(target)
      )
        return;
      if (!menuList.current.contains(target)) {
        toggling();
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [isOpen, toggling]);

  const currPage = 'homepage';
  const userName = 'User Name';
  const userNameCut = user.name.length < 11 ? user.name : user.name.slice(0, 11) + '...';

  const onOptionClicked = (value: string) => () => {
    if (currPage === value) return;
    if (value === `${t('MENU.SIGN_OUT')}`) {
      dispatch(setAuth(false));
    }

    if (value === `${t('MENU.NEW_BOARD')}`) {
      dispatch(
        setModalOpen({
          title: `${t('BOARDS.CREATE')}`,
          inputTitle: `${t('MODAL.TITLE')}`,
          inputDescr: `${t('MODAL.DESCRIPTION')}`,
          color: BtnColor.BLUE,
          btnText: `${t('MODAL.CREATE')}`,
          action: ModalAction.BOARD_CREATE,
        })
      );
    }

    toggling();
  };

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.dropdownHeader} onClick={toggling} ref={menuHeader}>
        <div className={styles.wrapperIconWithName}>
          <Icon color="#4D4D4D" size={36} icon="user" />
          <span className={styles.name}>{isLogged ? userNameCut : userName}</span>
        </div>
        <Icon
          className={`${styles.iconDown} ${isOpen && styles.up}`}
          color=""
          size={14}
          icon="arrow-down"
        />
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
