import { etransferEvents } from '@etransfer/utils';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { setLoading } from '../../src/utils/loading';

jest.mock('@etransfer/utils', () => ({
  etransferEvents: {
    SetGlobalLoading: {
      emit: jest.fn(), // Mock the emit method
    },
  },
}));

describe('setLoading', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should emit SetGlobalLoading with correct parameters', () => {
    const loadingInfo = {
      className: 'loading-class',
      width: 100,
      isHasText: true,
      text: 'Loading...',
      isLoading: true,
    };

    setLoading(true, loadingInfo);

    expect(etransferEvents.SetGlobalLoading.emit).toHaveBeenCalledWith(true, loadingInfo); // Verify emit call
  });

  it('should emit SetGlobalLoading with loading only', () => {
    setLoading(false); // Calling without loadingInfo

    expect(etransferEvents.SetGlobalLoading.emit).toHaveBeenCalledWith(false, undefined); // Ensure emit is called correctly
  });
});
