import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { BaseSignalr } from '../src/signalr';
import { SocketError } from '../src/types';

jest.mock('@microsoft/signalr');
jest.mock('@etransfer/utils', () => ({
  randomId: jest.fn(() => 'mockRandomId'), // Mock randomId function
}));

describe('BaseSignalr', () => {
  let signalr: BaseSignalr<any>;
  const mockUrl = 'http://localhost';
  const mockListenList = ['event1', 'event2'];

  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock state
    signalr = new BaseSignalr({ listenList: mockListenList, url: mockUrl });
  });

  it('should create an instance with initial properties', () => {
    expect(signalr.url).toBe(mockUrl);
    expect(signalr.connectionId).toBe('');
    expect(signalr.signalr).toBeNull();
  });

  describe('doOpen', () => {
    it('should throw an error if url is not set', async () => {
      signalr.setUrl(''); // Clear the URL
      await expect(signalr.doOpen()).rejects.toThrow('Please set url');
    });

    it('should return the correct connectionId if origin connectionId is undefined', async () => {
      const mockConnection = {
        connectionId: undefined,
        start: jest.fn().mockResolvedValue(undefined as never),
        on: jest.fn().mockImplementation((_: any, fn?: any) => {
          fn('mockData');
        }),
      };

      (HubConnectionBuilder.prototype.withUrl as jest.Mock).mockReturnValue({
        withAutomaticReconnect: jest.fn().mockImplementation(({ nextRetryDelayInMilliseconds }: any) => {
          nextRetryDelayInMilliseconds();
          return {
            build: jest.fn().mockReturnValue(mockConnection),
          };
        }),
      });

      await signalr.doOpen();

      expect(signalr.connectionId).toBe('');
    });

    it('should create a HubConnection and start it', async () => {
      const mockConnection = {
        connectionId: 'mockConnectionId',
        _listenList: ['event1', 'event2'],
        _messageMap: { event1: jest.fn() },
        start: jest.fn().mockResolvedValue(undefined as never),
        on: jest.fn().mockImplementation((_: any, fn?: any) => {
          fn('mockData');
        }),
        invoke: jest.fn(),
        onclose: jest.fn(() => {
          signalr.connectionId = '';
        }),
        stop: jest.fn(() => {
          signalr.connectionId = '';
        }),
        onreconnected: jest.fn(),
      };

      (HubConnectionBuilder.prototype.withUrl as jest.Mock).mockReturnValue({
        withAutomaticReconnect: jest.fn().mockImplementation(({ nextRetryDelayInMilliseconds }: any) => {
          nextRetryDelayInMilliseconds();
          return {
            build: jest.fn().mockReturnValue(mockConnection),
          };
        }),
      });

      signalr.setUrl(''); // Clear the URL
      const connection = await signalr.doOpen({ url: mockUrl });

      expect(HubConnectionBuilder.prototype.withUrl).toHaveBeenCalledWith(mockUrl, { withCredentials: false });
      expect(connection).toBe(mockConnection);
      expect(mockConnection.start).toHaveBeenCalled();
      expect(signalr.connectionId).toBe(mockConnection.connectionId);
      expect(signalr.signalr).toBe(mockConnection);
    });
  });

  describe('Listen, start, on, onReconnected, invoke, onclose, stop and destroy utility functions', () => {
    it('should add a listener for an event', () => {
      const handler = jest.fn();
      const listenName = 'event1';
      const listenObj = signalr.listen(listenName, handler);

      expect((signalr as any)._messageMap[listenName]['mockRandomId']).toBe(handler);

      listenObj.remove();
      expect((signalr as any)._messageMap[listenName]['mockRandomId']).toBeUndefined();
    });

    it('should start working', async () => {
      await signalr.doOpen();
      await signalr.start();
      expect(signalr.connectionId).toBe('mockConnectionId');
    });

    it('should executed on method successfully', async () => {
      await signalr.doOpen();
      const handler = jest.fn();
      const listenName = 'event1';

      signalr.on(listenName, handler);

      expect((signalr as any)._messageMap[listenName]).toBeUndefined();
    });

    it('should executed onReconnected method successfully', async () => {
      await signalr.doOpen();
      signalr.onReconnected(() => {
        return 'onReconnected';
      });
      expect(signalr.connectionId).toBe('mockConnectionId');
    });

    it('should executed invoke method successfully', async () => {
      await signalr.doOpen();
      const handler = jest.fn();
      const listenName = 'event1';

      await signalr.invoke(listenName, handler);
      expect(signalr.connectionId).toBe('mockConnectionId');
    });

    // it('should executed close method successfully', async () => {
    //   await signalr.doOpen();

    // });

    it('should executed close method successfully', async () => {
      await signalr.doOpen();
      signalr.onClose(() => {
        return 'close signalr';
      });
      expect(signalr.connectionId).toBe('');
      expect((signalr as any)._messageMap).toEqual({});
    });

    it('should executed stop method successfully', async () => {
      await signalr.doOpen();
      await signalr.stop();
      expect(signalr.connectionId).toBe('');
      expect((signalr as any)._messageMap).toEqual({});
    });

    it('should executed destroy method successfully', async () => {
      await signalr.doOpen();
      await signalr.destroy();
      expect(signalr.connectionId).toBe('');
      expect((signalr as any)._messageMap).toEqual({});
    });
  });

  it('should throw an error if signalr is not initialized', () => {
    signalr.signalr = null; // Simulate uninitialized state
    expect(() => signalr['_checkSignalr']()).toThrow(SocketError.notConnect);
  });
});
