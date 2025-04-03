import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import CommonQRCode from '../../src/components/CommonQRCode';
import { QRCode } from 'react-qrcode-logo';

// Mock the QRCode component
// jest.mock('react-qrcode-logo', () => ({
//   QRCode: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
// }));
jest.mock('react-qrcode-logo', () => ({
  QRCode: jest.fn(() => null),
}));

describe('CommonQRCode Component', () => {
  const mockValue = 'https://example.com';
  const mockLogo = 'logo.png';

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<CommonQRCode value={mockValue} />);

    expect(QRCode).toHaveBeenCalledWith(
      expect.objectContaining({
        ecLevel: 'M',
        eyeRadius: { inner: 4, outer: 7 },
        logoHeight: 26,
        logoImage: undefined,
        logoPadding: 3,
        logoPaddingStyle: 'square',
        logoWidth: 26,
        qrStyle: 'squares',
        quietZone: 0,
        size: 120,
        value: 'https://example.com',
      }),
      expect.anything(),
    );
  });

  test('renders with custom props', () => {
    render(
      <CommonQRCode
        value={mockValue}
        logoUrl={mockLogo}
        size={150}
        logoSize={30}
        logoPadding={5}
        errorCorrectionLevel="H"
      />,
    );

    expect(QRCode).toHaveBeenCalledWith(
      expect.objectContaining({
        value: mockValue,
        logoImage: mockLogo,
        size: 150,
        logoWidth: 30,
        logoHeight: 30,
        logoPadding: 5,
        ecLevel: 'H',
      }),
      expect.anything(),
    );
  });

  test('renders without logo when logoUrl is not provided', () => {
    render(<CommonQRCode value={mockValue} />);

    expect(QRCode).toHaveBeenCalledWith(
      expect.not.objectContaining({
        logoImage: expect.anything(),
      }),
      expect.anything(),
    );
  });

  test('uses default error correction level when not provided', () => {
    render(<CommonQRCode value={mockValue} />);

    expect(QRCode).toHaveBeenCalledWith(
      expect.objectContaining({
        ecLevel: 'M',
      }),
      expect.anything(),
    );
  });
});
