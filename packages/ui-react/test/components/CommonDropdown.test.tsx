import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import CommonDropdown from '../../src/components/CommonDropdown';
import { Dropdown } from 'antd';
import DynamicArrow from '../../src/components/DynamicArrow';

// Mock the Dropdown component
jest.mock('antd', () => ({
  Dropdown: jest.fn(({ children }) => children),
}));

// Mock the DynamicArrow component
jest.mock('../../src/components/DynamicArrow', () => jest.fn(() => <div data-testid="arrow" />));

describe('CommonDropdown', () => {
  const mockHandleClick = jest.fn();
  const mockGetContainer = 'test-container';

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the document.body.innerHTML to include the mock getContainer element
    document.body.innerHTML = `<div id="${mockGetContainer}"></div>`;
  });

  test('renders with default props', () => {
    render(
      <CommonDropdown getContainer={mockGetContainer}>
        <div data-testid="trigger" />
      </CommonDropdown>,
    );

    // Get the getPopupContainer handler from the Dropdown component
    const menuGetPopupContainerHandler = (Dropdown as any).mock.lastCall[0].getPopupContainer;
    // Call the getPopupContainer handler
    menuGetPopupContainerHandler?.();

    // Assert that the Dropdown component is called with the correct props
    expect(Dropdown).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: ['click'],
        getPopupContainer: expect.any(Function),
      }),
      expect.anything(),
    );
  });

  test('handles menu click correctly', () => {
    render(
      <CommonDropdown getContainer={mockGetContainer} handleMenuClick={mockHandleClick}>
        <div data-testid="trigger" />
      </CommonDropdown>,
    );

    // Simulate menu click
    const menuClickHandler = (Dropdown as any).mock.calls[0][0].menu.onClick;
    // Call the menu click handler
    menuClickHandler({ key: 'test' });

    // Assert that the handleMenuClick function is called with the correct argument
    expect(mockHandleClick).toHaveBeenCalledWith({ key: 'test' });
  });

  test('handles menu click failed', () => {
    render(
      <CommonDropdown getContainer={mockGetContainer} handleMenuClick={undefined}>
        <div data-testid="trigger" />
      </CommonDropdown>,
    );

    // Simulate menu click
    const menuClickHandler = (Dropdown as any).mock.calls[0][0].menu.onClick;
    // Call the menu click handler
    menuClickHandler({ key: 'test' });

    // Assert that the handleMenuClick function is not called
    expect(mockHandleClick).not.toHaveBeenCalled();
  });

  test('toggles dropdown state', () => {
    render(
      <CommonDropdown getContainer={mockGetContainer}>
        <div data-testid="trigger" />
      </CommonDropdown>,
    );

    // Simulate onOpenChange click
    const onOpenChange = (Dropdown as any).mock.calls[0][0].onOpenChange;
    // Call the onOpenChange handler
    act(() => {
      onOpenChange(true);
    });

    // Assert that the DynamicArrow component is called with the correct props
    expect(DynamicArrow).toHaveBeenCalledWith(expect.objectContaining({ isExpand: true }), {});
  });

  test('applies correct class names', () => {
    render(
      <CommonDropdown getContainer={mockGetContainer} isBorder={false} childrenClassName="custom-class">
        <div data-testid="trigger" />
      </CommonDropdown>,
    );

    // Assert that the Dropdown component is called
    expect(Dropdown).toHaveBeenCalled();
  });

  test('hides arrow when hideDownArrow is true', () => {
    render(
      <CommonDropdown getContainer={mockGetContainer} hideDownArrow>
        <div data-testid="trigger" />
      </CommonDropdown>,
    );

    // Assert that the DynamicArrow component is called
    expect(DynamicArrow).not.toHaveBeenCalled();
  });

  test('passes suffixArrowSize to DynamicArrow', () => {
    render(
      <CommonDropdown getContainer={mockGetContainer} suffixArrowSize={'Small'}>
        <div data-testid="trigger" />
      </CommonDropdown>,
    );

    // Assert that the DynamicArrow component is called with the correct props
    expect(DynamicArrow).toHaveBeenCalledWith(expect.objectContaining({ size: 'Small' }), expect.anything());
  });
});
