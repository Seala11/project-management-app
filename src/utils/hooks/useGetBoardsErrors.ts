import { useTranslation } from 'react-i18next';

export type ErrosType = {
  BOARDS_403: string;
  DEFAULT: string;
};

export const useGetBoardsErrors = () => {
  const { t } = useTranslation();

  const errMessage: ErrosType = {
    BOARDS_403: `${t('AUTH.403_USER')}`,
    DEFAULT: `${t('AUTH.DEFAULT')}`,
  };

  return errMessage;
};
