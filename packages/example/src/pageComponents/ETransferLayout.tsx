'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ETransferConfig, ETransferProvider, ETransferStyleProvider } from '@etransfer/ui-react';
const GetAuth = dynamic(() => import('@/pageComponents/login'), { ssr: false });

export default function ETransferLayout({ children }: { children: React.ReactNode }) {
  ETransferConfig.setConfig({
    depositConfig: {
      defaultChainId: 'tDVW',
      supportChainId: ['tDVW', 'AELF'],
    },
    authorization: {
      jwt: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ2RDhDN0NDNzM4QUEyQjlBRjBFNzhBNENCNEI2RDNEQzkwMzI1QzciLCJ4NXQiOiJSdGpIekhPS29ybXZEbmlreTB0dFBja0RKY2MiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJkOTc0NDY5NS02ZGFjLTQ2ZjgtOWFlYi05MTBkZjU5ZjY3YjQiLCJvaV9wcnN0IjoiRVRyYW5zZmVyU2VydmVyX0FwcCIsImNsaWVudF9pZCI6IkVUcmFuc2ZlclNlcnZlcl9BcHAiLCJvaV90a25faWQiOiJhMmViZTVmOS04ODk1LWYzNGQtNTYyMS0zYTEzODk5MzdmNmMiLCJhdWQiOiJFVHJhbnNmZXJTZXJ2ZXIiLCJzY29wZSI6IkVUcmFuc2ZlclNlcnZlciIsImp0aSI6ImIzOGFkOWQyLTlkNjctNGEzMi1hODE3LTI2NzRlZWEzYzk2MCIsImV4cCI6MTcyMDE2MjkzMywiaXNzIjoiaHR0cDovLzE3Mi4zMS41LjI0NDo4MDExLyIsImlhdCI6MTcxOTk5MDEzNH0.HFUNiEmtOA0YQR8rbgs9KmHjp16_DegQJ4-Pq84kfijIxs4UPDxN9DUyzYTYi0dg0bgIEHEv7wMDXtFP7L1JW-TGmXfwhaT_m9Yb8W6V7AWins7CXAq4gd1fJtvWCpz5-7EeY75cZlJQDcVzBtp5HcaQe3Cvrx213ixn9ixSwZiJDyX1XZJFqTlgNSsbs8bnvjss0cRhWX_o4w1QfYdHAJxGQCbHT7hZ0Xm1Ddaubg1vKtcdEzmWBfjb9j6HMm3JNNovKVoqhEpoFzfHQJO2hP4aPkmMHCTX_0AZHaRb9BTUZ9m6Wirk1tZHQLu8IWNF5qDifUWs8zo0XRmrxZMyHg',
    },
  });

  return (
    <ETransferProvider networkType="TESTNET">
      <ETransferStyleProvider>
        <GetAuth />
        {children}
      </ETransferStyleProvider>
    </ETransferProvider>
  );
}
