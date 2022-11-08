import React, { useState } from 'react';
// import { useAppSelector, useAppDispatch } from '../../store/store';
// import { updateSearchBar } from '../../store/apiPageReducer';
import './_customSelect.scss';

type CustomSelectProps = {
  options: DropDownEnum;
};

enum DropDownEnum {
  newBoard = 'New Board',
  boards = 'My Boards',
  edit = 'Edit Profile',
  signOut = 'Sign Out',
}

export default function CustomSelect(props: CustomSelectProps) {
  const { options } = props;
  const [isOpen, setIsOpen] = useState(false);
  // const state = useAppSelector((state) => state.apiPage);
  // const dispatch = useAppDispatch();
  // const { UserName, CurrPage } = state;
  const currPage = 'homepage';
  const userName = 'UserName';

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value: string) => () => {
    if (currPage === value) return;
    //dispatch(updateSearchBar({ [name]: value }));
    setIsOpen(false);
  };

  return (
    <div className="dropdown__wrapper">
      <div className={`dropdown__header`} onClick={toggling}>
        {userName}
      </div>
      {isOpen && (
        <ul className="dropdown__list">
          {Object.values(options).map((option, i) => (
            <li
              className={`dropdown__list-item ${currPage === option ? 'active' : ''}`}
              onClick={onOptionClicked(option)}
              key={i}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
