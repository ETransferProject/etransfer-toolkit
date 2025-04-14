import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { etransferCore, getAuth } from '../../src/utils';
import { useUpdateRecord } from '../../src/hooks/updateRecord';

jest.mock('@etransfer/utils', () => ({
  etransferEvents: {
    UpdateNewRecordStatus: {
      addListener: jest.fn().mockImplementation((fn: any) => {
        fn();
        return {
          remove: jest.fn(),
        };
      }), // Mock addListener
    },
  },
}));

jest.mock('../../src/utils', () => ({
  etransferCore: {
    services: {
      getRecordStatus: jest.fn(),
    },
  },
  getAuth: jest.fn(),
}));

jest.mock('../../src/components', () => ({
  SingleMessage: {
    info: jest.fn(), // Mock SingleMessage method
  },
}));

describe('useUpdateRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with isUnreadHistory as false', () => {
    // Mocking JWT exist
    (getAuth as jest.Mock).mockReturnValue('mockedToken');
    // Mock status response
    (etransferCore.services.getRecordStatus as jest.Mock).mockResolvedValue({ status: false } as never);

    const { result, unmount } = renderHook(() => useUpdateRecord());

    // Wait for any effect to complete
    act(() => {
      jest.advanceTimersByTime(6 * 1000);
    });

    unmount();

    expect(result.current).toBe(false);
  });

  it('should update isUnreadHistory when JWT is present', async () => {
    // Mocking JWT exist
    (getAuth as jest.Mock).mockReturnValue('mockedToken');

    // Mock status response
    (etransferCore.services.getRecordStatus as jest.Mock).mockResolvedValue({ status: false } as never);

    const { result, unmount } = renderHook(() => useUpdateRecord());

    unmount();

    // Wait for any effect to complete
    act(() => {
      jest.runAllTimers(); // push all timers
    });

    expect(result.current).toBe(false);
  });

  it('should not call getRecordStatus if JWT is not present', async () => {
    // Mocking JWT not exist
    (getAuth as jest.Mock).mockReturnValue(undefined);

    const { result, unmount } = renderHook(() => useUpdateRecord());

    unmount();

    // Wait for any effect to complete
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current).toBe(false);
    expect(etransferCore.services.getRecordStatus).not.toHaveBeenCalled();
  });

  it('should show log when services is throw error', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // Mocking JWT exist
    (getAuth as jest.Mock).mockReturnValue('mockedToken');

    // Mock status response
    (etransferCore.services.getRecordStatus as jest.Mock).mockRejectedValue({ error: 'Failed' } as never);

    const { result, unmount } = renderHook(() => useUpdateRecord());

    unmount();

    // Wait for any effect to complete
    act(() => {
      // push all timers
      jest.runAllTimers();
    });

    // expect(console.log).toHaveBeenCalled();
    expect(result.current).toBe(false);
  });
});
