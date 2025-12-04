import AElf from 'aelf-sdk';
import { ChainId } from '@portkey/types';
import { createManagerForwardCall, createTransferToken, getAElf, handleTransaction } from '../aelf';
import { CONTRACT_METHOD_NAME, MANAGER_FORWARD_CALL } from '../constants';
import { TGetSignatureFunc } from '../types';
import { TWalletType } from '@etransfer/types';

export interface CreateTransferTokenTransactionParams {
  caContractAddress: string;
  eTransferContractAddress: string;
  symbol: string;
  amount: string;
  chainId: ChainId;
  endPoint: string;
  fromManagerAddress: string;
  walletType?: TWalletType;
  caHash?: string;
  memo?: string;
  getSignature: TGetSignatureFunc;
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
  walletType,
  memo,
  getSignature,
}: CreateTransferTokenTransactionParams) => {
  let transactionParams: any;
  if (walletType === TWalletType.NightElf) {
    transactionParams = await createTransferToken({
      contractAddress: eTransferContractAddress,
      endPoint,
      chainId,
      args: { symbol, amount, memo },
    });
  } else {
    if (!caHash) throw new Error('User caHash is missing');
    transactionParams = await await createManagerForwardCall({
      caContractAddress,
      contractAddress: eTransferContractAddress,
      caHash,
      methodName: CONTRACT_METHOD_NAME.TransferToken,
      args: { symbol, amount, memo },
      chainId,
      endPoint,
    });
  }

  const packedInput = AElf.utils.uint8ArrayToHex(transactionParams);

  const aelf = getAElf(endPoint);
  const { BestChainHeight, BestChainHash } = await aelf.chain.getChainStatus();

  const transaction = await handleTransaction({
    blockHeightInput: BestChainHeight,
    blockHashInput: BestChainHash,
    packedInput,
    address: fromManagerAddress,
    contractAddress: walletType === TWalletType.NightElf ? eTransferContractAddress : caContractAddress,
    functionName: walletType === TWalletType.NightElf ? CONTRACT_METHOD_NAME.TransferToken : MANAGER_FORWARD_CALL,
    getSignature,
  });
  console.log('>>>>>> createTransferTokenTransaction transaction', transaction);
  return transaction;
};
