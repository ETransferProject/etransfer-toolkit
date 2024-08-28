import { OrderStatusEnum, TGetRecordDetailResult } from '@etransfer/types';
import clsx from 'clsx';
import { formatSymbolDisplay } from '../../../utils';
import TransferDetailStep from '../TransferDetailStep';
import CommonSvg from '../../CommonSvg';
import { DEFAULT_NULL_VALUE } from '../../../constants';
import TransferDetailBody from '../TransferDetailBody';
import { ComponentStyle } from '../../../types';

export default function TransferDetailMain({
  componentStyle,
  data,
  className,
}: {
  componentStyle: ComponentStyle;
  data: TGetRecordDetailResult;
  className?: string;
}) {
  return (
    <div className={clsx('etransfer-ui-transfer-detail-main', className)}>
      {data.status === OrderStatusEnum.Processing && (
        <TransferDetailStep
          componentStyle={componentStyle}
          orderType={data.orderType}
          currentStep={data.step.currentStep}
          fromTransfer={{
            confirmingThreshold: data.step.fromTransfer.confirmingThreshold,
            confirmedNum: data.step.fromTransfer.confirmedNum,
            amount: data.fromTransfer.amount,
            symbol: data.fromTransfer.symbol,
            chainId: data.fromTransfer.chainId || data.fromTransfer.network,
          }}
          toTransfer={{
            amount: data.toTransfer.amount,
            symbol: data.toTransfer.symbol,
            chainId: data.toTransfer.chainId || data.toTransfer.network,
          }}
        />
      )}

      {data.status === OrderStatusEnum.Succeed && (
        <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-transfer-detail-main-received')}>
          <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-transfer-detail-main-label')}>
            <CommonSvg type="checkNotice" />
            <span>Received</span>
          </div>
          {data.toTransfer.amount && data.toTransfer.symbol ? (
            <div className={'etransfer-ui-transfer-detail-main-value-amount'}>{`${
              data.toTransfer.amount
            } ${formatSymbolDisplay(data.toTransfer.symbol)}`}</div>
          ) : (
            <div>{DEFAULT_NULL_VALUE}</div>
          )}
        </div>
      )}

      {data.status === OrderStatusEnum.Failed && (
        <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-transfer-detail-main-failed')}>
          <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-transfer-detail-main-label')}>
            <CommonSvg type="error" />
            <span>Failed</span>
          </div>
          {data.fromTransfer.amount && data.fromTransfer.symbol ? (
            <div className={'etransfer-ui-transfer-detail-main-value-amount'}>
              {`${data.fromTransfer.amount} ${formatSymbolDisplay(data.fromTransfer.symbol)}`}
            </div>
          ) : (
            <div>{DEFAULT_NULL_VALUE}</div>
          )}
        </div>
      )}

      <div className={'etransfer-ui-transfer-detail-main-divider'} />
      <TransferDetailBody
        componentStyle={componentStyle}
        data={{
          id: data.id,
          status: data.status,
          orderType: data.orderType,
          createTime: data.createTime,
          fromNetwork: data.fromTransfer.network,
          fromChainId: data.fromTransfer.chainId,
          fromSymbol: data.fromTransfer.symbol,
          fromIcon: data.fromTransfer?.icon,
          fromAddress: data.fromTransfer.fromAddress,
          fromAmount: data.fromTransfer.amount,
          fromAmountUsd: data.fromTransfer?.amountUsd || '',
          fromTxId: data.fromTransfer.txId,
          fromStatus: data.fromTransfer.status,
          toNetwork: data.toTransfer.network,
          toChainId: data.toTransfer.chainId,
          toSymbol: data.toTransfer.symbol,
          toIcon: data.toTransfer?.icon,
          toAddress: data.toTransfer.toAddress,
          toAmount: data.toTransfer.amount,
          toAmountUsd: data.toTransfer.amountUsd || '',
          toTxId: data.toTransfer.txId,
          toStatus: data.toTransfer.status,
          toFeeInfo: data.toTransfer.feeInfo,
        }}
      />
    </div>
  );
}
