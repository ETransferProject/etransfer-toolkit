import { FairyVaultDiscoverWallet } from '@aelf-web-login/wallet-adapter-fairy-vault-discover';
import { PortkeyDiscoverWallet } from '@aelf-web-login/wallet-adapter-portkey-discover';
import { PortkeyInnerWallet } from '@aelf-web-login/wallet-adapter-portkey-web';
import { NightElfWallet } from '@aelf-web-login/wallet-adapter-night-elf';
import { IBaseConfig, IConfigProps } from '@aelf-web-login/wallet-adapter-bridge';
import { SignInDesignEnum } from '@aelf-web-login/wallet-adapter-base';
import {
  APP_NAME,
  AelfReact,
  NETWORK_TYPE,
  SupportedChainId,
  TELEGRAM_BOT_ID,
  WebLoginConnectUrl,
  WebLoginGraphqlUrl,
  WebLoginServiceUrl,
} from '@/constants/index';

export const didConfig = {
  graphQLUrl: WebLoginGraphqlUrl,
  connectUrl: WebLoginConnectUrl,
  serviceUrl: WebLoginServiceUrl,
  requestDefaults: {
    baseURL: WebLoginServiceUrl,
    timeout: 20000,
  },
  socialLogin: {
    Telegram: {
      botId: TELEGRAM_BOT_ID,
    },
  },
  networkType: NETWORK_TYPE,
};

const baseConfig: IBaseConfig = {
  showVconsole: true,
  networkType: NETWORK_TYPE,
  chainId: SupportedChainId.sideChain,
  sideChainId: SupportedChainId.sideChain,
  // keyboard: true,
  // noCommonBaseModal: false,
  design: SignInDesignEnum.CryptoDesign,
  enableAcceleration: true,
  appName: APP_NAME,
  theme: 'light',
};

const portkeyInnerWallet = new PortkeyInnerWallet({
  networkType: NETWORK_TYPE,
  chainId: SupportedChainId.sideChain,
  disconnectConfirm: true,
});

const portkeyDiscoverWallet = new PortkeyDiscoverWallet({
  networkType: NETWORK_TYPE,
  chainId: SupportedChainId.sideChain,
  autoRequestAccount: true,
  autoLogoutOnDisconnected: true,
  autoLogoutOnNetworkMismatch: true,
  autoLogoutOnAccountMismatch: true,
  autoLogoutOnChainMismatch: true,
});

const fairyVaultDiscoverWallet = new FairyVaultDiscoverWallet({
  networkType: NETWORK_TYPE,
  chainId: SupportedChainId.sideChain,
  autoRequestAccount: true, // If set to true, please contact Portkey to add whitelist
  autoLogoutOnDisconnected: true,
  autoLogoutOnNetworkMismatch: true,
  autoLogoutOnAccountMismatch: true,
  autoLogoutOnChainMismatch: true,
});

const nightElfWallet = new NightElfWallet({
  chainId: SupportedChainId.sideChain,
  appName: APP_NAME,
  connectEagerly: true,
  defaultRpcUrl: AelfReact[SupportedChainId.sideChain].rpcUrl,
  nodes: AelfReact,
});

export const config: IConfigProps = {
  // didConfig,
  baseConfig,
  wallets: [portkeyInnerWallet, portkeyDiscoverWallet, fairyVaultDiscoverWallet, nightElfWallet],
};
