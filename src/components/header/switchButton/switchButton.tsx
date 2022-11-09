import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './_switchButton.scss';

const SwitchButton = () => {
  const [lang, setLang] = useState(localStorage.getItem('i18nextLng') || 'en');
  const { i18n } = useTranslation();
  const handleToggle = () => {
    const newLangValue = lang === 'en' ? 'ru' : 'en';
    setLang(newLangValue);
    i18n.changeLanguage(newLangValue);
  };
  const isOn = lang === 'en' ? true : false;
  const labelClass = isOn ? 'switch__label en' : 'switch__label ru';
  return (
    <React.Fragment>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="switch__checkbox"
        id={`switch-new`}
        type="checkbox"
      />
      <label className={labelClass} htmlFor={`switch-new`}>
        <div className="switch__label-info">
          <span className={isOn ? 'label__info' : 'label__info--invisible'}>{lang}</span>
          <span className={isOn ? 'label__info--invisible' : 'label__info'}>{lang}</span>
        </div>
        <span className={`switch__button`} />
      </label>
    </React.Fragment>
  );
};

export default SwitchButton;
