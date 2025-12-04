import axios from 'axios';
import { formatApiError } from '../src/utils';
import { CommonErrorNameType } from '@etransfer/request';
import { describe, expect, it } from '@jest/globals';

describe('formatApiError', () => {
  const defaultMessage = 'An unexpected error occurred';

  it('error is undefined, and should format error message correctly', () => {
    const formattedError = formatApiError(undefined, defaultMessage);

    expect(formattedError).toBeInstanceOf(Error);
    expect(formattedError.message).toBe(`ETransfer services ${defaultMessage}`);
    expect(formattedError.code).toBeUndefined();
  });

  it('should format error message correctly', () => {
    const error = { code: 404, message: 'Not Found' };
    const formattedError = formatApiError(error, defaultMessage);

    expect(formattedError).toBeInstanceOf(Error);
    expect(formattedError.message).toBe(`Not Found`);
    expect(formattedError.code).toBe(404);
  });

  it('should format cancel error message correctly when isSetCancelName is true', () => {
    const cancelError = new axios.Cancel('Request canceled');
    const formattedError = formatApiError(cancelError, defaultMessage, true);

    expect(formattedError).toBeInstanceOf(Error);
    expect(formattedError.message).toBe('Request canceled');
    expect(formattedError.name).toBe(CommonErrorNameType.CANCEL);
    expect(formattedError.code).toBeUndefined();
  });
});
