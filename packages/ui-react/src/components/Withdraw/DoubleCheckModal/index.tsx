import clsx from 'clsx';
import './index.less';
import { TNetworkItem, TFeeItem } from '@etransfer/types';
import { DEFAULT_NULL_VALUE } from '../../../constants';
import { formatSymbolDisplay } from '../../../utils';
import { valueFixed2LessThanMin } from '@etransfer/utils';
import PartialLoading from '../../PartialLoading';
import CommonModalAutoScreen, { CommonModalAutoScreenProps } from '../../CommonModalAutoScreen';
import { ComponentStyle } from '../../../types';

export interface DoubleCheckModalProps {
  withdrawInfo: {
    receiveAmount: string;
    address?: string;
    memo?: string;
    network?: Partial<TNetworkItem>;
    amount: string;
    transactionFee: TFeeItem;
    aelfTransactionFee: TFeeItem;
    symbol: string;
    amountUsd: string;
    receiveAmountUsd: string;
    feeUsd: string;
  };
  modalProps: CommonModalAutoScreenProps;
  isTransactionFeeLoading: boolean;
  componentStyle?: ComponentStyle;
}

export default function DoubleCheckModal({
  componentStyle = ComponentStyle.Web,
  withdrawInfo,
  modalProps,
  isTransactionFeeLoading,
}: DoubleCheckModalProps) {
  const renderAmountToBeReceived = () => {
    return (
      <>
        {isTransactionFeeLoading && <PartialLoading />}
        <span className={clsx('etransfer-ui-withdraw-double-check-modal-receive-amount')}>
          {!isTransactionFeeLoading && `${withdrawInfo.receiveAmount || DEFAULT_NULL_VALUE} `}
          {formatSymbolDisplay(withdrawInfo.symbol)}
        </span>
      </>
    );
  };

  return (
    <CommonModalAutoScreen
      {...modalProps}
      title="Withdrawal Information"
      isOkButtonDisabled={isTransactionFeeLoading || !withdrawInfo.receiveAmount}
      componentStyle={componentStyle}>
      <div className="etransfer-ui-withdraw-double-check-modal">
        <div
          className={clsx(
            'etransfer-ui-flex-column-center',
            'etransfer-ui-withdraw-double-check-modal-receive-amount-wrapper',
          )}>
          <span className={'etransfer-ui-withdraw-double-check-modal-label'}>Amount to Be Received</span>
          <span className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-withdraw-double-check-modal-value')}>
            {renderAmountToBeReceived()}
          </span>
          <div className={clsx('etransfer-ui-withdraw-double-check-modal-receive-amount-usd')}>
            {valueFixed2LessThanMin(withdrawInfo.receiveAmountUsd, '$ ')}
          </div>
        </div>
        <div className={'etransfer-ui-withdraw-double-check-modal-divider'} />
        <div className={clsx('etransfer-ui-flex-column', 'etransfer-ui-withdraw-double-check-modal-detail-wrapper')}>
          <div className={'etransfer-ui-withdraw-double-check-modal-detail-row'}>
            <div className={'etransfer-ui-withdraw-double-check-modal-label'}>Withdrawal Address</div>
            <div className={'etransfer-ui-withdraw-double-check-modal-value'}>
              {withdrawInfo.address || DEFAULT_NULL_VALUE}
            </div>
          </div>
          {withdrawInfo.memo && (
            <div className={'etransfer-ui-withdraw-double-check-modal-detail-row'}>
              <div className={'etransfer-ui-withdraw-double-check-modal-label'}>Comment</div>
              <div className={'etransfer-ui-withdraw-double-check-modal-value'}>{withdrawInfo.memo}</div>
            </div>
          )}
          <div
            className={clsx(
              'etransfer-ui-withdraw-double-check-modal-detail-row',
              'etransfer-ui-withdraw-double-check-modal-withdrawal-network-wrapper',
            )}>
            <div className={'etransfer-ui-withdraw-double-check-modal-label'}>Withdrawal Network</div>
            <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-withdraw-double-check-modal-value')}>
              {componentStyle === ComponentStyle.Mobile ? (
                withdrawInfo.network?.name
              ) : (
                <>
                  <span>{withdrawInfo.network?.network}</span>
                  <span className={'etransfer-ui-withdraw-double-check-modal-secondary-value'}>
                    {withdrawInfo.network?.name}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className={'etransfer-ui-withdraw-double-check-modal-detail-row'}>
            <div className={'etransfer-ui-withdraw-double-check-modal-label'}>Withdraw Amount</div>
            <div className={'etransfer-ui-withdraw-double-check-modal-value'}>
              <div className={'etransfer-ui-withdraw-double-check-modal-value-content'}>
                {`${withdrawInfo.amount || DEFAULT_NULL_VALUE}`}
                <span className={'etransfer-ui-withdraw-double-check-modal-value-symbol'}>
                  {formatSymbolDisplay(withdrawInfo.symbol)}
                </span>
              </div>

              <div className={clsx('etransfer-ui-withdraw-double-check-modal-amount-usd')}>
                {valueFixed2LessThanMin(withdrawInfo.amountUsd, '$ ')}
              </div>
            </div>
          </div>
          <div
            className={clsx(
              'etransfer-ui-withdraw-double-check-modal-detail-row',
              'etransfer-ui-withdraw-double-check-modal-transaction-fee-wrapper',
            )}>
            <div className={'etransfer-ui-withdraw-double-check-modal-label'}>Estimated Gas Fee</div>
            <div
              className={clsx(
                'etransfer-ui-flex-row',
                'etransfer-ui-withdraw-double-check-modal-value',
                'etransfer-ui-withdraw-double-check-modal-fee-usd-box',
              )}>
              <span className={clsx('etransfer-ui-flex-1', 'etransfer-ui-withdraw-double-check-modal-fee-value')}>
                {withdrawInfo.aelfTransactionFee?.amount}
              </span>
              &nbsp;{withdrawInfo.aelfTransactionFee?.currency}
            </div>
          </div>
          <div
            className={clsx(
              'etransfer-ui-withdraw-double-check-modal-detail-row',
              'etransfer-ui-withdraw-double-check-modal-transaction-fee-wrapper',
            )}>
            <div className={'etransfer-ui-withdraw-double-check-modal-label'}>Transaction Fee</div>
            <div
              className={clsx(
                'etransfer-ui-flex-column',
                'etransfer-ui-withdraw-double-check-modal-value',
                'etransfer-ui-withdraw-double-check-modal-fee-usd-box',
              )}>
              <div className="etransfer-ui-flex-row-center">
                <span className={clsx('etransfer-ui-flex-1', 'etransfer-ui-withdraw-double-check-modal-fee-value')}>
                  {withdrawInfo.transactionFee?.amount}
                </span>
                &nbsp;{withdrawInfo.transactionFee?.currency}
              </div>

              <div className={clsx('etransfer-ui-withdraw-double-check-modal-fee-usd')}>
                {valueFixed2LessThanMin(withdrawInfo.feeUsd, '$ ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonModalAutoScreen>
  );
}
