import { divDecimals, getBalance, getTokenContract, handleWebLoginErrorMessage } from '@etransfer/utils';
import singleMessage from '../components/SingleMessage';

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
