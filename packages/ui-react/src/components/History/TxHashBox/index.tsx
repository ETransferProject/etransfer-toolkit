import { useMemo } from 'react';
import clsx from 'clsx';
import './index.less';
import { OrderStatusEnum, BusinessType } from '@etransfer/types';
import { getOmittedStr } from '@etransfer/utils';
import { ChainId } from '@portkey/types';
import { ComponentStyle } from '../../../types';
import { DEFAULT_NULL_VALUE, HistoryStatusEnum } from '../../../constants';
import CommonSvg from '../../CommonSvg';
import { viewTxDetailInExplore } from '../../../utils';

export type TTxHashBoxProps = {
  txHashLabel?: string;
  chainId: ChainId;
  network: string;
  txHash: string;
  orderStatus: OrderStatusEnum;
  orderType: BusinessType;
  type: 'From' | 'To';
  isShowIcon?: boolean;
  componentStyle?: ComponentStyle;
};

export default function TxHashBox({
  txHashLabel,
  chainId,
  network,
  txHash,
  orderStatus,
  orderType,
  type,
  isShowIcon = true,
  componentStyle = ComponentStyle.Web,
}: TTxHashBoxProps) {
  const txHashSuccess = useMemo(() => {
    return (
      <span
        className={clsx(
          'etransfer-ui-history-tx-hash-box-value',
          componentStyle === ComponentStyle.Mobile
            ? 'etransfer-ui-history-tx-hash-box-mobile-font'
            : 'etransfer-ui-history-tx-hash-box-web-font',
        )}
        onClick={() => viewTxDetailInExplore(network, txHash, chainId)}>
        {getOmittedStr(txHash, 6, 6)}
      </span>
    );
  }, [chainId, componentStyle, network, txHash]);

  const txHashPending = useMemo(() => {
    return (
      <span className="etransfer-ui-history-tx-hash-box-null-value">
        {HistoryStatusEnum.Processing.toLocaleLowerCase()}
      </span>
    );
  }, []);

  const txHashFailed = useMemo(() => {
    return (
      <span className="etransfer-ui-history-tx-hash-box-null-value">
        {HistoryStatusEnum.Failed.toLocaleLowerCase()}
      </span>
    );
  }, []);

  const txHashNull = useMemo(() => {
    return <span className="etransfer-ui-history-tx-hash-box-null-value">{DEFAULT_NULL_VALUE}</span>;
  }, []);

  const renderTxHash = useMemo(() => {
    if (orderStatus === OrderStatusEnum.Failed && orderType !== BusinessType.Deposit) {
      return txHashFailed;
    }

    if (orderStatus === OrderStatusEnum.Failed && orderType === BusinessType.Deposit) {
      if (type === 'From') {
        return txHash ? txHashSuccess : txHashFailed;
      } else {
        return txHashFailed;
      }
    }

    if (orderStatus === OrderStatusEnum.Processing) {
      return txHash ? txHashSuccess : txHashPending;
    }

    // HistoryStatusEnum.Succeed
    return txHash ? txHashSuccess : txHashNull;
  }, [orderStatus, orderType, txHash, txHashFailed, txHashNull, txHashPending, txHashSuccess, type]);

  return (
    <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-history-tx-hash-box')}>
      {isShowIcon && <CommonSvg type="nextLine" />}
      {txHashLabel && (
        <span
          className={clsx(
            'etransfer-ui-history-tx-hash-box-label',
            componentStyle === ComponentStyle.Mobile
              ? 'etransfer-ui-history-tx-hash-box-mobile-font'
              : 'etransfer-ui-history-tx-hash-box-web-font',
          )}>
          {txHashLabel}
        </span>
      )}
      {renderTxHash}
    </div>
  );
}
