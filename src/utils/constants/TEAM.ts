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
  imgLink: Record<string, unknown>;
  features: DevelopersFeaturesType;
};

import avatar_girl from 'assets/images/avatar_girl.jpg';
import avatar_boy from 'assets/images/avatar_boy.jpg';
import avatar_boy2 from 'assets/images/avatar_boy2.jpg';

// import { useTranslation } from 'react-i18next';

// const { t } = useTranslation();

export const DEVELOPERS: DevelopersType[] = [
  {
    name: 'Valentin',
    ghNick: 'OutLaw0',
    role: 'Developer',
    ghLink: 'https://github.com/OutLaw0',
    imgLink: { avatar_boy },
    features: { first: '', second: '', third: '' },
  },
  {
    name: 'Anna',
    ghNick: 'Hanna',
    role: 'Team Lead',
    ghLink: 'https://github.com/Seala11',
    imgLink: { avatar_girl },
    features: { first: '', second: '', third: '' },
  },
  {
    name: 'Kostia',
    ghNick: 'kosta4310',
    role: 'Developer',
    ghLink: 'https://github.com/kosta4310',
    imgLink: { avatar_boy2 },
    features: { first: '', second: '', third: '' },
  },
];
