'use client';
import React from 'react';
import { ConfigProvider } from 'antd';
import '@portkey/did-ui-react/dist/assets/index.css';
import WebLoginProvider from './webLoginProvider';

export default function RootProviders({ children }: { children?: React.ReactNode }) {
  return (
    <ConfigProvider autoInsertSpaceInButton={false}>
      <WebLoginProvider>{children}</WebLoginProvider>
    </ConfigProvider>
  );
}
