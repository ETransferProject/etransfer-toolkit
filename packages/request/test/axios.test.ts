import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { baseRequest } from '../src/axios';

jest.mock('axios', () => {
  const config = {
    url: '/test',
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return {
    create: jest.fn().mockReturnValue({
      interceptors: {
        request: {
          use: jest.fn().mockImplementation((config: any) => {
            config();
          }),
        },
        response: {
          use: jest.fn().mockImplementation((response: any) => {
            response({ data: { code: '200' } });
          }),
        },
      },
      get: jest.fn().mockResolvedValue(config as never),
    }),
  };
});

jest.mock('@etransfer/utils', () => ({
  etransferEvents: { DeniedRequest: { emit: jest.fn() } },
}));

describe('Axios Instance Interceptors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass configuration through the request interceptor', async () => {
    const config = {
      url: '/test',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await baseRequest.get(config.url);

    expect(response).toEqual(config);
  });
});
