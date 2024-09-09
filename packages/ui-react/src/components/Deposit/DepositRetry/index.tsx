import qrCodePlaceholder from '../../../assets/images/qrCodePlaceholder.png';
import clsx from 'clsx';
import './index.less';
import { DepositRetryText, DepositRetryBtnText } from '../../../constants/deposit';
import CommonButton from '../../CommonButton';
import { CommonButtonSize } from '../../../types/components';
import CommonImage from '../../CommonImage';

export type TDepositRetry = {
  className?: string;
  isShowImage?: boolean;
  onClick?: () => void;
};

export function DepositRetryForWeb({ className, isShowImage = false, onClick }: TDepositRetry) {
  return (
    <div
      className={clsx(
        'etransfer-ui-flex-row-center',
        'etransfer-ui-deposit-retry',
        'etransfer-ui-deposit-retry-for-web',
        className,
      )}>
      {isShowImage && (
        <CommonImage
          className={clsx('etransfer-ui-flex-none', 'qr-code-placeholder')}
          src={qrCodePlaceholder as unknown as string}
          alt="qrCodePlaceholder"
        />
      )}

      <div className="etransfer-ui-flex-column">
        <span className="retry-text">{DepositRetryText}</span>
        <CommonButton className="retry-btn" size={CommonButtonSize.Small} onClick={onClick}>
          {DepositRetryBtnText}
        </CommonButton>
      </div>
    </div>
  );
}

export function DepositRetryForMobile({ className, onClick }: TDepositRetry) {
  return (
    <div className={clsx('etransfer-ui-flex-column', 'etransfer-ui-deposit-retry', className)}>
      <span className="retry-text">{DepositRetryText}</span>
      <CommonButton className="retry-btn" size={CommonButtonSize.Small} onClick={onClick}>
        {DepositRetryBtnText}
      </CommonButton>
    </div>
  );
}
