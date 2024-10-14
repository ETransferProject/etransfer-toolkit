import AElf from 'aelf-sdk';
import { COMMON_PRIVATE, CONTRACT_GET_DATA_ERROR, CONTRACT_METHOD_NAME, MANAGER_FORWARD_CALL } from '../constants';
import { getAElf, getRawTx, getTxResult } from './aelfBase';
import {
  TApproveAllowanceParams,
  TCheckIsEnoughAllowanceParams,
  TCheckTokenAllowanceAndApproveParams,
  TCreateHandleManagerForwardCall,
  TCreateTransferToken,
  TGetRawTx,
  TGetSignatureFunc,
  TTokenContract,
} from '../types';
import { timesDecimals } from '../calculate';
import BigNumber from 'bignumber.js';
import { aelfInstance } from './aelfInstance';
import { handleManagerForwardCall, getContractMethods } from '@portkey/contracts';

const CacheViewContracts: { [key: string]: TTokenContract } = {};

export const getContract = async (endPoint: string, contractAddress: string, wallet?: any): Promise<TTokenContract> => {
  const key = endPoint + contractAddress;

  if (!CacheViewContracts[key]) {
    if (!wallet) wallet = AElf.wallet.getWalletByPrivateKey(COMMON_PRIVATE);
    const aelf = getAElf(endPoint);
    const contract = await aelf.chain.contractAt(contractAddress, wallet);
    CacheViewContracts[endPoint + contractAddress] = contract;
    return contract;
  }

  return CacheViewContracts[key];
};

export const getTokenContract = async (endPoint: string, tokenContractAddress: string) => {
  return await getContract(endPoint, tokenContractAddress);
};

export const getBalance = async (tokenContract: TTokenContract, symbol: string, owner: string) => {
  const result = await tokenContract.GetBalance.call({
    symbol,
    owner,
  });
  return result?.balance;
};

export const getAllowance = async (tokenContract: TTokenContract, symbol: string, owner: string, spender: string) => {
  const result = await tokenContract.GetAllowance.call({
    symbol,
    owner,
    spender,
  });
  return result?.allowance;
};

export const getTokenInfo = async (tokenContract: TTokenContract, symbol: string) => {
  const result = await tokenContract.GetTokenInfo.call({
    symbol,
  });

  if (!result.symbol) throw new Error(CONTRACT_GET_DATA_ERROR);
  return result;
};

export const approveAllowance = async ({
  tokenContractCallSendMethod,
  tokenContractAddress,
  endPoint,
  symbol,
  amount,
  spender,
  memo,
}: TApproveAllowanceParams) => {
  const approveResult = await tokenContractCallSendMethod({
    contractAddress: tokenContractAddress,
    methodName: CONTRACT_METHOD_NAME.Approve,
    args: {
      spender,
      symbol,
      amount: amount.toString(),
      memo,
    },
  });
  if (!approveResult?.transactionId) throw new Error('Missing transactionId');

  const txRes = await getTxResult(approveResult.transactionId, endPoint);
  console.log('approveResult: ', approveResult, txRes);
  return true;
};

export const checkTokenAllowanceAndApprove = async ({
  tokenContractCallSendMethod,
  tokenContractAddress,
  endPoint,
  symbol,
  amount,
  owner,
  spender,
  memo,
}: TCheckTokenAllowanceAndApproveParams) => {
  const tokenContractOrigin = await getTokenContract(endPoint, tokenContractAddress);
  const [allowance, tokenInfo] = await Promise.all([
    getAllowance(tokenContractOrigin, symbol, owner, spender),
    getTokenInfo(tokenContractOrigin, symbol),
  ]);
  console.log('>>>>>> allowance', allowance);
  console.log('>>>>>> tokenInfo', tokenInfo);
  const bigA = timesDecimals(amount, tokenInfo?.decimals || 8);
  const allowanceBN = new BigNumber(allowance);

  if (allowanceBN.lt(bigA)) {
    await approveAllowance({
      tokenContractCallSendMethod,
      tokenContractAddress,
      endPoint,
      symbol,
      amount: bigA.toFixed(0),
      spender,
      memo,
    });

    const allowanceNew = await getAllowance(tokenContractOrigin, symbol, owner, spender);
    console.log('>>>>>> allowanceNew', allowanceNew);
    console.log('second check allowance:', allowanceNew);

    return bigA.lte(allowanceNew);
  }
  return true;
};

export const checkIsEnoughAllowance = async ({
  endPoint,
  tokenContractAddress,
  symbol,
  owner,
  spender,
  amount,
}: TCheckIsEnoughAllowanceParams) => {
  const tokenContractOrigin = await getTokenContract(endPoint, tokenContractAddress);

  const [allowance, tokenInfo] = await Promise.all([
    getAllowance(tokenContractOrigin, symbol, owner, spender),
    getTokenInfo(tokenContractOrigin, symbol),
  ]);
  console.log('>>>>>> allowance', allowance);
  console.log('>>>>>> tokenInfo', tokenInfo);
  const bigA = timesDecimals(amount, tokenInfo?.decimals || 8);
  const allowanceBN = new BigNumber(allowance);

  if (allowanceBN.lt(bigA)) {
    return false;
  }
  return true;
};

export const createManagerForwardCall = async ({
  caContractAddress,
  contractAddress,
  endPoint,
  args,
  methodName,
  caHash,
  chainId,
}: TCreateHandleManagerForwardCall) => {
  let instance: any, res: { args: string }, methods: { [x: string]: any };

  instance = aelfInstance.getInstance(chainId, endPoint);
  res = await handleManagerForwardCall({
    paramsOption: {
      contractAddress,
      methodName,
      args,
      caHash,
    },
    functionName: MANAGER_FORWARD_CALL,
    instance,
  });
  res.args = Buffer.from(AElf.utils.uint8ArrayToHex(res.args), 'hex').toString('base64');
  methods = await getContractMethods(instance, caContractAddress);

  const protoInputType = methods[MANAGER_FORWARD_CALL];

  let input = AElf.utils.transform.transformMapToArray(protoInputType, res);

  input = AElf.utils.transform.transform(protoInputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);

  const message = protoInputType.fromObject(input);

  return protoInputType.encode(message).finish();
};

export const createTransferToken = async ({ contractAddress, chainId, endPoint, args }: TCreateTransferToken) => {
  let instance: any, methods: { [x: string]: any };

  instance = aelfInstance.getInstance(chainId, endPoint);
  methods = await getContractMethods(instance, contractAddress);

  const protoInputType = methods[CONTRACT_METHOD_NAME.TransferToken];

  let input = AElf.utils.transform.transformMapToArray(protoInputType, args);

  input = AElf.utils.transform.transform(protoInputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);

  const message = protoInputType.fromObject(input);

  return protoInputType.encode(message).finish();
};

export const handleTransaction = async ({
  blockHeightInput,
  blockHashInput,
  packedInput,
  address,
  contractAddress,
  functionName,
  getSignature,
}: TGetRawTx & {
  getSignature: TGetSignatureFunc;
}) => {
  // Create transaction
  const rawTx = getRawTx({
    blockHeightInput,
    blockHashInput,
    packedInput,
    address,
    contractAddress,
    functionName,
  });
  rawTx.params = Buffer.from(rawTx.params, 'hex');

  const ser = AElf.pbUtils.Transaction.encode(rawTx).finish();

  const signatureRes = await getSignature(ser);
  const signatureStr = signatureRes?.signature || '';
  if (!signatureStr) return;

  let tx = {
    ...rawTx,
    signature: Buffer.from(signatureStr, 'hex'),
  };

  tx = AElf.pbUtils.Transaction.encode(tx).finish();
  if (tx instanceof Buffer) {
    return tx.toString('hex');
  }
  return AElf.utils.uint8ArrayToHex(tx); // hex params
};
