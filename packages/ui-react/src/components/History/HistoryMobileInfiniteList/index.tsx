import clsx from 'clsx';
import './index.less';
import { Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { HistoryMobileContentProps } from '../types';
import { BusinessType, TRecordsListItem } from '@etransfer/types';
import { THistoryItem } from '../types';
import AddressBox from '../AddressBox';
import AmountBox from '../AmountBox';
import ArrivalTimeBox from '../ArrivalTimeBox';
import FeeInfo from '../FeeInfo';
import StatusBox from '../StatusBox';
import TxHashBox from '../TxHashBox';
import { ComponentStyle } from '../../../types';
import { BusinessTypeLabel, COBO_CUSTODY, LOADING_TEXT, NO_DATA_TEXT } from '../../../constants';

const componentStyle = ComponentStyle.Mobile;

export default function HistoryMobileInfiniteList({
  recordsList,
  hasMore,
  maxResultCount,
  totalCount,
  skipCount,
  onNextPage,
  onClickItem,
}: HistoryMobileContentProps) {
  const handleRecordListData = (recordsList: TRecordsListItem[]) => {
    if (recordsList.length === 0) {
      return [];
    }

    const recordsTableList: THistoryItem[] = [];

    recordsList?.map((item) => {
      const { id, orderType, status, arrivalTime, fromTransfer, toTransfer } = item;
      recordsTableList.push({
        key: id,
        orderType,
        status,
        arrivalTime,
        symbol: fromTransfer.symbol,
        sendingAmount: fromTransfer.amount,
        receivingAmount: toTransfer.amount,
        fromNetwork: fromTransfer.network,
        fromAddress: fromTransfer.fromAddress,
        fromToAddress: fromTransfer.toAddress,
        fromChainId: fromTransfer.chainId,
        fromTxId: fromTransfer.txId,
        toSymbol: toTransfer.symbol,
        toNetwork: toTransfer.network,
        toFromAddress: toTransfer.fromAddress,
        toAddress: toTransfer.toAddress,
        toChainId: toTransfer.chainId,
        toTxId: toTransfer.txId,
        feeInfo: toTransfer.feeInfo,
      });
    });

    return recordsTableList;
  };

  return (
    <div className={clsx('etransfer-ui-history-mobile-infinite-list')} id={'etransferHistoryMobileInfiniteList'}>
      <InfiniteScroll
        dataLength={recordsList.length}
        next={onNextPage}
        hasMore={skipCount <= Math.ceil(totalCount / maxResultCount)}
        scrollableTarget="etransferHistoryMobileInfiniteList"
        loader={
          <h4 className={clsx('etransfer-ui-history-mobile-infinite-list-loader-message')}>
            {hasMore ? LOADING_TEXT : NO_DATA_TEXT}
          </h4>
        }
        endMessage={
          <p className={clsx('etransfer-ui-history-mobile-infinite-list-end-message')}>
            <b>{NO_DATA_TEXT}</b>
          </p>
        }>
        {handleRecordListData(recordsList)?.map((recordItem: THistoryItem) => {
          return (
            <div
              className={clsx('etransfer-ui-history-mobile-infinite-item-wrapper')}
              key={recordItem.key}
              onClick={() => onClickItem?.(recordItem.key)}>
              <div className={clsx('etransfer-ui-history-mobile-infinite-item-header')}>
                <StatusBox
                  status={recordItem.status}
                  network={recordItem.fromNetwork}
                  componentStyle={componentStyle}
                />
                <span className={clsx('etransfer-ui-history-mobile-infinite-item-order-type')}>
                  {recordItem.orderType === BusinessType.Withdraw ? BusinessTypeLabel.Withdraw : recordItem.orderType}
                </span>
              </div>
              <Divider />
              <div className="etransfer-ui-history-mobile-infinite-item-line">
                <span className="etransfer-ui-history-mobile-infinite-item-label">Arrival Time</span>
                <ArrivalTimeBox
                  arrivalTime={recordItem.arrivalTime}
                  status={recordItem.status}
                  componentStyle={componentStyle}
                />
              </div>
              <div className="etransfer-ui-history-mobile-infinite-item-line">
                <span className="etransfer-ui-history-mobile-infinite-item-label">Amount Sent</span>
                <AmountBox
                  amount={recordItem.sendingAmount}
                  token={recordItem.symbol}
                  componentStyle={componentStyle}
                />
              </div>
              <div className="etransfer-ui-history-mobile-infinite-item-line">
                <span className="etransfer-ui-history-mobile-infinite-item-label">Amount Received</span>
                <AmountBox
                  amount={recordItem.receivingAmount}
                  token={recordItem.toSymbol}
                  fromToken={recordItem.symbol}
                  status={recordItem.status}
                  componentStyle={componentStyle}
                />
              </div>
              <div className="etransfer-ui-history-mobile-infinite-item-line">
                <span className="etransfer-ui-history-mobile-infinite-item-label">From</span>
                <AddressBox
                  type={'From'}
                  fromAddress={recordItem.fromAddress}
                  toAddress={recordItem.toAddress}
                  network={recordItem.fromNetwork}
                  fromChainId={recordItem.fromChainId}
                  toChainId={recordItem.toChainId}
                  accounts={{
                    AELF: undefined,
                    tDVV: undefined,
                    tDVW: undefined,
                  }}
                  componentStyle={componentStyle}
                />
              </div>
              <div className="etransfer-ui-history-mobile-infinite-item-line">
                <span className="etransfer-ui-history-mobile-infinite-item-label">From Hash</span>
                <TxHashBox
                  isShowIcon={false}
                  type="From"
                  orderType={recordItem.orderType}
                  orderStatus={recordItem.status}
                  chainId={recordItem.fromChainId}
                  txHash={recordItem.fromTxId}
                  network={recordItem.fromNetwork}
                  componentStyle={componentStyle}
                  isCoboHash={recordItem.fromAddress === COBO_CUSTODY || recordItem.fromToAddress === COBO_CUSTODY}
                />
              </div>
              <div className="etransfer-ui-history-mobile-infinite-item-line">
                <span className="etransfer-ui-history-mobile-infinite-item-label">To</span>
                <AddressBox
                  type={'To'}
                  fromAddress={recordItem.fromAddress}
                  toAddress={recordItem.toAddress}
                  network={recordItem.toNetwork}
                  fromChainId={recordItem.fromChainId}
                  toChainId={recordItem.toChainId}
                  accounts={{
                    AELF: undefined,
                    tDVV: undefined,
                    tDVW: undefined,
                  }}
                  componentStyle={componentStyle}
                />
              </div>
              <div className="etransfer-ui-history-mobile-infinite-item-line">
                <span className="etransfer-ui-history-mobile-infinite-item-label">To Hash</span>
                <TxHashBox
                  isShowIcon={false}
                  type="To"
                  orderType={recordItem.orderType}
                  orderStatus={recordItem.status}
                  chainId={recordItem.toChainId}
                  txHash={recordItem.toTxId}
                  network={recordItem.toNetwork}
                  componentStyle={componentStyle}
                  isCoboHash={recordItem.toAddress === COBO_CUSTODY || recordItem.toFromAddress === COBO_CUSTODY}
                />
              </div>
              <div className="etransfer-ui-history-mobile-infinite-item-fee">
                <span className="etransfer-ui-history-mobile-infinite-item-label">Transaction Fee</span>
                <FeeInfo
                  feeInfo={recordItem.feeInfo || []}
                  status={recordItem.status}
                  orderType={recordItem.orderType}
                  componentStyle={componentStyle}
                />
              </div>
              <Divider className="etransfer-ui-history-mobile-infinite-list-divider-style" />
            </div>
          );
        })}
      </InfiniteScroll>
    </div>
  );
}
