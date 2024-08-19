import { Divider } from 'antd';
import HistoryMobileFilter from '../HistoryMobileFilter';
import HistoryMobileInfiniteList from '../HistoryMobileInfiniteList';
import { HistoryMobileContentProps, HistoryMobileFilterProps } from '../types';
import './index.less';
import EmptyData from '../../EmptyData';
import { LOGIN_TO_VIEW_HISTORY, NO_HISTORY_FOUND } from '../../../constants';
import { getAuth } from '../../../utils';

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
      <Divider className="etransfer-ui-history-mobile-divider" />
      {recordsList?.length > 0 ? (
        <HistoryMobileInfiniteList
          recordsList={recordsList}
          hasMore={hasMore}
          maxResultCount={maxResultCount}
          totalCount={totalCount}
          skipCount={skipCount}
          onNextPage={onNextPage}
        />
      ) : (
        <EmptyData emptyText={!getAuth() ? LOGIN_TO_VIEW_HISTORY : NO_HISTORY_FOUND} />
      )}
    </div>
  );
}
