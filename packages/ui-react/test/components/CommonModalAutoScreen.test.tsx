import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import CommonModalAutoScreen from '../../src/components/CommonModalAutoScreen';
import CommonDrawer from '../../src/components/CommonDrawer';
import CommonModal from '../../src/components/CommonModal';
import { ComponentStyle } from '../../src/types';

// Mock child components
jest.mock('../../src/components/CommonDrawer', () => ({
  __esModule: true,
  default: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}));

jest.mock('../../src/components/CommonModal', () => ({
  __esModule: true,
  default: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}));

jest.mock('../../src/components/CommonButton', () => ({
  __esModule: true,
  default: jest.fn(({ children, ...props }) => <button {...props}>{children}</button>),
}));

describe('CommonModalAutoScreen Component', () => {
  const mockOnClose = jest.fn();
  const mockOnOk = jest.fn();
  const baseProps = {
    open: true,
    title: 'Test Modal',
    onClose: mockOnClose,
    onOk: mockOnOk,
    children: <div>Content</div>,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders CommonModal by default', () => {
    render(<CommonModalAutoScreen {...baseProps} />);

    expect(CommonModal).toHaveBeenCalledWith(
      expect.objectContaining({
        className: undefined,
        onCancel: mockOnClose,
      }),
      expect.anything(),
    );
  });

  test('renders CommonDrawer for mobile style', () => {
    render(<CommonModalAutoScreen {...baseProps} componentStyle={ComponentStyle.Mobile} />);

    expect(CommonDrawer).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'etransfer-ui-common-modal-auto-screen-drawer',
      }),
      expect.anything(),
    );
  });

  test('passes correct classNames', () => {
    render(
      <CommonModalAutoScreen
        {...baseProps}
        modalClassName="web-class"
        drawerClassName="mobile-class"
        componentStyle={ComponentStyle.Mobile}
      />,
    );

    expect(CommonDrawer).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('etransfer-ui-common-modal-auto-screen-drawer'),
      }),
      expect.anything(),
    );
  });

  test('handles hide footer buttons', () => {
    // Test mobile drawer footer
    render(
      <CommonModalAutoScreen {...baseProps} componentStyle={ComponentStyle.Mobile} hideCancelButton hideOkButton />,
    );

    expect(screen.queryByText('Cancel')).toBeNull();
    expect(screen.queryByText('Confirm')).toBeNull();
  });
});
