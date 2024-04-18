// eslint-disable-next-line max-len,prettier/prettier
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EN from '../assets/locales/en';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  resources: {
    // tr: { translation: { _shell: TR, ...(languageObject.turkish ?? {}) } },
    en: { translation: EN },
  },
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});
