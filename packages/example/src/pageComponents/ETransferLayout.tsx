'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ETransferConfig, ETransferLayoutProvider, ETransferStyleProvider } from '@etransfer/ui-react';
const GetAuth = dynamic(() => import('@/pageComponents/login'), { ssr: false });

export default function ETransferLayout({ children }: { children: React.ReactNode }) {
  ETransferConfig.setConfig({
    authorization: {
      jwt: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkY1RTBDMjFCQTNDMEJGRjhFOEIzQjE5QTkzQUExRkE4NkMyRkY1NkQiLCJ4NXQiOiI5ZURDRzZQQXZfam9zN0dhazZvZnFHd3Y5VzAiLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI3ZWE0Y2JkMy1kMzg4LTQ0MjItODc0OS1jZmFkOWRlOWZlNGMiLCJvaV9wcnN0IjoiRVRyYW5zZmVyU2VydmVyX0FwcCIsImNsaWVudF9pZCI6IkVUcmFuc2ZlclNlcnZlcl9BcHAiLCJvaV90a25faWQiOiJmNjA2ZWU3YS1mYTcwLTQ3OTQtYzZjZC0zYTE0MjM4OWM4NjQiLCJhdWQiOiJFVHJhbnNmZXJTZXJ2ZXIiLCJzY29wZSI6IkVUcmFuc2ZlclNlcnZlciIsImp0aSI6Ijk5NzFlNmFhLTFhNWEtNDJmOC1hMDE0LTM3YmI0MjAzYzNiMiIsImV4cCI6MTcyMjc0NTk4OCwiaXNzIjoiaHR0cDovLzAuMC4wLjA6ODAxMS8iLCJpYXQiOjE3MjI1NzMxODl9.faaEeqbh8bQbSQHNP355_Bwrb93Qq_uNDrfMpBjcbPAapMbAk8jzrMENpCmbJCuixnxzu6zCf-Rv0rAm5HEIPyEn4HiUc5tQa3ks4PkmSkM5R9Zlxy4bPLE-nCiNn1aDTQtJVvW8AKxw9QJhS3nZOOak6si79FIVKDv6W93qIFqs1fe1x43zoYZJS0z6n93u7HofCtQJFAmIMgy3dXB8KCEVqJaW0vviUrQ3Q2v8HPZyhv09oehskpCL8sFLhDXxEWjCUSqMbxPvuh2p-aDQvMS1oY5n5aaFM0l6_E5zmbgWHLNkJHUeYFuszsDPoNFsjDXg_FFt-H9ANI4z-BhXVg',
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
