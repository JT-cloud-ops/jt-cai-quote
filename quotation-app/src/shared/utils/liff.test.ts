import { afterEach, describe, expect, it, vi } from 'vitest';
import { initLiff, isLiffClient } from './liff';

describe('LIFF utilities', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('initializes through the typed global API when available', async () => {
    const init = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('window', { liff: { init, isInClient: () => false } });
    await initLiff();
    expect(init).toHaveBeenCalledWith({ liffId: '2010201815-z3mfiA3O' });
  });

  it('returns false when LIFF is unavailable', () => {
    vi.stubGlobal('window', {});
    expect(isLiffClient()).toBe(false);
  });
});
