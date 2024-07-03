import qrCodePlaceholder from '../../../assets/images/qrCodePlaceholder.png';
import clsx from 'clsx';
import './index.less';
import { DepositRetryText, DepositRetryBtnText } from '../../../constants/deposit';
import CommonButton, { CommonButtonSize } from '../../CommonButton';
import CommonImage from '../../CommonImage';

export type TDepositRetry = {
  isShowImage?: boolean;
  onClick?: () => void;
};

export function DepositRetryForWeb({ isShowImage = false, onClick }: TDepositRetry) {
  return (
    <div
      className={clsx(
        'etransfer-ui-flex-row-center',
        'etransfer-ui-deposit-retry',
        'etransfer-ui-deposit-retry-for-web',
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

export function DepositRetryForMobile({ onClick }: TDepositRetry) {
  return (
    <div className={clsx('etransfer-ui-flex-column', 'etransfer-ui-deposit-retry')}>
      <span className="retry-text">{DepositRetryText}</span>
      <CommonButton className="retry-btn" size={CommonButtonSize.Small} onClick={onClick}>
        {DepositRetryBtnText}
      </CommonButton>
    </div>
  );
}
