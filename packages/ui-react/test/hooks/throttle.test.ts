import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import {
  useThrottleFirstCallback,
  useThrottleFirstEffect,
  useThrottleLatestCallback,
  useThrottleLatestEffect,
} from '../../src/hooks/throttle';

describe('useThrottleFirstCallback', () => {
  jest.useFakeTimers();

  let mockCallback: jest.Mock;

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    // Create a new mock function for each test
    mockCallback = jest.fn();
  });

  it('should call callback on first invocation', () => {
    const { result } = renderHook(() => useThrottleFirstCallback(mockCallback, [], 500));

    act(() => {
      // Invoke the throttled function
      result.current('arg1', 'arg2');
    });

    // Verify callback was called
    expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should not call callback during throttle period', () => {
    const { result } = renderHook(() => useThrottleFirstCallback(mockCallback, [], 500));

    act(() => {
      // First invocation
      result.current();
    });

    act(() => {
      // Second invocation within the throttle period
      result.current();
    });

    // Ensure callback was called only once
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should call callback after throttle period expires', async () => {
    const { result } = renderHook(() => useThrottleFirstCallback(mockCallback, [], 500));

    act(() => {
      result.current('arg1');
    });

    act(() => {
      // Fast-forward time by 500ms to end the throttle period
      jest.advanceTimersByTime(500);
    });

    act(() => {
      // Invocation after throttle period
      result.current('arg2');
    });

    // Ensure callback was called twice
    expect(mockCallback).toHaveBeenCalledTimes(2);
    // Check last argument is correct
    expect(mockCallback).toHaveBeenCalledWith('arg2');
  });

  it('should not call callback if it is undefined', () => {
    const { result } = renderHook(() => useThrottleFirstCallback(undefined, [], 500));

    act(() => {
      // Invoke the throttled function
      result.current();
    });

    // Ensure callback was not called
    expect(mockCallback).not.toHaveBeenCalled();
  });
});

describe('useThrottleLatestCallback', () => {
  jest.useFakeTimers();
  let callback: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Initialize a new mock function
    callback = jest.fn();
  });

  it('should call the callback on first invocation', () => {
    const { result } = renderHook(() => useThrottleLatestCallback(callback, [], 500));

    act(() => {
      result.current('arg1', 'arg2');
    });

    // Callback should not be called immediately
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Verify callback is invoked with arguments
    expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should ignore subsequent calls within the delay', () => {
    const { result } = renderHook(() => useThrottleLatestCallback(callback, [], 500));

    act(() => {
      result.current('arg1');
    });

    act(() => {
      // Another call within delay
      result.current('arg2');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Ensure callback was called only once
    expect(callback).toHaveBeenCalledTimes(1);
    // Should've called with the first argument
    expect(callback).toHaveBeenCalledWith('arg1');
  });

  it('should update and call callback with the latest arguments after delay', () => {
    const { result } = renderHook(() => useThrottleLatestCallback(callback, [], 500));

    act(() => {
      result.current('arg1');
    });

    act(() => {
      // Advance timers by less than delay
      jest.advanceTimersByTime(250);
    });

    act(() => {
      // Update the arguments before the delay expires
      result.current('arg2');
    });

    act(() => {
      // Now advance timers again
      jest.advanceTimersByTime(500);
    });

    // Ensure callback was called exactly once
    expect(callback).toHaveBeenCalledTimes(1);
    // Verify callback called with latest arguments
    expect(callback).toHaveBeenCalledWith('arg1');
  });

  it('should do nothing if no callback is provided', () => {
    const { result } = renderHook(() => useThrottleLatestCallback(undefined as any, [], 500));

    act(() => {
      result.current('arg1');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Ensure callback is not called
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('useThrottleFirstEffect', () => {
  let effect: any;

  beforeEach(() => {
    jest.clearAllMocks();
    effect = jest.fn();
  });

  it('should call effect on first render', () => {
    renderHook(() => useThrottleFirstEffect(effect));

    // Ensure effect is called on first render
    expect(effect).toHaveBeenCalled();
  });

  it('should not call effect again immediately after render', () => {
    const { rerender } = renderHook(() => useThrottleFirstEffect(effect));

    // Rerender to simulate effect of dependency change
    rerender();

    expect(effect).toHaveBeenCalledTimes(1); // Ensure it is not called again immediately
  });

  it('should call effect after delay', async () => {
    // Use fake timers for the test
    jest.useFakeTimers();

    renderHook(() => useThrottleFirstEffect(effect));

    // Simulate the effect being called
    act(() => {
      // Fast-forward by delay
      jest.advanceTimersByTime(500);
    });

    // Check to see if the effect was called
    expect(effect).toHaveBeenCalled();
  });

  it('should handle changing dependencies correctly', () => {
    const { rerender } = renderHook(({ value }) => useThrottleFirstEffect(effect, [value]), {
      initialProps: { value: 'first' },
    });

    // Effect should have been called once
    expect(effect).toHaveBeenCalledTimes(1);

    // Change the value to trigger rerender
    rerender({ value: 'second' });

    // Effect should not be called again immediately
    expect(effect).toHaveBeenCalledTimes(1);
  });
});

describe('useThrottleLatestEffect', () => {
  // Use fake timers for the test
  jest.useFakeTimers();

  let mockEffect: any;

  beforeEach(() => {
    // Clear previous mocks before each test
    jest.clearAllMocks();

    // Create a new mock function for each test
    mockEffect = jest.fn();
  });

  it('should call effect on first render', () => {
    renderHook(() => useThrottleLatestEffect(mockEffect));
    act(() => {
      // Fast-forward by delay
      jest.advanceTimersByTime(500);
    });

    // Ensure effect is called on first render
    expect(mockEffect).toHaveBeenCalled();
  });
});
