import './index.less';
import { Table } from 'antd';
import { BusinessType, TRecordsListItem } from '@etransfer/types';
import { NO_HISTORY_FOUND, LOGIN_TO_VIEW_HISTORY, BusinessTypeLabel, COBO_CUSTODY } from '../../../constants';
import AmountBox from '../AmountBox';
import ArrivalTimeBox from '../ArrivalTimeBox';
import FeeInfo from '../FeeInfo';
import FromAndToBox from '../FromAndToBox';
import StatusBox from '../StatusBox';
import { HistoryWebContentProps, THistoryFeeInfo, THistoryItem } from '../types';
import { ComponentStyle } from '../../../types';
import { getAccountInfo, getAuth } from '../../../utils';
import EmptyData from '../../EmptyData';
import clsx from 'clsx';

const componentStyle = ComponentStyle.Web;

const columns = [
  {
    title: 'Transaction',
    dataIndex: 'status',
    key: 'status',
    render: (status: string, record: THistoryItem) => {
      return <StatusBox status={status} network={record.fromNetwork} componentStyle={componentStyle} />;
    },
  },
  {
    title: 'Arrival Time',
    dataIndex: 'arrivalTime',
    key: 'arrivalTime',
    render: (arrivalTime: number, record: THistoryItem) => {
      return <ArrivalTimeBox arrivalTime={arrivalTime} status={record.status} componentStyle={componentStyle} />;
    },
  },
  {
    title: 'Method',
    dataIndex: 'orderType',
    key: 'orderType',
    render: (orderType: string) => {
      return (
        <div className="etransfer-ui-history-web-table-order-type">
          {orderType === BusinessType.Withdraw ? BusinessTypeLabel.Withdraw : orderType}
        </div>
      );
    },
  },
  {
    title: 'Amount Sent',
    dataIndex: 'sendingAmount',
    key: 'sendingAmount',
    render: (sendingAmount: string, record: THistoryItem) => {
      return <AmountBox amount={sendingAmount} token={record.symbol} componentStyle={componentStyle} />;
    },
  },
  {
    title: 'Amount Received',
    dataIndex: 'receivingAmount',
    key: 'receivingAmount',
    render: (receivingAmount: string, record: THistoryItem) => {
      return (
        <AmountBox
          amount={receivingAmount}
          token={record.toSymbol}
          status={record.status}
          fromToken={record.symbol}
          componentStyle={componentStyle}
        />
      );
    },
  },
  {
    title: 'From',
    dataIndex: 'fromAddress',
    key: 'fromAddress',
    render: (fromAddress: string, record: THistoryItem) => {
      return (
        <FromAndToBox
          type="From"
          fromAddress={fromAddress}
          toAddress={record.toAddress}
          network={record.fromNetwork}
          fromChainId={record.fromChainId}
          toChainId={record.toChainId}
          orderType={record.orderType}
          orderStatus={record.status}
          txHashLabel="Tx Hash"
          txHash={record.fromTxId}
          componentStyle={componentStyle}
          accounts={getAccountInfo().accounts}
          isCoboHash={record.fromAddress === COBO_CUSTODY || record.fromToAddress === COBO_CUSTODY}
        />
      );
    },
  },
  {
    title: 'To',
    dataIndex: 'toAddress',
    key: 'toAddress',
    render: (toAddress: string, record: THistoryItem) => {
      return (
        <FromAndToBox
          type="To"
          fromAddress={record.fromAddress}
          toAddress={toAddress}
          network={record.toNetwork}
          fromChainId={record.fromChainId}
          toChainId={record.toChainId}
          orderType={record.orderType}
          orderStatus={record.status}
          txHashLabel="Tx Hash"
          txHash={record.toTxId}
          componentStyle={componentStyle}
          accounts={getAccountInfo().accounts}
          isCoboHash={record.toAddress === COBO_CUSTODY || record.toFromAddress === COBO_CUSTODY}
        />
      );
    },
  },
  {
    title: 'Fee',
    dataIndex: 'feeInfo',
    key: 'feeInfo',
    render: (feeInfo: THistoryFeeInfo[], record: THistoryItem) => {
      return (
        <FeeInfo
          feeInfo={feeInfo}
          status={record.status}
          orderType={record.orderType}
          componentStyle={componentStyle}
        />
      );
    },
  },
];

export default function HistoryWebTable({
  className,
  recordsList,
  totalCount,
  skipCount,
  maxResultCount,
  onTableChange,
  onClickItem,
}: HistoryWebContentProps) {
  const handleRecordListData = (recordsList: TRecordsListItem[]) => {
    if (recordsList.length === 0) {
      return;
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
    <div className={clsx('etransfer-ui-history-web-table-wrapper', className)}>
      <Table
        size={'large'}
        rowKey={'key'}
        rowClassName={'etransfer-ui-history-web-table-row'}
        onRow={(record) => {
          return {
            onClick: () => onClickItem?.(record.key),
          };
        }}
        dataSource={handleRecordListData(recordsList)}
        columns={columns}
        scroll={{ x: 1020 }}
        locale={{
          emptyText: <EmptyData emptyText={!getAuth() ? LOGIN_TO_VIEW_HISTORY : NO_HISTORY_FOUND} />,
        }}
        pagination={
          totalCount > maxResultCount
            ? {
                current: skipCount,
                pageSize: maxResultCount,
                total: totalCount,
                onChange: onTableChange,
                showQuickJumper: true,
                showSizeChanger: true,
                showTitle: true,
                pageSizeOptions: ['10', '20', '50'],
              }
            : false
        }
      />
    </div>
  );
}
