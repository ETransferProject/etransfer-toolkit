'use client';

import { ComponentStyle, Deposit, ETransferDepositProvider } from '@etransfer/ui-react';

export default function DepositPage() {
  return (
    <ETransferDepositProvider
      depositTokenSymbol={'USDT'}
      receiveTokenSymbol={'USDT'}
      chainItem={{ key: 'tDVW', label: 'sideChain tDVW' }}>
      <Deposit componentStyle={ComponentStyle.Mobile} />
    </ETransferDepositProvider>
  );
}
