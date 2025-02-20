import { beforeEach, describe, expect, it } from '@jest/globals';
import { globalInstance } from '../../src/utils/globalInstance';

describe('GlobalInstance', () => {
  beforeEach(() => {
    globalInstance.setShowNoticeIds([]);
    globalInstance.setProcessingIds([]);
  });

  it('should initialize with empty arrays', () => {
    expect(globalInstance.showNoticeIds).toEqual([]);
    expect(globalInstance.processingIds).toEqual([]);
  });

  it('should set showNoticeIds correctly', () => {
    const testList = ['notice1', 'notice2'];
    globalInstance.setShowNoticeIds(testList);

    expect(globalInstance.showNoticeIds).toEqual(testList); // Verify the state
  });

  it('should set processingIds correctly', () => {
    const testList = ['processing1', 'processing2'];
    globalInstance.setProcessingIds(testList);

    expect(globalInstance.processingIds).toEqual(testList); // Verify the state
  });

  it('should overwrite existing showNoticeIds', () => {
    globalInstance.setShowNoticeIds(['oldNotice']);
    expect(globalInstance.showNoticeIds).toEqual(['oldNotice']);

    globalInstance.setShowNoticeIds(['newNotice']);
    expect(globalInstance.showNoticeIds).toEqual(['newNotice']); // Verify overwrite
  });

  it('should overwrite existing processingIds', () => {
    globalInstance.setProcessingIds(['oldProcessing']);
    expect(globalInstance.processingIds).toEqual(['oldProcessing']);

    globalInstance.setProcessingIds(['newProcessing']);
    expect(globalInstance.processingIds).toEqual(['newProcessing']); // Verify overwrite
  });
});
