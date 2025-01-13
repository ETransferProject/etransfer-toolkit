import { describe, expect, test } from '@jest/globals';
import {
  handleContractError,
  handleContractErrorMessage,
  handleError,
  handleErrorMessage,
  handleWebLoginErrorMessage,
  isAuthTokenError,
  isHtmlError,
  isWriteOperationError,
} from '../../src/error';
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

describe('isHtmlError', () => {
  test('should return true for 5xx error with HTML message', () => {
    expect(isHtmlError('500', '<!DOCTYPE HTML PUBLIC')).toBe(true);
    expect(isHtmlError(503, '<!DOCTYPE HTML PUBLIC')).toBe(true);
  });

  test('should return false for non-5xx error', () => {
    expect(isHtmlError('404', '<!DOCTYPE HTML PUBLIC')).toBe(false);
    expect(isHtmlError('200', '<!DOCTYPE HTML PUBLIC')).toBe(false);
  });

  test('should return false for 5xx error without HTML message', () => {
    expect(isHtmlError('500', 'Internal Server Error')).toBe(false);
  });

  test('should return false without params', () => {
    expect(isHtmlError('' as any, 'Internal Server Error')).toBe(false);
  });
});

describe('isAuthTokenError', () => {
  test('should return true for error with 401 in message', () => {
    const error = { status: 401, message: 'Unauthorized' };
    expect(isAuthTokenError(error)).toBe(true);
  });

  test('should return false for error without 401 in message', () => {
    const error = { status: 403, message: 'Forbidden' };
    expect(isAuthTokenError(error)).toBe(false);
    expect(isAuthTokenError(null)).toBe(false);
  });

  test('should return false for error without 401 in message', () => {
    const error = { status: 401, message: '401 Unauthorized' };
    expect(isAuthTokenError(error)).toBe(true);
  });
});

describe('isWriteOperationError', () => {
  test('should return true for 5xx error with specific message', () => {
    expect(isWriteOperationError('500', 'A write operation resulted in an error')).toBe(true);
    expect(isWriteOperationError(503, 'A write operation resulted in an error')).toBe(true);
  });

  test('should return false for non-5xx error', () => {
    expect(isWriteOperationError('404', 'A write operation resulted in an error')).toBe(false);
    expect(isWriteOperationError('200', 'A write operation resulted in an error')).toBe(false);
  });

  test('should return false for 5xx error without the specific message', () => {
    expect(isWriteOperationError('500', 'Internal Server Error')).toBe(false);
  });
});

describe('handleWebLoginErrorMessage', () => {
  test('should return the error message from nativeError if it exists', () => {
    const error = { nativeError: { message: 'Native error occurred' } };
    const result = handleWebLoginErrorMessage(error);

    expect(result).toContain('Native error occurred');
  });

  test('should call handleErrorMessage with the error', () => {
    const error = { message: 'Some error occurred' };
    const errorText = 'Handle this error';
    const result = handleWebLoginErrorMessage(error, errorText);

    expect(result).toContain('Some error occurred');
  });

  test('should return default error message if no error is provided', () => {
    const result = handleWebLoginErrorMessage(undefined);

    expect(result).toBe('Failed to fetch data');
  });
});
