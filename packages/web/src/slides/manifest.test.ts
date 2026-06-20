import { describe, it, expect } from 'vitest';
import { buildSlideManifest } from './manifest';
import { fullStats, minimalStats } from '../test/fixtures';

describe('buildSlideManifest', () => {
  it('includes all slides for full stats, in order', () => {
    const ids = buildSlideManifest(fullStats).map((s) => s.id);
    expect(ids).toEqual([
      'cover', 'volume', 'type', 'peakHour',
      'busiestDay', 'flag', 'countdown', 'secrets', 'receipt',
    ]);
  });

  it('always starts with cover and ends with receipt', () => {
    const ids = buildSlideManifest(minimalStats).map((s) => s.id);
    expect(ids[0]).toBe('cover');
    expect(ids[ids.length - 1]).toBe('receipt');
  });

  it('skips time slides when there is no timestamp data', () => {
    const ids = buildSlideManifest(minimalStats).map((s) => s.id);
    expect(ids).not.toContain('peakHour');
    expect(ids).not.toContain('busiestDay');
  });

  it('skips secrets when none were found', () => {
    const ids = buildSlideManifest(minimalStats).map((s) => s.id);
    expect(ids).not.toContain('secrets');
  });

  it('skips type and flag slides when those sections are empty', () => {
    const ids = buildSlideManifest(minimalStats).map((s) => s.id);
    expect(ids).not.toContain('type');
    expect(ids).not.toContain('flag');
  });

  it('assigns a known palette token to every slide', () => {
    const valid = ['lime', 'magenta', 'blue', 'violet', 'ink'];
    for (const s of buildSlideManifest(fullStats)) {
      expect(valid).toContain(s.bg);
    }
  });
});
