import { describe, expect, test } from '@jest/globals';
import { etransferEvents } from '../../src/event';

describe('etransferEvents', () => {
  test('Trigger DeniedRequest event and be able to listened.', () => {
    let result: string = '';
    const { remove } = etransferEvents.DeniedRequest.addListener(() => {
      result = 'DeniedRequest';
    });
    etransferEvents.DeniedRequest.emit();
    remove();

    expect(result).toBe('DeniedRequest');
  });
});
