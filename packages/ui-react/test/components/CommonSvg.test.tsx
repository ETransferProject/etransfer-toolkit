import { afterEach, describe, test, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import CommonSvg from '../../src/components/CommonSvg';

// Mock the SVG list
jest.mock('../../src/assets/svgs', () => ({
  __esModule: true,
  default: {
    close: '<svg>close-icon</svg>',
  } as Record<string, string>,
}));

describe('CommonSvg Component', () => {
  const mockType = 'close';
  const mockClassName = 'custom-class';

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correct SVG content', () => {
    const { container } = render(<CommonSvg type={mockType} />);
    const div = container.firstChild as HTMLElement;

    expect(div).toHaveClass('etransfer-ui-common-svg');
    expect(div).toHaveClass('close-icon');
  });

  test('handles SVG types correctly', () => {
    render(<CommonSvg type={mockType} className={mockClassName} />);

    const svgDiv = screen.getByText('close-icon');

    expect(svgDiv).toBeInTheDocument();
  });

  test('passes through other props', () => {
    const mockOnClick = jest.fn();
    const { container } = render(<CommonSvg type={mockType} onClick={mockOnClick} style={{ color: 'red' }} />);

    const div = container.firstChild as HTMLElement;
    div.click();

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(div.style.color).toBe('red');
  });
});
