'use client';
import {
  AelfReact,
  AppName,
  NETWORK_TYPE_V1,
  WEB_LOGIN_CONNECT_URL_V2,
  WEB_LOGIN_GRAPHQL_URL_V1,
  WEB_LOGIN_GRAPHQL_URL_V2,
  WEB_LOGIN_REQUEST_URL_V2,
  NETWORK_TYPE_V2,
  WEB_LOGIN_SERVICE_URL_V1,
  WEB_LOGIN_SERVICE_URL_V2,
  SupportedChainId,
} from '@/constants';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { EtransferLogoIconBase64 } from '@/constants/wallet';

const WalletProviderDynamic = dynamic(
  async () => {
    const WalletProvider = await import('./walletProvider').then(module => module);
    return WalletProvider;
  },
  { ssr: false },
);

const WebLoginPortkeyProvider = dynamic(
  async () => {
    const { PortkeyProvider } = await import('aelf-web-login').then(module => module);
    return PortkeyProvider;
  },
  { ssr: false },
);

const WebLoginProviderDynamic = dynamic(
  async () => {
    const webLogin = await import('aelf-web-login').then(module => module);

    webLogin.setGlobalConfig({
      appName: AppName,
      chainId: SupportedChainId.sideChain,
      // networkType: NETWORK_TYPE_V1,
      portkey: {
        useLocalStorage: true,
        graphQLUrl: WEB_LOGIN_GRAPHQL_URL_V1,
        requestDefaults: {
          baseURL: WEB_LOGIN_SERVICE_URL_V1,
        },
      },
      onlyShowV2: true,
      portkeyV2: {
        useLocalStorage: true,
        graphQLUrl: WEB_LOGIN_GRAPHQL_URL_V2,
        networkType: NETWORK_TYPE_V2,
        connectUrl: WEB_LOGIN_CONNECT_URL_V2,
        requestDefaults: {
          baseURL: WEB_LOGIN_SERVICE_URL_V2,
          timeout: 20000, // NETWORK_NAME === NetworkName.testnet ? 300000 : 80000
        },
        serviceUrl: WEB_LOGIN_REQUEST_URL_V2,
      },
      aelfReact: {
        appName: AppName,
        nodes: AelfReact,
      },
      defaultRpcUrl: AelfReact[SupportedChainId.sideChain].rpcUrl,
    });
    return webLogin.WebLoginProvider;
  },
  { ssr: false },
);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WebLoginPortkeyProvider networkType={NETWORK_TYPE_V1} networkTypeV2={NETWORK_TYPE_V2}>
      <WebLoginProviderDynamic
        nightElf={{
          useMultiChain: false,
          connectEagerly: false,
        }}
        portkey={{
          design: 'SocialDesign',
          autoShowUnlock: false,
          checkAccountInfoSync: true,
        }}
        commonConfig={{
          showClose: true,
          iconSrc: EtransferLogoIconBase64,
          title: 'Log In to ETransfer',
        }}
        extraWallets={['discover']}
        discover={{
          autoRequestAccount: true,
          autoLogoutOnDisconnected: true,
          autoLogoutOnNetworkMismatch: true,
          autoLogoutOnAccountMismatch: true,
          autoLogoutOnChainMismatch: true,
          // onPluginNotFound: (openStore) => {
          //   console.log('openStore:', openStore);
          // },
        }}>
        <WalletProviderDynamic>{children}</WalletProviderDynamic>
      </WebLoginProviderDynamic>
    </WebLoginPortkeyProvider>
  );
}
