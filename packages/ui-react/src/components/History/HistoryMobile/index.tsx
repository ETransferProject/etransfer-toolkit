import HistoryMobileFilter from '../HistoryMobileFilter';
import HistoryMobileInfiniteList from '../HistoryMobileInfiniteList';
import { HistoryMobileContentProps, HistoryMobileFilterProps } from '../types';
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
  onCloseItem,
  onReset,
  onApply,
  onNextPage,
}: HistoryMobileFilterProps & HistoryMobileContentProps) {
  return (
    <div className="etransfer-ui-history-mobile">
      <HistoryMobileFilter
        type={type}
        status={status}
        timestamp={timestamp}
        onCloseItem={onCloseItem}
        onReset={onReset}
        onApply={onApply}
      />
      <HistoryMobileInfiniteList
        recordsList={recordsList}
        hasMore={hasMore}
        maxResultCount={maxResultCount}
        totalCount={totalCount}
        skipCount={skipCount}
        onNextPage={onNextPage}
      />
    </div>
  );
}
