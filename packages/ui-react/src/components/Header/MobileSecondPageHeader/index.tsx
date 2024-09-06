import clsx from 'clsx';
import './index.less';
import CommonSpace from '../../CommonSpace';
import CommonSvg from '../../CommonSvg';

interface MobileSecondPageHeaderProps {
  title?: string;
  className?: string;
  isShowBackIcon?: boolean;
  backIcon?: React.ReactNode;
  onBack?: () => void;
}

export default function MobileSecondPageHeader({
  title,
  className,
  isShowBackIcon,
  backIcon,
  onBack,
}: MobileSecondPageHeaderProps) {
  return (
    <div className={clsx('etransfer-ui-flex-row-center-between', 'etransfer-ui-mobile-second-page-header', className)}>
      {isShowBackIcon && (
        <div onClick={onBack}>
          {backIcon ? backIcon : <CommonSvg type="downBig" className={'etransfer-ui-mobile-second-page-header-back'} />}
        </div>
      )}

      <span className={clsx('etransfer-ui-text-center', 'etransfer-ui-mobile-second-page-header-title')}>{title}</span>
      {isShowBackIcon && <CommonSpace direction="horizontal" size={20} />}
    </div>
  );
}
