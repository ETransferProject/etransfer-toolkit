'use client';

import { useSetUserInfo } from '@/hooks/setUserInfo';
import { CommonSpace, ComponentStyle, Withdraw, ETransferWithdrawProvider, useScreenSize } from '@etransfer/ui-react';

export default function WithdrawPage() {
  const { isPadPX } = useScreenSize();
  useSetUserInfo();

  return (
    <ETransferWithdrawProvider>
      <CommonSpace direction={'vertical'} size={24} />
      <Withdraw componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web} depositProcessingCount={8} />
    </ETransferWithdrawProvider>
  );
}
