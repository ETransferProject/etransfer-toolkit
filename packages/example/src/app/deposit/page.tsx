'use client';

import { CommonSpace, ComponentStyle, Deposit, ETransferDepositProvider } from '@etransfer/ui-react';

export default function DepositPage() {
  return (
    <ETransferDepositProvider
      depositTokenSymbol={'USDT'}
      receiveTokenSymbol={'SGR-1'}
      chainItem={{ key: 'tDVW', label: 'sideChain tDVW' }}>
      <CommonSpace direction={'vertical'} size={24} />
      <Deposit componentStyle={ComponentStyle.Mobile} />
    </ETransferDepositProvider>
  );
}
