import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ComponentStyle } from '../../types';
import HistoryMobile from './HistoryMobile';
import HistoryWeb from './HistoryWeb';
import { RecordsRequestStatus, RecordsRequestType, TRecordsListItem } from '@etransfer/types';
import { useEffectOnce } from 'react-use';
import { etransferEvents, sleep } from '@etransfer/utils';
import { etransferCore, getAuth, setLoading } from '../../utils';
import moment from 'moment';
import { END_TIME_FORMAT, START_TIME_FORMAT } from '../../constants';
import { useDebounceCallback } from '../../hooks';
import { HistoryFilterOnApplyParams } from './types';

export default function History({
  className,
  componentStyle = ComponentStyle.Web,
  isUnreadHistory,
  isShowMobilePoweredBy,
  onClickHistoryItem,
}: {
  className?: string;
  isUnreadHistory: boolean;
  componentStyle?: ComponentStyle;
  isShowMobilePoweredBy?: boolean;
  onClickHistoryItem?: (id: string) => void;
}) {
  const isMobileStyle = useMemo(() => componentStyle === ComponentStyle.Mobile, [componentStyle]);
  const [type, setType] = useState(RecordsRequestType.All);
  const [status, setStatus] = useState(RecordsRequestStatus.All);
  const [timestamp, setTimestamp] = useState<number[] | null>(null);
  const [recordsList, setRecordsList] = useState<TRecordsListItem[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [maxResultCount, setMaxResultCount] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [skipCount, setSkipCount] = useState(1);

  const requestRecordsList = useDebounceCallback(async (isLoading = false) => {
    try {
      const isHaveJWT = getAuth();
      if (!isHaveJWT) return;

      isLoading && setLoading(true);
      const startTimestampFormat = timestamp?.[0] && moment(timestamp?.[0]).format(START_TIME_FORMAT);
      const endTimestampFormat = timestamp?.[1] && moment(timestamp?.[1]).format(END_TIME_FORMAT);
      const startTimestamp = startTimestampFormat ? moment(startTimestampFormat).valueOf() : null;
      const endTimestamp = endTimestampFormat ? moment(endTimestampFormat).valueOf() : null;

      const { items: recordsListRes, totalCount } = await etransferCore.services.getRecordsList({
        type,
        status,
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
        skipCount: (skipCount - 1) * maxResultCount,
        maxResultCount,
      });

      if (isMobileStyle) {
        let mobileRecordsList = [...recordsList, ...recordsListRes];
        mobileRecordsList = mobileRecordsList.reduce((result: TRecordsListItem[], item) => {
          if (!result.some((it: TRecordsListItem) => it.id === item.id)) {
            result.push(item);
          }
          return result;
        }, []);
        setRecordsList(mobileRecordsList);
      } else {
        setRecordsList(recordsListRes);
      }
      setTotalCount(totalCount);
      // recordsList is load all and hasMore set false
      if (recordsListRes.length < maxResultCount) {
        setHasMore(false);
      }
    } catch (error) {
      console.log('records', error);
    } finally {
      setLoading(false);

      await sleep(1000);
      etransferEvents.UpdateNewRecordStatus.emit();
    }
  }, []);
  const requestRecordsListRef = useRef(requestRecordsList);
  requestRecordsListRef.current = requestRecordsList;

  const handleTypeChange = useCallback((type: RecordsRequestType) => {
    setType(type);
    setSkipCount(1);
    requestRecordsListRef.current(true);
  }, []);

  const handleStatusChange = useCallback((status: RecordsRequestStatus) => {
    setStatus(status);
    setSkipCount(1);
    requestRecordsListRef.current(true);
  }, []);

  const handleTimeStampChange = useCallback((timeArray: number[] | null) => {
    setTimestamp(timeArray);
    setSkipCount(1);
    requestRecordsListRef.current(true);
  }, []);

  const handleCloseItem = useCallback((clickType: string) => {
    switch (clickType) {
      case 'type':
        setType(RecordsRequestType.All);
        break;
      case 'status':
        setStatus(RecordsRequestStatus.All);
        break;
      case 'timestamp':
        setTimestamp(null);
        break;
      default:
        break;
    }

    setSkipCount(1);
    setRecordsList([]);
    requestRecordsListRef.current();
  }, []);

  const handleReset = useCallback(() => {
    setType(RecordsRequestType.All);
    setStatus(RecordsRequestStatus.All);
    setTimestamp(null);

    setSkipCount(1);
    if (isMobileStyle) {
      setRecordsList([]);
    }
    requestRecordsListRef.current(true);
  }, [isMobileStyle]);

  const handleApply = useCallback((params: HistoryFilterOnApplyParams) => {
    setType(params.type);
    setStatus(params.status);
    setTimestamp(params.timeArray);

    setSkipCount(1);
    setRecordsList([]);
    requestRecordsListRef.current();
  }, []);

  const handleNextPage = useDebounceCallback(() => {
    if (hasMore && skipCount <= Math.ceil(totalCount / maxResultCount)) {
      setSkipCount(skipCount + 1);
      requestRecordsList();
    } else {
      setHasMore(false);
    }
  }, []);

  const handleTableChange = (page: number, pageSize: number) => {
    if (page !== skipCount) {
      setSkipCount(page);
    }
    if (maxResultCount !== pageSize) {
      // pageSize change and skipCount need init 1
      setSkipCount(1);
      setMaxResultCount(pageSize);
    }
    requestRecordsListRef.current();
  };

  const init = useCallback(() => {
    if (isUnreadHistory) {
      handleReset();
    } else {
      requestRecordsListRef.current(true);
    }
  }, [handleReset, isUnreadHistory]);

  const initRef = useRef(init);
  initRef.current = init;

  useEffect(() => {
    console.log('getWithdrawData - isLogin', getAuth());
    const isHaveJWT = !!getAuth();
    if (isHaveJWT) {
      initRef.current();
    } else {
      setSkipCount(1);
      setRecordsList([]);
    }
  }, []);

  const refreshData = useCallback(() => {
    requestRecordsListRef.current(true);
  }, []);
  useEffectOnce(() => {
    // Listener login
    const { remove: authTokenSuccessRemove } = etransferEvents.AuthTokenSuccess.addListener(() => refreshData());

    // Listener unread records
    const { remove: refreshHistoryDataRemove } = etransferEvents.RefreshHistoryData.addListener(() => handleReset());

    return () => {
      authTokenSuccessRemove();
      refreshHistoryDataRemove();
    };
  });

  return isMobileStyle ? (
    <HistoryMobile
      className={className}
      isShowPoweredBy={isShowMobilePoweredBy}
      type={type}
      status={status}
      timestamp={timestamp}
      onCloseItem={handleCloseItem}
      onReset={handleReset}
      onApply={handleApply}
      onClickItem={onClickHistoryItem}
      onNextPage={handleNextPage}
      recordsList={recordsList}
      hasMore={hasMore}
      maxResultCount={maxResultCount}
      totalCount={totalCount}
      skipCount={skipCount}
    />
  ) : (
    <HistoryWeb
      className={className}
      type={type}
      status={status}
      timestamp={timestamp}
      onReset={handleReset}
      recordsList={recordsList}
      hasMore={hasMore}
      maxResultCount={maxResultCount}
      totalCount={totalCount}
      skipCount={skipCount}
      onTypeChange={handleTypeChange}
      onStatusChange={handleStatusChange}
      onTimeStampChange={handleTimeStampChange}
      onClickItem={onClickHistoryItem}
      onTableChange={handleTableChange}
    />
  );
}
