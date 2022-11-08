import React from 'react';
import './_switchButton.scss';

type SwitchButtonProps = {
  isOn: boolean;
  handleToggle: () => void;
};

const SwitchButton: React.FC<SwitchButtonProps> = ({ isOn, handleToggle }) => {
  const labelClass = isOn ? 'switch__label en' : 'switch__label ru';
  return (
    <React.Fragment>
      <div className="switch__label-info">
        <span>EN</span>
        <span>RU</span>
      </div>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="switch__checkbox"
        id={`switch-new`}
        type="checkbox"
      />
      <label className={labelClass} htmlFor={`switch-new`}>
        <span className={`switch__button`} />
      </label>
    </React.Fragment>
  );
};

export default SwitchButton;
