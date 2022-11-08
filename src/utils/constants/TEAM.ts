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

// import { useTranslation } from 'react-i18next';

// const { t } = useTranslation();

export const DEVELOPERS: DevelopersType[] = [
  {
    name: 'Valentin',
    ghNick: 'OutLaw0',
    role: 'Developer',
    ghLink: 'https://github.com/OutLaw0',
    imgLink: '',
    features: { first: '', second: '', third: '' },
  },
  {
    name: 'Anna',
    ghNick: 'Hanna',
    role: 'Team Lead',
    ghLink: 'https://github.com/Seala11',
    imgLink: '',
    features: { first: '', second: '', third: '' },
  },
  {
    name: 'Kostia',
    ghNick: 'kosta4310',
    role: 'Developer',
    ghLink: 'https://github.com/kosta4310',
    imgLink: '',
    features: { first: '', second: '', third: '' },
  },
];
