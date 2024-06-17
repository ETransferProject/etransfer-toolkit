import { describe, expect, test } from '@jest/globals';
import { handleContractError, handleContractErrorMessage, handleError, handleErrorMessage } from '../../src/error';
import { ServicesError } from '../__mocks__/error';

describe('handleError', () => {
  test('Input undefined, and return the main error body.', () => {
    const error = handleError(undefined);
    expect(error).toBeUndefined();
  });
  test('Format error structure, and return the main error body.', () => {
    const error = handleError(ServicesError);
    expect(error).toHaveProperty('code');
    expect(error.code).toBe(ServicesError.code);
  });

  test('Format error.error structure, and return the main error body.', () => {
    const error = handleError({ error: ServicesError });
    expect(error).toHaveProperty('code');
    expect(error.code).toBe(ServicesError.code);
  });
});

describe('handleContractError', () => {
  const ContractErrorMessage = 'Contract Error';
  const ContractErrorCode = '50000';
  test('Input parameter is string, and return the correct format.', () => {
    const error = handleContractError(ContractErrorMessage);
    expect(error).toHaveProperty('message');
    expect(error.message).toBe(ContractErrorMessage);
  });
  test('Input parameter is object, and return the correct format.', () => {
    const error = handleContractError({ message: ContractErrorMessage });
    expect(error).toHaveProperty('message');
    expect(error.message).toBe(ContractErrorMessage);
  });
  test('Input Error.Details and Error.Code, and return the correct format.', () => {
    const error = handleContractError({ Error: { Details: ContractErrorMessage, Code: '50000' } });
    expect(error).toHaveProperty('message');
    expect(error.message).toBe(ContractErrorMessage);
    expect(error).toHaveProperty('code');
    expect(error.code).toBe(ContractErrorCode);
  });
  test('Input Error.Message and Error.Code, and return the correct format.', () => {
    const error = handleContractError({ Error: { Message: ContractErrorMessage } });
    expect(error).toHaveProperty('message');
    expect(error.message).toBe(ContractErrorMessage);
    expect(error).toHaveProperty('code');
    expect(error.code).toBeUndefined();
  });
  test('Input Error.Details and Error.Code, and return the correct format.', () => {
    const error = handleContractError({ Error: ContractErrorMessage });
    expect(error).toHaveProperty('message');
    expect(error.message).toBe(ContractErrorMessage);
    expect(error).toHaveProperty('code');
    expect(error.code).toBeUndefined();
  });
  test('Input error.message.Message and error.message.Code, and return the correct format.', () => {
    const error = handleContractError(undefined, {
      error: { message: { Message: ContractErrorMessage, Code: '50000' } },
    });
    expect(error).toHaveProperty('message');
    expect(error.message).toBe(ContractErrorMessage);
    expect(error).toHaveProperty('code');
    expect(error.code).toBe(ContractErrorCode);
  });
  test('Input error and errorMessage.message, and return the correct format.', () => {
    const error = handleContractError(undefined, {
      error: ContractErrorCode,
      errorMessage: { message: ContractErrorMessage },
    });
    expect(error).toHaveProperty('message');
    expect(error.message).toBe(ContractErrorMessage);
    expect(error).toHaveProperty('code');
    expect(error.code).toBe(ContractErrorCode);
  });
});

describe('handleContractErrorMessage', () => {
  const ContractErrorMessage = 'Contract Error';
  test('Input is string, and return the correct format.', () => {
    const error = handleContractErrorMessage(ContractErrorMessage);
    expect(error).toBe(ContractErrorMessage);
  });
  test('Input error.message, and return the correct format.', () => {
    const error = handleContractErrorMessage({ message: ContractErrorMessage });
    expect(error).toBe(ContractErrorMessage);
  });
  test('Input error.Error, and return the correct format.', () => {
    const error = handleContractErrorMessage({ Error: ContractErrorMessage });
    expect(error).toBe(ContractErrorMessage);
  });
  test('Input error.Error.Details, and return the correct format.', () => {
    const error = handleContractErrorMessage({ Error: { Details: ContractErrorMessage } });
    expect(error).toBe(ContractErrorMessage);
  });
  test('Input error.Error.Message, and return the correct format.', () => {
    const error = handleContractErrorMessage({ Error: { Message: ContractErrorMessage } });
    expect(error).toBe(ContractErrorMessage);
  });
  test('Input error.Status, and return the correct format.', () => {
    const error = handleContractErrorMessage({ Status: 500 });
    expect(error).toBe('Transaction: 500');
  });
  test('Input undefined, and return the correct format.', () => {
    const error = handleContractErrorMessage(undefined);
    expect(error).toBe('Transaction: error');
  });
});

describe('handleErrorMessage', () => {
  test('error.status is 500', () => {
    const error = handleErrorMessage({ status: 500 });
    expect(error).toBe('Failed to fetch data');
  });
  test('error.status is 500, and errorText is ServicesError', () => {
    const error = handleErrorMessage({ statue: 500 }, 'ServicesError');
    expect(error).toBe('ServicesError');
  });
  test('Input is new Error()', () => {
    const errorOrigin = new Error('ServicesError');
    const error = handleErrorMessage(errorOrigin);
    expect(error).toBe('ServicesError');
  });
  test('Input is undefined', () => {
    const error = handleErrorMessage(undefined);
    expect(error).toBeFalsy();
  });
});
