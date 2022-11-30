import { useTranslation } from 'react-i18next';

export type ErrosType = {
  BOARDS_403: string;
  BOARDS_404: string;
  BOARDS_400: string;
  DEFAULT: string;
};

export const useGetBoardsErrors = () => {
  const { t } = useTranslation();

  const errMessage: ErrosType = {
    BOARDS_403: `${t('AUTH.403_USER')}`,
    BOARDS_404: `${t('BOARDS.404_BOARDS')}`,
    BOARDS_400: `${t('AUTH.400_USER_UPDATE')}`,
    DEFAULT: `${t('AUTH.DEFAULT')}`,
  };

  return errMessage;
};
