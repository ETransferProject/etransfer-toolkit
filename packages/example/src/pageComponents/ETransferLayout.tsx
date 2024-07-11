'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ETransferConfig, ETransferLayoutProvider, ETransferStyleProvider } from '@etransfer/ui-react';
const GetAuth = dynamic(() => import('@/pageComponents/login'), { ssr: false });

export default function ETransferLayout({ children }: { children: React.ReactNode }) {
  ETransferConfig.setConfig({
    depositConfig: {
      defaultDepositToken: 'ELF',
      supportDepositTokens: ['USDT', 'ELF'],
      defaultReceiveToken: 'ELF',
      supportReceiveTokens: ['USDT', 'ELF'],
      defaultChainId: 'tDVW',
      supportChainIds: ['tDVW'],
      defaultNetwork: 'SETH',
      supportNetworks: ['SETH'],
    },
    authorization: {
      jwt: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ2RDhDN0NDNzM4QUEyQjlBRjBFNzhBNENCNEI2RDNEQzkwMzI1QzciLCJ4NXQiOiJSdGpIekhPS29ybXZEbmlreTB0dFBja0RKY2MiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJlYTczM2E2Yi03ZWI4LTQ1ZDItYmM2NC1mMjEzZjk1MDBlYmQiLCJvaV9wcnN0IjoiRVRyYW5zZmVyU2VydmVyX0FwcCIsImNsaWVudF9pZCI6IkVUcmFuc2ZlclNlcnZlcl9BcHAiLCJvaV90a25faWQiOiIxNTZmZDdlNC05NjQ2LWI1Y2UtZGVkNy0zYTEzYjM3OTExOTAiLCJhdWQiOiJFVHJhbnNmZXJTZXJ2ZXIiLCJzY29wZSI6IkVUcmFuc2ZlclNlcnZlciIsImp0aSI6ImI3NzAxMjMyLTc2NzktNGRmNy05MGY2LTQ4Zjg3YTQ1MTM0ZCIsImV4cCI6MTcyMDg2NTg0NCwiaXNzIjoiaHR0cDovLzE3Mi4zMS41LjI0NDo4MDExLyIsImlhdCI6MTcyMDY5MzA0NX0.F2ToZlzNRaZDuq3YGfRavrEg-OdrWdWlGoNTtLwaJZ8xOTgiSOxUF3VNtkIJFrBCCx91t5YBhomL3YpXoUSBg5xjnfHJBqIDTQeXEvvJ8BQZZHhmy2cHHjR3Mvo_drv2dcKG_hPrRcTBLanGprb00c4UpKAwXjIU2QcsGCHXhtVm2Cpn9WHz0Z1JNbTaNxmge4yOQmUN0K3h80b3FQuRrVSLaVloAGVYL25c7q8afGEHe8ZQxXsUUCTxWFZR3tASx_Jtk7Ma0FYPlnSveuJU1q9VaAb8T9LViTzNav4-6tUautl_1xu4-6B4XnNWyH9j2WybBTOK8HUbGWmVw71Z7Q',
    },
    networkType: 'TESTNET',
  });

  return (
    <ETransferStyleProvider>
      <ETransferLayoutProvider>
        <GetAuth />
        {children}
      </ETransferLayoutProvider>
    </ETransferStyleProvider>
  );
}
