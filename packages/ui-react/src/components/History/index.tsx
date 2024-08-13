import { useCallback, useState } from 'react';
import { ComponentStyle } from '../../types';
import HistoryMobile from './HistoryMobile';
import HistoryWeb from './HistoryWeb';
import { RecordsRequestStatus, RecordsRequestType, TRecordsListItem } from '@etransfer/types';

export default function History({ componentStyle = ComponentStyle.Web }: { componentStyle?: ComponentStyle }) {
  const [type, setType] = useState(RecordsRequestType.All);
  const [status, setStatus] = useState(RecordsRequestStatus.All);
  const [timestamp, setTimestamp] = useState<number[] | null>(null);
  const [recordsList, setRecordsList] = useState<TRecordsListItem[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [maxResultCount, setMaxResultCount] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);

  const handleReset = useCallback(() => {
    console.log('reset');
  }, []);

  return componentStyle === ComponentStyle.Mobile ? (
    <HistoryMobile
      type={type}
      status={status}
      timestamp={timestamp}
      onReset={handleReset}
      recordsList={recordsList}
      hasMore={hasMore}
      maxResultCount={maxResultCount}
      totalCount={totalCount}
      skipCount={skipCount}
    />
  ) : (
    <HistoryWeb
      type={type}
      status={status}
      timestamp={timestamp}
      onReset={handleReset}
      recordsList={recordsList}
      hasMore={hasMore}
      maxResultCount={maxResultCount}
      totalCount={totalCount}
      skipCount={skipCount}
    />
  );
}
