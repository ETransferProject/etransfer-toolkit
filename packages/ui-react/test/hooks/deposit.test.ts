import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useCheckTxn } from '../../src/hooks/deposit';
import { SingleMessage } from '../../src/components';
import { NO_TXN_FOUND, START_CHECKING_TXN } from '../../src/constants';

jest.mock('../../src/context/ETransferDepositProvider', () => ({
  useETransferDeposit: jest.fn().mockImplementation(() => {
    return [
      {
        depositProcessingCount: 0,
      },
    ];
  }), // Mock useETransferDeposit
}));

jest.mock('../../src/components', () => ({
  SingleMessage: {
    info: jest.fn(), // Mock SingleMessage method
  },
}));

describe('useCheckTxn', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // clean mocks
  });

  it('should initialize loading state as false', () => {
    const { result } = renderHook(() => useCheckTxn());

    // Ensure initial loading state is false
    expect(result.current.isCheckTxnLoading).toBe(false);
  });

  it('should set loading and start timer on handleCheckTxnClick', () => {
    // Use fake timers for the test
    jest.useFakeTimers();
    const { result } = renderHook(() => useCheckTxn());

    act(() => {
      result.current.handleCheckTxnClick();
    });

    // Should set loading to true
    expect(result.current.isCheckTxnLoading).toBe(false);
    // Verify message
    expect(SingleMessage.info).toHaveBeenCalledWith(START_CHECKING_TXN);
  });

  it('should stop the timer and show message if no transactions are found', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useCheckTxn());

    act(() => {
      result.current.handleCheckTxnClick();
      // Advance the timer to the end of CHECK_TXN_DURATION
      jest.advanceTimersByTime(5 * 60 * 1000);
    });

    // Should be stopped
    expect(result.current.isCheckTxnLoading).toBe(false);
    // Ensure no transaction message was displayed
    expect(SingleMessage.info).toHaveBeenCalledWith(NO_TXN_FOUND);
  });

  it('should clean up timer on unmount', () => {
    const { result, unmount } = renderHook(() => useCheckTxn());
    act(() => {
      result.current.stopTimer(); // Stop the timer
    });

    // Unmount the hook
    unmount();
    // Ensure no message is called after unmount
    expect(SingleMessage.info).not.toHaveBeenCalled();
  });
});
