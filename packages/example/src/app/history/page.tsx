'use client';

import { CommonSpace, ComponentStyle, History, useScreenSize } from '@etransfer/ui-react';

export default function HistoryPage() {
  const { isPadPX } = useScreenSize();

  return (
    <>
      <CommonSpace direction={'vertical'} size={24} />
      <History componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web} isUnreadHistory={false} />
    </>
  );
}
