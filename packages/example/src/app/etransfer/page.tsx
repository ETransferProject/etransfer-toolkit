'use client';

import { useSetUserInfo } from '@/hooks/setUserInfo';
import { CommonSpace, ComponentStyle, ETransferContent, useScreenSize } from '@etransfer/ui-react';

export default function HistoryPage() {
  const { isPadPX } = useScreenSize();
  useSetUserInfo();

  return (
    <>
      <CommonSpace direction={'vertical'} size={24} />
      <ETransferContent componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web} />
    </>
  );
}
