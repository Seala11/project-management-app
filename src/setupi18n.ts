import i18n, { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './utils/locales/en.json';
import ru from './utils/locales/ru.json';

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
};

const detectOptions = {
  order: ['localStorage'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
};

use(initReactI18next).use(LanguageDetector).init({
  detection: detectOptions,
  resources,
  fallbackLng: 'en',
});

export default i18n;
