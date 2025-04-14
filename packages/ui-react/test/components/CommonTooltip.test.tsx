import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import CommonTooltip from '../../src/components/CommonTooltip';
import { Tooltip } from 'antd';

// Mock Ant Design Tooltip
jest.mock('antd', () => ({
  Tooltip: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}));

describe('CommonTooltip Component', () => {
  const mockProps = {
    title: 'Test tooltip',
    placement: 'top' as const,
    children: <button>Hover me</button>,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with base className', () => {
    render(<CommonTooltip {...mockProps} />);

    expect(Tooltip).toHaveBeenCalledWith(
      expect.objectContaining({
        overlayClassName: 'etransfer-ui-common-tooltip-overlay',
      }),
      expect.anything(),
    );
  });

  test('combines custom overlayClassName', () => {
    render(<CommonTooltip {...mockProps} overlayClassName="custom-class" />);

    expect(Tooltip).toHaveBeenCalledWith(
      expect.objectContaining({
        overlayClassName: 'etransfer-ui-common-tooltip-overlay custom-class',
      }),
      expect.anything(),
    );
  });

  test('passes through all TooltipProps', () => {
    render(<CommonTooltip {...mockProps} trigger="click" color="red" />);

    expect(Tooltip).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test tooltip',
        placement: 'top',
        trigger: 'click',
        color: 'red',
      }),
      expect.anything(),
    );
  });

  test('renders children content', () => {
    const { getByText } = render(<CommonTooltip {...mockProps} />);
    expect(getByText('Hover me')).toBeInTheDocument();
  });
});
