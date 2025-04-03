import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import CommonModalTip from '../../../src/components/CommonTips/CommonModalTip';
import CommonModal from '../../../src/components/CommonModal';

// Mock CommonModal component
jest.mock('../../../src/components/CommonModal', () => ({
  __esModule: true,
  default: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}));

describe('CommonModalTip Component', () => {
  // Mock CommonModal component
  const mockProps = {
    title: 'Test Tip',
    children: <div>Content</div>,
  };

  afterEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  test('renders without props', () => {
    render(<CommonModalTip />);

    // Check if CommonModal is called with correct props
    expect(CommonModal).toHaveBeenCalledWith(
      expect.objectContaining({
        open: false,
        getContainer: 'body',
        hideCancelButton: true,
      }),
      expect.anything(),
    );
  });

  test('renders with default props', () => {
    render(<CommonModalTip {...mockProps} />);

    // Check if CommonModal is called with correct props
    expect(CommonModal).toHaveBeenCalledWith(
      expect.objectContaining({
        open: false,
        getContainer: 'body',
        hideCancelButton: true,
      }),
      expect.anything(),
    );
  });

  test('applies custom className and footerClassName', () => {
    render(<CommonModalTip {...mockProps} className="custom-class" footerClassName="custom-footer" />);

    // Check if CommonModal is called with correct props
    expect(CommonModal).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('custom-class'),
        footerClassName: expect.stringContaining('custom-footer'),
      }),
      expect.anything(),
    );
  });

  test('merges base classes with props', () => {
    render(<CommonModalTip {...mockProps} />);

    // Check if CommonModal is called with correct props
    expect(CommonModal).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'etransfer-ui-common-modal-tip',
        footerClassName: 'etransfer-ui-common-modal-tip-footer',
      }),
      expect.anything(),
    );
  });

  test('passes through all CommonModalProps', () => {
    render(<CommonModalTip {...mockProps} open={true} width={500} />);

    // Check if CommonModal is called with correct props
    expect(CommonModal).toHaveBeenCalledWith(
      expect.objectContaining({
        open: true,
        width: 500,
        title: 'Test Tip',
      }),
      expect.anything(),
    );
  });

  test('renders children content', () => {
    const { getByText } = render(<CommonModalTip {...mockProps} />);

    // Check if children content is rendered
    expect(getByText('Content')).toBeInTheDocument();
  });
});
