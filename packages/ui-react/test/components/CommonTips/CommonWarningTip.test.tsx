import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import CommonWarningTip from '../../../src/components/CommonTips/CommonWarningTip';
import CommonSvg from '../../../src/components/CommonSvg';

// Mock CommonSvg component
jest.mock('../../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: jest.fn(() => <svg role="img" />),
}));

describe('CommonWarningTip Component', () => {
  const mockContent = 'Test warning message';
  const mockOnClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders basic content correctly', () => {
    render(<CommonWarningTip content={mockContent} />);

    // Check if the content is rendered correctly
    expect(screen.getByText(mockContent)).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  test('handles icon visibility', () => {
    const { rerender } = render(<CommonWarningTip content={mockContent} isShowPrefix={false} isShowSuffix={false} />);
    // Check if the prefix and suffix icons are not rendered
    expect(screen.queryAllByRole('img')).toHaveLength(0);

    // Check if the prefix icon is rendered correctly
    rerender(<CommonWarningTip content={mockContent} isShowPrefix={true} />);
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(CommonSvg).toHaveBeenCalledWith(expect.objectContaining({ type: 'infoLine' }), expect.anything());

    // Check if the suffix icon is rendered correctly
    rerender(<CommonWarningTip content={mockContent} isShowSuffix={true} />);
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(CommonSvg).toHaveBeenCalledWith(expect.objectContaining({ type: 'down' }), expect.anything());
  });

  test('applies custom styles', () => {
    const { container } = render(<CommonWarningTip content={mockContent} className="custom-class" borderRadius={10} />);

    // Check if the wrapper div has the correct class and style
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
    expect(wrapper).toHaveStyle('border-radius: 10px');
  });

  test('triggers onClick handler', () => {
    render(<CommonWarningTip content={mockContent} onClick={mockOnClick} />);

    // Simulate click on the content
    fireEvent.click(screen.getByText(mockContent));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('uses default borderRadius', () => {
    const { container } = render(<CommonWarningTip content={mockContent} />);

    // Check if the wrapper div has the correct border-radius style
    expect(container.firstChild).toHaveStyle('border-radius: 8px');
  });

  test('applies correct classNames', () => {
    render(<CommonWarningTip content={mockContent} />);

    // Check if the content span has the correct class
    const contentSpan = screen.getByText(mockContent);
    expect(contentSpan).toHaveClass('etransfer-ui-common-warning-tip-content');
  });
});
