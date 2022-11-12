import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './switch.module.scss';

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
        className={styles.switchCheckbox}
        id={`switch-new`}
        type="checkbox"
      />
      <label
        className={`${styles.switchLabel} ${isEn ? styles.en : styles.ru}`}
        htmlFor={`switch-new`}
      >
        <div className={styles.switchLabelInfo}>
          <span className={!isEn ? styles.invisible : ''}>{lang}</span>
          <span className={isEn ? styles.invisible : ''}>{lang}</span>
        </div>
        <span className={styles.switchButton} />
      </label>
    </>
  );
};

export default SwitchButton;
