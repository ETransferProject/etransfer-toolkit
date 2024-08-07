import { divDecimals, getBalance, getTokenContract, handleWebLoginErrorMessage } from '@etransfer/utils';
import singleMessage from '../components/SingleMessage';
import { CONTRACT_TYPE, NetworkType } from '../types';
import { ChainId } from '@portkey/types';
import * as AELF_Mainnet from '../constants/platform/AELF';
import * as tDVV_Mainnet from '../constants/platform/tDVV';
import * as AELF_Testnet from '../constants/platform/AELF_Testnet';
import * as tDVW_Testnet from '../constants/platform/tDVW_Testnet';
import { ETransferConfig } from '../provider/ETransferConfigProvider';

export const getAelfReact = (networkType: NetworkType, chainId: ChainId) => {
  if (networkType === 'TESTNET') {
    if (chainId === 'AELF') {
      // main chain
      return {
        endPoint: AELF_Testnet.CHAIN_INFO.rpcUrl,
        exploreUrl: AELF_Testnet.CHAIN_INFO.exploreUrl,
        contractAddress: {
          [CONTRACT_TYPE.CA]: AELF_Testnet.CA_CONTRACT_V2,
          [CONTRACT_TYPE.TOKEN]: AELF_Testnet.TOKEN_CONTRACT,
          [CONTRACT_TYPE.ETRANSFER]: AELF_Testnet.ETRANSFER_CONTRACT,
        },
      };
    }
    // side chain
    return {
      endPoint: tDVW_Testnet.CHAIN_INFO.rpcUrl,
      exploreUrl: tDVW_Testnet.CHAIN_INFO.exploreUrl,
      contractAddress: {
        [CONTRACT_TYPE.CA]: tDVW_Testnet.CA_CONTRACT_V2,
        [CONTRACT_TYPE.TOKEN]: tDVW_Testnet.TOKEN_CONTRACT,
        [CONTRACT_TYPE.ETRANSFER]: tDVW_Testnet.ETRANSFER_CONTRACT,
      },
    };
  } else {
    if (chainId === 'AELF') {
      // main chain
      return {
        endPoint: AELF_Mainnet.CHAIN_INFO.rpcUrl,
        exploreUrl: AELF_Mainnet.CHAIN_INFO.exploreUrl,
        contractAddress: {
          [CONTRACT_TYPE.CA]: AELF_Mainnet.CA_CONTRACT_V2,
          [CONTRACT_TYPE.TOKEN]: AELF_Mainnet.TOKEN_CONTRACT,
          [CONTRACT_TYPE.ETRANSFER]: AELF_Mainnet.ETRANSFER_CONTRACT,
        },
      };
    }
    // side chain
    return {
      endPoint: tDVV_Mainnet.CHAIN_INFO.rpcUrl,
      exploreUrl: tDVV_Mainnet.CHAIN_INFO.exploreUrl,
      contractAddress: {
        [CONTRACT_TYPE.CA]: tDVV_Mainnet.CA_CONTRACT_V2,
        [CONTRACT_TYPE.TOKEN]: tDVV_Mainnet.TOKEN_CONTRACT,
        [CONTRACT_TYPE.ETRANSFER]: tDVV_Mainnet.ETRANSFER_CONTRACT,
      },
    };
  }
};

export const getBalanceDivDecimals = async (
  endPoint: string,
  tokenContractAddress: string,
  accountAddress: string,
  symbol: string,
  decimals: string | number,
) => {
  try {
    if (!accountAddress) return '';

    const tokenContractOrigin = await getTokenContract(endPoint, tokenContractAddress);
    const maxBalance = await getBalance(tokenContractOrigin, symbol, accountAddress);

    return divDecimals(maxBalance, decimals).toFixed();
  } catch (error) {
    singleMessage.error(handleWebLoginErrorMessage(error));
    throw new Error('Failed to get balance.');
  }
};

export const getBalanceDivDecimalsAdapt = async (
  chainId: ChainId,
  accountAddress: string,
  symbol: string,
  decimals: string | number,
) => {
  const networkType = ETransferConfig.getConfig('networkType') as NetworkType;
  const aelfReact = getAelfReact(networkType, chainId);

  return await getBalanceDivDecimals(
    aelfReact.endPoint,
    aelfReact.contractAddress[CONTRACT_TYPE.TOKEN],
    accountAddress,
    symbol,
    decimals,
  );
};
