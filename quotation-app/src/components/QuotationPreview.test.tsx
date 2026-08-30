import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import QuotationPreview from './QuotationPreview';
import { getPartyBPreviewLines } from '../domain/partyB';
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

describe('QuotationPreview party B contract section', () => {
  it('renders remarks and calculated summary rows', () => {
    const data = createQuotationData({ name: '', representative: '', address: '', taxId: '', phone: '', fax: '', contactPerson: '', mobile: '' });
    data.items[0] = { ...data.items[0], jobName: '彙總測試', quantity: '2', unitPrice: '100' };
    data.remarks = '請於確認後製作';
    const markup = renderToStaticMarkup(<QuotationPreview data={data} />);
    expect(markup).toContain('請於確認後製作');
    expect(markup).toContain('200');
    expect(markup).toContain('210');
    expect(markup.match(/<tr>/g)?.length).toBeGreaterThan(4);
  });

  it('renders single quotation rows through the single-row component', () => {
    const data = createQuotationData({ name: '', representative: '', address: '', taxId: '', phone: '', fax: '', contactPerson: '', mobile: '' });
    data.items[0] = { ...data.items[0], jobName: '單張測試', quantity: '2', unitPrice: '100' };
    const markup = renderToStaticMarkup(<QuotationPreview data={data} />);
    expect(markup).toContain('單張測試');
    expect(markup.match(/單張測試/g)?.length).toBe(1);
  });

  it('renders booklet rows and part rows without duplicate job output', () => {
    const data = createQuotationData({ name: '', representative: '', address: '', taxId: '', phone: '', fax: '', contactPerson: '', mobile: '' });
    data.quotationType = 'booklet';
    data.items = [];
    data.bookletJobs = [{ id: 'job-1', jobName: '冊子測試', jobSheetSize: 'A4', bindingMethod: '膠裝', quantity: '1', unit: '本', unitPrice: '200', hqQuantity: '', parts: [{ id: 'part-1', partName: '內頁', sheetSize: 'A4', printColor: '四色', reverseColor: '', specialColor: '', paperName: '紙張', processingDetails: '' }] }];
    const markup = renderToStaticMarkup(<QuotationPreview data={data} />);
    expect(markup).toContain('冊子測試');
    expect(markup).toContain('內頁');
    expect(markup.match(/冊子測試/g)?.length).toBe(1);
  });

  it('renders department HQ quantity rows', () => {
    const data = createQuotationData({ name: '', representative: '', address: '', taxId: '', phone: '', fax: '', contactPerson: '', mobile: '' });
    data.quotationType = 'dept';
    data.items = [];
    data.bookletJobs = [{ id: 'job-2', jobName: '部門測試', jobSheetSize: 'A4', bindingMethod: '騎馬釘', quantity: '1', unit: '本', unitPrice: '300', hqQuantity: '5', parts: [] }];
    const markup = renderToStaticMarkup(<QuotationPreview data={data} />);
    expect(markup).toContain('部門測試');
    expect(markup).toContain('5本');
  });

  it('uses its party B preview helper to render every party B value', () => {
    const partyB = {
      name: '鼎盛印刷有限公司',
      representative: '王小明',
      address: '臺中市西屯區工業路 1 號',
      taxId: '12345678',
      phone: '04-23580040',
      fax: '04-23580042',
      contactPerson: '陳小姐',
      mobile: '0912-345-678',
    };

    const markup = renderToStaticMarkup(<QuotationPreview data={createQuotationData(partyB)} />);

    const previewLines = getPartyBPreviewLines(partyB);

    expect(previewLines).toEqual([
      '乙方：鼎盛印刷有限公司',
      '法代：王小明',
      '地址：臺中市西屯區工業路 1 號',
      '統一編號：12345678',
      '電話：04-23580040　傳真：04-23580042',
      '聯絡人：陳小姐　手機：0912-345-678',
    ]);
    previewLines.forEach((line) => expect(markup).toContain(line));
  });

  it('renders missing party B values without undefined text', () => {
    const legacyData = createQuotationData(undefined as unknown as QuotationData['partyB']);

    const markup = renderToStaticMarkup(<QuotationPreview data={legacyData} />);

    expect(getPartyBPreviewLines(legacyData.partyB).some((line) => line.includes('undefined'))).toBe(false);
    expect(markup).not.toContain('undefined');
  });
});
