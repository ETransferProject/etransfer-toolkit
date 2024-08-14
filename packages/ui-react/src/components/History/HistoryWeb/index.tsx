import HistoryWebFilter from '../HistoryWebFilter';
import HistoryWebTable from '../HistoryWebTable';
import { HistoryWebContentProps, HistoryWebFilterProps } from '../types';
import './index.less';

export default function HistoryWeb({
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
  onTableChange,
}: HistoryWebFilterProps & HistoryWebContentProps) {
  return (
    <div className="etransfer-ui-history-web">
      <HistoryWebFilter
        type={type}
        status={status}
        timestamp={timestamp}
        onReset={onReset}
        onTypeChange={onTypeChange}
        onStatusChange={onStatusChange}
        onTimeStampChange={onTimeStampChange}
      />
      <HistoryWebTable
        recordsList={recordsList}
        hasMore={hasMore}
        maxResultCount={maxResultCount}
        totalCount={totalCount}
        skipCount={skipCount}
        onTableChange={onTableChange}
      />
    </div>
  );
}
