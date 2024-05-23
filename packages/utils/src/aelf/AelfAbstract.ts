import { ChainId } from '@portkey/types';
import { AELFInstances, IAelfAbstract } from '../types';

abstract class AelfAbstract implements IAelfAbstract {
  public instances: AELFInstances;
  public aelfSDK: any;

  constructor() {
    this.instances = {
      AELF: undefined,
      tDVV: undefined,
      tDVW: undefined,
    };
  }

  abstract setAelf(): any;

  getInstance = (chainId: ChainId, rpcUrl: string) => {
    if (this.instances[chainId]) {
      return this.instances[chainId];
    } else {
      const instance = this.aelfSDK.getAelfInstance(rpcUrl);
      this.instances[chainId] = instance;
      return instance;
    }
  };
}

export default AelfAbstract;
