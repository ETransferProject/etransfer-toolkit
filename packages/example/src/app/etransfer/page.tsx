'use client';

import { CommonSpace, ComponentStyle, ETransferContent, useScreenSize } from '@etransfer/ui-react';

export default function HistoryPage() {
  const { isPadPX } = useScreenSize();

  return (
    <>
      <CommonSpace direction={'vertical'} size={24} />
      <ETransferContent componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web} />
    </>
  );
}
