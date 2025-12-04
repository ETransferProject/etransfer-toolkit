import clsx from 'clsx';
import HistoryWebFilter from '../HistoryWebFilter';
import HistoryWebTable from '../HistoryWebTable';
import { HistoryWebContentProps, HistoryWebFilterProps } from '../types';
import './index.less';

export default function HistoryWeb({
  className,
  filterClassName,
  contentClassName,
  type,
  status,
  timestamp,
  recordsList,
  totalCount,
  skipCount,
  maxResultCount,
  hasMore,
  onTypeChange,
  onStatusChange,
  onTimeStampChange,
  onReset,
  onClickItem,
  onTableChange,
}: HistoryWebFilterProps & HistoryWebContentProps & { filterClassName?: string; contentClassName?: string }) {
  return (
    <div className={clsx('etransfer-ui-history-web', className)}>
      <HistoryWebFilter
        className={filterClassName}
        type={type}
        status={status}
        timestamp={timestamp}
        onReset={onReset}
        onTypeChange={onTypeChange}
        onStatusChange={onStatusChange}
        onTimeStampChange={onTimeStampChange}
      />
      <HistoryWebTable
        className={contentClassName}
        recordsList={recordsList}
        hasMore={hasMore}
        maxResultCount={maxResultCount}
        totalCount={totalCount}
        skipCount={skipCount}
        onClickItem={onClickItem}
        onTableChange={onTableChange}
      />
    </div>
  );
}
