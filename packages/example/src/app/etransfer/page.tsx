'use client';

import { useQueryAuthToken } from '@/hooks/authToken';
import { useSetUserInfo } from '@/hooks/setUserInfo';
import { ComponentStyle, ETransferContent, useScreenSize } from '@etransfer/ui-react';
import { useCallback } from 'react';

export default function ETransferPage() {
  const { isPadPX } = useScreenSize();

  const { getAuthToken } = useQueryAuthToken();
  const fetchAuthToken = useCallback(async () => {
    await getAuthToken();
  }, [getAuthToken]);

  useSetUserInfo();

  return (
    <>
      <ETransferContent
        customDepositDescriptionNode={<div>Custom Deposit Description</div>}
        componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web}
        onLifeCycleChange={(liftCycle, data) => {
          console.log('>>>>>> onLifeCycleChange:', liftCycle, data);
        }}
        onLogin={fetchAuthToken}
      />
    </>
  );
}
