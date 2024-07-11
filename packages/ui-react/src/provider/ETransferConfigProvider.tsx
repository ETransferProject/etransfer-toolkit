import { ConfigKey, ETransferConfigProps, ETransferConfigProviderProps } from './types';
// import { CHAIN_INFO as AELF_CHAIN_INFO } from '../constants/platform/AELF';
// import { CHAIN_INFO as tDVV_CHAIN_INFO } from '../constants/platform/tDVV';
import { BaseAsyncStorage } from '../utils/BaseAsyncStorage';
import { etransferCore } from '../utils/core';
// import { CHAIN_ID, DEFAULT_CHAIN_ID, TokenType } from '../constants';

const defaultConfig: ETransferConfigProps = {
  // depositConfig: {
  //   defaultChainId: DEFAULT_CHAIN_ID,
  //   supportChainIds: [CHAIN_ID.tDVV, CHAIN_ID.AELF],
  //   defaultDepositToken: TokenType.USDT,
  //   defaultReceiveToken: TokenType.USDT,
  // },
  // withdrawConfig: {
  //   defaultChainId: DEFAULT_CHAIN_ID,
  //   supportChainIds: [CHAIN_ID.tDVV, CHAIN_ID.AELF],
  //   defaultToken: TokenType.USDT,
  // },
  // aelfReact: {
  //   nodes: {
  //     AELF: {
  //       rpcUrl: AELF_CHAIN_INFO.rpcUrl,
  //       exploreUrl: AELF_CHAIN_INFO.exploreUrl,
  //     },
  //     tDVV: {
  //       rpcUrl: tDVV_CHAIN_INFO.rpcUrl,
  //       exploreUrl: tDVV_CHAIN_INFO.exploreUrl,
  //     },
  //   },
  // },
  networkType: 'MAINNET',
};

class ETransferConfigProvider implements ETransferConfigProviderProps {
  public config: ETransferConfigProps;

  constructor(config: ETransferConfigProps) {
    this.config = config;
  }

  getAllConfig = () => {
    return this.config;
  };

  getConfig = (key: ConfigKey) => {
    return this.config?.[key];
  };

  setConfig = (_config: Partial<ETransferConfigProps>) => {
    if (('storage' in _config && _config.storage) || !this.config.storage) {
      const storage = _config.storage || new BaseAsyncStorage();

      etransferCore.setStorage(storage);
    }

    if ('etransferUrl' in _config) {
      etransferCore.setBaseUrl(_config['etransferUrl']);
    }

    if ('etransferAuthUrl' in _config) {
      etransferCore.setAuthUrl(_config['etransferAuthUrl']);
    }

    if ('authorization' in _config && _config['authorization']?.jwt) {
      etransferCore.services.setRequestHeaders('Authorization', _config['authorization'].jwt);
    }

    this.config = { ...this.config, ..._config };
  };
}

export const ETransferConfig = new ETransferConfigProvider(defaultConfig);
