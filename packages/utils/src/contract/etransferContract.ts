import AElf from 'aelf-sdk';
import { ChainId } from '@portkey/types';
import { createManagerForwardCall, getAElf, handleTransaction } from '../aelf';
import { CONTRACT_METHOD_NAME, MANAGER_FORWARD_CALL } from '../constants';

export interface CreateTransferTokenTransactionParams {
  caContractAddress: string;
  eTransferContractAddress: string;
  caHash: string;
  symbol: string;
  amount: string;
  chainId: ChainId;
  endPoint: string;
  fromManagerAddress: string;
  getSignature: (param: string) => Promise<string>;
}

export const createTransferTokenTransaction = async ({
  caContractAddress,
  eTransferContractAddress,
  caHash,
  symbol,
  amount,
  chainId,
  endPoint,
  fromManagerAddress,
  getSignature,
}: CreateTransferTokenTransactionParams) => {
  const managerForwardCall = await createManagerForwardCall({
    caContractAddress,
    contractAddress: eTransferContractAddress,
    caHash,
    methodName: CONTRACT_METHOD_NAME.TransferToken,
    args: { symbol, amount },
    chainId,
    endPoint,
  });

  const transactionParams = AElf.utils.uint8ArrayToHex(managerForwardCall);

  const aelf = getAElf(endPoint);
  const { BestChainHeight, BestChainHash } = await aelf.chain.getChainStatus();

  const transaction = await handleTransaction({
    blockHeightInput: BestChainHeight,
    blockHashInput: BestChainHash,
    packedInput: transactionParams,
    address: fromManagerAddress,
    contractAddress: caContractAddress,
    functionName: MANAGER_FORWARD_CALL,
    getSignature,
  });
  console.log('>>>>>> createTransferTokenTransaction transaction', transaction);
  return transaction;
};
