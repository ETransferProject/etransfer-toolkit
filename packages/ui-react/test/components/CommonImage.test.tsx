import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommonImage from '../../src/components/CommonImage';

describe('CommonImage Component', () => {
  const mockSrc = 'test-image.jpg';
  const mockOnLoad = jest.fn();
  const mockOnError = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with basic props', () => {
    render(<CommonImage src={mockSrc} alt="test alt" width={100} height={200} />);

    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('src', mockSrc);
    expect(img).toHaveAttribute('alt', 'test alt');
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '200');
  });

  test('applies correct className combinations', () => {
    const { rerender } = render(<CommonImage src={mockSrc} objectFit="cover" className="custom-class" />);

    expect(screen.getByRole('img')).toHaveClass(
      'etransfer-ui-common-image',
      'etransfer-ui-object-cover',
      'custom-class',
    );

    rerender(<CommonImage src={mockSrc} objectFit="fill" />);
    expect(screen.getByRole('img')).toHaveClass('etransfer-ui-object-fill');

    rerender(<CommonImage src={mockSrc} objectFit="contain" />);
    expect(screen.getByRole('img')).toHaveClass('etransfer-ui-object-contain');

    rerender(<CommonImage src={mockSrc} objectFit="cover" />);
    expect(screen.getByRole('img')).toHaveClass('etransfer-ui-object-cover');

    rerender(<CommonImage src={mockSrc} objectFit="scale-down" />);
    expect(screen.getByRole('img')).toHaveClass('etransfer-ui-object-scale');

    rerender(<CommonImage src={mockSrc} objectFit="none" />);
    expect(screen.getByRole('img')).toHaveClass('etransfer-ui-object-none');
  });

  test('handles image loading events', async () => {
    render(<CommonImage src={mockSrc} onLoad={mockOnLoad} onError={mockOnError} />);

    const img = screen.getByRole('img');
    // Simulate interaction to ensure event listeners are attached
    await userEvent.click(img);

    fireEvent.load(img);
    expect(mockOnLoad).toHaveBeenCalledTimes(1);

    fireEvent.error(img);
    expect(mockOnError).toHaveBeenCalledTimes(1);
  });

  test('applies correct attributes for optimization', () => {
    render(<CommonImage src={mockSrc} loading="lazy" decoding="async" priority="high" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    expect(img).toHaveAttribute('fetchPriority', 'high');
  });

  test('handles default values correctly', () => {
    render(<CommonImage src={mockSrc} />);

    const img = screen.getByRole('img');
    expect(img).not.toHaveAttribute('loading');
    expect(img.className).toBe('etransfer-ui-common-image');
  });
});
