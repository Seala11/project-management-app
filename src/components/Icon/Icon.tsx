import React, { MouseEventHandler } from 'react';
import IcomoonReact from 'icomoon-react';
import iconSet from 'utils/data/iconSet.json';

/*
import Icon from 'components/Icon/Icon';
<Icon color="#000" size={100} icon="user" />
*/

type Props = {
  color?: string;
  size: string | number;
  icon: string;
  className?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
};

const Icon = (props: Props) => {
  const { color, size = '100%', icon, className = '', onClick } = props;
  return (
    <IcomoonReact
      className={className}
      iconSet={iconSet}
      color={color}
      size={size}
      icon={icon}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick={(e: any) => onClick && onClick(e)}
    />
  );
};

export default Icon;
