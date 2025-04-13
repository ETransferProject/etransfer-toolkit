import { afterEach, describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import PartialLoading from '../../src/components/PartialLoading';
import lottie from 'lottie-web';

// Mock lottie-web
jest.mock('lottie-web', () => ({
  loadAnimation: jest.fn(() => ({
    stop: jest.fn(),
    destroy: jest.fn(),
  })),
}));

describe('PartialLoading Component', () => {
  const mockAnimation = {
    stop: jest.fn(),
    destroy: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('initializes and destroys Lottie animation correctly', () => {
    (lottie.loadAnimation as jest.Mock).mockImplementation(() => mockAnimation);
    const { unmount } = render(<PartialLoading />);

    // Verify Lottie initialization
    expect(lottie.loadAnimation).toHaveBeenCalledTimes(1);
    expect(lottie.loadAnimation).toHaveBeenCalledWith({
      container: expect.any(HTMLDivElement),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: expect.anything(),
    });

    // Test cleanup
    unmount();
    expect(mockAnimation.stop).toHaveBeenCalledTimes(1);
    expect(mockAnimation.destroy).toHaveBeenCalledTimes(1);
  });

  test('applies correct className', () => {
    const { container } = render(<PartialLoading className="custom-loading" />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('partial-loading');
    expect(wrapper).toHaveClass('custom-loading');
  });

  test('does not reinitialize animation on re-render', () => {
    const { rerender } = render(<PartialLoading />);
    expect(lottie.loadAnimation).toHaveBeenCalledTimes(1);

    rerender(<PartialLoading className="updated" />);
    expect(lottie.loadAnimation).toHaveBeenCalledTimes(1);
  });
});
