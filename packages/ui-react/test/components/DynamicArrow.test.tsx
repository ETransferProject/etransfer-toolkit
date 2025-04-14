import { describe, expect, test, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import DynamicArrow from '../../src/components/DynamicArrow';

// Mock the CommonSvg component
jest.mock('../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: ({ type, ...props }: { type: string }) => <svg data-testid={`svg-${type}`} {...props} />,
}));

describe('DynamicArrow Component', () => {
  test('renders with different sizes', () => {
    const { rerender } = render(<DynamicArrow size="Big" />);
    expect(screen.getByTestId('svg-downBig')).toBeInTheDocument();

    rerender(<DynamicArrow size="Small" />);
    expect(screen.getByTestId('svg-downSmall')).toBeInTheDocument();

    rerender(<DynamicArrow size="Normal" />);
    expect(screen.getByTestId('svg-down')).toBeInTheDocument();
  });

  test('applies rotation when expanded and normal size', () => {
    const { container, rerender } = render(<DynamicArrow isExpand={true} />);

    const svg = container.querySelector('svg');
    // Assert that the SVG has the correct class
    expect(svg).toHaveClass('etransfer-ui-dynamic-arrow-icon-rotate');

    rerender(<DynamicArrow isExpand={false} />);
    // Assert that the SVG does not have the class
    expect(svg).not.toHaveClass('etransfer-ui-dynamic-arrow-icon-rotate');
  });

  test('applies rotation when expanded and big size', () => {
    const { container, rerender } = render(<DynamicArrow isExpand={true} size="Big" />);

    const svg = container.querySelector('svg');
    // Assert that the SVG has the correct class
    expect(svg).toHaveClass('etransfer-ui-dynamic-arrow-icon-rotate');

    rerender(<DynamicArrow isExpand={false} size="Big" />);
    // Assert that the SVG does not have the class
    expect(svg).not.toHaveClass('etransfer-ui-dynamic-arrow-icon', 'etransfer-ui-dynamic-arrow-icon-rotate');
  });

  test('applies rotation when expanded and small size', () => {
    const { container, rerender } = render(<DynamicArrow isExpand={true} size="Small" />);

    const svg = container.querySelector('svg');
    // Assert that the SVG has the correct class
    expect(svg).toHaveClass('etransfer-ui-dynamic-arrow-icon-rotate');

    rerender(<DynamicArrow isExpand={false} size="Small" />);
    // Assert that the SVG does not have the class
    expect(svg).not.toHaveClass('etransfer-ui-dynamic-arrow-icon', 'etransfer-ui-dynamic-arrow-icon-rotate');
  });

  test('applies custom className and iconClassName', () => {
    const { container } = render(<DynamicArrow className="custom-class" iconClassName="custom-icon" />);

    const wrapper = container.firstChild;
    const svg = container.querySelector('svg');

    expect(wrapper).toHaveClass('custom-class');
    expect(svg).toHaveClass('custom-icon');
  });

  test('uses default props correctly', () => {
    render(<DynamicArrow />);

    expect(screen.getByTestId('svg-down')).toBeInTheDocument();
  });
});
