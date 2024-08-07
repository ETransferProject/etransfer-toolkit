import clsx from 'clsx';
import './index.less';
import { useMemo } from 'react';
import CheckFilledIcon from 'assets/images/checkFilled.svg';
import CommonSvg from '../../CommonSvg';
import CommonModalAutoScreen, { CommonModalAutoScreenProps } from '../../CommonModalAutoScreen';
import { ARRIVAL_TIME_CONFIG, DEFAULT_NULL_VALUE, TokenType } from '../../../constants';
import { valueFixed2LessThanMin } from '@etransfer/utils';
import { ChainId } from '@portkey/types';
import { TWithdrawInfoSuccess } from '../../../types';

interface SuccessModalProps {
  withdrawInfo: TWithdrawInfoSuccess;
  modalProps: CommonModalAutoScreenProps;
}

const isNeedQuota = (symbol: TokenType, chainId: ChainId) => {
  if (!symbol || !chainId) return false;
  if ([TokenType.ELF, TokenType.USDT].includes(symbol) && ARRIVAL_TIME_CONFIG[symbol].chainList.includes(chainId))
    return true;
  return false;
};

export default function SuccessModal({ withdrawInfo, modalProps }: SuccessModalProps) {
  const arrivalTime = useMemo(() => {
    const symbol = withdrawInfo.symbol as TokenType;
    const chainId = withdrawInfo.network.network as unknown as ChainId;
    if (
      isNeedQuota(symbol, chainId) &&
      Number(withdrawInfo.amount) <= Number(ARRIVAL_TIME_CONFIG[symbol].dividingQuota)
    ) {
      return '30s';
    } else {
      return withdrawInfo.arriveTime;
    }
  }, [withdrawInfo.amount, withdrawInfo.arriveTime, withdrawInfo.network.network, withdrawInfo.symbol]);

  return (
    <CommonModalAutoScreen {...modalProps} hideCancelButton okText="Got it">
      <div className={clsx('etransfer-ui-flex-column', 'etransfer-ui-withdraw-success-modal-container')}>
        <div className={clsx('etransfer-ui-flex-column-center', 'etransfer-ui-withdraw-success-modal-title-wrapper')}>
          <div className={clsx('etransfer-ui-flex-center', 'etransfer-ui-withdraw-success-modal-title-icon')}>
            <CheckFilledIcon />
            <CommonSvg type="checkFilled" />
          </div>
          <div className={'etransfer-ui-withdraw-success-modal-title'}>Withdrawal Request Submitted</div>
        </div>
        <div className={clsx('etransfer-ui-flex-column-center', 'etransfer-ui-withdraw-success-modal-content')}>
          <div className={'etransfer-ui-withdraw-success-modal-label'}>
            Amount to Be Received on {withdrawInfo.network.name}
          </div>
          <div className={'etransfer-ui-withdraw-success-modal-value'}>
            <span className={'etransfer-ui-withdraw-success-modal-value-center'}>
              {withdrawInfo.receiveAmount || DEFAULT_NULL_VALUE} {withdrawInfo.symbol}
            </span>
            <div className={clsx('etransfer-ui-withdraw-success-modal-receive-amount-usd')}>
              {valueFixed2LessThanMin(withdrawInfo.receiveAmountUsd, '$ ')}
            </div>
          </div>
        </div>
        <div className={'etransfer-ui-withdraw-success-modal-divider'} />
        <div className={clsx('etransfer-ui-flex-column', 'etransfer-ui-withdraw-success-modal-detail')}>
          <div className={'etransfer-ui-withdraw-success-modal-detail-row'}>
            <div className={'etransfer-ui-withdraw-success-modal-label'}>Withdrawal Amount</div>
            <div className={'etransfer-ui-withdraw-success-modal-value'}>
              {withdrawInfo.amount} {withdrawInfo.symbol}
            </div>
          </div>
          <div className={'etransfer-ui-withdraw-success-modal-detail-row'}>
            <div className={'etransfer-ui-withdraw-success-modal-label'}>Arrival Time</div>
            <div className={'etransfer-ui-withdraw-success-modal-value'}>≈ {arrivalTime}</div>
          </div>
        </div>
      </div>
    </CommonModalAutoScreen>
  );
}
