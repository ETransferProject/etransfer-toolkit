import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen, act, cleanup } from '@testing-library/react';
import GlobalLoading from '../../src/components/GlobalLoading';
import { etransferEvents } from '@etransfer/utils';
import { Modal } from 'antd';

// Mock etransferEvents
jest.mock('@etransfer/utils', () => ({
  etransferEvents: {
    SetGlobalLoading: {
      addListener: jest.fn().mockImplementation((fn: any) => {
        fn?.();
        return { remove: jest.fn() };
      }),
    },
  },
}));

jest.mock('antd', () => ({
  Modal: jest.fn(({ children, open }) => (open ? <div>{children}</div> : null)),
}));

jest.mock('../../src/components/CircleLoading', () => () => <div data-testid="circle-loading" />);

describe('GlobalLoading Component', () => {
  const mockAddListener = etransferEvents.SetGlobalLoading.addListener as jest.Mock;
  let removeListener: jest.Mock;

  beforeEach(() => {
    removeListener = jest.fn();
    mockAddListener.mockClear().mockReturnValue({ remove: removeListener });
  });

  afterEach(cleanup);

  it('Subscribe to the global loading event when the component is mounted, and unsubscribe when it is unmounted', () => {
    const { unmount } = render(<GlobalLoading />);

    // Verify subscription
    expect(mockAddListener).toHaveBeenCalledTimes(1);

    unmount();

    // Verify unsubscription
    expect(removeListener).toHaveBeenCalledTimes(1);
  });

  it('Display a loading modal with text when a loading event is received', () => {
    render(<GlobalLoading />);

    // Get the event handler
    const [[eventHandler]] = mockAddListener.mock.calls;

    // Trigger the event handler
    act(() => {
      (eventHandler as any)(true, { text: 'Processing...', className: 'custom-loading' });
    });

    // Verify modal display
    expect(Modal).toHaveBeenCalledWith(
      expect.objectContaining({
        open: true,
        className: expect.stringContaining('custom-loading'),
      }),
      expect.anything(),
    );
    expect(screen.getByTestId('circle-loading')).toBeInTheDocument();
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('When isHasText is false, no text is displayed.', () => {
    render(<GlobalLoading />);

    // Get the event handler
    const [[eventHandler]] = mockAddListener.mock.calls;

    // Trigger the event handler
    act(() => {
      (eventHandler as any)(true, { text: 'Should not show', isHasText: false });
    });

    expect(screen.queryByText('Should not show')).toBeNull();
  });

  it('Use default text when text is not provided', () => {
    render(<GlobalLoading />);

    // Get the event handler
    const [[eventHandler]] = mockAddListener.mock.calls;

    // Trigger the event handler
    act(() => {
      (eventHandler as any)(true, { isHasText: true });
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('Correctly configure modal box properties', () => {
    render(<GlobalLoading />);

    // Get the event handler
    const [[eventHandler]] = mockAddListener.mock.calls;

    // Trigger the event handler
    act(() => {
      (eventHandler as any)(true);
    });

    expect(Modal).toHaveBeenCalledWith(
      expect.objectContaining({
        closable: false,
        keyboard: false,
        maskClosable: false,
        footer: null,
        centered: true,
      }),
      expect.anything(),
    );
  });
});
