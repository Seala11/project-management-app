import { useTranslation } from 'react-i18next';

export type ErrosType = {
  USER_404: string;
  DEFAULT: string;
};

export const useGetAuthErrors = () => {
  const { t } = useTranslation();

  const errMessage: ErrosType = {
    USER_404: `${t('AUTH.404_USER')}`,
    DEFAULT: `${t('MODAL.AUTH.DEFAULT')}`,
  };

  return errMessage;
};
