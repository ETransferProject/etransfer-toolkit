import clsx from 'clsx';
import './index.less';
import { TTransferDetailBodyData } from '../types';
import { ComponentStyle } from '../../../types';
import { useMemo } from 'react';
import { BusinessType, OrderStatusEnum } from '@etransfer/types';
import { getOmittedStr } from '@etransfer/utils';
import { formatSymbolDisplay, viewTxDetailInExplore } from '../../../utils';
import { BusinessTypeLabel, DEFAULT_NULL_VALUE } from '../../../constants';
import FromOrToChain from '../FromOrToChain';
import TokenAmount from '../TokenAmount';
import { TransferStatus } from '../TransferStatus';
import WalletAddress from '../WalletAddress';
import { formatPastTime } from '../../../utils';
import { TRANSFER_DETAIL_LABEL } from '../../../constants/transfer';
import { useScreenSize } from '../../../hooks';

export default function TransferDetailBody({
  componentStyle,
  data,
  className,
}: {
  componentStyle?: ComponentStyle;
  data: TTransferDetailBodyData;
  className?: string;
}) {
  const { isMobilePX } = useScreenSize();
  const isMobileStyle = useMemo(() => {
    return componentStyle === ComponentStyle.Mobile && isMobilePX;
  }, [componentStyle, isMobilePX]);

  const orderType = useMemo(() => {
    return data.orderType === BusinessType.Withdraw ? BusinessTypeLabel.Withdraw : data.orderType;
  }, [data.orderType]);

  return (
    <div className={clsx('etransfer-ui-transfer-detail-body', className)}>
      {isMobileStyle ? (
        <>
          <div className={'etransfer-ui-transfer-detail-item'}>
            <div className={'etransfer-ui-transfer-detail-label etransfer-ui-transfer-detail-value-type'}>
              {orderType}
            </div>
            <div className={clsx('etransfer-ui-transfer-detail-value', 'etransfer-ui-transfer-detail-value-time')}>
              {formatPastTime(data.createTime)}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={'etransfer-ui-transfer-detail-item'}>
            <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.Type}</div>
            <div className={clsx('etransfer-ui-transfer-detail-value', 'etransfer-ui-transfer-detail-value-type')}>
              {data.orderType === BusinessType.Withdraw ? BusinessTypeLabel.Withdraw : data.orderType}
            </div>
          </div>

          <div className={'etransfer-ui-transfer-detail-item'}>
            <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.CreateTime}</div>
            <div className={clsx('etransfer-ui-transfer-detail-value', 'etransfer-ui-transfer-detail-value-time')}>
              {formatPastTime(data.createTime)}
            </div>
          </div>
        </>
      )}

      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.TransactionFee}</div>
        <div className={clsx('etransfer-ui-transfer-detail-value', 'detail-value-fee')}>
          {data.status === OrderStatusEnum.Failed
            ? DEFAULT_NULL_VALUE
            : data.orderType === BusinessType.Withdraw
            ? `${data.toFeeInfo[0].amount} ${formatSymbolDisplay(data.toFeeInfo[0].symbol)}`
            : 'Free'}
        </div>
      </div>

      <div className={'etransfer-ui-transfer-detail-divider'} />

      {/* ======== Source Info ======== */}
      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.SourceTxHash}</div>
        {data.fromTxId ? (
          <div
            className={clsx('etransfer-ui-transfer-detail-value', 'etransfer-ui-transfer-detail-value-from-tx-hash')}
            onClick={() => viewTxDetailInExplore(data.fromNetwork, data.fromTxId, data.fromChainId)}>
            {isMobileStyle ? getOmittedStr(data.fromTxId, 8, 9) : data.fromTxId}
          </div>
        ) : (
          DEFAULT_NULL_VALUE
        )}
      </div>

      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.SourceChain}</div>
        <FromOrToChain network={data.fromNetwork} chainId={data.fromChainId} />
      </div>

      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>
          {`${data.orderType} ${TRANSFER_DETAIL_LABEL.Amount}`}
        </div>
        <TokenAmount
          status={data.fromStatus}
          amount={data.fromAmount}
          amountUsd={data.fromAmountUsd}
          symbol={data.fromSymbol}
          icon={data?.fromIcon}
        />
      </div>

      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>
          {`${data.orderType} ${TRANSFER_DETAIL_LABEL.Address}`}
        </div>
        <WalletAddress
          address={data.fromAddress}
          chainId={data.fromChainId}
          network={data.fromNetwork}
          isOmitAddress={isMobileStyle ? true : false}
          className={
            isMobileStyle
              ? 'etransfer-ui-transfer-detail-value-wallet-address'
              : 'etransfer-ui-transfer-detail-value-wallet-address-web'
          }
        />
      </div>

      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.Status}</div>
        <TransferStatus status={data.fromStatus} />
      </div>

      <div className={'etransfer-ui-transfer-detail-divider'} />

      {/* ======== Destination Info ======== */}
      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.DestinationTxHash}</div>
        {data.toTxId ? (
          <div
            className={clsx('etransfer-ui-transfer-detail-value', 'etransfer-ui-transfer-detail-value-to-tx-hash')}
            onClick={() => viewTxDetailInExplore(data.toNetwork, data.toTxId, data.toChainId)}>
            {isMobileStyle ? getOmittedStr(data.toTxId, 8, 9) : data.toTxId}
          </div>
        ) : (
          DEFAULT_NULL_VALUE
        )}
      </div>

      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.DestinationChain}</div>
        <FromOrToChain network={data.toNetwork} chainId={data.toChainId} />
      </div>

      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.ReceiveAmount}</div>
        <TokenAmount
          status={data.toStatus}
          amount={data.toAmount}
          amountUsd={data.toAmountUsd}
          symbol={data.toSymbol}
          fromSymbol={data.fromSymbol}
          icon={data?.toIcon}
        />
      </div>

      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.ReceiveAddress}</div>
        <WalletAddress
          address={data.toAddress}
          chainId={data.toChainId}
          network={data.toNetwork}
          isOmitAddress={isMobileStyle ? true : false}
          className={
            isMobileStyle
              ? 'etransfer-ui-transfer-detail-value-wallet-address'
              : 'etransfer-ui-transfer-detail-value-wallet-address-web'
          }
        />
      </div>

      <div className={'etransfer-ui-transfer-detail-item'}>
        <div className={'etransfer-ui-transfer-detail-label'}>{TRANSFER_DETAIL_LABEL.Status}</div>
        <TransferStatus status={data.toStatus} />
      </div>
    </div>
  );
}
