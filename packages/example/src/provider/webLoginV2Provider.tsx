'use client';

import React from 'react';
import { WebLoginProvider } from '@aelf-web-login/wallet-adapter-react';
import { config } from './webLoginV2Config';

export default function WebLoginV2Providers({ children }: { children: React.ReactNode }) {
  return <WebLoginProvider config={config}>{children}</WebLoginProvider>;
}
