'use client';

import { useSetUserInfo } from '@/hooks/setUserInfo';
import { CommonSpace, ComponentStyle, Deposit, ETransferDepositProvider, useScreenSize } from '@etransfer/ui-react';
import { useRouter } from 'next/navigation';

export default function DepositPage() {
  const router = useRouter();
  const { isPadPX } = useScreenSize();

  useSetUserInfo();

  return (
    <ETransferDepositProvider>
      <CommonSpace direction={'vertical'} size={24} />
      <Deposit
        componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web}
        onClickProcessingTip={() => router.push('/history')}
      />
    </ETransferDepositProvider>
  );
}
