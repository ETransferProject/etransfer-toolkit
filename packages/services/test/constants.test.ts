import { describe, expect, it } from '@jest/globals';
import { API_LIST, AUTH_API_BASE_PARAMS, CANCEL_TOKEN_SOURCE_KEY } from '../src/constants';

describe('API_LIST', () => {
  it('should have auth list with correct structure', () => {
    expect(API_LIST.auth).toHaveProperty('token');
    expect(API_LIST.auth.token).toHaveProperty('target', '/connect/token');
    expect(API_LIST.auth.token).toHaveProperty('baseConfig');
  });
});

describe('AUTH_API_BASE_PARAMS', () => {
  it('should have correct authentication parameters', () => {
    expect(AUTH_API_BASE_PARAMS).toMatchObject({
      grant_type: 'signature',
      scope: 'ETransferServer',
      client_id: 'ETransferServer_App',
    });
  });
});

describe('CANCEL_TOKEN_SOURCE_KEY', () => {
  it('should define correct cancel token sources', () => {
    expect(CANCEL_TOKEN_SOURCE_KEY.GET_DEPOSIT_INFO).toEqual('GET_DEPOSIT_INFO');
    expect(CANCEL_TOKEN_SOURCE_KEY.GET_WITHDRAW_INFO).toEqual('GET_WITHDRAW_INFO');
  });
});
