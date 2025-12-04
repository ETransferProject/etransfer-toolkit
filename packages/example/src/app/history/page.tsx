'use client';

import { CommonSpace, ComponentStyle, History, useScreenSize, TransferDetail } from '@etransfer/ui-react';
import { useCallback, useState } from 'react';

export default function HistoryPage() {
  const { isPadPX } = useScreenSize();

  const [isShowDetail, setIsShowDetail] = useState(false);
  const [detailId, setDetailId] = useState('');

  const handleClickHistoryItem = useCallback((id: string) => {
    setDetailId(id);
    setIsShowDetail(true);
  }, []);
  const handleBackToHistory = useCallback(() => {
    setIsShowDetail(false);
    setDetailId('');
  }, []);

  return !isShowDetail ? (
    <>
      <CommonSpace direction={'vertical'} size={24} />
      <History
        componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web}
        isUnreadHistory={false}
        onClickHistoryItem={handleClickHistoryItem}
        onActionChange={data => {
          console.log('>>>>>> history component data', data);
        }}
      />
    </>
  ) : (
    <>
      <CommonSpace direction={'vertical'} size={24} />
      <TransferDetail
        orderId={detailId}
        isShowBackElement={true}
        componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web}
        onBack={handleBackToHistory}
      />
    </>
  );
}
