import { Divider } from 'antd';
import HistoryMobileFilter from '../HistoryMobileFilter';
import HistoryMobileInfiniteList from '../HistoryMobileInfiniteList';
import { HistoryMobileContentProps, HistoryMobileFilterProps } from '../types';
import './index.less';
import EmptyData from '../../EmptyData';
import { LOGIN_TO_VIEW_HISTORY, NO_HISTORY_FOUND } from '../../../constants';
import { getAuth } from '../../../utils';
import CommonSvg from '../../CommonSvg';
import clsx from 'clsx';

export default function HistoryMobile({
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
  isShowPoweredBy = false,
  onCloseItem,
  onReset,
  onApply,
  onNextPage,
}: HistoryMobileFilterProps &
  HistoryMobileContentProps & { filterClassName?: string; contentClassName?: string; isShowPoweredBy?: boolean }) {
  return (
    <div className={clsx('etransfer-ui-history-mobile', className)}>
      <div>
        <HistoryMobileFilter
          className={filterClassName}
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
            className={contentClassName}
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
      {isShowPoweredBy && (
        <CommonSvg type="poweredBy" className="etransfer-ui-flex-center etransfer-ui-mobile-bottom-powered-by" />
      )}
    </div>
  );
}
