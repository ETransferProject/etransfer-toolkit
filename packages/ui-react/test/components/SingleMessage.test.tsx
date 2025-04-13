import { beforeEach, describe, expect, test } from '@jest/globals';
import singleMessage from '../../src/components/SingleMessage';
import { message } from 'antd';
import { renderToString } from 'react-dom/server';
import { ETRANSFER_PREFIX_CLS, ETRANSFER_PREFIX_CLS_MESSAGE } from '../../src/constants';

// Mock dependencies
jest.mock('antd', () => ({
  message: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    warn: jest.fn(),
    destroy: jest.fn(),
    open: jest.fn(),
    config: jest.fn(),
  },
}));

jest.mock('../../src/utils', () => ({
  randomId: jest.fn(() => 'mockRandomId'), // Mock randomId function
}));

jest.mock('react-dom/server', () => ({
  renderToString: jest.fn((component) => component),
}));

describe('SingleMessage Component', () => {
  const mockContent = 'Test message';
  const mockArgs = { content: mockContent, duration: 5 };
  const mockReactContent = <div>React Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle basic message types', () => {
    ['success', 'error', 'info', 'warning'].forEach((type) => {
      // Test string content
      singleMessage[type](mockContent);
      expect(message.destroy).toHaveBeenCalledWith(mockContent);
      expect(message[type]).toHaveBeenCalledWith(
        expect.objectContaining({
          content: mockContent,
          prefixCls: ETRANSFER_PREFIX_CLS_MESSAGE,
          rootPrefixCls: ETRANSFER_PREFIX_CLS,
        }),
        undefined,
        undefined,
      );

      // Test ArgsProps content
      singleMessage[type](mockArgs);
      expect(message[type]).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockArgs,
          prefixCls: ETRANSFER_PREFIX_CLS_MESSAGE,
          rootPrefixCls: ETRANSFER_PREFIX_CLS,
        }),
        undefined,
        undefined,
      );
    });
  });

  test('should generate unique keys when not provided', () => {
    // Test with string content
    singleMessage.success(mockContent);
    const stringKey = (message.success as jest.Mock).mock.calls[0][0].key;
    expect(typeof stringKey).toBe('string');

    // Test with React content
    singleMessage.success(mockReactContent);
    expect(renderToString).toHaveBeenCalledWith(mockReactContent);
  });

  test('should handle open method', () => {
    singleMessage.open(mockArgs);
    expect(message.open).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockArgs,
        prefixCls: ETRANSFER_PREFIX_CLS_MESSAGE,
        rootPrefixCls: ETRANSFER_PREFIX_CLS,
      }),
    );
  });

  test('should handle config method', () => {
    const customConfig = { maxCount: 3 };
    singleMessage.config(customConfig);
    expect(message.config).toHaveBeenCalledWith({
      ...customConfig,
      prefixCls: ETRANSFER_PREFIX_CLS_MESSAGE,
    });
  });

  test('should alias warn to warning', () => {
    singleMessage.warn(mockContent);
    expect(message.warning).toHaveBeenCalled();
  });

  test('should handle destroy method', () => {
    singleMessage.destroy();
    expect(message.destroy).toHaveBeenCalled();
  });

  test('should handle edge cases', () => {
    try {
      // Test empty content
      singleMessage.success(undefined as any);
    } catch (error) {
      expect(error).toBe('');
    }
  });
});
