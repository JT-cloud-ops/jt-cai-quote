import { describe, expect, it } from 'vitest';
import { buildQuotationShareMessage } from './lineShareMessage';

describe('buildQuotationShareMessage', () => {
  it('builds the existing LINE share text', () => {
    expect(buildQuotationShareMessage('甲公司', '名片')).toBe('這是來自捷采印刷的報價單：甲公司 - 名片');
  });

  it('uses readable fallbacks for empty names', () => {
    expect(buildQuotationShareMessage('', '')).toBe('這是來自捷采印刷的報價單：未命名客戶 - 未命名印件');
  });
});
