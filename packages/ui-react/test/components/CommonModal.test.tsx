import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import CommonModal from '../../src/components/CommonModal';
import { Modal } from 'antd';

// Mock Ant Design Modal and child components
jest.mock('antd', () => ({
  Modal: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}));

jest.mock('../../src/components/CommonButton', () => ({
  __esModule: true,
  default: jest.fn(({ className, ...props }) => <button {...props} className={className} />),
}));

jest.mock('../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: jest.fn(() => <svg />),
}));

describe('CommonModal Component', () => {
  const mockOnCancel = jest.fn();
  const mockOnOk = jest.fn();
  const defaultProps = {
    open: true,
    onCancel: mockOnCancel,
    onOk: mockOnOk,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<CommonModal {...defaultProps} />);

    expect(Modal).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 480,
        centered: true,
        zIndex: 299,
        title: ' ',
      }),
      expect.anything(),
    );
  });

  test('renders close icon correctly', () => {
    render(<CommonModal {...defaultProps} />);
    expect(Modal).toHaveBeenCalledWith(
      expect.objectContaining({
        closeIcon: expect.any(Object),
      }),
      expect.anything(),
    );
  });

  test('handles button visibility', () => {
    const { rerender } = render(<CommonModal {...defaultProps} hideCancelButton hideOkButton />);
    expect(screen.queryByRole('button')).toBeNull();

    rerender(<CommonModal {...defaultProps} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('disables ok button when isOkButtonDisabled is true', () => {
    render(<CommonModal {...defaultProps} isOkButtonDisabled />);
    const okButton = screen.getByText('Confirm');
    expect(okButton).toBeDisabled();
  });

  test('triggers callbacks correctly', () => {
    render(<CommonModal {...defaultProps} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Confirm'));
    expect(mockOnOk).toHaveBeenCalled();
  });

  test('renders footerSlot content', () => {
    render(<CommonModal {...defaultProps} footerSlot={<div data-testid="custom-footer">Custom Footer</div>} />);
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });
});
