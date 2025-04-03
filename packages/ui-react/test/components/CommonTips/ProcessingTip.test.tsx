import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import ProcessingTip from '../../../src/components/CommonTips/ProcessingTip';
import CommonWarningTip from '../../../src/components/CommonTips/CommonWarningTip';
import CommonSpace from '../../../src/components/CommonSpace';

// Mock child components
jest.mock('../../../src/components/CommonTips/CommonWarningTip', () => ({
  __esModule: true,
  default: jest.fn(() => <div />),
}));

jest.mock('../../../src/components/CommonSpace', () => ({
  __esModule: true,
  default: jest.fn(() => <div />),
}));

describe('ProcessingTip Component', () => {
  const mockOnClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns null when no processing counts', () => {
    const { container } = render(<ProcessingTip />);
    expect(container).toBeEmptyDOMElement();
  });

  describe('Text generation logic', () => {
    test('only deposit count', () => {
      render(<ProcessingTip depositProcessingCount={1} />);
      expect(CommonWarningTip).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '1 deposit processing',
        }),
        expect.anything(),
      );
    });

    test('multiple deposits', () => {
      render(<ProcessingTip depositProcessingCount={3} />);
      expect(CommonWarningTip).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '3 deposits processing',
        }),
        expect.anything(),
      );
    });

    test('only withdrawal count', () => {
      render(<ProcessingTip withdrawProcessingCount={1} />);
      expect(CommonWarningTip).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '1 withdrawal processing',
        }),
        expect.anything(),
      );
    });

    test('multiple withdrawals', () => {
      render(<ProcessingTip withdrawProcessingCount={4} />);
      expect(CommonWarningTip).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '4 withdrawals processing',
        }),
        expect.anything(),
      );
    });

    test('both counts', () => {
      render(<ProcessingTip depositProcessingCount={2} withdrawProcessingCount={1} />);
      expect(CommonWarningTip).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '1 withdrawal and 2 deposits processing',
        }),
        expect.anything(),
      );
    });
  });

  test('passes correct props to CommonWarningTip', () => {
    render(
      <ProcessingTip depositProcessingCount={2} className="custom-class" borderRadius={10} onClick={mockOnClick} />,
    );

    expect(CommonWarningTip).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'custom-class',
        borderRadius: 10,
        isShowSuffix: true,
        onClick: mockOnClick,
      }),
      expect.anything(),
    );
  });

  test('renders CommonSpace with correct margin', () => {
    render(<ProcessingTip depositProcessingCount={1} marginBottom={20} />);

    expect(CommonSpace).toHaveBeenCalledWith(
      expect.objectContaining({
        direction: 'vertical',
        size: 20,
      }),
      expect.anything(),
    );
  });

  test('uses default marginBottom', () => {
    render(<ProcessingTip depositProcessingCount={1} />);

    expect(CommonSpace).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 16,
      }),
      expect.anything(),
    );
  });

  test('handles click events', () => {
    render(<ProcessingTip depositProcessingCount={1} onClick={mockOnClick} />);

    // Simulate click through the mocked CommonWarningTip
    const clickHandler = (CommonWarningTip as jest.Mock).mock.calls[0][0].onClick;
    clickHandler();

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
