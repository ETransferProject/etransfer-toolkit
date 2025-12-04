'use client';

import React from 'react';
import { ConfigProvider } from 'antd';
import '@portkey/did-ui-react/dist/assets/index.css';
import dynamic from 'next/dynamic';

const WebLoginProviderDynamic = dynamic(async () => {
  const WalletProvider = await import('./webLoginV2Provider').then(module => module);
  return WalletProvider;
});

export default function RootProviders({ children }: { children?: React.ReactNode }) {
  return (
    <ConfigProvider autoInsertSpaceInButton={false}>
      <WebLoginProviderDynamic>{children}</WebLoginProviderDynamic>
    </ConfigProvider>
  );
}
