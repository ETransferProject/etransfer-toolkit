'use client';

import { CommonSpace, ComponentStyle, Deposit, ETransferDepositProvider } from '@etransfer/ui-react';

export default function DepositPage() {
  return (
    <ETransferDepositProvider>
      <CommonSpace direction={'vertical'} size={24} />
      <Deposit componentStyle={ComponentStyle.Mobile} />
    </ETransferDepositProvider>
  );
}
