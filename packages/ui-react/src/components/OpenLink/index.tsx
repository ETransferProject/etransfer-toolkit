import { useCallback } from 'react';
import { openWithBlank } from '../../utils/common';
import CommonSvg from '../CommonSvg';
import './index.less';

export type TOpenLink = {
  className?: string;
  href: string;
};
export default function OpenLink({ className, href }: TOpenLink) {
  const handleClick = useCallback(() => {
    openWithBlank(href);
  }, [href]);

  return (
    <div className={className} onClick={handleClick}>
      <CommonSvg type="openLink" />
    </div>
  );
}
