import { describe, expect, it } from '@jest/globals';
import * as AelfBaseUtils from '../../src/aelf/aelfBase';

describe('TXError Class', () => {
  it('should create an error with a message and transaction ID', () => {
    const error = new AelfBaseUtils.TXError('Transaction failed', '12345');
    expect(error.message).toBe('Transaction failed');
    expect(error.TransactionId).toBe('12345');
    expect(error.transactionId).toBe('12345');
  });
});

describe('getTxResult', () => {
  it('should throw TXError for invalid transaction', async () => {
    const TransactionId = '12345';
    const endPoint = 'http://localhost:1234';

    await expect(AelfBaseUtils.getTxResult(TransactionId, endPoint)).rejects.toThrow(AelfBaseUtils.TXError);
  });
});
