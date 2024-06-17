import React from 'react';
import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';
import Provider from '@/provider';
import 'aelf-web-login/dist/assets/index.css';
import './globals.css';
import dynamic from 'next/dynamic';
const GetAuth = dynamic(() => import('@/pageComponents/login'), { ssr: false });

export const metadata: Metadata = {
  title: 'ETransfer toolkit example',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#285eff',
                colorPrimaryActive: '#1e52f0',
                colorPrimaryHover: '#3b6cff',
                colorError: '#f53f3f',
                colorText: '#1a1a1a',
                colorTextSecondary: '#808080',
                colorTextDisabled: '#d6d6d6',
                colorBorder: '#e0e0e0',
                colorSplit: '#f0f0f0',
              },
            }}>
            <GetAuth />
            {children}
          </ConfigProvider>
        </Provider>
      </body>
    </html>
  );
}
