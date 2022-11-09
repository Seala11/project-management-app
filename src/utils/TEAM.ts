// import avatar_girl from 'assets/images/avatar_girl.jpg';
// import avatar_boy from 'assets/images/avatar_boy.jpg';
// import avatar_boy2 from 'assets/images/avatar_boy2.jpg';
import { useTranslation } from 'react-i18next';

type DevelopersFeaturesType = {
  first: string;
  second: string;
  third: string;
};

export type DevelopersType = {
  name: string;
  ghNick: string;
  role: string;
  ghLink: string;
  imgLink: string;
  features: DevelopersFeaturesType;
};

export const useGetTeamData = () => {
  const { t } = useTranslation();

  const teamData: DevelopersType[] = [
    {
      name: `${t('VALA.NAME')}`,
      ghNick: 'OutLaw0',
      role: `${t('VALA.ROLE')}`,
      ghLink: 'https://github.com/OutLaw0',
      imgLink: '',
      features: {
        first: `${t('VALA.FEAT1')}`,
        second: `${t('VALA.FEAT2')}`,
        third: `${t('VALA.FEAT3')}`,
      },
    },
    {
      name: `${t('ANNA.NAME')}`,
      ghNick: 'Seala11',
      role: `${t('ANNA.ROLE')}`,
      ghLink: 'https://github.com/Seala11',
      imgLink: '',
      features: {
        first: `${t('ANNA.FEAT1')}`,
        second: `${t('ANNA.FEAT2')}`,
        third: `${t('ANNA.FEAT3')}`,
      },
    },
    {
      name: `${t('KOSTIA.NAME')}`,
      ghNick: 'kosta4310',
      role: `${t('KOSTIA.ROLE')}`,
      ghLink: 'https://github.com/kosta4310',
      imgLink: '',
      features: {
        first: `${t('KOSTIA.FEAT1')}`,
        second: `${t('KOSTIA.FEAT2')}`,
        third: `${t('KOSTIA.FEAT3')}`,
      },
    },
  ];
  return teamData;
};
