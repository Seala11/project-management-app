import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './_switchButton.scss';

const SwitchButton = () => {
  const [lang, setLang] = useState(localStorage.getItem('i18nextLng') || 'en');
  const { i18n } = useTranslation();
  const isEn = lang === 'en' ? true : false;
  const handleToggle = () => {
    const newLangValue = isEn ? 'ru' : 'en';
    setLang(newLangValue);
    i18n.changeLanguage(newLangValue);
  };

  return (
    <>
      <input
        checked={isEn}
        onChange={handleToggle}
        className="switch__checkbox"
        id={`switch-new`}
        type="checkbox"
      />
      <label className={isEn ? 'switch__label en' : 'switch__label ru'} htmlFor={`switch-new`}>
        <div className="switch__label-info">
          <span className={isEn ? 'label__info' : 'label__info--invisible'}>{lang}</span>
          <span className={isEn ? 'label__info--invisible' : 'label__info'}>{lang}</span>
        </div>
        <span className={`switch__button`} />
      </label>
    </>
  );
};

export default SwitchButton;
