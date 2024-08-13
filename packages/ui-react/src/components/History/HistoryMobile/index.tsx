import HistoryMobileFilter from '../HistoryMobileFilter';
import HistoryMobileInfiniteList from '../HistoryMobileInfiniteList';
import { HistoryContentProps, HistoryFilterProps } from '../types';
import './index.less';

export default function HistoryMobile({
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
    <div className="etransfer-ui-history-mobile">
      <HistoryMobileFilter type={type} status={status} timestamp={timestamp} onReset={onReset} />
      <HistoryMobileInfiniteList
        recordsList={recordsList}
        hasMore={hasMore}
        maxResultCount={maxResultCount}
        totalCount={totalCount}
        skipCount={skipCount}
      />
    </div>
  );
}
