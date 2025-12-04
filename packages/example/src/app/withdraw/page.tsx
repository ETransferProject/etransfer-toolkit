'use client';

import { useQueryAuthToken } from '@/hooks/authToken';
import { useSetUserInfo } from '@/hooks/setUserInfo';
import { CommonSpace, ComponentStyle, Withdraw, ETransferWithdrawProvider, useScreenSize } from '@etransfer/ui-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function WithdrawPage() {
  const router = useRouter();
  const { isPadPX } = useScreenSize();

  const { getAuthToken } = useQueryAuthToken();
  const fetchAuthToken = useCallback(async () => {
    await getAuthToken();
  }, [getAuthToken]);

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
        onLogin={fetchAuthToken}
      />
    </ETransferWithdrawProvider>
  );
}
