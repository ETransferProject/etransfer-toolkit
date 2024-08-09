'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ETransferConfig, ETransferLayoutProvider, ETransferStyleProvider } from '@etransfer/ui-react';
const GetAuth = dynamic(() => import('@/pageComponents/login'), { ssr: false });

export default function ETransferLayout({ children }: { children: React.ReactNode }) {
  ETransferConfig.setConfig({
    // authorization: {
    //   jwt: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjYxN0Y0N0E4NzgwODlCNEYxOTRDRUU0NjNBNTM1MDM5OEFCMEQzMUQiLCJ4NXQiOiJZWDlIcUhnSW0wOFpUTzVHT2xOUU9ZcXcweDAiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJlYTczM2E2Yi03ZWI4LTQ1ZDItYmM2NC1mMjEzZjk1MDBlYmQiLCJvaV9wcnN0IjoiRVRyYW5zZmVyU2VydmVyX0FwcCIsImNsaWVudF9pZCI6IkVUcmFuc2ZlclNlcnZlcl9BcHAiLCJvaV90a25faWQiOiI1ZGUwMGMyNi1iNzk2LTYxNTUtZTcxNS0zYTE0NDNlNzAzOWIiLCJhdWQiOiJFVHJhbnNmZXJTZXJ2ZXIiLCJzY29wZSI6IkVUcmFuc2ZlclNlcnZlciIsImp0aSI6IjE1NzhiMzdiLWM1ZjUtNDViNy1iMDljLTY3MGRiYWUyYjVhMCIsImV4cCI6MTcyMzI4ODk2OSwiaXNzIjoiaHR0cDovLzAuMC4wLjA6ODAxMS8iLCJpYXQiOjE3MjMxMTYxNzB9.OtEHQMSSW3XTmxMDbqLA2ACt4uOnC0AIp-qzSf1a2cFLRdUc3f9vaDxUrKXeXdJVL4Vr6ooHL3JJJFeuVkXzBwcWQatCn1jND-K_h6JQE9Vmdm1oO4qWBD8bn6OlPG3THBDJHhHaT-TMyQ7A_KUg4CWtoahj5M9INWwuel5wb2F0p-ydFoM5Rz_QGtL9blNYjgwgD0APGLoRVetD3ZljSObpGwIM605NYv8XYxUjdyxKW-zdBmTtgbStaWO4hAz7CFz4c_LDJK3jZ4KcQ809jjRzU1NqFmAbDFrGXG5ALBONUg_Srn8e6UCnYrLauZOBgWBeEXhR7jJRRKGA5BxpUA',
    // },
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
