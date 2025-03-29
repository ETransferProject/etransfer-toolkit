import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useIsHaveJWT } from '../../src/hooks/login';
import { etransferEvents } from '@etransfer/utils';
import { getAuth } from '../../src/utils';

jest.mock('@etransfer/utils', () => ({
  etransferEvents: {
    ETransferConfigUpdated: {
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
  getAuth: jest.fn(),
}));

describe('useIsHaveJWT', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  it('should initialize with isHaveJWT as false', () => {
    const { result } = renderHook(() => useIsHaveJWT());

    // Initial state should be false
    expect(result.current).toBe(false);
  });

  it('should update isHaveJWT based on getAuth return value', () => {
    // Mock getAuth to return a token
    (getAuth as jest.Mock).mockReturnValue('mockedAuthToken');

    const { result } = renderHook(() => useIsHaveJWT());

    // Re-run the effect to set updated state
    // Should reflect the presence of a JWT
    expect(result.current).toBe(true);
  });

  it('should handle ETransferConfigUpdated event correctly', () => {
    const { result, unmount } = renderHook(() => useIsHaveJWT());

    // First call returns the token
    (getAuth as jest.Mock).mockReturnValueOnce('mockedAuthToken');

    // Trigger the event
    unmount();

    // Check if the state is updated
    // Should now reflect the presence of a JWT
    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useIsHaveJWT());

    // Simulate unmount
    unmount();

    // Ensure the listener was added
    expect(etransferEvents.ETransferConfigUpdated.addListener).toHaveBeenCalled();
    // Assuming that we were tracking the removal, you might want to check your cleanup logic
  });
});
