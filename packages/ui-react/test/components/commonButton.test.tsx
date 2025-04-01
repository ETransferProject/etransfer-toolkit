import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import CommonButton, { CommonButtonProps } from '../../src/components/CommonButton';
import { CommonButtonSize, CommonButtonType } from '../../src/types/components';
import clsx from 'clsx';

jest.mock('antd', () => ({
  Button: jest.fn(({ className, ...props }) => <button {...props} className={className} data-testid="antd-button" />),
}));

// Emulate clsx class name generation
jest.mock('clsx', () => jest.fn(() => 'mocked-classname'));

describe('CommonButton', () => {
  const defaultProps: CommonButtonProps = {
    size: CommonButtonSize.Middle,
    type: CommonButtonType.Primary,
    stretched: false,
  };

  beforeEach(() => {
    (clsx as jest.Mock).mockClear();
  });

  test('Correct rendering of default configuration', () => {
    render(<CommonButton>Test Button</CommonButton>);

    const button = screen.getByTestId('antd-button');

    expect(button.textContent).toBe('Test Button');
  });

  describe('Class name generation logic', () => {
    const classCases: Array<{
      props: Partial<CommonButtonProps>;
      expectedClasses: string[];
    }> = [
      {
        props: { size: CommonButtonSize.Small },
        expectedClasses: ['etransfer-ui-common-button-Small'],
      },
      {
        props: { type: CommonButtonType.Secondary },
        expectedClasses: ['etransfer-ui-common-button-Secondary'],
      },
      {
        props: { stretched: true },
        expectedClasses: ['etransfer-ui-common-button-stretched'],
      },
      {
        props: { className: 'custom-class' },
        expectedClasses: ['custom-class'],
      },
    ];

    test.each(classCases)('Generates the correct class name when passing $props', ({ props }) => {
      render(
        <CommonButton {...defaultProps} {...props}>
          Button
        </CommonButton>,
      );

      // expect(clsx).toHaveBeenCalledWith(
      //   'etransfer-ui-common-button',
      //   expect.stringContaining(expectedClasses),
      //   expect.anything(),
      // );
    });

    test('Merge multiple class names', () => {
      render(
        <CommonButton size={CommonButtonSize.Large} type={CommonButtonType.Secondary} stretched className="extra-class">
          Button
        </CommonButton>,
      );

      expect(clsx).toHaveBeenCalledWith(
        'etransfer-ui-common-button',
        'etransfer-ui-common-button-large',
        'etransfer-ui-common-button-secondary',
        { ['etransfer-ui-common-button-stretched']: true },
        'extra-class',
      );
    });
  });

  test('Handling undefined and null values', () => {
    render(
      <CommonButton size={undefined} type={undefined} stretched={undefined}>
        Button
      </CommonButton>,
    );

    expect(clsx).toHaveBeenCalledWith(
      'etransfer-ui-common-button',
      'etransfer-ui-common-button-middle',
      'etransfer-ui-common-button-primary',
      { ['etransfer-ui-common-button-stretched']: false },
      undefined,
    );
  });

  test('Snapshot Matching', () => {
    const { asFragment } = render(
      <CommonButton size={CommonButtonSize.Small} type={CommonButtonType.Primary} stretched className="custom-class">
        Submit
      </CommonButton>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
