import clsx from 'clsx';
import { CSSProperties } from 'react';
import svgList from '../../assets/svgs';
import { TSvgListType } from '../../types';

export interface CommonSvgProps {
  type: TSvgListType;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function CommonSvg({ type, className, ...props }: CommonSvgProps) {
  return (
    <div
      className={clsx('etransfer-ui-common-svg', `${type.toLocaleLowerCase()}-icon`, className)}
      dangerouslySetInnerHTML={{ __html: svgList[type] }}
      {...props}></div>
  );
}
