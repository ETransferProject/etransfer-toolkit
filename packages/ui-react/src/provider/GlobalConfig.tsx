import { GlobalConfigProps } from './types';
import { CHAIN_INFO as AELF_CHAIN_INFO } from '../constants/platform/AELF';
import { CHAIN_INFO as tDVV_CHAIN_INFO } from '../constants/platform/tDVV';
import { BaseAsyncStorage } from '../utils/BaseAsyncStorage';
import { etransferCore } from '../utils/core';

const defaultConfig: GlobalConfigProps = {
  aelfReact: {
    nodes: {
      AELF: {
        rpcUrl: AELF_CHAIN_INFO.rpcUrl,
        exploreUrl: AELF_CHAIN_INFO.exploreUrl,
      },
      tDVV: {
        rpcUrl: tDVV_CHAIN_INFO.rpcUrl,
        exploreUrl: tDVV_CHAIN_INFO.exploreUrl,
      },
    },
  },
};

type ConfigKey = keyof GlobalConfigProps;

class GlobalConfigProvider {
  config: GlobalConfigProps;

  constructor(config: GlobalConfigProps) {
    this.config = config;
  }

  getGlobalConfig = () => {
    return this.config;
  };

  getConfig = (key: ConfigKey) => {
    return this.config?.[key];
  };

  setGlobalConfig = (_config: Partial<GlobalConfigProps>) => {
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

    this.config = { ...this.config, ..._config };
  };
}

export const globalConfigProvider = new GlobalConfigProvider(defaultConfig);
