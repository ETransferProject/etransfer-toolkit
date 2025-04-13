import { describe, expect, test, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import SimpleTipAutoScreen from '../../../src/components/Modal/SimpleTipAutoScreen';
import { ComponentStyle } from '../../../src/types/common';
import { GOT_IT } from '../../../src/constants/misc';

// Mock dependencies
jest.mock('../../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: ({ type, onClick }: { type: string; onClick: () => void }) => (
    <div data-testid={`svg-${type}`} onClick={onClick} />
  ),
}));

jest.mock('../../../src/components/CommonTips/CommonModalTip', () => ({
  __esModule: true,
  default: ({ open, title, okText, onOk, children }: any) =>
    open ? (
      <div data-testid="modal">
        {title && <div data-testid="modal-title">{title}</div>}
        <div data-testid="modal-content">{children}</div>
        <button data-testid="modal-ok" onClick={onOk}>
          {okText}
        </button>
      </div>
    ) : (
      <div data-testid="modal-content">{children}</div>
    ),
}));

describe('SimpleTipAutoScreen Component', () => {
  const mockContent = 'This is a test content';

  test('renders question mark icon only in mobile style', () => {
    const { rerender } = render(<SimpleTipAutoScreen content={mockContent} componentStyle={ComponentStyle.Mobile} />);

    // Question mark icon should be present in mobile style
    expect(screen.getByTestId('svg-questionMark')).toBeInTheDocument();

    rerender(<SimpleTipAutoScreen content={mockContent} componentStyle={ComponentStyle.Web} />);

    // Question mark icon should not be present in web style
    expect(screen.queryByTestId('svg-questionMark')).not.toBeInTheDocument();
  });

  test('opens/closes modal correctly', () => {
    render(<SimpleTipAutoScreen content={mockContent} componentStyle={ComponentStyle.Mobile} />);

    // Open modal
    fireEvent.click(screen.getByTestId('svg-questionMark'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByTestId('modal-ok'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  test('displays content correctly', () => {
    render(<SimpleTipAutoScreen title="Test Title" content={mockContent} componentStyle={ComponentStyle.Mobile} />);

    // Open modal
    fireEvent.click(screen.getByTestId('svg-questionMark'));

    // Check if modal content is displayed correctly
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('modal-content')).toHaveTextContent(mockContent);
    expect(screen.getByTestId('modal-ok')).toHaveTextContent(GOT_IT);
  });

  test('handles optional title', () => {
    render(<SimpleTipAutoScreen content={mockContent} componentStyle={ComponentStyle.Mobile} />);

    // Open modal
    fireEvent.click(screen.getByTestId('svg-questionMark'));

    // Check if modal title is not displayed
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

  test('passes correct props to CommonModalTip', () => {
    render(<SimpleTipAutoScreen content={mockContent} />);

    // Check if modal content is displayed correctly
    const content = screen.getByTestId('modal-content');
    expect(content).toBeInTheDocument();
  });
});
