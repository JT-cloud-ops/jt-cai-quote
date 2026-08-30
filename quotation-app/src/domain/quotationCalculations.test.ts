import { describe, expect, it } from 'vitest';
import { calculateDensityScore, calculateEmptyRowCount, getLayoutScales } from './quotationCalculations';
import type { QuotationData } from '../types';

const createQuotationData = (partyB: QuotationData['partyB']): QuotationData => ({
  companyId: 'jie-cai',
  quotationType: 'single',
  customerName: '',
  contactPerson: '',
  phone: '',
  mobile: '',
  fax: '',
  partyB,
  items: [{
    id: 'test-item',
    jobName: '',
    sheetSize: '',
    printColor: '',
    reverseColor: '',
    specialColor: '',
    paperName: '',
    processingDetails: '',
    quantity: '',
    unit: '份',
    unitPrice: '',
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
});

describe('quotation density score', () => {
  it('clamps layout scales for very dense input', () => {
    expect(getLayoutScales(100)).toEqual({ layoutScale: 0.82, lineScale: 0.86, rowScale: 0.64 });
  });

  it('reduces empty rows when remarks and department HQ rows consume space', () => {
    const data = createQuotationData(null as unknown as QuotationData['partyB']);
    data.quotationType = 'dept';
    data.items = [];
    data.remarks = '備註';
    data.bookletJobs = [{ id: 'job', jobName: '', jobSheetSize: '', bindingMethod: '', quantity: '', unit: '', unitPrice: '', hqQuantity: '10', parts: [{ id: 'part', partName: '', sheetSize: '', printColor: '', reverseColor: '', specialColor: '', paperName: '', processingDetails: '' }] }];
    expect(calculateEmptyRowCount(data)).toBe(1);
  });

  it('increases density and reduces layout scale for long party B data', () => {
    const emptyPartyB = {
      name: '',
      representative: '',
      address: '',
      taxId: '',
      phone: '',
      fax: '',
      contactPerson: '',
      mobile: '',
    };
    const longValue = '長文字'.repeat(80);
    const longPartyB = {
      name: longValue,
      representative: longValue,
      address: longValue,
      taxId: longValue,
      phone: longValue,
      fax: longValue,
      contactPerson: longValue,
      mobile: longValue,
    };

    const emptyDensity = calculateDensityScore(createQuotationData(emptyPartyB));
    const longDensity = calculateDensityScore(createQuotationData(longPartyB));

    expect(longDensity).toBeGreaterThan(emptyDensity);
    expect(getLayoutScales(longDensity).layoutScale).toBeLessThan(getLayoutScales(emptyDensity).layoutScale);
  });
});
