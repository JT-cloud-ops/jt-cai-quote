import { describe, expect, it } from 'vitest';
import { formatValidationErrors, parseQuotationData, parseQuotationJson } from './quotationValidation';

const createValidData = (overrides: Record<string, unknown> = {}) => ({
  companyId: 'jie-cai',
  quotationType: 'single',
  customerName: '測試客戶',
  contactPerson: '',
  phone: '',
  mobile: '',
  fax: '',
  partyB: {
    name: '乙方公司',
    representative: '',
    address: '',
    taxId: '',
    phone: '',
    fax: '',
    contactPerson: '',
    mobile: '',
  },
  items: [{
    id: 'item-1',
    jobName: '名片',
    sheetSize: '',
    printColor: '',
    reverseColor: '',
    specialColor: '',
    paperName: '',
    processingDetails: '',
    quantity: '100',
    unit: '份',
    unitPrice: '10',
    taxType: 'exclude',
    manualAmount: '',
  }],
  bookletJobs: [],
  remarks: '',
  orderYear: '',
  orderMonth: '',
  orderDay: '',
  paymentMethod: '',
  deliveryYear: '',
  deliveryMonth: '',
  deliveryDay: '',
  deliveryLocation: '',
  salesName: '',
  salesMobile: '',
  ...overrides,
});

describe('quotation import validation', () => {
  it.each(['single', 'booklet', 'dept'] as const)('accepts %s quotation data', (quotationType) => {
    const input = createValidData({
      quotationType,
      items: quotationType === 'single' ? createValidData().items : [],
      bookletJobs: quotationType === 'single' ? [] : [{
        id: 'job-1',
        jobName: '冊子',
        jobSheetSize: '',
        bindingMethod: '',
        quantity: '10',
        unit: '本',
        unitPrice: '20',
        hqQuantity: quotationType === 'dept' ? '10' : '',
        parts: [],
      }],
    });

    const result = parseQuotationData(input);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.quotationType).toBe(quotationType);
  });

  it('fills party B defaults for legacy data that has no party B', () => {
    const legacyData: Record<string, unknown> = { ...createValidData() };
    delete legacyData.partyB;

    const result = parseQuotationData(legacyData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.partyB).toEqual({
        name: '',
        representative: '',
        address: '',
        taxId: '',
        phone: '',
        fax: '',
        contactPerson: '',
        mobile: '',
      });
    }
  });

  it('ignores unknown fields and returns a newly shaped quotation object', () => {
    const result = parseQuotationData(createValidData({ unknownField: 'ignore me' }));

    expect(result.success).toBe(true);
    if (result.success) expect(result.data).not.toHaveProperty('unknownField');
  });

  it('reports an invalid quotation type without throwing', () => {
    const result = parseQuotationData(createValidData({ quotationType: 'invalid' }));

    expect(result).toMatchObject({
      success: false,
      errors: [{ path: 'quotationType', message: expect.stringContaining('報價類型') }],
    });
  });

  it('rejects present fields with the wrong type instead of coercing them', () => {
    const result = parseQuotationData(createValidData({ customerName: 12345 }));

    expect(result).toMatchObject({
      success: false,
      errors: [{ path: 'customerName', message: expect.stringContaining('文字') }],
    });
  });

  it('rejects invalid numeric strings and tax types', () => {
    const result = parseQuotationData(createValidData({
      items: [{ ...createValidData().items[0], quantity: '-1', taxType: 'unknown' }],
    }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.map((error) => error.path)).toEqual(expect.arrayContaining([
        'items[0].quantity',
        'items[0].taxType',
      ]));
    }
  });

  it('rejects strings longer than the configured limit', () => {
    const result = parseQuotationData(createValidData({ customerName: '甲'.repeat(501) }));

    expect(result).toMatchObject({
      success: false,
      errors: [{ path: 'customerName', message: expect.stringContaining('500') }],
    });
  });

  it('rejects an items array larger than the configured limit', () => {
    const item = createValidData().items[0];
    const result = parseQuotationData(createValidData({ items: Array.from({ length: 101 }, () => item) }));

    expect(result).toMatchObject({
      success: false,
      errors: [{ path: 'items', message: expect.stringContaining('100') }],
    });
  });
});

describe('quotation JSON import validation', () => {
  it('formats validation errors with paths and messages for import alerts', () => {
    expect(formatValidationErrors([
      { path: 'items[0].quantity', message: '必須是有限且非負的數字' },
      { path: 'partyB.name', message: '必須是文字' },
    ])).toBe('items[0].quantity：必須是有限且非負的數字\npartyB.name：必須是文字');
  });

  it('parses valid JSON through the quotation data validator', () => {
    const result = parseQuotationJson(JSON.stringify(createValidData()));

    expect(result.success).toBe(true);
  });

  it('returns a readable error for malformed JSON', () => {
    const result = parseQuotationJson('{"quotationType":');

    expect(result).toMatchObject({
      success: false,
      errors: [{ path: '$', message: expect.stringContaining('JSON') }],
    });
  });

  it('rejects JSON larger than 1 MB', () => {
    const result = parseQuotationJson(JSON.stringify({ payload: 'x'.repeat(1024 * 1024) }));

    expect(result).toMatchObject({
      success: false,
      errors: [{ path: '$', message: expect.stringContaining('1 MB') }],
    });
  });
});
