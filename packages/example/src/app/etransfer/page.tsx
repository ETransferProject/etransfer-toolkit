'use client';

import { useSetUserInfo } from '@/hooks/setUserInfo';
import { ComponentStyle, ETransferContent, useScreenSize } from '@etransfer/ui-react';

export default function ETransferPage() {
  const { isPadPX } = useScreenSize();
  useSetUserInfo();

  return (
    <>
      <ETransferContent componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web} />
    </>
  );
}
