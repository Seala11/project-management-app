import React from 'react';
import IcomoonReact from 'icomoon-react';
import iconSet from 'utils/data/iconSet.json';

type Props = {
  color?: string;
  size: string | number;
  icon: string;
  className?: string;
};

const Icon = (props: Props) => {
  const { color, size = '100%', icon, className = '' } = props;
  return (
    <IcomoonReact className={className} iconSet={iconSet} color={color} size={size} icon={icon} />
  );
};

export default Icon;
