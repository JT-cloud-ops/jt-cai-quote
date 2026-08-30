import { describe, expect, it } from 'vitest';
import { createSharePayload } from './useLineShare';

describe('createSharePayload', () => {
  it('creates stable share metadata', () => {
    expect(createSharePayload('甲公司', '名片')).toEqual({ customer: '甲公司', job: '名片', fileName: '報價單_甲公司_名片.jpg', title: '報價單圖檔', text: '這是來自捷采印刷的報價單：甲公司 - 名片' });
  });
  it('applies fallbacks', () => {
    expect(createSharePayload('', '').fileName).toBe('報價單_未命名客戶_未命名印件.jpg');
  });
});
