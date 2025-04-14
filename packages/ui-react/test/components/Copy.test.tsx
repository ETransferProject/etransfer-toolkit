import { afterEach, beforeEach, describe, expect, test, jest } from '@jest/globals';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { forwardRef } from 'react';
import Copy from '../../src/components/Copy';
import { ComponentStyle, CopySize } from '../../src/types';
// import { useCopyToClipboard } from 'react-use';

// Mock dependencies
jest.mock('react-use', () => ({
  useCopyToClipboard: () => [{}, jest.fn()],
}));

// Emulate clsx class name generation
jest.mock('clsx', () => jest.fn(() => 'mocked-classname'));

jest.mock('../../src/components/CommonTooltip', () =>
  forwardRef(({ children, getPopupContainer, ...props }: any, ref: any) => {
    getPopupContainer?.();
    return (
      <div data-testid="tooltip" ref={ref} {...props}>
        {children}
      </div>
    );
  }),
);

jest.mock('../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: ({ type }: { type: string }) => <div data-testid={`svg-${type}`} />,
}));

describe('Copy Component', () => {
  const defaultProps = {
    toCopy: 'test-text',
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  test('renders with default props', () => {
    render(<Copy {...defaultProps} />);

    // Check if the copy icon is displayed
    expect(screen.getByTestId('svg-copy')).toBeInTheDocument();
  });

  test('switches icon on click and resets after timeout', async () => {
    const { container } = render(<Copy {...defaultProps} />);

    // Find the copy element
    const element = container.querySelector('.mocked-classname');

    if (element) {
      // Click the copy element
      await act(async () => {
        fireEvent.click(element);

        // Click again to simulate a second click
        fireEvent.click(element);
      });

      // Check if the check icon is displayed
      expect(screen.getByTestId('svg-check')).toBeInTheDocument();

      // Advance timers by 2 seconds to simulate the cool down period
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      // Check if the copy icon is displayed
      expect(screen.getByTestId('svg-copy')).toBeInTheDocument();
    }
  });

  // test('calls copyToClipboard with correct text', () => {
  //   const [_, setCopyValue] = useCopyToClipboard();
  //   const { container } = render(<Copy {...defaultProps} />);

  //   const element = container.querySelector('.mocked-classname');

  //   if (element) {
  //     act(() => {
  //       fireEvent.click(element);
  //     });

  //     expect(setCopyValue).toHaveBeenCalled();
  //     expect(screen.getByTestId('svg-copy')).toBeInTheDocument();
  //   }
  // });

  test('shows mobile style tooltip correctly', async () => {
    const { container } = render(<Copy {...defaultProps} componentStyle={ComponentStyle.Mobile} />);

    // Find the copy element
    const element = container.querySelector('.mocked-classname');

    if (element) {
      // Click the copy button
      await act(async () => {
        fireEvent.click(element);
      });

      expect(screen.getByTitle('Copied')).toBeInTheDocument();

      // Wait for the cooldown period
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      // expect(screen.getByTitle('Copied')).not.toBeInTheDocument();
    }
  });

  // test('prevents multiple clicks during cooldown', () => {
  //   const [_, setCopyValue] = useCopyToClipboard();
  //   render(<Copy {...defaultProps} />);

  //   fireEvent.click(screen.getByRole('button'));
  //   fireEvent.click(screen.getByRole('button'));
  //   expect(setCopyValue).toHaveBeenCalledTimes(1);
  // });

  test('renders correct size variants', () => {
    const { rerender } = render(<Copy {...defaultProps} size={CopySize.Small} />);
    // Small size
    expect(screen.getByTestId('svg-copySmall')).toBeInTheDocument();

    rerender(<Copy {...defaultProps} size={CopySize.Big} />);

    // Big size
    expect(screen.getByTestId('svg-copyBig')).toBeInTheDocument();
  });

  test('displays children correctly', () => {
    render(<Copy {...defaultProps}>Child Content</Copy>);

    // Assert
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
