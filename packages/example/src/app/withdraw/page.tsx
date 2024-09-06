'use client';

import { useSetUserInfo } from '@/hooks/setUserInfo';
import { CommonSpace, ComponentStyle, Withdraw, ETransferWithdrawProvider, useScreenSize } from '@etransfer/ui-react';
import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
  const router = useRouter();
  const { isPadPX } = useScreenSize();

  useSetUserInfo();

  return (
    <ETransferWithdrawProvider>
      <CommonSpace direction={'vertical'} size={24} />
      <Withdraw
        componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web}
        onClickProcessingTip={() => router.push('/history')}
        onActionChange={data => {
          console.log('>>>>>> withdraw component data', data);
        }}
      />
    </ETransferWithdrawProvider>
  );
}
