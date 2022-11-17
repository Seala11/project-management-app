import { useTranslation } from 'react-i18next';

type ErrosType = {
  required: string;
  titleLim: string;
  descrLim: string;
};

export const useGetModalErrors = () => {
  const { t } = useTranslation();

  const errMessage: ErrosType = {
    required: `${t('MODAL.REQUIRED')}`,
    titleLim: `${t('MODAL.TITLE_LIM')}`,
    descrLim: `${t('MODAL.DESCRIPTION_LIM')}`,
  };

  return errMessage;
};
