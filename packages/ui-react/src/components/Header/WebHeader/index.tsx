import { useCallback } from 'react';
import clsx from 'clsx';
import './index.less';
import CommonSvg from '../../CommonSvg';
import { ETRANSFER_WEBSITE_URL } from '../../../constants';

export interface WebHeaderProps {
  isCanClickLogo: boolean;
  onClickLogo?: () => void;
}

export default function WebHeader({ isCanClickLogo, onClickLogo }: WebHeaderProps) {
  const goWebsite = useCallback(() => {
    if (onClickLogo) {
      onClickLogo();
    } else {
      window.open(ETRANSFER_WEBSITE_URL, '_blank');
    }
  }, [onClickLogo]);

  return (
    <div className={clsx('etransfer-ui-flex-row-between', 'etransfer-ui-web-header')}>
      {isCanClickLogo ? (
        <div className={'etransfer-ui-web-header-logo'} onClick={goWebsite}>
          <CommonSvg type="logo" />
        </div>
      ) : (
        <CommonSvg type="logo" />
      )}

      <div className={'etransfer-ui-web-right-wrapper'}>
        {/* TODO */}
        {/* <LoginAndProfileEntry /> */}
      </div>
    </div>
  );
}
