'use client';

import { useQueryAuthToken } from '@/hooks/authToken';
import { useSetUserInfo } from '@/hooks/setUserInfo';
import { CommonSpace, ComponentStyle, Deposit, ETransferDepositProvider, useScreenSize } from '@etransfer/ui-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function DepositPage() {
  const router = useRouter();
  const { isPadPX } = useScreenSize();

  const { getAuthToken } = useQueryAuthToken();
  const fetchAuthToken = useCallback(async () => {
    await getAuthToken();
  }, [getAuthToken]);

  useSetUserInfo();

  return (
    <ETransferDepositProvider>
      <CommonSpace direction={'vertical'} size={24} />
      <Deposit
        componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web}
        onClickProcessingTip={() => {
          router.push('/history');
        }}
        onActionChange={data => {
          console.log('>>>>>> deposit component data', data);
        }}
        onConnect={fetchAuthToken}
      />
    </ETransferDepositProvider>
  );
}
