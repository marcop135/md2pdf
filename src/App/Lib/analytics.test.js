import { afterEach, describe, expect, test } from 'vitest';
import { APP_EVENTS, trackAppEvent } from './analytics.js';

afterEach(() => {
  delete window._mtm;
});

describe('trackAppEvent', () => {
  test('creates the data layer and pushes only the event name', () => {
    trackAppEvent(APP_EVENTS.export);
    expect(window._mtm).toEqual([{ event: 'md2pdf_export' }]);
  });

  test('appends to an existing data layer', () => {
    window._mtm = [{ event: 'mtm.Start' }];
    trackAppEvent(APP_EVENTS.import);
    expect(window._mtm).toEqual([
      { event: 'mtm.Start' },
      { event: 'md2pdf_import' },
    ]);
  });

  test('swallows a throwing data layer', () => {
    window._mtm = {
      push() {
        throw new Error('blocked');
      },
    };
    expect(() => trackAppEvent(APP_EVENTS.export)).not.toThrow();
  });
});
