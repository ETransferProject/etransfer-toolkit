import HistoryWebFilter from '../HistoryWebFilter';
import HistoryWebTable from '../HistoryWebTable';
import { HistoryContentProps, HistoryFilterProps } from '../types';
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
  onReset,
}: HistoryFilterProps & HistoryContentProps) {
  return (
    <div className="etransfer-ui-history-web">
      <HistoryWebFilter type={type} status={status} timestamp={timestamp} onReset={onReset} />
      <HistoryWebTable
        recordsList={recordsList}
        hasMore={hasMore}
        maxResultCount={maxResultCount}
        totalCount={totalCount}
        skipCount={skipCount}
      />
    </div>
  );
}
