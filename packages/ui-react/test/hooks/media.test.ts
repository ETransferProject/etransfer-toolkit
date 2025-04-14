import { afterAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useScreenSize } from '../../src/hooks/media';
import { MOBILE_PX, PAD_PX } from '../../src/constants';

// Mock window methods
const originalInnerWidth = window.innerWidth;
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

beforeEach(() => {
  window.addEventListener = jest.fn();
  window.removeEventListener = jest.fn();
});

afterAll(() => {
  window.innerWidth = originalInnerWidth;
  window.addEventListener = originalAddEventListener;
  window.removeEventListener = originalRemoveEventListener;
});

describe('useScreenSize', () => {
  it('should return initial values correctly', () => {
    const { result } = renderHook(() => useScreenSize());

    expect(result.current.isMobilePX).toBe(false);
    expect(result.current.isPadPX).toBe(true);
  });

  it('should update isMobilePX when window width <= MOBILE_PX', () => {
    window.innerWidth = MOBILE_PX;
    const { result } = renderHook(() => useScreenSize());

    expect(result.current.isMobilePX).toBe(true);
    expect(result.current.isPadPX).toBe(true);
  });

  it('should update isPadPX when window width <= PAD_PX but > MOBILE_PX', () => {
    window.innerWidth = PAD_PX;
    const { result } = renderHook(() => useScreenSize());

    expect(result.current.isMobilePX).toBe(false);
    expect(result.current.isPadPX).toBe(true);
  });

  it('should add/remove resize event listeners', () => {
    const { unmount } = renderHook(() => useScreenSize());

    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
