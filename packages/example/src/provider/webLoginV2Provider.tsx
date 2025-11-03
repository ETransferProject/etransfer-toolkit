'use client';

import React, { useMemo } from 'react';
import { WebLoginProvider } from '@aelf-web-login/wallet-adapter-react';
import { did } from '@portkey/did';
import { getConfig, didConfig } from './webLoginV2Config';
import { checkConnectedWallet } from '@/utils/portkey';

export default function WebLoginV2Providers({ children }: { children: React.ReactNode }) {
  useMemo(() => {
    did.setConfig(didConfig);
    checkConnectedWallet();
  }, []);
  const config = useMemo(() => getConfig(), []);

  return <WebLoginProvider config={config}>{children}</WebLoginProvider>;
}
