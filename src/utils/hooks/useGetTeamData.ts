import Seala11 from 'assets/images/avatar_girl.jpg';
import OutLaw0 from 'assets/images/avatar_boy.jpg';
import kosta4310 from 'assets/images/avatar_boy2.jpg';
import { useTranslation } from 'react-i18next';

type DevelopersFeaturesType = string[];

export type DevelopersType = {
  name: string;
  ghNick: string;
  role: string;
  ghLink: string;
  imgLink: { [key: string]: string };
  features: DevelopersFeaturesType;
};

export const useGetTeamData = () => {
  const { t } = useTranslation();

  const teamData: DevelopersType[] = [
    {
      name: `${t('ANNA.NAME')}`,
      ghNick: 'Seala11',
      role: `${t('ANNA.ROLE')}`,
      ghLink: 'https://github.com/Seala11',
      imgLink: { Seala11 },
      features: [`${t('ANNA.FEAT1')}`, `${t('ANNA.FEAT2')}`, `${t('ANNA.FEAT3')}`],
    },

    {
      name: `${t('VALA.NAME')}`,
      ghNick: 'OutLaw0',
      role: `${t('VALA.ROLE')}`,
      ghLink: 'https://github.com/OutLaw0',
      imgLink: { OutLaw0 },
      features: [`${t('VALA.FEAT1')}`, `${t('VALA.FEAT2')}`, `${t('VALA.FEAT3')}`],
    },
    {
      name: `${t('KOSTIA.NAME')}`,
      ghNick: 'kosta4310',
      role: `${t('KOSTIA.ROLE')}`,
      ghLink: 'https://github.com/kosta4310',
      imgLink: { kosta4310 },
      features: [`${t('KOSTIA.FEAT1')}`, `${t('KOSTIA.FEAT2')}`, `${t('KOSTIA.FEAT3')}`],
    },
  ];
  return teamData;
};
