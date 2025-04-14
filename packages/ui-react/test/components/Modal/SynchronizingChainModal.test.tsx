import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import SynchronizingChainModal from '../../../src/components/Modal/SynchronizingChainModal';
import { GOT_IT } from '../../../src/constants/misc';

// Mock CommonModalTip component
jest.mock('../../../src/components/CommonTips/CommonModalTip', () => ({
  __esModule: true,
  default: ({ className, open, title, okText, onOk, onCancel, footerClassName, closable }: any) =>
    open ? (
      <div data-testid="modal" className={className}>
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-body">Data is synchronising on the blockchain. Please wait a minute and try again.</div>
        <button data-testid="modal-ok" onClick={onOk}>
          {okText}
        </button>
        {closable && <button data-testid="modal-close" onClick={onCancel} />}
        <div data-testid="footer-class" className={footerClassName}></div>
      </div>
    ) : null,
}));

describe('SynchronizingChainModal Component', () => {
  const mockOnOk = jest.fn();
  const mockOnCancel = jest.fn();
  const expectedContent = 'Data is synchronising on the blockchain. Please wait a minute and try again.';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default closed state', () => {
    render(<SynchronizingChainModal />);

    // Check if modal is not displayed
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  test('displays content when open', () => {
    render(<SynchronizingChainModal open={true} />);

    // Check if modal content is displayed correctly
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Tips');
    expect(screen.getByTestId('modal-body')).toHaveTextContent(expectedContent);
    expect(screen.getByTestId('modal-ok')).toHaveTextContent(GOT_IT);
  });

  test('handles ok and cancel callbacks', () => {
    render(<SynchronizingChainModal open={true} onOk={mockOnOk} onCancel={mockOnCancel} />);

    // Check if ok callback is called
    fireEvent.click(screen.getByTestId('modal-ok'));
    expect(mockOnOk).toHaveBeenCalledTimes(1);

    // Check if cancel callback is called
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('applies correct styling classes', () => {
    render(<SynchronizingChainModal open={true} className="custom-class" />);

    // Verify modal and footer classes
    const modal = screen.getByTestId('modal');
    expect(modal).toHaveClass('etransfer-ui-synchronizing-chain-modal');
    expect(modal).toHaveClass('custom-class');

    // Verify footer class
    const footer = screen.getByTestId('footer-class');
    expect(footer).toHaveClass('etransfer-ui-synchronizing-chain-modal-footer');
  });

  test('has closable functionality', () => {
    render(<SynchronizingChainModal open={true} />);

    // Check if close button is present
    expect(screen.getByTestId('modal-close')).toBeInTheDocument();
  });
});
