import { describe, expect, it } from 'vitest';
import { createEmptyPartyB, formatPartyBForPreview, normalizePartyB, normalizeQuotationData, upsertPartyBRecord } from './partyB';

describe('party B data model', () => {
  it('creates an empty party B with every supported field', () => {
    expect(createEmptyPartyB()).toEqual({
      name: '',
      representative: '',
      address: '',
      taxId: '',
      phone: '',
      fax: '',
      contactPerson: '',
      mobile: '',
    });
  });

  it('normalizes missing or invalid fields while preserving supplied values', () => {
    expect(normalizePartyB({ name: '乙方公司', phone: 12345 })).toEqual({
      name: '乙方公司',
      representative: '',
      address: '',
      taxId: '',
      phone: '12345',
      fax: '',
      contactPerson: '',
      mobile: '',
    });
  });

  it('normalizes null and non-object input to an empty party B', () => {
    expect(normalizePartyB(null)).toEqual(createEmptyPartyB());
    expect(normalizePartyB(undefined)).toEqual(createEmptyPartyB());
  });

  it('fills every omitted field when party B is only partially provided', () => {
    expect(normalizePartyB({ representative: '王小明', taxId: 12345678 })).toEqual({
      name: '',
      representative: '王小明',
      address: '',
      taxId: '12345678',
      phone: '',
      fax: '',
      contactPerson: '',
      mobile: '',
    });
  });

  it('normalizes legacy quotation data that has no party B', () => {
    const normalized = normalizeQuotationData({ customerName: '既有客戶' });
    expect(normalized.customerName).toBe('既有客戶');
    expect(normalized.partyB).toEqual(createEmptyPartyB());
  });
});

describe('party B database records', () => {
  it('replaces an existing record with the same company name and moves it to the front', () => {
    const original = { ...createEmptyPartyB(), name: '甲公司', phone: '02-1111-1111' };
    const another = { ...createEmptyPartyB(), name: '乙公司' };
    const updated = { ...createEmptyPartyB(), name: '甲公司', phone: '02-2222-2222' };

    expect(upsertPartyBRecord([original, another], updated)).toEqual([updated, another]);
  });

  it('does not add a record when the company name is empty', () => {
    const existing = { ...createEmptyPartyB(), name: '甲公司' };

    expect(upsertPartyBRecord([existing], createEmptyPartyB())).toEqual([existing]);
  });
});

describe('party B preview formatting', () => {
  it('formats every party B field for the contract preview', () => {
    expect(formatPartyBForPreview({
      name: '鼎盛印刷有限公司',
      representative: '王小明',
      address: '臺中市西屯區工業路 1 號',
      taxId: '12345678',
      phone: '04-23580040',
      fax: '04-23580042',
      contactPerson: '陳小姐',
      mobile: '0912-345-678',
    })).toEqual([
      '乙方：鼎盛印刷有限公司',
      '法代：王小明',
      '地址：臺中市西屯區工業路 1 號',
      '統一編號：12345678',
      '電話：04-23580040　傳真：04-23580042',
      '聯絡人：陳小姐　手機：0912-345-678',
    ]);
  });

  it('formats absent party B values without rendering undefined', () => {
    const lines = formatPartyBForPreview(undefined);

    expect(lines).toEqual([
      '乙方：',
      '法代：',
      '地址：',
      '統一編號：',
      '電話：　傳真：',
      '聯絡人：　手機：',
    ]);
    expect(lines.some((line) => line.includes('undefined'))).toBe(false);
  });
});
