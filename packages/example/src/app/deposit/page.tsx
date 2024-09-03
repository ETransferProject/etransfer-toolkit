'use client';

import { CommonSpace, ComponentStyle, Deposit, ETransferDepositProvider, useScreenSize } from '@etransfer/ui-react';

export default function DepositPage() {
  const { isPadPX } = useScreenSize();

  return (
    <ETransferDepositProvider>
      <CommonSpace direction={'vertical'} size={24} />
      <Deposit componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web} withdrawProcessingCount={9} />
    </ETransferDepositProvider>
  );
}
