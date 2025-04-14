import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import SimpleTipModal from '../../../src/components/Modal/SimpleTipModal';
import { GOT_IT } from '../../../src/constants/misc';

// Mock CommonModalTip component
jest.mock('../../../src/components/CommonTips/CommonModalTip', () => ({
  __esModule: true,
  default: ({ className, open, okText, onOk, children, footerClassName, getContainer }: any) => (
    <div data-testid="modal-tip" className={className}>
      {open && (
        <>
          <div data-testid="modal-content">{children}</div>
          <button data-testid="modal-ok" onClick={onOk} className={footerClassName}>
            {okText}
          </button>
          <div data-testid="get-container">{getContainer}</div>
        </>
      )}
    </div>
  ),
}));

describe('SimpleTipModal Component', () => {
  const mockContent = 'Sample modal content';
  const mockOnOk = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<SimpleTipModal content={mockContent} />);

    // Check if modal is not displayed
    expect(screen.queryByTestId('modal-tip')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  test('displays content when open', () => {
    render(<SimpleTipModal open={true} content={mockContent} />);

    // Check if modal content is displayed correctly
    expect(screen.getByTestId('modal-content')).toHaveTextContent(mockContent);
    expect(screen.getByTestId('modal-ok')).toHaveTextContent(GOT_IT);
  });

  test('handles onOk callback', () => {
    render(<SimpleTipModal open={true} onOk={mockOnOk} content={mockContent} />);

    // Click on the "Got it" button
    fireEvent.click(screen.getByTestId('modal-ok'));

    // Check if onOk callback is called
    expect(mockOnOk).toHaveBeenCalledTimes(1);
  });

  test('passes getContainer prop correctly', () => {
    render(<SimpleTipModal open={true} content={mockContent} getContainer=".test-container" />);

    // Check if getContainer prop is passed correctly
    expect(screen.getByTestId('get-container')).toHaveTextContent('.test-container');
  });
});
