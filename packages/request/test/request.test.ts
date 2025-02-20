import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';
import { EtransferRequest } from '../src/request';
import { baseRequest } from '../src/axios';
import { TBaseConfig } from '../src/types';

describe('EtransferRequest', () => {
  let mock: MockAdapter;
  let etransferRequest: EtransferRequest;

  beforeEach(() => {
    mock = new MockAdapter(baseRequest);
    etransferRequest = new EtransferRequest();
  });

  afterEach(() => {
    mock.reset();
  });

  it('should send a POST request', async () => {
    mock.onPost('/test').reply(200, { success: true });

    const response = await etransferRequest.post('/test', { data: 'test' });
    expect(response.data).toEqual({ success: true });
  });

  it('should send a GET request', async () => {
    mock.onGet('/test').reply(200, { success: true });

    const response = await etransferRequest.get('/test');
    expect(response.data).toEqual({ success: true });
  });

  it('should send a request with the send undefined method', async () => {
    mock.onGet('/test').reply(200, { success: true });

    const response = await etransferRequest.send('/test', {});

    expect(response.data).toEqual({ success: true });
  });

  it('should send a request with the send undefined config', async () => {
    mock.onGet('/test').reply(200, { success: true });

    const response = await etransferRequest.send('/test', undefined as any);

    expect(response.data).toEqual({ success: true });
  });

  it('should send a request with the send method using base string', async () => {
    mock.onPost('/test').reply(200, { success: true });

    const response = await etransferRequest.send('/test', { method: 'POST' });

    expect(response.data).toEqual({ success: true });
  });

  it('should send a request with the send method using base target', async () => {
    mock.onPost('/test').reply(200, { success: true });

    const response = await etransferRequest.send({ target: '/test' } as TBaseConfig, { method: 'POST' });

    expect(response.data).toEqual({ success: true });
  });

  it('should send a request with the send method using base object', async () => {
    mock.onPost('/test').reply(200, { success: true });

    const base: TBaseConfig = {
      target: 'http://example.com',
      baseConfig: {
        url: '/test',
        query: 'id=1',
        method: 'POST',
        params: { foo: 'bar' },
        data: { name: 'John' },
      },
    };

    const response = await etransferRequest.send(base, {
      cancelTokenSourceKey: 'cancelTokenSourceKey',
    });

    expect(response.data).toEqual({ success: true });
  });

  it('should send a request with the send method using base object repeat', async () => {
    mock.onPost('/test').reply(200, { success: true });

    const base: TBaseConfig = {
      target: 'http://example.com',
      baseConfig: {
        url: '/test',
        query: 'id=1',
        method: 'POST',
        params: { foo: 'bar' },
        data: { name: 'John' },
      },
    };

    const response = await etransferRequest.send(base, {
      cancelTokenSourceKey: 'cancelTokenSourceKey',
    });

    expect(response.data).toEqual({ success: true });
  });

  it('should set headers correctly', () => {
    etransferRequest.setHeaders('Authorization', 'Bearer token');
    expect(baseRequest.defaults.headers.common['Authorization']).toBe('Bearer token');
  });

  it('should set config correctly', () => {
    etransferRequest.setConfig('timeout', 10000);
    expect(baseRequest.defaults.timeout).toBe(10000);
  });

  it('should handle 401 errors and emit DeniedRequest event', async () => {
    const deniedRequestEventMock = jest.spyOn(require('@etransfer/utils').etransferEvents.DeniedRequest, 'emit');

    mock.onGet('/unauthorized').reply(401, { message: '401 Unauthorized' });

    await expect(etransferRequest.get('/unauthorized')).rejects.toThrow();

    expect(deniedRequestEventMock).toHaveBeenCalled();
    deniedRequestEventMock.mockRestore();
  });
});
