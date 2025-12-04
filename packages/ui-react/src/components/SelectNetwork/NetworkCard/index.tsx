import clsx from 'clsx';
import './index.less';
import { formatSymbolDisplay } from '../../../utils/format';
import { BusinessType, NetworkStatus } from '@etransfer/types';
import { NetworkLogo } from '../../NetworkLogo';

interface NetworkCardProps {
  type: BusinessType;
  network: string;
  name: string;
  status: string;
  multiConfirmTime: string;
  multiConfirm: string;
  transactionFee?: string;
  transactionFeeUnit?: string;
  className?: string;
  isDisabled?: boolean;
  onClick: () => void;
}

const feeContent = (transactionFee?: string, transactionFeeUnit?: string) => {
  return transactionFee
    ? `Fee: ${transactionFee} ${formatSymbolDisplay(transactionFeeUnit || '')}`
    : 'Fee: Failed to estimate the fee.';
};

export function NetworkCardForMobile({
  type,
  transactionFee,
  transactionFeeUnit,
  className,
  network,
  name,
  multiConfirmTime,
  multiConfirm,
  isDisabled = false,
  onClick,
  status,
}: NetworkCardProps) {
  return (
    <div
      className={clsx(
        'etransfer-ui-network-card-for-mobile',
        (isDisabled || status === NetworkStatus.Offline) && 'etransfer-ui-network-card-disabled',
        className,
      )}
      onClick={onClick}>
      <div className={clsx('etransfer-ui-flex-row', 'network-card-name-row')}>
        <NetworkLogo network={network} size={'normal'} />
        <div className={'network-card-name'}>
          {name}
          {status === NetworkStatus.Offline && <span className={'network-card-network-suspended'}>Suspended</span>}
        </div>
      </div>

      <div className={'network-card-arrival-time'}>
        <span>Arrival Time ≈ </span>
        <span>{multiConfirmTime}</span>
      </div>
      <div className={'network-card-confirm-time'}>
        {type === BusinessType.Deposit ? multiConfirm : feeContent(transactionFee, transactionFeeUnit)}
      </div>
    </div>
  );
}

export function NetworkCardForWeb({
  type,
  transactionFee,
  transactionFeeUnit,
  className,
  network,
  name,
  multiConfirmTime,
  multiConfirm,
  isDisabled = false,
  onClick,
  status,
}: NetworkCardProps) {
  return (
    <div
      className={clsx(
        'etransfer-ui-flex-row-center',
        'etransfer-ui-network-card-for-web',
        'etransfer-ui-network-card-for-web-hover',
        (isDisabled || status === NetworkStatus.Offline) && 'etransfer-ui-network-card-disabled',
        className,
      )}
      onClick={onClick}>
      <NetworkLogo network={network} size="big" />
      <div className="etransfer-ui-flex-column etransfer-ui-flex-1">
        <div className={clsx('etransfer-ui-flex-row-center-between', 'network-card-row')}>
          <span className={'network-card-network'}>
            {network}
            {status === NetworkStatus.Offline && <span className={'network-card-network-suspended'}>Suspended</span>}
          </span>
          <span className={'network-card-arrival-time'}>≈ {multiConfirmTime}</span>
        </div>
        <div className={clsx('etransfer-ui-flex-row-center-between', 'network-card-row')}>
          <span className={'network-card-name'}>{name}</span>
          <span className={'network-card-confirm-time'}>
            {type === BusinessType.Deposit ? multiConfirm : feeContent(transactionFee, transactionFeeUnit)}
          </span>
        </div>
      </div>
    </div>
  );
}
