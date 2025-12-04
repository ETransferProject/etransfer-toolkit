import CommonSvg from '../../CommonSvg';
import './index.less';
import clsx from 'clsx';

interface CommonWarningTipProps {
  content: string;
  isShowPrefix?: boolean;
  isShowSuffix?: boolean;
  className?: string;
  borderRadius?: number;
  onClick?: () => void;
}

export default function CommonWarningTip({
  content,
  isShowPrefix = true,
  isShowSuffix = true,
  className,
  borderRadius = 8,
  onClick,
}: CommonWarningTipProps) {
  return (
    <div
      className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-common-warning-tip', className)}
      style={{ borderRadius: borderRadius }}
      onClick={onClick}>
      <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-flex-1')}>
        {isShowPrefix && <CommonSvg type="infoLine" className="etransfer-ui-flex-shrink-0" />}
        <span className={'etransfer-ui-common-warning-tip-content'}>{content}</span>
      </div>
      {isShowSuffix && (
        <CommonSvg type="down" className={'etransfer-ui-flex-shrink-0 etransfer-ui-common-warning-tip-arrow'} />
      )}
    </div>
  );
}
