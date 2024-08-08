'use client';

import { CommonSpace, ComponentStyle, Withdraw, ETransferWithdrawProvider, useScreenSize } from '@etransfer/ui-react';

export default function DepositPage() {
  const { isPadPX } = useScreenSize();

  return (
    <ETransferWithdrawProvider>
      <CommonSpace direction={'vertical'} size={24} />
      <Withdraw componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web} />
    </ETransferWithdrawProvider>
  );
}
