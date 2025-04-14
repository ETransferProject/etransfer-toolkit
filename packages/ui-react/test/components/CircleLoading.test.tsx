import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import CircleLoading from '../../src/components/CircleLoading';
import lottie from 'lottie-web';

const lottieStop = jest.fn();
const lottieDestroy = jest.fn();

// Mock lottie-web
jest.mock('lottie-web', () => ({
  loadAnimation: jest.fn(() => ({
    stop: lottieStop,
    destroy: lottieDestroy,
  })),
}));

describe('CircleLoading Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('applies custom className', () => {
    const { container } = render(<CircleLoading className="custom-class" />);

    // Assert that the container has the correct class
    expect(container.firstChild).toHaveClass('etransfer-ui-circle-loading custom-class');
  });

  test('initializes lottie animation on mount', () => {
    render(<CircleLoading />);

    // Assert that lottie.loadAnimation is called with correct props
    expect(lottie.loadAnimation).toHaveBeenCalledWith(
      expect.objectContaining({
        container: expect.any(HTMLDivElement),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: expect.any(Object),
      }),
    );
  });

  test('cleans up animation on unmount', () => {
    const { unmount } = render(<CircleLoading />);

    // Clean up
    unmount();

    // Assert
    expect(lottieStop).toHaveBeenCalled();
    expect(lottieDestroy).toHaveBeenCalled();
  });
});
