import AElf from 'aelf-sdk';
import { sleep } from '../common';
import { SupportedChainId } from '@etransfer/types';
import { isValidBase58 } from '../reg';

const httpProviders: any = {};
export function getAElf(rpc: string) {
  if (!httpProviders[rpc]) httpProviders[rpc] = new AElf(new AElf.providers.HttpProvider(rpc));
  return httpProviders[rpc];
}

export type GetRawTx = {
  blockHeightInput: string;
  blockHashInput: string;
  packedInput: string;
  address: string;
  contractAddress: string;
  functionName: string;
};

export const getRawTx = ({
  blockHeightInput,
  blockHashInput,
  packedInput,
  address,
  contractAddress,
  functionName,
}: GetRawTx) => {
  const rawTx = AElf.pbUtils.getTransaction(address, contractAddress, functionName, packedInput);
  rawTx.refBlockNumber = blockHeightInput;
  const blockHash = blockHashInput.match(/^0x/) ? blockHashInput.substring(2) : blockHashInput;
  rawTx.refBlockPrefix = Buffer.from(blockHash, 'hex').slice(0, 4);
  return rawTx;
};

class TXError extends Error {
  public TransactionId?: string;
  public transactionId?: string;
  constructor(message: string, id?: string) {
    super(message);
    this.TransactionId = id;
    this.transactionId = id;
  }
}

export function handleContractErrorMessage(error?: any) {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error.Error) {
    return error.Error.Details || error.Error.Message || error.Error || error.Status;
  }
  return `Transaction: ${error.Status}`;
}

export async function getTxResult(
  TransactionId: string,
  endPoint: string,
  reGetCount = 0,
  notExistedReGetCount = 0,
): Promise<any> {
  const txFun = getAElf(endPoint).chain.getTxResult;
  let txResult;
  try {
    txResult = await txFun(TransactionId);
    console.log(txResult, TransactionId, 'compBalanceMetadata====txResult');
  } catch (error) {
    console.log('getTxResult:error', error);
    throw new TXError(handleContractErrorMessage(error), TransactionId);
  }

  const result = txResult?.result || txResult;
  if (!result) {
    throw new TXError('Can not get transaction result.', TransactionId);
  }

  const lowerCaseStatus = result.Status.toLowerCase();
  if (lowerCaseStatus === 'notexisted') {
    if (notExistedReGetCount > 5) throw new TXError(result.Error || `Transaction: ${result.Status}`, TransactionId);
    await sleep(1000);
    notExistedReGetCount++;
    reGetCount++;
    return getTxResult(TransactionId, endPoint, reGetCount, notExistedReGetCount);
  }
  if (lowerCaseStatus === 'pending' || lowerCaseStatus === 'pending_validation') {
    if (reGetCount > 20) throw new TXError(result.Error || `Transaction: ${result.Status}`, TransactionId);
    await sleep(1000);
    reGetCount++;
    return getTxResult(TransactionId, endPoint, reGetCount, notExistedReGetCount);
  }

  if (lowerCaseStatus === 'mined') return result;
  throw new TXError(result.Error || `Transaction: ${result.Status}`, TransactionId);
}

export function isDIDAddress(value?: string) {
  if (!value || !isValidBase58(value)) return false;
  if (value.includes('_') && value.split('_').length < 3) return false;
  try {
    return !!AElf.utils.decodeAddressRep(value);
  } catch {
    return false;
  }
}

export function isDIDAddressSuffix(value?: string) {
  if (!value) return false;
  if (isDIDAddress(value)) {
    const arr = value.split('_');

    if (arr && arr.length === 3 && Object.values(SupportedChainId).includes(arr[2] as any)) {
      return true;
    }
  }
  return false;
}

export const removeAddressSuffix = (address: string) => {
  const arr = address.split('_');
  if (arr.length === 3) return arr[1];

  return address;
};

export const removeDIDAddressSuffix = (address: string) => {
  if (isDIDAddressSuffix(address)) return removeAddressSuffix(address);

  return address;
};
