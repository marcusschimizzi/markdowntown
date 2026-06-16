import { describe, it, expect } from 'vitest';
import { maxWidthFor } from './width';

describe('maxWidthFor', () => {
  it('maps width settings to px', () => {
    expect(maxWidthFor('narrow')).toBe(560);
    expect(maxWidthFor('normal')).toBe(660);
    expect(maxWidthFor('wide')).toBe(760);
  });
});
